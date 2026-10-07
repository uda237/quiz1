import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const fixtures = process.env.UQONI_TEST_FIXTURES;
const base = process.env.UQONI_TEST_URL || "http://127.0.0.1:3100";

test(
  "client quote → admin offer → accepted quote → manual payment → production → delivery, plus access isolation",
  { timeout: 600000, skip: !fixtures },
  async () => {
    const accounts = JSON.parse(fs.readFileSync(fixtures));
    const progress = (message) =>
      fs.appendFileSync("/tmp/uqoni-e2e-progress.log", message + "\n");
    fs.writeFileSync("/tmp/uqoni-e2e-progress.log", "Starting\n");
    const server = process.env.UQONI_TEST_URL
      ? null
      : spawn(
          process.execPath,
          [
            "node_modules/next/dist/bin/next",
            "start",
            "--hostname",
            "127.0.0.1",
            "--port",
            "3100",
          ],
          { env: process.env, stdio: ["ignore", "pipe", "pipe"] },
        );
    let serverLogs = "";
    server?.stdout.on("data", (d) => (serverLogs += d));
    server?.stderr.on("data", (d) => (serverLogs += d));
    let browser;
    try {
      if (server)
        await new Promise((resolve, reject) => {
          const stop = setTimeout(
            () => reject(new Error("Server startup failed: " + serverLogs)),
            15000,
          );
          server.stdout.on("data", (d) => {
            if (d.toString().includes("Ready")) {
              clearTimeout(stop);
              resolve();
            }
          });
        });
      const proxy = process.env.HTTPS_PROXY
        ? { server: process.env.HTTPS_PROXY, bypass: "127.0.0.1,localhost" }
        : undefined;
      const args = process.env.UQONI_CHROMIUM_ARGS
        ? JSON.parse(process.env.UQONI_CHROMIUM_ARGS)
        : ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"];
      browser = await chromium.launch({
        headless: true,
        executablePath:
          process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
        args,
        proxy,
      });
      const errors = [],
        network = [];
      async function context() {
        const c = await browser.newContext({
          viewport: { width: 1360, height: 900 },
          ignoreHTTPSErrors: true,
        });
        if (process.env.UQONI_PROXY_API === "1") {
          // Restricted CI networks route live Supabase traffic via Node's configured proxy.
          // Responses still come from the real Supabase service; no data is mocked.
          await c.route("https://*.supabase.co/**", async (route) => {
            const request = route.request();
            const response = await fetch(request.url(), {
              method: request.method(),
              headers: request.headers(),
              body: ["GET", "HEAD"].includes(request.method())
                ? undefined
                : request.postData(),
              signal: AbortSignal.timeout(30000),
            });
            const headers = Object.fromEntries(response.headers);
            delete headers["content-encoding"];
            delete headers["content-length"];
            await route.fulfill({
              status: response.status,
              headers,
              body: Buffer.from(await response.arrayBuffer()),
            });
          });
        }
        c.on("page", (p) =>
          p
            .on("pageerror", (e) => errors.push(e.message))
            .on("requestfailed", (r) =>
              network.push({
                path: new URL(r.url()).pathname,
                failure: r.failure()?.errorText,
              }),
            )
            .on("response", (r) => {
              if (r.url().includes("supabase.co"))
                network.push({
                  status: r.status(),
                  path: new URL(r.url()).pathname,
                });
            }),
        );
        return c;
      }
      const guest = await context(),
        gp = await guest.newPage();
      progress("Opening guest catalogue");await gp.goto(base + "/services", { waitUntil: "domcontentloaded" });progress("Guest catalogue loaded");
      assert.match(await gp.locator("h1").textContent(), /Construisons/);
      assert.equal(await gp.locator(".service-card").count(), 6);
      progress("Checking guest protection");await gp.goto(base + "/orders", { waitUntil: "domcontentloaded" });progress("Guest redirected");
      await gp.waitForURL("**/login?next=*", { waitUntil: "commit" });
      const client = await context(),
        page = await client.newPage(),
        admin = await context(),
        ap = await admin.newPage(),
        other = await context(),
        op = await other.newPage();
      async function login(p, role) {
        const account = accounts.find((a) => a.role === role);
        await p.goto(base + "/login", { waitUntil: "domcontentloaded" });
        await p.getByLabel("Adresse email").fill(account.email);
        await p
          .getByLabel("Mot de passe", { exact: true })
          .fill(account.password);
        await p
          .getByRole("button", { name: "Se connecter", exact: true })
          .click();
        try {
          await p.waitForURL("**/home", {
            timeout: 60000,
            waitUntil: "commit",
          });
        } catch (error) {
          console.error(
            "LOGIN EVIDENCE",
            p.url(),
            await p.locator(".notice").allTextContents(),
            await p
              .getByRole("button", { name: /connecter|Traitement/ })
              .allTextContents(),
            network,
          );
          throw error;
        }
        assert.match(await p.locator("h1").textContent(), /Bonjour/);
      }
      await login(page, "client");
      progress("Client login passed");
      await login(ap, "admin");
      progress("Admin login passed");
      await login(op, "other");
      progress("Other client login passed");
      await op.goto(base + "/admin", { waitUntil: "domcontentloaded" });
      await op.waitForURL("**/home", { waitUntil: "commit" });
      await page.goto(base + "/services/site-web", {
        waitUntil: "domcontentloaded",
      });
      await page
        .getByLabel("Décrivez votre besoin")
        .fill(
          "TEST E2E : Un site de présentation pour une entreprise avec cinq pages, un formulaire de contact et une livraison sous trois semaines.",
        );
      await page.getByRole("button", { name: "Envoyer ma demande" }).click();
      await page.waitForURL("**/orders/*", {
        timeout: 60000,
        waitUntil: "commit",
      });
      progress("Quote request submitted");
      const orderUrl = page.url(),
        orderId = orderUrl.split("/").pop();
      assert.match(
        await page.locator(".badge").first().textContent(),
        /Devis demandé/,
      );
      await op.goto(orderUrl, { waitUntil: "domcontentloaded" });
      assert.match(await op.locator("h1").textContent(), /introuvable/);
      await ap.goto(base + "/admin/orders", { waitUntil: "domcontentloaded" });
      const quote = ap
        .locator("article")
        .filter({ hasText: "TEST E2E" })
        .first();
      await quote.getByLabel("Montant total en FCFA").fill("150000");
      await quote
        .getByLabel("Périmètre, livrables, délais et conditions")
        .fill(
          "Site de cinq pages, formulaire de contact, deux révisions, livraison sous trois semaines après validation des contenus. Paiement total avant production.",
        );
      await quote
        .getByRole("button", { name: "Proposer ce devis au client" })
        .click();
      await quote.getByRole("status").waitFor();
      progress("Admin quote issued");
      await page.goto(orderUrl, { waitUntil: "domcontentloaded" });
      assert.match(await page.locator(".amount-row").textContent(), /150/);
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Accepter le devis" }).click();
      await page.getByLabel("Référence de transaction").waitFor();
      await page
        .getByLabel("Référence de transaction")
        .fill("TEST-E2E-REFERENCE");
      await page
        .getByRole("button", { name: "Soumettre pour vérification" })
        .click();
      await page
        .getByRole("heading", { name: "Vérification en cours" })
        .waitFor();
      await page.goto(base + "/projects", { waitUntil: "domcontentloaded" });
      assert.match(
        await page.locator("h2").textContent(),
        /Vos projets apparaîtront/,
      );
      await ap.goto(base + "/admin/orders", { waitUntil: "domcontentloaded" });
      const payment = ap
        .locator("article")
        .filter({ hasText: "TEST-E2E-REFERENCE" })
        .first();
      ap.once("dialog", (d) => d.accept());
      await payment
        .getByRole("button", { name: "Confirmer l’encaissement", exact: true })
        .click();
      await payment.getByRole("status").waitFor();
      progress("Payment verified");
      await page.goto(base + "/projects", { waitUntil: "domcontentloaded" });
      const project = page.locator(".record").first();
      await project.click();
      await page.waitForURL("**/projects/*", { waitUntil: "commit" });
      const projectUrl = page.url();
      assert.match(await page.locator(".badge").textContent(), /préparation/);
      await ap.goto(base + "/admin/projects", {
        waitUntil: "domcontentloaded",
      });
      const production = ap
        .locator("article")
        .filter({ hasText: "Site web & application" })
        .first();
      await production
        .getByLabel("Statut", { exact: true })
        .selectOption("delivered");
      await production
        .getByLabel("Titre de la mise à jour")
        .fill("TEST E2E : Votre site est livré");
      await production
        .getByLabel("Message au client")
        .fill("Votre livrable est prêt pour validation.");
      await production.getByLabel("Nom du livrable").fill("Site livré");
      await production
        .getByLabel("Lien HTTPS")
        .fill("https://example.com/uqoni-test-delivery");
      await production
        .getByRole("button", { name: "Publier cette mise à jour" })
        .click();
      await production.getByRole("status").waitFor();
      progress("Project delivered");
      await page.goto(projectUrl, { waitUntil: "domcontentloaded" });
      assert.match(await page.locator(".badge").textContent(), /Livré/);
      assert.equal(
        await page
          .getByRole("link", { name: "Site livré" })
          .getAttribute("href"),
        "https://example.com/uqoni-test-delivery",
      );
      await op.goto(projectUrl, { waitUntil: "domcontentloaded" });
      assert.match(await op.locator("h1").textContent(), /introuvable/);
      await page.goto(base + "/profile", { waitUntil: "domcontentloaded" });
      await page.getByLabel("Nom complet").fill("Test Client Modifié");
      await page.getByLabel("Téléphone").fill("+237600000000");
      await page
        .getByRole("button", { name: "Enregistrer mon profil" })
        .click();
      await page.getByRole("status").waitFor();
      await page.reload();
      assert.equal(
        await page.getByLabel("Nom complet").inputValue(),
        "Test Client Modifié",
      );
      await page.goto(base + "/services/site-web", {
        waitUntil: "domcontentloaded",
      });
      await page.getByRole("button", { name: "Ajouter à mes favoris" }).click();
      await page.getByRole("button", { name: "Retirer des favoris" }).waitFor();
      await page.goto(base + "/favorites", { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator(".service-card").count(), 1);
      await page.goto(base + "/support", { waitUntil: "domcontentloaded" });
      await page.getByLabel("Objet").fill("TEST E2E : Livraison");
      await page
        .getByLabel("Votre message")
        .fill(
          "Merci de confirmer la disponibilité du livrable et les prochaines étapes de validation.",
        );
      await page.getByRole("button", { name: "Envoyer ma demande" }).click();
      await page.getByRole("status").waitFor();
      await ap.goto(base + "/admin/support", { waitUntil: "domcontentloaded" });
      const ticket = ap
        .locator("article")
        .filter({ hasText: "TEST E2E : Livraison" })
        .first();
      await ticket
        .getByLabel("Réponse au client")
        .fill(
          "Le livrable est disponible dans votre espace. Votre demande est résolue.",
        );
      await ticket.getByLabel("Statut").selectOption("resolved");
      await ticket
        .getByRole("button", { name: "Enregistrer la réponse" })
        .click();
      await ticket.getByRole("status").waitFor();
      await page.goto(base + "/support", { waitUntil: "domcontentloaded" });
      assert.match(
        await page.locator(".support-reply").textContent(),
        /livrable est disponible/,
      );
      await page.goto(base + "/notifications", {
        waitUntil: "domcontentloaded",
      });
      assert.ok(
        (await page
          .getByRole("button", { name: "Marquer comme lue" })
          .count()) > 0,
      );
      await page
        .getByRole("button", { name: "Marquer comme lue" })
        .first()
        .click();
      await page.getByRole("status").waitFor();
      // Assert API isolation as well as rendered isolation.
      const u = accounts.find((a) => a.role === "other"),
        db = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        );
      const { error: loginError } = await db.auth.signInWithPassword({
        email: u.email,
        password: u.password,
      });
      assert.equal(loginError, null);
      const { data: leaked, error: readError } = await db
        .from("orders")
        .select("id")
        .eq("id", orderId);
      assert.equal(readError, null);
      assert.deepEqual(leaked, []);
      const { error: roleError } = await db
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", u.id);
      assert.ok(roleError);
      // Test narrow viewport, valid destinations, active navigation and overflow.
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(base + "/home", { waitUntil: "domcontentloaded" });
      assert.equal(
        await page.locator('.bottom-nav a[aria-current="page"]').textContent(),
        "Accueil",
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      fs.mkdirSync("/tmp/uqoni-preview", { recursive: true });
      await page.screenshot({
        path: "/tmp/uqoni-preview/mobile.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 1360, height: 900 });
      await page.screenshot({
        path: "/tmp/uqoni-preview/desktop.png",
        fullPage: true,
      });
      await page.goto(base + "/profile", { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "Se déconnecter" }).click();
      await page.waitForURL("**/login", { waitUntil: "commit" });
      await page.goto(base + "/orders", { waitUntil: "domcontentloaded" });
      await page.waitForURL("**/login?next=*", { waitUntil: "commit" });
      assert.deepEqual(errors, [], "No browser runtime errors");
      console.log(
        "E2E PASS: guest protection, real login, quote, accepted amount, pending payment, verification, project delivery, cross-client isolation, profile persistence, favorites, support reply, notifications, mobile overflow, logout.",
      );
    } catch (error) {
      console.error("SERVER EVIDENCE", serverLogs.slice(-3000));
      throw error;
    } finally {
      await browser?.close();
      server?.kill();
    }
  },
);

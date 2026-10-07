import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
const fixtureFile = process.env.UQONI_TEST_FIXTURES;
const base = process.env.UQONI_TEST_URL || "http://127.0.0.1:3100";

test(
  "client browser workflow with real admin API, persisted data and ownership isolation",
  { timeout: 900000, skip: !fixtureFile },
  async () => {
    const accounts = JSON.parse(fs.readFileSync(fixtureFile));
    const progress = (message) =>
      fs.appendFileSync("/tmp/uqoni-e2e-progress.log", message + "\n");
    fs.writeFileSync(
      "/tmp/uqoni-e2e-progress.log",
      "Starting client browser + live admin API\n",
    );
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
    let logs = "",
      browser;
    server?.stdout.on("data", (d) => (logs += d));
    server?.stderr.on("data", (d) => (logs += d));
    try {
      if (server)
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(Error(logs)), 15000);
          server.stdout.on("data", (d) => {
            if (d.toString().includes("Ready")) {
              clearTimeout(timeout);
              resolve();
            }
          });
        });
      browser = await chromium.launch({
        headless: true,
        executablePath:
          process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
        args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
        proxy: process.env.HTTPS_PROXY
          ? { server: process.env.HTTPS_PROXY, bypass: "127.0.0.1,localhost" }
          : undefined,
      });
      const context = await browser.newContext({
        viewport: { width: 1360, height: 900 },
        ignoreHTTPSErrors: true,
      });
      context.setDefaultTimeout(90000);
      context.setDefaultNavigationTimeout(90000);
      if (process.env.UQONI_PROXY_API === "1")
        await context.route(
          /^https:\/\/[^/]+\.(?:supabase\.co|vercel\.app)\//,
          async (route) => {
            const request = route.request(),
              response = await fetch(request.url(), {
                method: request.method(),
                headers: await request.allHeaders(),
                body: ["GET", "HEAD"].includes(request.method())
                  ? undefined
                  : request.postData(),
                redirect: "manual",
                signal: AbortSignal.timeout(90000),
              });
            const headers = Object.fromEntries(response.headers);
            delete headers["content-encoding"];
            delete headers["content-length"];
            await route.fulfill({
              status: response.status,
              headers,
              body: Buffer.from(await response.arrayBuffer()),
            });
          },
        );
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const goto = (path) => page.goto(base + path, { waitUntil: "commit" });
      if (process.env.UQONI_TEST_ACCESS_FILE) {
        await page.goto(
          JSON.parse(fs.readFileSync(process.env.UQONI_TEST_ACCESS_FILE)).url,
          { waitUntil: "commit" },
        );
        await page.locator("h1").waitFor();
      }
      await goto("/services");
      assert.match(await page.locator("h1").textContent(), /Construisons/);
      assert.equal(await page.locator(".service-card").count(), 6);
      await goto("/orders");
      await page.waitForURL("**/login?next=*", { waitUntil: "commit" });
      progress("Guest routes protected");
      const account = accounts.find((a) => a.role === "client");
      await page.getByLabel("Adresse email").fill(account.email);
      await page
        .getByLabel("Mot de passe", { exact: true })
        .fill(account.password);
      await page
        .getByRole("button", { name: "Se connecter", exact: true })
        .click();
      await page.waitForURL("**/orders", {
        waitUntil: "commit",
        timeout: 90000,
      });
      progress("Client real login passed");
      async function api(role) {
        const u = accounts.find((a) => a.role === role),
          db = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            { auth: { persistSession: false, autoRefreshToken: false } },
          );
        const { error } = await db.auth.signInWithPassword({
          email: u.email,
          password: u.password,
        });
        assert.equal(error, null);
        return db;
      }
      const admin = await api("admin"),
        other = await api("other");
      const rpc = async (name, args) => {
        const { data, error } = await admin.rpc(name, args);
        assert.equal(error, null, error?.message);
        return data;
      };
      await goto("/services/site-web");
      await page
        .getByLabel("Décrivez votre besoin")
        .fill(
          "TEST E2E : Un site de présentation avec cinq pages, un formulaire de contact et une livraison sous trois semaines.",
        );
      await page.getByRole("button", { name: "Envoyer ma demande" }).click();
      await page.waitForURL("**/orders/*", { waitUntil: "commit" });
      const orderId = new URL(page.url()).pathname.split("/").pop();
      progress("Browser quote request persisted");
      await rpc("admin_quote", {
        p_order: orderId,
        p_amount: 150000,
        p_note:
          "Site de cinq pages, formulaire de contact, deux révisions. Livraison sous trois semaines après validation des contenus. Paiement total avant production.",
      });
      await goto("/orders/" + orderId);
      assert.match(await page.locator(".amount-row").textContent(), /150/);
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Accepter le devis" }).click();
      await page.getByLabel("Référence de transaction").waitFor();
      progress("Client accepted quote");
      await page
        .getByLabel("Référence de transaction")
        .fill("TEST-E2E-REFERENCE");
      await page
        .getByRole("button", { name: "Soumettre pour vérification" })
        .click();
      await page
        .getByRole("heading", { name: "Vérification en cours" })
        .waitFor();
      let { data: projects, error: pe } = await admin
        .from("projects")
        .select("id")
        .eq("order_id", orderId);
      assert.equal(pe, null);
      assert.deepEqual(projects, []);
      progress("Payment pending; no premature project");
      const { data: payment, error: payError } = await admin
        .from("payments")
        .select("id,amount_xaf")
        .eq("order_id", orderId)
        .eq("status", "pending")
        .single();
      assert.equal(payError, null);
      assert.equal(payment.amount_xaf, 150000);
      await rpc("admin_verify_payment", {
        p_payment: payment.id,
        p_confirm: true,
      });
      const { data: project, error: prError } = await admin
        .from("projects")
        .select("id")
        .eq("order_id", orderId)
        .single();
      assert.equal(prError, null);
      progress("Real admin verification created one project");
      await rpc("admin_update_project", {
        p_project: project.id,
        p_status: "delivered",
        p_title: "TEST E2E : Votre site est livré",
        p_body: "Votre livrable est disponible pour validation.",
        p_url: "https://example.com/uqoni-test-delivery",
        p_file_name: "Site livré",
      });
      await goto("/projects/" + project.id);
      assert.match(await page.locator(".badge").textContent(), /Livré/);
      assert.equal(
        await page
          .getByRole("link", { name: "Site livré" })
          .getAttribute("href"),
        "https://example.com/uqoni-test-delivery",
      );
      progress("Client sees delivered project and live deliverable");
      const { data: leaked, error: leakError } = await other
        .from("orders")
        .select("id")
        .eq("id", orderId);
      assert.equal(leakError, null);
      assert.deepEqual(leaked, []);
      const { data: files, error: fileError } = await other
        .from("deliverables")
        .select("id")
        .eq("project_id", project.id);
      assert.equal(fileError, null);
      assert.deepEqual(files, []);
      const { error: roleError } = await other
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", accounts.find((a) => a.role === "other").id);
      assert.ok(roleError);
      progress("API ownership isolation and anti-escalation passed");
      await goto("/profile");
      await page.getByLabel("Nom complet").fill("Test Client Modifié");
      await page
        .getByRole("button", { name: "Enregistrer mon profil" })
        .click();
      await page.getByRole("status").waitFor();
      await goto("/profile");
      assert.equal(
        await page.getByLabel("Nom complet").inputValue(),
        "Test Client Modifié",
      );
      await goto("/services/site-web");
      await page.getByRole("button", { name: "Ajouter à mes favoris" }).click();
      await page.getByRole("button", { name: "Retirer des favoris" }).waitFor();
      await goto("/favorites");
      assert.equal(await page.locator(".service-card").count(), 1);
      progress("Profile persistence and favorites passed");
      await goto("/support");
      await page.getByLabel("Objet").fill("TEST E2E : Livraison");
      await page
        .getByLabel("Votre message")
        .fill(
          "Merci de confirmer la disponibilité du livrable et les prochaines étapes de validation.",
        );
      await page.getByRole("button", { name: "Envoyer ma demande" }).click();
      await page.getByRole("status").waitFor();
      const { data: ticket, error: te } = await admin
        .from("support_requests")
        .select("id")
        .eq("user_id", account.id)
        .eq("subject", "TEST E2E : Livraison")
        .single();
      assert.equal(te, null);
      const { error: replyError } = await admin
        .from("support_requests")
        .update({
          response: "Le livrable est disponible dans votre espace.",
          status: "resolved",
          responded_at: new Date().toISOString(),
        })
        .eq("id", ticket.id);
      assert.equal(replyError, null);
      await goto("/support");
      assert.match(
        await page.locator(".support-reply").textContent(),
        /livrable est disponible/,
      );
      progress("Support request and admin response passed");
      await goto("/notifications");
      await page
        .getByRole("button", { name: "Marquer comme lue" })
        .first()
        .click();
      await page.getByRole("status").waitFor();
      await page.setViewportSize({ width: 390, height: 844 });
      await goto("/home");
      await page.locator(".hero-panel").waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.equal(
        await page.locator('.bottom-nav a[aria-current="page"]').textContent(),
        "Accueil",
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
      progress("Mobile, navigation and notifications passed");
      await goto("/profile");
      await page.getByRole("button", { name: "Se déconnecter" }).click();
      await page.waitForURL("**/login", { waitUntil: "commit" });
      await goto("/orders");
      await page.waitForURL("**/login?next=*", { waitUntil: "commit" });
      assert.deepEqual(errors, []);
      progress("Logout passed; no runtime errors");
      console.log(
        "PASS: real client browser quote, acceptance, manual payment, admin API verification, delivery, isolated data, profile, favorites, support, notifications, mobile and logout.",
      );
    } catch (error) {
      console.error(
        "Verification evidence",
        fs.readFileSync("/tmp/uqoni-e2e-progress.log", "utf8"),
        logs.slice(-1000),
      );
      throw error;
    } finally {
      await browser?.close();
      server?.kill();
    }
  },
);

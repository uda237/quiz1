import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const enabled =
  process.env.UQONI_AUTH_HTTP === "1" || !!process.env.UQONI_AUTH_TEST_URL;
const base = process.env.UQONI_AUTH_TEST_URL || "http://127.0.0.1:3100";
let server;
before(async () => {
  if (!enabled || process.env.UQONI_AUTH_TEST_URL) return;
  server = spawn(
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
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Auth HTTP server did not start")),
      15000,
    );
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Auth HTTP server exited: ${code}`));
    });
    server.stdout.on("data", (data) => {
      if (data.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
});
after(() => server?.kill());

test(
  "confirmation page and entry points render without a session",
  { skip: !enabled },
  async () => {
    const response = await fetch(`${base}/verify-email`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Confirmer votre adresse email/);
    assert.match(html, /Renvoyer le lien de confirmation/);
    assert.match(html, /type="email"/);
    assert.doesNotMatch(html, /type="password"/);
    for (const path of ["/login", "/register"]) {
      const page = await fetch(base + path);
      assert.equal(page.status, 200);
      assert.match(await page.text(), /href="\/verify-email"/);
    }
  },
);

test(
  "invalid auth callbacks redirect to the matching internal retry page",
  { skip: !enabled },
  async () => {
    const cases = [
      ["/auth/callback", "/verify-email?error=confirmation"],
      [
        "/auth/callback?next=/reset-password",
        "/forgot-password?error=confirmation",
      ],
      [
        "/auth/callback?next=https%3A%2F%2Fevil.example",
        "/verify-email?error=confirmation",
      ],
      ["/auth/confirm?type=recovery", "/forgot-password?error=confirmation"],
      ["/auth/confirm?type=signup", "/verify-email?error=confirmation"],
    ];
    for (const [path, destination] of cases) {
      const response = await fetch(base + path, { redirect: "manual" });
      assert.equal(response.status, 307);
      const location = new URL(response.headers.get("location"));
      assert.equal(location.pathname + location.search, destination);
      const origins = process.env.UQONI_AUTH_TEST_URL
        ? [new URL(base).origin]
        : [base, "http://localhost:3100"];
      assert.ok(origins.includes(location.origin));
    }
  },
);

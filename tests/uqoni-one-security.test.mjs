import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Static source checks only; no authenticated network requests or database RLS verification.
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("client portal requires verified Supabase user on server", () => {
  const source = read("src/app/client/page.tsx");
  assert.match(source, /await supabase\.auth\.getUser\(\)/);
  assert.match(source, /if \(error \|\| !data\.user\) redirect\(/);
});

test("workspace uses existing server-side administrator gate", () => {
  const source = read("src/app/workspace/page.tsx");
  assert.match(source, /await requireAdmin\("\/workspace"\)/);
  const session = read("src/lib/session.ts");
  assert.match(session, /s\.profile\?\.role !== "admin"/);
});

test("launcher links to protected portals without granting roles", () => {
  const source = read("src/app/one/page.tsx");
  assert.match(source, /href: "\/client"/);
  assert.match(source, /href: "\/workspace"/);
  assert.doesNotMatch(source, /service_role|setUserRole|updateUserRole/);
});

test("login redirect is restricted to same-origin relative paths", () => {
  const source = read("src/lib/format.ts");
  assert.match(source, /value\?\.startsWith\("\/"\)/);
  assert.match(source, /!value\.startsWith\("\/\/"\)/);
  assert.match(source, /: "\/home"/);
});

test("session uses verified auth identity and checks the database profile role", () => {
  const source = read("src/lib/session.ts");
  assert.match(source, /await db\.auth\.getUser\(\)/);
  assert.match(source, /\.from\("profiles"\)/);
  assert.match(source, /\.eq\("id", user\.id\)/);
  assert.match(source, /if \(s\.profile\?\.role !== "admin"\) redirect\("\/home"\)/);
});

test("Supabase server client uses a public key rather than a service-role key", () => {
  const source = read("src/lib/supabase/server.ts");
  assert.match(source, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(source, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY|service_role/);
});

test("administrator gate retains original admin route as default", () => {
  const session = read("src/lib/session.ts");
  assert.match(session, /export async function requireAdmin\(path = "\/admin"\)/);
  assert.match(session, /await requireUser\(path\)/);
  assert.match(session, /if \(s\.profile\?\.role !== "admin"\) redirect\("\/home"\)/);
});

test("server Supabase client uses user-scoped publishable or anon credentials", () => {
  const source = read("src/lib/supabase/server.ts");
  assert.match(source, /createServerClient<Database>/);
  assert.match(source, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY|service_role/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Static regression guards. These do NOT replace live authentication or RLS tests.
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("client portal requires verified Supabase user on server", () => {
  const source = read("src/app/client/page.tsx");
  assert.match(source, /await supabase\.auth\.getUser\(\)/);
  assert.match(source, /if \(error \|\| !data\.user\) redirect\(/);
});

test("workspace uses existing server-side administrator gate", () => {
  const source = read("src/app/workspace/page.tsx");
  assert.match(source, /await requireAdmin\(\)/);
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

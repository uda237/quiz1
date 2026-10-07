import test from "node:test";
import assert from "node:assert/strict";
import { safeNext, safeUrl } from "../src/lib/format.ts";
test("authentication callbacks cannot redirect outside this application", () => {
  for (const candidate of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/\n/evil.example",
    "/\t/evil.example",
    "javascript:alert(1)",
    null,
  ])
    assert.equal(safeNext(candidate), "/home");
  assert.equal(safeNext("/orders/123?view=quote"), "/orders/123?view=quote");
  assert.equal(safeNext("/reset-password"), "/reset-password");
});
test("deliverable links cannot execute scripts or use unsafe protocols", () => {
  for (const candidate of [
    "javascript:alert(1)",
    "data:text/html,example",
    "http://example.com",
    "file:///tmp/test",
    null,
  ])
    assert.equal(safeUrl(candidate), null);
  assert.equal(
    safeUrl("https://example.com/deliverable"),
    "https://example.com/deliverable",
  );
});

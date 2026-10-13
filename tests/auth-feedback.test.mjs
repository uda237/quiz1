import test from "node:test";
import assert from "node:assert/strict";
import {
  authErrorMessage,
  confirmationFailurePath,
} from "../src/lib/auth-feedback.ts";
test("unconfirmed accounts and expired links offer actionable recovery", () => {
  assert.match(
    authErrorMessage({ code: "email_not_confirmed" }),
    /nouveau lien de confirmation/,
  );
  assert.match(authErrorMessage({ code: "otp_expired" }), /expiré/);
  assert.equal(
    confirmationFailurePath(false),
    "/verify-email?error=confirmation",
  );
  assert.equal(
    confirmationFailurePath(true),
    "/forgot-password?error=confirmation",
  );
});
test("rate limits remain errors and never claim successful delivery", () => {
  for (const code of [
    "over_email_send_rate_limit",
    "over_request_rate_limit",
  ]) {
    const feedback = authErrorMessage({ code });
    assert.match(feedback, /Patientez/);
    assert.doesNotMatch(feedback, /envoyé|succès|prise en compte/);
  }
});
test("unknown provider errors do not expose internal details", () => {
  const raw =
    "database connection failed: internal host and transaction details";
  assert.doesNotMatch(
    authErrorMessage(new Error(raw)),
    /database|internal|transaction/,
  );
  assert.match(authErrorMessage(new Error(raw)), /Réessayez/);
  assert.equal(
    authErrorMessage(new Error("Les mots de passe ne correspondent pas.")),
    "Les mots de passe ne correspondent pas.",
  );
});

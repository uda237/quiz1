/** Keep provider details private and avoid claiming successful email delivery. */
export function authErrorMessage(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  const message = error instanceof Error ? error.message : "";
  if (code === "invalid_credentials" || message.includes("Invalid login"))
    return "Email ou mot de passe incorrect.";
  if (code === "email_not_confirmed" || message.includes("Email not confirmed"))
    return "Confirmez votre adresse email avant de vous connecter. Vous pouvez demander un nouveau lien de confirmation.";
  if (
    ["over_email_send_rate_limit", "over_request_rate_limit"].includes(code) ||
    message.toLowerCase().includes("rate limit")
  )
    return "Trop de tentatives. Patientez avant de demander un nouveau lien.";
  if (
    ["otp_expired", "flow_state_expired", "flow_state_not_found"].includes(code)
  )
    return "Le lien a expiré ou a déjà été utilisé. Demandez un nouveau lien.";
  if (
    message === "Les mots de passe ne correspondent pas." ||
    message ===
      "Ouvrez le lien de récupération reçu par email avant de changer le mot de passe."
  )
    return message;
  return "Impossible de terminer cette demande. Réessayez ou contactez UQONI si le problème persiste.";
}
export function confirmationFailurePath(recovery: boolean): string {
  return recovery
    ? "/forgot-password?error=confirmation"
    : "/verify-email?error=confirmation";
}

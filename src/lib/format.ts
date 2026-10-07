export const money = (value: number | string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(Number(value));
export const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeZone: "Africa/Douala",
      }).format(new Date(value))
    : "—";
export const labels: Record<string, string> = {
  draft: "Devis demandé",
  requested: "Devis demandé",
  ready: "Devis prêt",
  accepted: "Devis accepté",
  declined: "Devis décliné",
  awaiting_payment: "En attente de paiement",
  pending: "Vérification en cours",
  paid: "Payé",
  processing: "En production",
  completed: "Terminé",
  cancelled: "Annulé",
  refunded: "Remboursé",
  failed: "Non confirmé",
  queued: "En préparation",
  active: "En cours",
  review: "En validation",
  delivered: "Livré",
  blocked: "À débloquer",
  open: "Ouvert",
  resolved: "Résolu",
};
export const safeNext = (value: string | null) =>
  value?.startsWith("/") &&
  !value.startsWith("//") &&
  !/[\\\x00-\x20]/.test(value)
    ? value
    : "/home";
export const safeUrl = (value: string | null) => {
  try {
    const u = new URL(value || "");
    return u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
};

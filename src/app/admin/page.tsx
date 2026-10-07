import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { Heading } from "@/components/ui";
import { money } from "@/lib/format";
export default async function Admin() {
  const { db } = await requireAdmin();
  const results = await Promise.all([
    db
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("quote_state", "requested"),
    db
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    db
      .from("projects")
      .select("id", { count: "exact", head: true })
      .not("status", "in", "(completed,cancelled)"),
    db
      .from("support_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    db.from("payments").select("amount_xaf").eq("status", "paid"),
  ]);
  const error = results.find((r) => r.error)?.error;
  if (error) throw error;
  const revenue =
    results[4].data?.reduce(
      (sum, p) => sum + ("amount_xaf" in p ? Number(p.amount_xaf) : 0),
      0,
    ) || 0;
  const stats = [
    ["Devis à préparer", results[0].count, "/admin/orders"],
    ["Paiements à vérifier", results[1].count, "/admin/orders"],
    ["Projets en cours", results[2].count, "/admin/projects"],
    ["Tickets ouverts", results[3].count, "/admin/support"],
  ] as const;
  return (
    <section>
      <Heading
        eyebrow="CONTROL CENTER"
        title="Pilotez l’exécution."
        description="Vos demandes, vos encaissements et votre production en une vue."
      />
      <div className="admin-stats">
        {stats.map(([label, count, href]) => (
          <Link prefetch={false} className="card stat" href={href} key={label}>
            <span className="muted">{label}</span>
            <strong>{count || 0}</strong>
            <span>Ouvrir →</span>
          </Link>
        ))}
      </div>
      <article className="hero-panel compact">
        <div>
          <p className="eyebrow">ENCAISSEMENTS CONFIRMÉS</p>
          <h2>{money(revenue)}</h2>
          <p>Somme des paiements vérifiés, hors paiements en attente.</p>
        </div>
      </article>
      <div className="card panel">
        <h2>Le parcours de production</h2>
        <p className="prose muted">
          Demande → devis → acceptation → paiement vérifié → projet → livraison.
        </p>
        <p className="notice">
          Avant de confirmer un paiement, vérifiez le montant, la référence et
          l’encaissement réel sur votre compte. Une référence saisie par le
          client ne constitue pas une confirmation de paiement.
        </p>
      </div>
    </section>
  );
}

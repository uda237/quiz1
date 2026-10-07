import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { money, date } from "@/lib/format";
import { Heading, Badge, Field } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { respondQuote, submitPayment } from "@/app/actions";
export default async function Order({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { db, user } = await requireUser(`/orders/${id}`);
  const { data: o, error } = await db
    .from("orders")
    .select("*,order_items(*),payments(*),projects(id,name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!o) notFound();
  const pending = o.payments.some((p) =>
    ["pending", "processing", "paid"].includes(p.status),
  );
  return (
    <section className="container page">
      <Link prefetch={false} className="back-link" href="/orders">
        ← Mes commandes
      </Link>
      <Heading
        eyebrow={o.order_number}
        title={o.order_items[0]?.service_name || "Votre commande"}
        description={`Demandée le ${date(o.created_at)}`}
      />
      <div className="detail-grid">
        <div className="stack">
          <article className="card panel">
            <Badge value={o.status === "draft" ? o.quote_state : o.status} />
            <h2>Votre besoin</h2>
            <p className="prose">{o.brief}</p>
            {o.quote_note && (
              <>
                <h2>Proposition UQONI</h2>
                <p className="prose">{o.quote_note}</p>
              </>
            )}
            <div className="amount-row">
              <span>Montant du devis</span>
              <strong>
                {o.quote_state === "requested"
                  ? "À définir"
                  : money(o.total_xaf)}
              </strong>
            </div>
          </article>
          {o.payments.length > 0 && (
            <article className="card panel">
              <h2>Historique des paiements</h2>
              {o.payments.map((p) => (
                <div className="list-row" key={p.id}>
                  <div>
                    <strong>{p.provider}</strong>
                    <p className="muted">
                      {p.provider_reference} · {money(p.amount_xaf)}
                    </p>
                  </div>
                  <Badge value={p.status} />
                </div>
              ))}
            </article>
          )}
          {o.projects.map((p) => (
            <Link
              prefetch={false}
              key={p.id}
              className="card panel text-link"
              href={`/projects/${p.id}`}
            >
              Suivre le projet : {p.name} →
            </Link>
          ))}
          <Link prefetch={false} className="text-link" href="/support">
            Une question ? Contacter l’assistance →
          </Link>
        </div>
        <aside className="card panel">
          {o.quote_state === "requested" ? (
            <>
              <h2>Nous préparons votre devis.</h2>
              <p className="muted">
                Vous recevrez une notification dans votre espace lorsqu’il sera
                prêt.
              </p>
            </>
          ) : o.quote_state === "ready" ? (
            <>
              <h2>Votre devis est prêt.</h2>
              <p className="muted">
                Vérifiez le périmètre et le montant avant de valider.
              </p>
              <ActionForm
                action={respondQuote}
                label="Accepter le devis"
                confirm="Accepter ce devis et ses conditions ?"
              >
                <input type="hidden" name="order_id" value={id} />
                <input type="hidden" name="accept" value="true" />
              </ActionForm>
              <ActionForm
                action={respondQuote}
                label="Décliner le devis"
                confirm="Décliner ce devis ?"
              >
                <input type="hidden" name="order_id" value={id} />
                <input type="hidden" name="accept" value="false" />
              </ActionForm>
            </>
          ) : o.status === "awaiting_payment" ? (
            <>
              <h2>
                {pending
                  ? "Vérification en cours"
                  : "Transmettre une référence"}
              </h2>
              <p className="muted">
                {pending
                  ? "UQONI vérifie l’encaissement. Aucun paiement n’est confirmé automatiquement."
                  : "Obtenez les coordonnées de paiement auprès d’UQONI, effectuez le règlement puis transmettez la référence."}
              </p>
              {!pending && (
                <>
                  <a
                    href={`mailto:uqoni.pro@gmail.com?subject=${encodeURIComponent(`Paiement ${o.order_number}`)}`}
                    className="text-link"
                  >
                    Demander les coordonnées de paiement →
                  </a>
                  <ActionForm
                    action={submitPayment}
                    label="Soumettre pour vérification"
                  >
                    <input type="hidden" name="order_id" value={id} />
                    <label className="field">
                      Moyen de paiement
                      <select name="provider">
                        <option>Orange Money</option>
                        <option>MTN Mobile Money</option>
                        <option>Virement bancaire</option>
                        <option>Autre</option>
                      </select>
                    </label>
                    <Field
                      name="reference"
                      label="Référence de transaction"
                      minLength={4}
                      maxLength={120}
                    />
                    <p className="muted text-sm">
                      Ne transmettez jamais de code PIN, mot de passe ou code
                      OTP.
                    </p>
                  </ActionForm>
                </>
              )}
            </>
          ) : (
            <>
              <h2>Votre demande est suivie.</h2>
              <p className="muted">
                Consultez l’état de votre commande et les mises à jour de votre
                projet.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

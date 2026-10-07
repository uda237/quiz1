import { requireAdmin } from "@/lib/session";
import { Heading, Badge, Field, TextField, Empty } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { issueQuote, verifyPayment } from "@/app/actions";
import { money, date } from "@/lib/format";
export default async function Orders() {
  const { db } = await requireAdmin();
  const { data: list, error } = await db
    .from("orders")
    .select(
      "*,profiles(full_name,company,phone),order_items(service_name),payments(*)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (
    <section>
      <Heading
        title="Devis & paiements"
        description="Les 100 dernières demandes. Chaque encaissement doit être vérifié avant validation."
      />
      {list?.length ? (
        <div className="record-list">
          {list.map((o) => (
            <article key={o.id} className="card panel">
              <div className="section-title">
                <div>
                  <p className="eyebrow">
                    {o.order_number} · {date(o.created_at)}
                  </p>
                  <h2>{o.order_items[0]?.service_name}</h2>
                  <p className="muted">
                    {o.profiles?.full_name} · {o.profiles?.company} ·{" "}
                    {o.profiles?.phone}
                  </p>
                </div>
                <Badge
                  value={o.status === "draft" ? o.quote_state : o.status}
                />
              </div>
              <p className="prose">{o.brief}</p>
              {["requested", "ready"].includes(o.quote_state) &&
              o.status === "draft" ? (
                <ActionForm
                  action={issueQuote}
                  label="Proposer ce devis au client"
                >
                  <input type="hidden" name="order_id" value={o.id} />
                  <Field
                    name="amount"
                    label="Montant total en FCFA"
                    type="number"
                    defaultValue={o.total_xaf ? String(o.total_xaf) : ""}
                  />
                  <TextField
                    name="note"
                    label="Périmètre, livrables, délais et conditions"
                    defaultValue={o.quote_note || ""}
                    minLength={20}
                  />
                </ActionForm>
              ) : (
                <div className="amount-row">
                  <span>Montant convenu</span>
                  <strong>{money(o.total_xaf)}</strong>
                </div>
              )}
              {o.payments.map((p) => (
                <div className="payment-review" key={p.id}>
                  <div className="list-row">
                    <div>
                      <strong>
                        {p.provider} · {money(p.amount_xaf)}
                      </strong>
                      <p>Référence : {p.provider_reference}</p>
                    </div>
                    <Badge value={p.status} />
                  </div>
                  {["pending", "processing"].includes(p.status) && (
                    <div className="button-row">
                      <ActionForm
                        action={verifyPayment}
                        label="Confirmer l’encaissement"
                        confirm={`Avez-vous vérifié l’encaissement réel de ${money(p.amount_xaf)} pour la référence ${p.provider_reference} ?`}
                      >
                        <input type="hidden" name="payment_id" value={p.id} />
                        <input type="hidden" name="confirm" value="true" />
                      </ActionForm>
                      <ActionForm
                        action={verifyPayment}
                        label="Encaissement non confirmé"
                        confirm="Marquer ce paiement comme non confirmé ?"
                      >
                        <input type="hidden" name="payment_id" value={p.id} />
                        <input type="hidden" name="confirm" value="false" />
                      </ActionForm>
                    </div>
                  )}
                </div>
              ))}
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Aucune demande pour le moment."
          body="Les demandes de devis de vos clients apparaîtront ici."
        />
      )}
    </section>
  );
}

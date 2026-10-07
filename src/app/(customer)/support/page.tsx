import { requireUser } from "@/lib/session";
import { Heading, Field, TextField, Badge } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { sendSupport } from "@/app/actions";
import { date } from "@/lib/format";
export default async function Support() {
  const { db, user } = await requireUser("/support");
  const { data: list, error } = await db
    .from("support_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (
    <section className="container page">
      <Heading
        title="Comment pouvons-nous vous aider ?"
        description="Une question sur votre devis, votre paiement ou votre projet ?"
      />
      <div className="detail-grid">
        <div className="stack">
          <h2>Mes demandes</h2>
          {list?.length ? (
            list.map((t) => (
              <article className="card panel" key={t.id}>
                <Badge value={t.status} />
                <h2>{t.subject}</h2>
                <p className="eyebrow">{date(t.created_at)}</p>
                <p className="prose">{t.message}</p>
                {t.response && (
                  <div className="support-reply">
                    <strong>Réponse UQONI</strong>
                    <p className="prose">{t.response}</p>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="card panel muted">
              Vous n’avez pas encore de demande d’assistance.
            </div>
          )}
        </div>
        <aside className="card panel">
          <h2>Nouvelle demande</h2>
          <ActionForm action={sendSupport} label="Envoyer ma demande">
            <Field name="subject" label="Objet" minLength={4} />
            <TextField name="message" label="Votre message" minLength={20} />
          </ActionForm>
          <p className="muted mt-6">
            Contact officiel :{" "}
            <a className="text-link" href="mailto:uqoni.pro@gmail.com">
              uqoni.pro@gmail.com
            </a>
          </p>
        </aside>
      </div>
    </section>
  );
}

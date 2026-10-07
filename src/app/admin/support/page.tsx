import { requireAdmin } from "@/lib/session";
import { Heading, TextField, Badge, Empty } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { replySupport } from "@/app/actions";
export default async function Support() {
  const { db } = await requireAdmin();
  const { data: list, error } = await db
    .from("support_requests")
    .select("*,profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (
    <section>
      <Heading
        title="Assistance client"
        description="Répondez aux demandes dans l’espace de chaque client."
      />
      {list?.length ? (
        <div className="record-list">
          {list.map((t) => (
            <article className="card panel" key={t.id}>
              <Badge value={t.status} />
              <h2>{t.subject}</h2>
              <p className="muted">{t.profiles?.full_name}</p>
              <p className="prose">{t.message}</p>
              <ActionForm action={replySupport} label="Enregistrer la réponse">
                <input type="hidden" name="id" value={t.id} />
                <TextField
                  name="response"
                  label="Réponse au client"
                  defaultValue={t.response || ""}
                />
                <label className="field">
                  Statut
                  <select name="status" defaultValue={t.status}>
                    <option value="open">Ouvert</option>
                    <option value="resolved">Résolu</option>
                  </select>
                </label>
              </ActionForm>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Aucune demande d’assistance."
          body="Les messages de vos clients apparaîtront ici."
        />
      )}
    </section>
  );
}

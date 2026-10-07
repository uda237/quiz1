import { requireAdmin } from "@/lib/session";
import { Heading, Badge, Field, TextField, Empty } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { updateProject } from "@/app/actions";
import { labels } from "@/lib/format";
export default async function Projects() {
  const { db } = await requireAdmin();
  const { data: list, error } = await db
    .from("projects")
    .select(
      "*,profiles(full_name),project_updates(title,body,created_at),deliverables(name,url)",
    )
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (
    <section>
      <Heading
        title="Production & livraison"
        description="Mettez à jour les projets et partagez les liens de livrables avec les clients concernés."
      />
      {list?.length ? (
        <div className="record-list">
          {list.map((p) => (
            <article className="card panel" key={p.id}>
              <div className="section-title">
                <div>
                  <p className="eyebrow">{p.project_number}</p>
                  <h2>{p.name}</h2>
                  <p className="muted">{p.profiles?.full_name}</p>
                </div>
                <Badge value={p.status} />
              </div>
              {["completed", "cancelled"].includes(p.status) ? (
                <p className="notice">Projet clôturé.</p>
              ) : (
                <ActionForm
                  action={updateProject}
                  label="Publier cette mise à jour"
                >
                  <input type="hidden" name="project_id" value={p.id} />
                  <label className="field">
                    Statut
                    <select name="status" defaultValue={p.status}>
                      {[
                        "queued",
                        "active",
                        "review",
                        "delivered",
                        "completed",
                        "blocked",
                        "cancelled",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {labels[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    name="title"
                    label="Titre de la mise à jour"
                    minLength={3}
                  />
                  <TextField
                    name="body"
                    label="Message au client"
                    required={false}
                    minLength={0}
                  />
                  <Field
                    name="file_name"
                    label="Nom du livrable (si un lien est ajouté)"
                    required={false}
                  />
                  <Field
                    name="url"
                    label="Lien HTTPS du livrable (facultatif)"
                    type="url"
                    required={false}
                    maxLength={2000}
                  />
                  <p className="muted text-sm">
                    Utilisez un partage limité au client dans votre outil de
                    stockage. La visibilité de cette fiche ne remplace pas les
                    permissions du lien externe.
                  </p>
                </ActionForm>
              )}
              <details className="mt-6">
                <summary>
                  Journal du projet ({p.project_updates.length})
                </summary>
                {p.project_updates
                  .toSorted((a, b) =>
                    b.created_at!.localeCompare(a.created_at!),
                  )
                  .map((u, i) => (
                    <div key={i} className="list-row">
                      <div>
                        <strong>{u.title}</strong>
                        <p className="prose muted">{u.body}</p>
                      </div>
                    </div>
                  ))}
              </details>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Aucun projet en production."
          body="La confirmation d’un paiement crée automatiquement un projet."
        />
      )}
    </section>
  );
}

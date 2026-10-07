import { requireUser } from "@/lib/session";
import { Heading, Empty } from "@/components/ui";
import { date } from "@/lib/format";
import { ActionForm } from "@/components/action-form";
import { markRead } from "@/app/actions";
export default async function Notifications() {
  const { db, user } = await requireUser("/notifications");
  const { data: list, error } = await db
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (
    <section className="container page">
      <Heading
        title="Mes notifications"
        description="Les dernières nouvelles de vos demandes et projets."
      />
      {list?.length ? (
        <div className="record-list">
          {list.map((n) => (
            <article
              key={n.id}
              className={`card panel ${n.read_at ? "" : "unread"}`}
            >
              <p className="eyebrow">
                {date(n.created_at)} · {n.read_at ? "Lue" : "Nouvelle"}
              </p>
              <h2>{n.title}</h2>
              <p className="prose muted">{n.body}</p>
              {!n.read_at && (
                <ActionForm action={markRead} label="Marquer comme lue">
                  <input type="hidden" name="id" value={n.id} />
                </ActionForm>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Vous êtes à jour."
          body="Vos prochaines notifications apparaîtront ici."
        />
      )}
    </section>
  );
}

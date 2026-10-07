import { requireAdmin } from "@/lib/session";
import { Heading, Empty } from "@/components/ui";
import { date } from "@/lib/format";
export default async function Audit() {
  const { db } = await requireAdmin();
  const { data: list, error } = await db
    .from("audit_logs")
    .select("id,event,entity_type,entity_id,created_at")
    .order("id", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (
    <section>
      <Heading
        title="Journal d’activité"
        description="Les 100 derniers événements de devis, paiement et production."
      />
      {list?.length ? (
        <div className="card panel">
          {list.map((a) => (
            <div className="list-row" key={a.id}>
              <div>
                <strong>{a.event}</strong>
                <p className="muted text-sm">
                  {a.entity_type} · {a.entity_id}
                </p>
              </div>
              <span className="muted text-sm">{date(a.created_at!)}</span>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="Aucun événement."
          body="Les actions métier seront tracées ici."
        />
      )}
    </section>
  );
}

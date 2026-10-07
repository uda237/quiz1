import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Heading, Empty, Badge } from "@/components/ui";
import { date } from "@/lib/format";
export default async function Projects() {
  const { db, user } = await requireUser("/projects");
  const { data: list, error } = await db
    .from("projects")
    .select("id,name,status,project_number,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (
    <section className="container page">
      <Heading
        eyebrow="DE L’IDÉE AU LIVRABLE"
        title="Mes projets"
        description="Suivez la production et retrouvez vos livrables."
      />
      {list?.length ? (
        <div className="record-list">
          {list.map((p) => (
            <Link
              prefetch={false}
              href={`/projects/${p.id}`}
              className="card record"
              key={p.id}
            >
              <div>
                <p className="eyebrow">{p.project_number}</p>
                <h2>{p.name}</h2>
                <p className="muted">Mis à jour le {date(p.updated_at)}</p>
              </div>
              <div className="record-end">
                <Badge value={p.status} />
                <span>Suivre le projet →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="Vos projets apparaîtront ici."
          body="Un projet est créé après confirmation du paiement de votre commande."
          href="/orders"
          label="Voir mes devis"
        />
      )}
    </section>
  );
}

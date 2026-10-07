import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { Heading, Badge } from "@/components/ui";
import { date, safeUrl } from "@/lib/format";
export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { db, user } = await requireUser(`/projects/${id}`);
  const { data: p, error } = await db
    .from("projects")
    .select("*,project_updates(*),deliverables(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!p) notFound();
  return (
    <section className="container page">
      <Link prefetch={false} href="/projects" className="back-link">
        ← Mes projets
      </Link>
      <Heading eyebrow={p.project_number} title={p.name} />
      <Badge value={p.status} />
      <div className="detail-grid mt-6">
        <article className="card panel">
          <h2>Journal du projet</h2>
          <ol className="timeline">
            {p.project_updates
              .toSorted((a, b) =>
                (b.created_at || "").localeCompare(a.created_at || ""),
              )
              .map((u) => (
                <li key={u.id}>
                  <p className="eyebrow">{date(u.created_at)}</p>
                  <h3>{u.title}</h3>
                  <p className="prose muted">{u.body}</p>
                </li>
              ))}
          </ol>
        </article>
        <aside className="stack">
          <div className="card panel">
            <h2>Vos livrables</h2>
            {p.deliverables.length ? (
              p.deliverables.map((d) => (
                <div key={d.id} className="list-row">
                  {safeUrl(d.url) ? (
                    <a
                      className="text-link"
                      href={safeUrl(d.url)!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {d.name} ↗
                    </a>
                  ) : (
                    <p>{d.name} — contactez l’assistance pour l’accès.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="muted">
                Les livrables seront disponibles ici dès leur mise à
                disposition.
              </p>
            )}
          </div>
          <Link prefetch={false} className="btn-secondary" href="/support">
            Contacter l’assistance
          </Link>
          {p.order_id && (
            <Link
              prefetch={false}
              href={`/orders/${p.order_id}`}
              className="text-link"
            >
              Voir la commande associée →
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}

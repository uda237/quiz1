import Link from "next/link";
import { notFound } from "next/navigation";
import { randomUUID } from "node:crypto";
import { session } from "@/lib/session";
import { Heading, TextField } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { requestQuote, toggleFavorite } from "@/app/actions";
export default async function Service({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { db, user } = await session();
  const { data: s, error } = await db
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  if (!s) notFound();
  const { data: fav } = user
    ? await db
        .from("favorites")
        .select("service_id")
        .eq("user_id", user.id)
        .eq("service_id", s.id)
        .maybeSingle()
    : { data: null };
  return (
    <section className="container page">
      <Link prefetch={false} href="/services" className="back-link">
        ← Tous les services
      </Link>
      <Heading
        eyebrow="SERVICE UQONI · SUR DEVIS"
        title={s.name}
        description={s.summary}
      />
      <div className="detail-grid">
        <div>
          <article className="card panel">
            <h2>Ce que nous construisons ensemble</h2>
            <p className="prose">{s.description}</p>
            <div className="notice">
              Chaque devis précise le périmètre, les livrables, les délais et
              les conditions de paiement. Aucun paiement n’est demandé avant
              votre acceptation.
            </div>
          </article>
          {user && (
            <ActionForm
              action={toggleFavorite}
              label={fav ? "Retirer des favoris" : "Ajouter à mes favoris"}
            >
              <input type="hidden" name="service_id" value={s.id} />
              <input type="hidden" name="slug" value={slug} />
              <input
                type="hidden"
                name="remove"
                value={fav ? "true" : "false"}
              />
            </ActionForm>
          )}
        </div>
        <aside className="card panel">
          <p className="eyebrow">PARLONS DE VOTRE PROJET</p>
          <h2>Demander un devis</h2>
          <p className="muted">
            Précisez votre objectif, vos délais et les éléments déjà
            disponibles.
          </p>
          {user ? (
            <ActionForm action={requestQuote} label="Envoyer ma demande">
              <input type="hidden" name="service_id" value={s.id} />
              <input type="hidden" name="request_key" value={randomUUID()} />
              <TextField
                name="brief"
                label="Décrivez votre besoin"
                minLength={20}
              />
            </ActionForm>
          ) : (
            <div className="form-stack">
              <Link
                prefetch={false}
                className="btn-primary"
                href={`/login?next=${encodeURIComponent(`/services/${slug}`)}`}
              >
                Se connecter pour demander un devis
              </Link>
              <Link prefetch={false} className="text-link" href="/register">
                Créer mon compte
              </Link>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

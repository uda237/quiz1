import { createClient } from "@/lib/supabase/server";
import { Heading, Empty } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
export default async function Services({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const db = await createClient();
  const [{ data: services, error }, { data: categories, error: ce }] =
    await Promise.all([
      db
        .from("services")
        .select("id,slug,name,summary,category_id")
        .eq("active", true)
        .order("name"),
      db
        .from("service_categories")
        .select("id,name")
        .eq("active", true)
        .order("sort_order"),
    ]);
  if (error || ce) throw error || ce;
  const list = services?.filter(
    (s) =>
      (!category || s.category_id === category) &&
      `${s.name} ${s.summary}`
        .toLocaleLowerCase("fr")
        .includes(q.slice(0, 120).toLocaleLowerCase("fr")),
  );
  return (
    <section className="container page">
      <Heading
        eyebrow="LE CATALOGUE"
        title="Construisons votre prochain projet."
        description="Choisissez votre service. Nous cadrons ensemble le besoin, les livrables et le devis."
      />
      <form className="filter-bar">
        <label className="field">
          <span>Rechercher</span>
          <input
            name="q"
            type="search"
            defaultValue={q}
            maxLength={120}
            placeholder="Site web, automatisation, identité…"
          />
        </label>
        <label className="field">
          <span>Catégorie</span>
          <select name="category" defaultValue={category}>
            <option value="">Toutes les catégories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn-primary">Rechercher</button>
      </form>
      <p className="muted results-count">{list?.length || 0} service(s)</p>
      {list?.length ? (
        <div className="service-grid">
          {list.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      ) : (
        <Empty
          title="Aucun service trouvé"
          body="Essayez un autre mot-clé ou une autre catégorie."
          href="/services"
          label="Réinitialiser"
        />
      )}
    </section>
  );
}

import { requireUser } from "@/lib/session";
import { Heading, Empty } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
export default async function Favorites() {
  const { db, user } = await requireUser("/favorites");
  const { data: list, error } = await db
    .from("favorites")
    .select("service_id,services(id,slug,name,summary,active)")
    .eq("user_id", user.id);
  if (error) throw error;
  const services = list?.flatMap((f) =>
    f.services?.active ? [f.services] : [],
  );
  return (
    <section className="container page">
      <Heading
        title="Mes favoris"
        description="Gardez vos services préférés à portée de main."
      />
      {services?.length ? (
        <div className="service-grid">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      ) : (
        <Empty
          title="Aucun favori pour le moment."
          body="Ajoutez un service à vos favoris depuis sa fiche."
          href="/services"
          label="Explorer les services"
        />
      )}
    </section>
  );
}

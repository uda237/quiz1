import Link from "next/link";
import { session } from "@/lib/session";
import { ServiceCard } from "@/components/service-card";
import { ArrowUpRight } from "lucide-react";
export default async function Home() {
  const { db, user, profile } = await session();
  const [{ data: services, error }, orders, projects, notifications] =
    await Promise.all([
      db
        .from("services")
        .select("id,slug,name,summary")
        .eq("active", true)
        .order("created_at")
        .limit(3),
      user
        ? db
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
        : Promise.resolve({ count: 0 }),
      user
        ? db
            .from("projects")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .not("status", "in", "(completed,cancelled)")
        : Promise.resolve({ count: 0 }),
      user
        ? db
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .is("read_at", null)
        : Promise.resolve({ count: 0 }),
    ]);
  if (error) throw error;
  return (
    <section className="container page">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">VOTRE ESPACE DIGITAL</p>
          <h1>
            Bonjour
            {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h1>
          <p className="muted">Que souhaitez-vous construire aujourd’hui ?</p>
        </div>
        <Link prefetch={false} className="btn-secondary" href="/notifications">
          Notifications {notifications.count ? `(${notifications.count})` : ""}
        </Link>
      </div>
      <div className="hero-panel">
        <div>
          <p className="eyebrow">DE L’AMBITION À L’EXÉCUTION</p>
          <h2>
            Vos idées méritent
            <br />
            un système solide.
          </h2>
          <p>
            Des services digitaux, un devis clair et un suivi à chaque étape.
          </p>
          <Link prefetch={false} className="btn-light" href="/services">
            Explorer les services <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span>U</span>
        </div>
      </div>
      {user && (
        <div className="stats-grid">
          <Link prefetch={false} className="card stat" href="/orders">
            <span className="muted">Demandes & commandes</span>
            <strong>{orders.count || 0}</strong>
            <span>Consulter mes devis →</span>
          </Link>
          <Link prefetch={false} className="card stat" href="/projects">
            <span className="muted">Projets en cours</span>
            <strong>{projects.count || 0}</strong>
            <span>Suivre la production →</span>
          </Link>
          <Link prefetch={false} className="card stat" href="/support">
            <span className="muted">Une question ?</span>
            <strong>À vos côtés.</strong>
            <span>Contacter l’assistance →</span>
          </Link>
        </div>
      )}
      <div className="section-title">
        <h2>Commencez par un service.</h2>
        <Link prefetch={false} href="/services" className="text-link">
          Tout explorer <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="service-grid">
        {services?.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </div>
      <div className="process-grid">
        {[
          [
            "01",
            "Décrivez votre besoin",
            "Choisissez un service et envoyez votre demande.",
          ],
          [
            "02",
            "Validez votre devis",
            "Le périmètre et le montant sont définis avant tout paiement.",
          ],
          [
            "03",
            "Suivez votre projet",
            "Retrouvez les étapes et livrables dans votre espace.",
          ],
        ].map(([n, t, b]) => (
          <div key={n}>
            <span className="step-number">{n}</span>
            <h3>{t}</h3>
            <p className="muted">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

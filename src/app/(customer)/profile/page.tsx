import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Heading, Field } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { saveProfile, activateOwner } from "@/app/actions";
import { SignOut } from "@/components/sign-out";

export default async function Profile() {
  const { db, user, profile } = await requireUser("/profile");
  const [orders, projects, notifications, support] = await Promise.all([
    db.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    db.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    db.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("read_at", null),
    db.from("support_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id).neq("status", "resolved"),
  ]);

  const links = [
    ["/orders", "Devis & commandes", `${orders.count || 0} dossier(s)`],
    ["/projects", "Projets", `${projects.count || 0} projet(s)`],
    ["/notifications", "Notifications", `${notifications.count || 0} non lue(s)`],
    ["/support", "Assistance", `${support.count || 0} demande(s) ouverte(s)`],
    ["/favorites", "Favoris", "Services enregistrés"],
  ];

  return (
    <section className="container page">
      <Heading
        eyebrow="VOTRE COMPTE"
        title="Mon espace"
        description="Pilotez vos coordonnées, demandes, projets et échanges UQONI depuis un seul espace."
      />
      <div className="stats-grid">
        {links.map(([href, title, meta]) => (
          <Link prefetch={false} className="card stat" href={href} key={href}>
            <span className="muted">{title}</span>
            <strong>{meta}</strong>
            <span>Ouvrir →</span>
          </Link>
        ))}
      </div>
      <div className="detail-grid mt-6">
        <article className="card panel">
          <h2>Informations personnelles</h2>
          <p className="muted">{user.email}</p>
          <ActionForm action={saveProfile} label="Enregistrer mon profil">
            <Field name="full_name" label="Nom complet" defaultValue={profile?.full_name || ""} minLength={2} maxLength={120} />
            <Field name="phone" label="Téléphone" type="tel" required={false} defaultValue={profile?.phone || ""} maxLength={40} />
            <Field name="company" label="Entreprise" required={false} defaultValue={profile?.company || ""} />
          </ActionForm>
        </article>
        <aside className="card panel stack">
          <h2>Sécurité & accès</h2>
          <Link prefetch={false} className="list-row" href="/forgot-password">Changer mon mot de passe →</Link>
          <Link prefetch={false} className="list-row" href="/privacy">Confidentialité →</Link>
          <Link prefetch={false} className="list-row" href="/terms">Conditions d’utilisation →</Link>
          {profile?.role === "admin" && <Link prefetch={false} className="list-row" href="/admin">Administration →</Link>}
          {user.email === "uqoni.pro@gmail.com" && profile?.role !== "admin" && (
            <ActionForm action={activateOwner} label="Activer mon administration" />
          )}
          <SignOut />
        </aside>
      </div>
    </section>
  );
}

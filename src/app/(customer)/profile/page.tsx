import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Heading, Field } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { saveProfile, activateOwner } from "@/app/actions";
import { SignOut } from "@/components/sign-out";
export default async function Profile() {
  const { user, profile } = await requireUser("/profile");
  return (
    <section className="container page">
      <Heading
        eyebrow="VOTRE COMPTE"
        title="Mon espace"
        description="Vos coordonnées facilitent le suivi de vos projets."
      />
      <div className="detail-grid">
        <article className="card panel">
          <h2>Informations personnelles</h2>
          <p className="muted">{user.email}</p>
          <ActionForm action={saveProfile} label="Enregistrer mon profil">
            <Field
              name="full_name"
              label="Nom complet"
              defaultValue={profile?.full_name || ""}
              minLength={2}
              maxLength={120}
            />
            <Field
              name="phone"
              label="Téléphone"
              type="tel"
              required={false}
              defaultValue={profile?.phone || ""}
              maxLength={40}
            />
            <Field
              name="company"
              label="Entreprise"
              required={false}
              defaultValue={profile?.company || ""}
            />
          </ActionForm>
        </article>
        <aside className="card panel stack">
          <Link prefetch={false} className="list-row" href="/favorites">
            Mes favoris →
          </Link>
          <Link prefetch={false} className="list-row" href="/notifications">
            Mes notifications →
          </Link>
          <Link prefetch={false} className="list-row" href="/support">
            Assistance →
          </Link>
          <Link prefetch={false} className="list-row" href="/forgot-password">
            Changer mon mot de passe →
          </Link>
          {profile?.role === "admin" && (
            <Link prefetch={false} className="list-row" href="/admin">
              Administration →
            </Link>
          )}
          {user.email === "uqoni.pro@gmail.com" &&
            profile?.role !== "admin" && (
              <ActionForm
                action={activateOwner}
                label="Activer mon administration"
              />
            )}
          <SignOut />
        </aside>
      </div>
    </section>
  );
}

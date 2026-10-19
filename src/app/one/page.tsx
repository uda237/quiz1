import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, LayoutDashboard, Palette, ShoppingBag, Sparkles } from "lucide-react";

const apps = [
  { name: "Digital Agency", description: "Services, devis et projets", href: "/services", icon: BriefcaseBusiness, enabled: true },
  { name: "Espace client", description: "Commandes et livrables", href: "/client", icon: LayoutDashboard, enabled: true },
  { name: "Espace équipe", description: "Opérations et administration — accès restreint", href: "/workspace", icon: LayoutDashboard, enabled: true },
  { name: "Academy", description: "Formations UQONI", href: "#", icon: GraduationCap, enabled: false },
  { name: "Creative", description: "Studio de création", href: "#", icon: Palette, enabled: false },
  { name: "Shop", description: "Produits et ressources", href: "#", icon: ShoppingBag, enabled: false },
  { name: "UQONI AI", description: "Assistant intelligent", href: "#", icon: Sparkles, enabled: false },
] as const;

export default function OneLauncher() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight">UQONI ONE</Link>
        <Link href="/login" className="text-sm font-semibold underline underline-offset-4">Connexion</Link>
      </header>
      <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-blue-700">Un seul écosystème</p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Vos applications UQONI, au même endroit.</h1>
      <p className="mt-4 max-w-2xl text-slate-600">Découvrez les services disponibles. Les espaces client et équipe disposent de contrôles d’accès distincts. Les autres modules seront activés après validation de leur sécurité et de leur fonctionnement.</p>
      <section aria-label="Catalogue des applications" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map(({ name, description, href, icon: Icon, enabled }) => (
          <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Icon className="mb-5 text-blue-700" aria-hidden="true" size={28} />
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
            {enabled ? (
              <Link href={href} className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700">
                Ouvrir <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <span className="mt-5 inline-block text-sm font-medium text-slate-500">Bientôt disponible</span>
            )}
          </article>
        ))}
      </section>
      <p className="mt-10 text-xs text-slate-500">Aucun module non validé ne donne accès à des données internes.</p>
    </main>
  );
}

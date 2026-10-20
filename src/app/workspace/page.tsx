import Link from "next/link";
import { requireAdmin } from "@/lib/session";

/** Internal entry point: reuse the existing server-side admin gate.
 * This does not grant access to any additional data or roles.
 */
export default async function WorkspacePage() {
  await requireAdmin("/workspace");
  const modules = [
    { name: "Administration", href: "/admin", description: "Tableau de bord existant" },
    { name: "Demandes et paiements", href: "/admin/orders", description: "Vérification et suivi" },
    { name: "Production", href: "/admin/projects", description: "Projets et livrables" },
    { name: "Assistance", href: "/admin/support", description: "Tickets clients" },
  ];
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/one" className="font-bold text-blue-700">UQONI ONE</Link>
        <span className="text-sm text-slate-500">Espace interne · Accès restreint</span>
      </header>
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Control Center</p>
      <h1 className="mt-3 text-4xl font-bold">Espace équipe UQONI</h1>
      <p className="mt-4 max-w-2xl text-slate-600">Accès réservé aux administrateurs déjà autorisés dans APP-01. Les autres rôles internes nécessitent un futur modèle de permissions vérifié.</p>
      <section aria-label="Modules internes" className="mt-10 grid gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <Link key={module.href} href={module.href} className="rounded-2xl border border-slate-200 p-6 hover:border-blue-600">
            <h2 className="text-lg font-bold">{module.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{module.description}</p>
            <span className="mt-4 inline-block font-semibold text-blue-700">Ouvrir →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Customer entry point. Existing project RLS remains the authority for resource access. */
export default async function ClientPortal() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login?next=%2Fclient");

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <nav className="mb-10 flex items-center justify-between">
        <Link href="/one" className="font-bold text-blue-700">UQONI ONE</Link>
        <Link href="/profile" className="text-sm underline">Mon profil</Link>
      </nav>
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Espace client</p>
      <h1 className="mt-3 text-3xl font-bold">Bienvenue dans votre espace</h1>
      <p className="mt-3 text-slate-600">Retrouvez vos services, commandes et projets. Les données affichées par chaque module restent soumises à ses contrôles de propriété et aux politiques RLS.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[{title:"Services",href:"/services"},{title:"Commandes",href:"/orders"},{title:"Projets",href:"/projects"}].map(item=>(
          <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 p-6 font-semibold text-blue-700 hover:border-blue-500">{item.title} →</Link>
        ))}
      </div>
    </main>
  );
}

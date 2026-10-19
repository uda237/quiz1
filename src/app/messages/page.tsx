import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Mail, MessageCircle, ShieldCheck } from "lucide-react";

/** Authenticated messaging entry point. No inbox is claimed until a backed, RLS-protected service exists. */
export default async function MessagesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login?next=%2Fmessages");

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-white px-5 py-8 text-[#0B1020]">
      <Link href="/one" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0248D7]"><ArrowLeft size={18}/> Retour à UQONI ONE</Link>
      <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9EDF9] text-[#0248D7]"><MessageCircle size={28}/></div>
      <h1 className="mt-5 text-3xl font-black">Messages et assistance</h1>
      <p className="mt-3 text-slate-600">Votre espace de communication UQONI. La messagerie intégrée est en préparation : aucun historique de conversation n’est encore affiché ici.</p>
      <section className="mt-8 rounded-3xl border border-slate-200 p-6">
        <div className="flex items-start gap-3"><Mail className="shrink-0 text-[#0248D7]" size={24}/><div><h2 className="text-lg font-bold">Contacter l’équipe UQONI</h2><p className="mt-2 text-sm text-slate-600">Pour une demande ou un suivi, contactez-nous par notre adresse officielle.</p></div></div>
        <a href="mailto:uqoni.pro@gmail.com" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0248D7] px-5 py-3 text-sm font-bold text-white">Envoyer un e-mail</a>
      </section>
      <p className="mt-6 flex items-start gap-2 text-xs text-slate-500"><ShieldCheck size={16} className="shrink-0"/> Cette page nécessite une connexion. Aucun accès supplémentaire aux données clients ou internes n’est accordé.</p>
    </main>
  );
}

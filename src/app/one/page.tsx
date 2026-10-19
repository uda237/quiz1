import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap, LayoutDashboard, Palette, Search, ShieldCheck, ShoppingBag, Sparkles, Users, Wallet, Wifi, Grid2X2, House, ChevronRight } from "lucide-react";

const primary = [
  { name: "Agence", detail: "Sites web, design et marketing", href: "/services", icon: BriefcaseBusiness },
  { name: "Espace client", detail: "Commandes et livrables", href: "/client", icon: LayoutDashboard },
];
const modules = [
  { name: "Academy", icon: GraduationCap },
  { name: "Creative", icon: Palette },
  { name: "Shop", icon: ShoppingBag },
  { name: "UQONI AI", icon: Sparkles },
  { name: "Finance", icon: Wallet },
  { name: "Wi-Fi Zone", icon: Wifi },
];
export default function OneLauncher() {
  return (
    <main className="min-h-screen scroll-smooth bg-white pb-28 text-[#0B1020]">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <Link href="/one" className="text-2xl font-black tracking-[-.08em] text-[#0248D7]" aria-label="UQONI ONE, accueil">UQONI<span className="ml-1 rounded-full bg-[#0248D7] px-2 py-1 text-xs tracking-normal text-white">ONE</span></Link>
          <nav aria-label="Actions rapides" className="flex items-center gap-4 text-[#0B1020]">
            <a href="#applications" aria-label="Voir les applications" className="rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Grid2X2 size={21}/></a>
            <a href="#explorer" aria-label="Explorer les services" className="rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Search size={21}/></a>
            <Link href="/login" aria-label="Connexion au compte"><Users size={22}/></Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5">
        <section className="relative mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2563EB] via-[#0248D7] to-[#0B1020] px-7 py-11 text-white sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-xl">
            <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold">Bienvenue dans UQONI ONE</span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">Tous vos services. <span className="text-[#8ADAF5]">Un seul espace.</span></h1>
            <p className="mt-5 max-w-md text-base text-blue-100">Création digitale, projets, formations et solutions intelligentes. Découvrez l’écosystème UQONI depuis un seul endroit.</p>
            <Link href="/services" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#0248D7]">Découvrir les services <ArrowRight size={18}/></Link>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full border-[48px] border-white/10 sm:h-96 sm:w-96"/>
        </section>
        <section id="applications" aria-labelledby="apps-heading" className="mt-8 scroll-mt-24 rounded-[30px] bg-[#E9EDF9] p-5 sm:p-8">
          <div className="mb-5 flex items-center justify-between"><h2 id="apps-heading" className="text-xl font-extrabold">Vos espaces UQONI</h2><Grid2X2 size={20} className="text-[#0248D7]"/></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {primary.map(({name,detail,href,icon:Icon})=><Link key={name} href={href} className="flex min-h-36 flex-col justify-between rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"><Icon className="text-[#0248D7]" size={30}/><div><h3 className="mt-4 text-base font-bold">{name}</h3><p className="mt-1 text-xs text-slate-600">{detail}</p></div></Link>)}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {modules.map(({name,icon:Icon})=><div key={name} className="flex min-h-28 flex-col items-center justify-center rounded-2xl bg-white p-3 text-center"><Icon className="mb-3 text-[#0248D7]" size={28}/><span className="text-xs font-bold">{name}</span><span className="mt-1 text-[10px] text-slate-500">Bientôt</span></div>)}
          </div>
        </section>
        <section id="explorer" className="mt-10 scroll-mt-24 grid gap-5 sm:grid-cols-2">
          <article className="overflow-hidden rounded-[28px] bg-[#0248D7] p-8 text-white">
            <p className="text-sm font-semibold text-blue-100">UQONI Digital Agency</p>
            <h2 className="mt-4 text-3xl font-black">Donnez vie à vos projets.</h2>
            <p className="mt-3 text-sm text-blue-100">Sites web, applications, identité visuelle et automatisation.</p>
            <Link href="/services" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0248D7]">Explorer <ChevronRight size={16}/></Link>
          </article>
          <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm font-semibold text-[#0248D7]">Espace personnel</p>
            <h2 className="mt-4 text-3xl font-black">Suivez vos commandes.</h2>
            <p className="mt-3 text-sm text-slate-600">Retrouvez vos projets, vos demandes et vos livrables dans un espace sécurisé.</p>
            <Link href="/client" className="mt-7 inline-flex items-center gap-2 font-bold text-[#0248D7]">Accéder à mon espace <ArrowRight size={17}/></Link>
          </article>
        </section>
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between"><div><h2 className="text-2xl font-black">À découvrir</h2><p className="text-sm text-slate-600">De nouvelles possibilités pour votre activité</p></div></div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{name:"UQONI Academy",desc:"Formations et parcours professionnels",icon:GraduationCap},{name:"UQONI Creative",desc:"Design et production de contenus",icon:Palette},{name:"UQONI AI",desc:"Outils intelligents pour votre croissance",icon:Sparkles}].map(({name,desc,icon:Icon})=><article key={name} className="rounded-3xl border border-slate-200 p-6"><Icon className="text-[#0248D7]" size={29}/><h3 className="mt-5 font-bold">{name}</h3><p className="mt-2 text-sm text-slate-600">{desc}</p><span className="mt-4 inline-block text-xs font-semibold text-slate-500">Prochainement</span></article>)}
          </div>
        </section>
        <section className="mt-12 rounded-3xl bg-slate-100 p-7"><div className="flex items-start gap-4"><ShieldCheck className="shrink-0 text-[#0248D7]" size={30}/><div><h2 className="text-lg font-bold">Vos données, vos accès</h2><p className="mt-2 text-sm text-slate-600">Les espaces privés nécessitent une connexion. Les modules en préparation ne donnent pas accès aux données internes.</p><Link href="/workspace" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0248D7]">Espace équipe (accès autorisé uniquement) <ArrowRight size={15}/></Link></div></div></section>
        <footer className="py-10 text-center text-sm text-slate-500">UQONI ONE · Growth Infrastructure</footer>
      </div>
      <nav aria-label="Navigation mobile" className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-slate-200 bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 shadow-lg sm:hidden">
        <Link href="/one" className="flex flex-col items-center gap-1 text-[#0248D7]"><House size={22}/><span className="text-[11px] font-semibold">Accueil</span></Link>
        <Link href="/services" className="flex flex-col items-center gap-1 text-slate-600"><BriefcaseBusiness size={22}/><span className="text-[11px]">Services</span></Link>
        <Link href="/client" className="flex flex-col items-center gap-1 text-slate-600"><LayoutDashboard size={22}/><span className="text-[11px]">Mon espace</span></Link>
        <Link href="/login" className="flex flex-col items-center gap-1 text-slate-600"><Users size={22}/><span className="text-[11px]">Compte</span></Link>
      </nav>
    </main>
  );
}

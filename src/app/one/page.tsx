import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap, LayoutDashboard, Palette, Search, ShieldCheck, ShoppingBag, Sparkles, Users, Wallet, Wifi, Grid2X2, House, ChevronRight, Bell, Smartphone, Globe2, HeartPulse, Sprout, MessageCircle } from "lucide-react";

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
  { name: "UQONI Health", icon: HeartPulse },
  { name: "More", icon: Grid2X2 },
];
export default function OneLauncher() {
  return (
    <main className="min-h-screen min-w-0 overflow-x-clip scroll-smooth bg-white pb-28 text-[#0B1020]">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4">
          <Link href="/one" className="shrink-0 text-xl font-black tracking-[-.06em] text-[#0248D7] sm:text-2xl" aria-label="UQONI ONE, accueil">UQONI<span className="ml-1 rounded-full bg-[#0248D7] px-2 py-1 text-xs tracking-normal text-white">ONE</span></Link>
          <nav aria-label="Actions rapides" className="flex shrink-0 items-center gap-2 text-[#0B1020] sm:gap-4">
            <a href="#applications" aria-label="Voir les applications" className="rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Grid2X2 size={21}/></a>
            <a href="#explorer" aria-label="Explorer les services" className="rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Search size={21}/></a>
            <a href="#nouveautes" aria-label="Voir les nouveautés"><Bell size={21}/></a><Link href="/login" aria-label="Connexion au compte" className="rounded-full bg-[#E9EDF9] p-2 text-[#0248D7]"><Users size={21}/></Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl min-w-0 px-4 sm:px-5">
        <section className="relative isolate mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2563EB] via-[#0248D7] to-[#0B1020] px-5 py-8 text-white sm:mt-6 sm:rounded-[28px] sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-xl">
            <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold">Bienvenue dans UQONI ONE</span>
            <h1 className="mt-5 text-[clamp(1.85rem,8vw,3rem)] font-black leading-[1.12] tracking-tight sm:mt-6 sm:text-6xl">Tous vos services. <span className="text-[#8ADAF5]">Un seul espace.</span></h1>
            <p className="mt-5 max-w-md text-base text-blue-100">Création digitale, projets, formations et solutions intelligentes. Découvrez l’écosystème UQONI depuis un seul endroit.</p>
            <Link href="/services" className="mt-6 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-[#0248D7] sm:mt-7 sm:px-6">Découvrir les services <ArrowRight size={18}/></Link>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full border-[48px] border-white/10 sm:h-96 sm:w-96"/><div aria-hidden="true" className="pointer-events-none absolute right-[-45px] top-[-45px] h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl"/><div aria-hidden="true" className="pointer-events-none absolute bottom-[-90px] left-[-70px] h-56 w-56 rounded-full bg-white/10 blur-3xl"/><div aria-hidden="true" className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-12deg] rounded-[26px] border border-white/40 bg-white/15 p-8 shadow-2xl backdrop-blur sm:block"><Smartphone size={92} strokeWidth={1.1}/></div>
        </section>
        <section id="applications" aria-labelledby="apps-heading" className="mt-6 scroll-mt-24 rounded-[20px] bg-[#E9EDF9] p-3 sm:mt-8 sm:rounded-[30px] sm:p-8">
          <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#BCC5DD]" /><div className="mb-3 flex items-center justify-between"><h2 id="apps-heading" className="text-lg font-extrabold">Vos espaces UQONI</h2><Grid2X2 size={20} className="text-[#0248D7]"/></div>
          <div className="grid grid-cols-4 auto-rows-auto items-stretch gap-2 sm:gap-3">
            {primary.map(({name,detail,href,icon:Icon})=><Link key={name} href={href} className="group col-span-2 flex aspect-[2/1] min-w-0 items-center justify-between gap-1.5 overflow-hidden rounded-xl bg-white p-2.5 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0248D7] sm:p-4"><span className="min-w-0"><span className="block text-xs font-extrabold leading-tight sm:text-lg">{name}</span><span className="mt-1 line-clamp-2 block text-[9px] leading-tight text-slate-500 sm:text-xs">{detail}</span></span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#0248D7] sm:h-14 sm:w-14"><Icon size={27}/></span></Link>)}
            {modules.map(({name,icon:Icon})=><div key={name} className="flex aspect-square min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-white p-1.5 text-center shadow-sm sm:p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF]"><Icon className="text-[#0248D7]" size={22}/></span><span className="line-clamp-2 w-full break-words text-[10px] font-bold leading-tight sm:text-xs">{name}</span></div>)}
          </div>
        </section>
        <section id="nouveautes" aria-labelledby="news-heading" className="mt-10 scroll-mt-24">
          <div className="mb-5">
            <h2 id="news-heading" className="text-3xl font-black tracking-tight text-[#101010] sm:text-4xl">À découvrir</h2>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">Des expériences sélectionnées pour vous</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4">
            <Link href="/services" className="group w-[126px] shrink-0 overflow-hidden rounded-[24px] bg-[#F3F4F6] shadow-sm transition hover:shadow-md sm:w-[160px]">
              <div className="flex aspect-[1.4] items-center justify-center bg-gradient-to-br from-[#0248D7] to-[#0B1020]"><Globe2 className="text-white" size={55} strokeWidth={1.4}/></div>
              <div className="flex min-h-14 items-center justify-center px-2 py-2 text-center text-sm font-bold leading-tight text-[#111111] sm:text-base">Sites web</div>
            </Link>
            <Link href="/services" className="group w-[126px] shrink-0 overflow-hidden rounded-[24px] bg-[#F3F4F6] shadow-sm transition hover:shadow-md sm:w-[160px]">
              <div className="flex aspect-[1.4] items-center justify-center bg-gradient-to-br from-[#D99408] to-[#0B1020]"><Palette className="text-white" size={55} strokeWidth={1.4}/></div>
              <div className="flex min-h-14 items-center justify-center px-2 py-2 text-center text-sm font-bold leading-tight text-[#111111] sm:text-base">Design créatif</div>
            </Link>
          </div>
          <p className="mt-20 select-none text-[clamp(3.1rem,12vw,8rem)] font-black leading-[0.95] tracking-[-0.07em] text-[#B9B9B9] sm:mt-28">Avec passion,<span className="block">par UQONI.</span></p>
        </section>
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between"><div><h2 className="text-2xl font-black">Solutions digitales</h2><p className="text-sm text-slate-600">Vos idées, nos expertises</p></div><a href="#explorer" className="text-sm font-bold text-[#0248D7]">Tout voir</a></div>
          <div aria-label="Parcourir les solutions digitales" className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch] sm:gap-4">
            {[{name:"Sites web & applications",description:"Une présence digitale à votre image",icon:Globe2,color:"from-[#0248D7] to-[#0B1020]"},{name:"Design & identité",description:"Une marque qui vous ressemble",icon:Palette,color:"from-[#D99408] to-[#0B1020]"},{name:"Automatisation & IA",description:"Des processus plus intelligents",icon:Sparkles,color:"from-[#2563EB] to-[#0B1020]"}].map(({name,description,icon:Icon,color})=><Link key={name} href="/services" className={`group relative flex min-h-64 min-w-0 w-[85%] max-w-[420px] shrink-0 snap-start sm:min-h-72 flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-br p-5 text-white sm:w-[40%] sm:p-7 ${color}`}><div aria-hidden="true" className="absolute -right-10 top-12 flex h-52 w-52 rotate-[-18deg] items-center justify-center rounded-[42px] border border-white/20 bg-white/10 shadow-2xl transition-transform duration-300 group-hover:rotate-[-10deg]"><div className="flex h-36 w-36 items-center justify-center rounded-[32px] border border-white/20 bg-white/10"><Icon size={82} strokeWidth={1.2} className="text-white/80"/></div></div><span className="relative z-10 w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">UQONI Digital Agency</span><div className="relative z-10"><h3 className="text-2xl font-black">{name}</h3><p className="mt-2 text-sm text-white/80">{description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Découvrir <ArrowRight size={17}/></span></div></Link>)}
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
        <section className="mt-12 rounded-3xl bg-slate-100 p-7"><div className="flex items-start gap-4"><ShieldCheck className="shrink-0 text-[#0248D7]" size={30}/><div><h2 className="text-lg font-bold">Vos données, vos accès</h2><p className="mt-2 text-sm text-slate-600">Les espaces privés nécessitent une connexion. Les modules en préparation ne donnent pas accès aux données internes.</p><Link href="/workspace" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0248D7]">Espace équipe (accès autorisé uniquement) <ArrowRight size={15}/></Link></div></div></section>
        <footer className="py-10 text-center text-sm text-slate-500">UQONI ONE · Growth Infrastructure</footer>
      </div>
      <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-30 grid w-full grid-cols-5 items-center gap-0 border-t border-slate-200 bg-white/95 px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] shadow-[0_-6px_24px_rgba(11,16,32,0.08)] backdrop-blur-lg sm:hidden">
        <Link href="/one" aria-current="page" className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[#0248D7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0248D7] text-white"><House size={20}/></span><span className="text-[10px] font-bold">Accueil</span></Link>
        <Link href="/services" className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><BriefcaseBusiness size={22}/><span className="text-[10px]">Services</span></Link>
        <Link href="/client" className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><LayoutDashboard size={22}/><span className="text-[10px]">Projets</span></Link>
        <Link href="/messages" className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><MessageCircle size={22}/><span className="text-[10px]">Messages</span></Link>
        <Link href="/login" className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Users size={22}/><span className="text-[10px]">Compte</span></Link>
      </nav>
    </main>
  );
}

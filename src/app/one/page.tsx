import Link from "next/link";
import Image from "next/image";
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
        <section aria-labelledby="hero-heading" className="mt-4 overflow-hidden rounded-[26px] bg-[#1142C6] text-white shadow-sm sm:mt-6 sm:rounded-[30px]">
          <div className="relative px-5 pb-7 pt-6 sm:px-10 sm:pb-10 sm:pt-9">
            <div className="flex items-start justify-between gap-3"><span className="text-sm font-semibold text-blue-100">Bienvenue dans UQONI ONE</span><Link href="/services" aria-label="Découvrir les services UQONI" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0248D7]"><ChevronRight size={23}/></Link></div>
            <h1 id="hero-heading" className="mt-4 max-w-lg text-[clamp(2rem,8vw,3.8rem)] font-black leading-[1.08] tracking-tight">Vos projets digitaux, plus loin avec UQONI.</h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-blue-100 sm:text-base">Sites web, design, applications, IA et automatisations.</p>
          </div>
          <div className="relative w-full overflow-hidden bg-[#8CC6F0]"><Image src="/one/uqoni-ecosystem-hero.svg" alt="Illustration UQONI : ordinateur, application mobile et assistant IA" width={960} height={460} priority className="block h-auto w-full" /></div>
        </section>
        <section aria-label="Accès rapide UQONI" className="mt-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#087EA8] px-4 py-4 text-white sm:px-6">
            <div className="min-w-0"><p className="text-base font-extrabold sm:text-lg">Lancez votre projet</p><p className="mt-1 text-xs text-white/90 sm:text-sm">Sites web, design et applications</p></div>
            <Link href="/services" className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#075E82] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1020] sm:text-sm">Explorer <ChevronRight size={16}/></Link>
          </div>
        </section>
        <section id="applications" aria-labelledby="apps-heading" className="mt-6 scroll-mt-24 rounded-[20px] bg-[#E9EDF9] p-3 sm:mt-8 sm:rounded-[30px] sm:p-8">
          <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#BCC5DD]" /><div className="mb-3 flex items-center justify-between"><h2 id="apps-heading" className="text-lg font-extrabold">Vos espaces UQONI</h2><Grid2X2 size={20} className="text-[#0248D7]"/></div>
          <div className="grid grid-cols-4 auto-rows-auto items-stretch gap-2.5 sm:gap-3">
            {primary.map(({name,detail,href,icon:Icon})=><Link key={name} href={href} className="group col-span-2 flex aspect-[2/1] min-w-0 items-center justify-between gap-1.5 overflow-hidden rounded-xl bg-white p-2.5 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0248D7] sm:p-4"><span className="min-w-0"><span className="block text-xs font-extrabold leading-tight sm:text-lg">{name}</span><span className="mt-1 line-clamp-2 block text-[9px] leading-tight text-slate-500 sm:text-xs">{detail}</span></span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#0248D7] sm:h-14 sm:w-14"><Icon size={27}/></span></Link>)}
            {modules.map(({name,icon:Icon})=><div key={name} className="flex aspect-square min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-white p-1 text-center shadow-sm sm:gap-1.5 sm:p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] min-[390px]:h-9 min-[390px]:w-9"><Icon className="text-[#0248D7]" size={22}/></span><span className="line-clamp-2 w-full break-words text-[9px] font-bold leading-tight min-[390px]:text-[10px] sm:text-xs">{name}</span></div>)}
          </div>
        </section>
        <section aria-labelledby="whats-new-heading" className="mt-10">
          <h2 id="whats-new-heading" className="text-2xl font-black sm:text-3xl">Quoi de neuf ?</h2>
          <p className="mt-1 text-sm text-slate-600">Découvrez les nouveautés de l'écosystème UQONI</p>
          <div className="mt-4 grid grid-cols-4 gap-2 rounded-3xl border border-slate-200 p-3 sm:gap-4 sm:p-5">
            {[{label:"Agence",icon:BriefcaseBusiness},{label:"Academy",icon:GraduationCap},{label:"Creative",icon:Palette},{label:"UQONI AI",icon:Sparkles}].map(({label,icon:Icon})=><div key={label} className="flex min-w-0 flex-col items-center gap-2 text-center"><span className="flex aspect-square w-full max-w-16 items-center justify-center rounded-full border-2 border-[#0248D7] bg-[#EEF3FF] text-[#0248D7] sm:max-w-20"><Icon size={25}/></span><span className="text-[10px] font-semibold leading-tight sm:text-sm">{label}</span></div>)}
          </div>
        </section>
        <section aria-labelledby="finance-heading" className="mt-10">
          <div className="flex items-end justify-between gap-3"><div><h2 id="finance-heading" className="text-2xl font-black sm:text-3xl">Finance</h2><p className="mt-1 text-sm text-slate-600">Des solutions pour accompagner votre activité</p></div><a href="#explorer" className="shrink-0 text-sm font-bold text-[#0248D7]">Tout voir</a></div>
          <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3">
            <article className="flex min-h-44 w-[78%] max-w-sm shrink-0 snap-start flex-col justify-between rounded-3xl bg-[#0B1020] p-5 text-white"><Wallet size={35} className="text-[#8ADAF5]"/><div><h3 className="text-xl font-extrabold">Finance UQONI</h3><p className="mt-1 text-sm text-slate-300">Un espace dédié aux opérations financières</p><span className="mt-3 inline-block text-xs text-slate-300">En préparation</span></div></article>
            <article className="flex min-h-44 w-[78%] max-w-sm shrink-0 snap-start flex-col justify-between rounded-3xl bg-[#E9EDF9] p-5 text-[#0B1020]"><LayoutDashboard size={35} className="text-[#0248D7]"/><div><h3 className="text-xl font-extrabold">Suivi des projets</h3><p className="mt-1 text-sm text-slate-600">Retrouvez vos commandes et livrables</p><Link href="/client" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#0248D7]">Mon espace <ArrowRight size={15}/></Link></div></article>
          </div>
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
        <section id="nouveautes" aria-labelledby="news-heading" className="mt-10 scroll-mt-24">
          <div className="mb-5">
            <h2 id="news-heading" className="text-3xl font-black tracking-tight text-[#101010] sm:text-4xl">À découvrir</h2>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">Des expériences sélectionnées pour vous</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4">
            <Link href="/services" className="group w-[118px] shrink-0 overflow-hidden rounded-[24px] bg-[#F3F4F6] shadow-sm transition hover:shadow-md sm:w-[160px]">
              <div className="flex aspect-[1.4] items-center justify-center bg-gradient-to-br from-[#0248D7] to-[#0B1020]"><Globe2 className="text-white" size={55} strokeWidth={1.4}/></div>
              <div className="flex min-h-14 items-center justify-center px-2 py-2 text-center text-sm font-bold leading-tight text-[#111111] sm:text-base">Sites web</div>
            </Link>
            <Link href="/services" className="group w-[118px] shrink-0 overflow-hidden rounded-[24px] bg-[#F3F4F6] shadow-sm transition hover:shadow-md sm:w-[160px]">
              <div className="flex aspect-[1.4] items-center justify-center bg-gradient-to-br from-[#D99408] to-[#0B1020]"><Palette className="text-white" size={55} strokeWidth={1.4}/></div>
              <div className="flex min-h-14 items-center justify-center px-2 py-2 text-center text-sm font-bold leading-tight text-[#111111] sm:text-base">Design créatif</div>
            </Link>
          </div>
          <p className="mt-16 select-none text-[clamp(2.75rem,10vw,7rem)] font-black leading-[0.95] tracking-[-0.07em] text-[#B9B9B9] sm:mt-28">Avec passion,<span className="block">par UQONI.</span></p>
        </section>
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

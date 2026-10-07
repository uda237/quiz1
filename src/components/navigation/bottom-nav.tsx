"use client";
import Link from "next/link";
import {Home,Grid2X2,FolderKanban,ReceiptText,User} from "lucide-react";
const items=[["/home","Accueil",Home],["/services","Services",Grid2X2],["/projects","Projets",FolderKanban],["/orders","Commandes",ReceiptText],["/profile","Profil",User]] as const;
export function BottomNav(){return <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden"><div className="mx-auto flex max-w-lg justify-around">{items.map(([href,label,Icon])=><Link key={href} href={href} className="flex min-w-16 flex-col items-center gap-1 py-3 text-[11px] text-gray-600"><Icon size={20}/><span>{label}</span></Link>)}</div></nav>}
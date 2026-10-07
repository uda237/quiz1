"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, FolderKanban, ReceiptText, User } from "lucide-react";
const items = [
  ["/home", "Accueil", Home],
  ["/services", "Services", Grid2X2],
  ["/projects", "Projets", FolderKanban],
  ["/orders", "Commandes", ReceiptText],
  ["/profile", "Profil", User],
] as const;
export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map(([href, label, Icon]) => (
        <Link
          prefetch={false}
          key={href}
          href={href}
          aria-current={path.startsWith(href) ? "page" : undefined}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/session";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link prefetch={false} href="/admin" className="wordmark">
            UQONI<span> / ADMIN</span>
          </Link>
          <Link prefetch={false} className="btn-secondary" href="/home">
            Espace client ↗
          </Link>
        </div>
      </header>
      <div className="container admin-shell">
        <aside className="admin-nav" aria-label="Administration">
          <Link prefetch={false} href="/admin">
            Vue d’ensemble
          </Link>
          <Link prefetch={false} href="/admin/orders">
            Devis & paiements
          </Link>
          <Link prefetch={false} href="/admin/projects">
            Production
          </Link>
          <Link prefetch={false} href="/admin/services">
            Catalogue
          </Link>
          <Link prefetch={false} href="/admin/support">
            Assistance
          </Link>
          <Link prefetch={false} href="/admin/audit">
            Journal d’activité
          </Link>
        </aside>
        <main>{children}</main>
      </div>
    </>
  );
}

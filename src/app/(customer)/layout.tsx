import { BottomNav } from "@/components/navigation/bottom-nav";
import Link from "next/link";
import { session } from "@/lib/session";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await session();
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link prefetch={false} href="/home" className="wordmark">
            UQONI<span>®</span>
          </Link>
          <nav aria-label="Navigation principale">
            <Link prefetch={false} href="/services">
              Services
            </Link>
            <Link prefetch={false} href="/projects">
              Projets
            </Link>
            <Link prefetch={false} href="/orders">
              Commandes
            </Link>
            <Link prefetch={false} href="/support">
              Assistance
            </Link>
          </nav>
          <div className="header-end">
            {profile?.role === "admin" && (
              <Link prefetch={false} href="/admin" className="admin-link">
                Admin
              </Link>
            )}
            <Link
              prefetch={false}
              className="account-link"
              href={user ? "/profile" : "/login"}
            >
              {user
                ? profile?.full_name?.split(" ")[0] || "Mon espace"
                : "Connexion"}
            </Link>
          </div>
        </div>
      </header>
      <main id="main" className="customer-main">
        {children}
      </main>
      <footer className="site-footer container">
        <span>© {new Date().getFullYear()} UQONI</span>
        <div>
          <Link prefetch={false} href="/privacy">
            Confidentialité
          </Link>
          <Link prefetch={false} href="/terms">
            Conditions
          </Link>
          <a href="mailto:uqoni.pro@gmail.com">Contact</a>
        </div>
      </footer>
      <BottomNav />
    </>
  );
}

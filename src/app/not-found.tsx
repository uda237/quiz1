import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container empty">
      <p className="eyebrow">404</p>
      <h1>Cette page est introuvable.</h1>
      <p className="muted">Revenez à votre espace pour continuer.</p>
      <Link prefetch={false} className="btn-primary" href="/home">
        Retour à l’accueil
      </Link>
    </main>
  );
}

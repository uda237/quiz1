import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function Landing() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link prefetch={false} href="/" className="wordmark">
            UQONI<span>®</span>
          </Link>
          <Link prefetch={false} href="/login" className="btn-secondary">
            Mon espace <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>
      <main>
        <section className="container landing">
          <p className="eyebrow">GROWTH INFRASTRUCTURE FOR MODERN BUSINESS</p>
          <h1>
            Votre ambition.
            <br />
            <span>Notre exécution.</span>
          </h1>
          <p className="landing-copy">
            Des systèmes solides. Des services digitaux précis.
            <br />
            Un espace unique pour construire et suivre vos projets.
          </p>
          <div className="button-row">
            <Link prefetch={false} className="btn-primary" href="/services">
              Explorer les services <ArrowUpRight size={18} />
            </Link>
            <Link prefetch={false} className="btn-secondary" href="/register">
              Créer mon espace
            </Link>
          </div>
          <div className="landing-strip">
            <span>Architecture Business OS</span>
            <span>Automatisation & IA</span>
            <span>Design & Web</span>
          </div>
        </section>
        <section className="container process-grid">
          {[
            [
              "01",
              "Un besoin bien cadré",
              "Présentez votre projet. Nous préparons un devis adapté.",
            ],
            [
              "02",
              "Une décision claire",
              "Validez le périmètre, les livrables et le montant avant de payer.",
            ],
            [
              "03",
              "Un suivi continu",
              "Consultez les étapes de production et retrouvez vos livrables.",
            ],
          ].map(([n, t, b]) => (
            <div key={n}>
              <span className="step-number">{n}</span>
              <h2>{t}</h2>
              <p className="muted">{b}</p>
            </div>
          ))}
        </section>
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
    </>
  );
}

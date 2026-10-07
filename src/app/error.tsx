"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container empty">
      <h1>Nous n’avons pas pu charger cette page.</h1>
      <p className="muted">
        Vos informations restent enregistrées. Réessayez dans un instant.
      </p>
      <button className="btn-primary" onClick={reset}>
        Réessayer
      </button>
    </main>
  );
}

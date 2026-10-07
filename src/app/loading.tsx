export default function Loading() {
  return (
    <main className="container py-10" role="status">
      <div className="skeleton" />
      <p className="muted mt-4">Chargement de votre espace…</p>
    </main>
  );
}

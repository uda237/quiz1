"use client";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
export function SignOut() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <button
        className="btn-secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const { error } = await createClient().auth.signOut();
          if (error) {
            setError("Déconnexion impossible. Réessayez.");
            setBusy(false);
            return;
          }
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Clear the authenticated document and its prefetched data after sign-out.
          window.location.assign("/login");
        }}
      >
        {busy ? "Déconnexion…" : "Se déconnecter"}
      </button>
    </div>
  );
}

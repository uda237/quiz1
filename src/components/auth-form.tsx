"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/format";
type Mode = "login" | "register" | "forgot-password" | "reset-password";
const titles = {
  login: "Bienvenue chez UQONI",
  register: "Créons votre espace",
  "forgot-password": "Retrouver votre accès",
  "reset-password": "Nouveau mot de passe",
};
export function AuthForm({ mode }: { mode: Mode }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (mode !== "reset-password") return;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const token = hash.get("access_token"),
      refresh = hash.get("refresh_token");
    if (token && refresh) {
      createClient()
        .auth.setSession({ access_token: token, refresh_token: refresh })
        .then(({ error }) => {
          window.history.replaceState(null, "", "/reset-password");
          if (error) setMessage("Le lien a expiré. Demandez un nouveau lien.");
        });
    }
  }, [mode]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setSuccess(false);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const db = createClient();
    try {
      if (mode === "login") {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.assign(
          safeNext(new URLSearchParams(window.location.search).get("next")),
        );
      }
      if (mode === "register") {
        if (password !== form.get("confirm"))
          throw new Error("Les mots de passe ne correspondent pas.");
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: String(form.get("full_name")) },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Fresh document uses the newly established session cookies.
          window.location.assign("/home");
        } else {
          setSuccess(true);
          setMessage(
            "Vérifiez votre boîte mail pour confirmer votre compte, puis connectez-vous.",
          );
        }
      }
      if (mode === "forgot-password") {
        const { error } = await db.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        setSuccess(true);
        setMessage(
          "Si ce compte existe, un lien de récupération sera envoyé à son adresse email.",
        );
      }
      if (mode === "reset-password") {
        if (password !== form.get("confirm"))
          throw new Error("Les mots de passe ne correspondent pas.");
        const {
          data: { user },
        } = await db.auth.getUser();
        if (!user)
          throw new Error(
            "Ouvrez le lien de récupération reçu par email avant de changer le mot de passe.",
          );
        const { error } = await db.auth.updateUser({ password });
        if (error) throw error;
        await db.auth.signOut();
        setSuccess(true);
        setMessage("Mot de passe changé. Vous pouvez vous connecter.");
      }
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Une erreur est survenue.";
      setMessage(
        text.includes("Invalid login")
          ? "Email ou mot de passe incorrect."
          : text.includes("Email not confirmed")
            ? "Confirmez votre adresse email avant de vous connecter."
            : text.includes("rate limit")
              ? "Trop de tentatives. Réessayez dans quelques minutes."
              : text,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-shell">
      <aside className="auth-brand">
        <Link prefetch={false} href="/" className="wordmark">
          UQONI<span>®</span>
        </Link>
        <div>
          <p className="eyebrow">VOTRE PROCHAIN CHAPITRE</p>
          <h2>
            De l’idée.
            <br />À l’exécution.
          </h2>
          <p>
            Un espace pour donner forme à vos projets et suivre chaque étape.
          </p>
        </div>
        <small>Scalable systems. Intelligent execution.</small>
      </aside>
      <section className="auth-panel">
        <Link prefetch={false} href="/" className="wordmark mobile-brand">
          UQONI<span>®</span>
        </Link>
        <div className="auth-content">
          <p className="eyebrow">ESPACE CLIENT</p>
          <h1>{titles[mode]}</h1>
          <p className="muted">
            {mode === "login"
              ? "Vos services, vos commandes et vos projets vous attendent."
              : "Un accès personnel pour piloter vos projets digitaux."}
          </p>
          <form className="form-stack" onSubmit={submit}>
            {mode === "register" && (
              <label className="field">
                Nom complet
                <input
                  name="full_name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </label>
            )}
            {mode !== "reset-password" && (
              <label className="field">
                Adresse email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
              </label>
            )}
            {mode !== "forgot-password" && (
              <label className="field">
                Mot de passe
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={mode === "login" ? 1 : 10}
                  maxLength={72}
                  required
                />
              </label>
            )}
            {["register", "reset-password"].includes(mode) && (
              <>
                <label className="field">
                  Confirmer le mot de passe
                  <input
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    minLength={10}
                    maxLength={72}
                    required
                  />
                </label>
                <p className="muted text-sm">Au moins 10 caractères.</p>
              </>
            )}
            {mode === "register" && (
              <label className="check">
                <input type="checkbox" required />
                J’accepte les{" "}
                <Link prefetch={false} href="/terms">
                  conditions d’utilisation
                </Link>{" "}
                et la{" "}
                <Link prefetch={false} href="/privacy">
                  politique de confidentialité
                </Link>
                .
              </label>
            )}
            {message && (
              <p
                role={success ? "status" : "alert"}
                className={`notice ${success ? "success" : "error"}`}
              >
                {message}
              </p>
            )}
            <button className="btn-primary" disabled={busy}>
              {busy
                ? "Traitement…"
                : mode === "login"
                  ? "Se connecter"
                  : mode === "register"
                    ? "Créer mon compte"
                    : mode === "forgot-password"
                      ? "Envoyer le lien"
                      : "Changer le mot de passe"}
            </button>
          </form>
          <div className="auth-links">
            <Link
              prefetch={false}
              href={mode === "login" ? "/register" : "/login"}
            >
              {mode === "login" ? "Créer un compte" : "Retour connexion"}
            </Link>
            {mode === "login" && (
              <Link prefetch={false} href="/forgot-password">
                Mot de passe oublié ?
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

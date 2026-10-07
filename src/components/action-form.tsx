"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
export type Result = { ok?: boolean; message?: string; redirect?: string };
export function ActionForm({
  action,
  children,
  label = "Enregistrer",
  className = "",
  confirm,
}: {
  action: (state: Result, data: FormData) => Promise<Result>;
  children?: React.ReactNode;
  label?: string;
  className?: string;
  confirm?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const router = useRouter();
  useEffect(() => {
    if (state.ok) {
      if (state.redirect) router.push(state.redirect);
      else router.refresh();
    }
  }, [state, router]);
  return (
    <form
      action={formAction}
      className={`form-stack ${className}`}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
      {state.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={state.ok ? "notice success" : "notice error"}
        >
          {state.message}
        </p>
      )}
      <button className="btn-primary" disabled={pending}>
        {pending ? "Traitement…" : label}
      </button>
    </form>
  );
}

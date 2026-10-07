import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
export const session = cache(async () => {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) return { db, user: null, profile: null };
  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("id,full_name,phone,company,role,avatar_url")
    .eq("id", user.id)
    .single();
  if (profileError)
    throw new Error("Votre profil est momentanément indisponible. Réessayez.");
  return { db, user, profile };
});
export async function requireUser(path = "/home") {
  const s = await session();
  if (!s.user) redirect(`/login?next=${encodeURIComponent(path)}`);
  return { ...s, user: s.user };
}
export async function requireAdmin() {
  const s = await requireUser("/admin");
  if (s.profile?.role !== "admin") redirect("/home");
  return s;
}

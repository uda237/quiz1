"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser, requireAdmin } from "@/lib/session";
import type { Result } from "@/components/action-form";
const uuid = z.string().uuid();
const text = (min = 1, max = 4000) => z.string().trim().min(min).max(max);
function data(form: FormData, key: string) {
  return String(form.get(key) || "");
}
function fail(e: unknown): Result {
  return {
    message:
      e instanceof z.ZodError
        ? "Vérifiez les champs du formulaire."
        : e instanceof Error
          ? e.message
          : "Impossible d’enregistrer. Réessayez.",
  };
}
function done(
  paths: string[],
  message = "Enregistré.",
  redirect?: string,
): Result {
  paths.forEach((p) => revalidatePath(p));
  return { ok: true, message, redirect };
}
export async function requestQuote(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireUser("/services");
  try {
    const service = uuid.parse(data(f, "service_id")),
      brief = text(20).parse(data(f, "brief")),
      key = uuid.parse(data(f, "request_key"));
    const { data: id, error } = await db.rpc("request_quote", {
      p_service: service,
      p_brief: brief,
      p_key: key,
    });
    if (error) return { message: error.message };
    return done(["/orders", "/home"], "Demande envoyée.", `/orders/${id}`);
  } catch (e) {
    return fail(e);
  }
}
export async function respondQuote(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireUser("/orders");
  try {
    const id = uuid.parse(data(f, "order_id"));
    const { error } = await db.rpc("respond_quote", {
      p_order: id,
      p_accept: data(f, "accept") === "true",
    });
    if (error) return { message: error.message };
    return done(["/orders", `/orders/${id}`], "Votre réponse est enregistrée.");
  } catch (e) {
    return fail(e);
  }
}
export async function submitPayment(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireUser("/orders");
  try {
    const id = uuid.parse(data(f, "order_id")),
      ref = text(4, 120).parse(data(f, "reference"));
    const provider = z
      .enum(["Orange Money", "MTN Mobile Money", "Virement bancaire", "Autre"])
      .parse(data(f, "provider"));
    const { error } = await db.rpc("submit_payment", {
      p_order: id,
      p_provider: provider,
      p_reference: ref,
    });
    if (error) return { message: error.message };
    return done(
      ["/orders", `/orders/${id}`, "/notifications"],
      "Référence reçue. La vérification de l’encaissement reste nécessaire.",
    );
  } catch (e) {
    return fail(e);
  }
}
export async function saveProfile(_: Result, f: FormData): Promise<Result> {
  const { db, user } = await requireUser("/profile");
  try {
    const values = {
      full_name: text(2, 120).parse(data(f, "full_name")),
      phone: text(0, 40).parse(data(f, "phone")),
      company: text(0, 200).parse(data(f, "company")),
    };
    const { error } = await db
      .from("profiles")
      .update(values)
      .eq("id", user.id);
    if (error) return { message: "Impossible de mettre à jour le profil." };
    return done(["/profile", "/home"], "Profil mis à jour.");
  } catch (e) {
    return fail(e);
  }
}
export async function toggleFavorite(_: Result, f: FormData): Promise<Result> {
  const { db, user } = await requireUser("/favorites");
  try {
    const id = uuid.parse(data(f, "service_id"));
    const remove = data(f, "remove") === "true";
    const { error } = remove
      ? await db
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("service_id", id)
      : await db
          .from("favorites")
          .upsert(
            { user_id: user.id, service_id: id },
            { onConflict: "user_id,service_id" },
          );
    if (error) return { message: "Impossible de modifier vos favoris." };
    return done(
      ["/favorites", `/services/${data(f, "slug")}`],
      remove ? "Favori retiré." : "Ajouté à vos favoris.",
    );
  } catch (e) {
    return fail(e);
  }
}
export async function sendSupport(_: Result, f: FormData): Promise<Result> {
  const { db, user } = await requireUser("/support");
  try {
    const { error } = await db.from("support_requests").insert({
      user_id: user.id,
      subject: text(4, 200).parse(data(f, "subject")),
      message: text(20).parse(data(f, "message")),
    });
    if (error) return { message: "Impossible d’envoyer votre demande." };
    return done(
      ["/support"],
      "Demande enregistrée. Notre équipe vous répondra dans cet espace.",
    );
  } catch (e) {
    return fail(e);
  }
}
export async function markRead(_: Result, f: FormData): Promise<Result> {
  const { db, user } = await requireUser("/notifications");
  const id = uuid.safeParse(data(f, "id"));
  if (!id.success) return { message: "Notification invalide." };
  const { error } = await db
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id.data)
    .eq("user_id", user.id);
  if (error) return { message: "Impossible de modifier la notification." };
  return done(["/notifications", "/home"], "Notification lue.");
}
export async function issueQuote(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireAdmin();
  try {
    const amount = z.coerce
      .number()
      .int()
      .min(1)
      .max(1000000000)
      .parse(data(f, "amount"));
    const { error } = await db.rpc("admin_quote", {
      p_order: uuid.parse(data(f, "order_id")),
      p_amount: amount,
      p_note: text(20).parse(data(f, "note")),
    });
    if (error) return { message: error.message };
    return done(
      ["/admin", "/admin/orders", "/orders"],
      "Devis proposé au client.",
    );
  } catch (e) {
    return fail(e);
  }
}
export async function verifyPayment(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireAdmin();
  try {
    const { error } = await db.rpc("admin_verify_payment", {
      p_payment: uuid.parse(data(f, "payment_id")),
      p_confirm: data(f, "confirm") === "true",
    });
    if (error) return { message: error.message };
    return done(
      ["/admin", "/admin/orders", "/admin/projects"],
      data(f, "confirm") === "true"
        ? "Encaissement confirmé et projet créé."
        : "Paiement non confirmé.",
    );
  } catch (e) {
    return fail(e);
  }
}
export async function updateProject(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireAdmin();
  try {
    const url = data(f, "url").trim();
    if (url && !url.startsWith("https://"))
      return { message: "Le livrable doit utiliser un lien HTTPS." };
    const { error } = await db.rpc("admin_update_project", {
      p_project: uuid.parse(data(f, "project_id")),
      p_status: data(f, "status"),
      p_title: text(3, 200).parse(data(f, "title")),
      p_body: text(0).parse(data(f, "body")),
      p_url: url || undefined,
      p_file_name: url ? text(3, 200).parse(data(f, "file_name")) : undefined,
    });
    if (error) return { message: error.message };
    return done(
      ["/admin/projects", "/projects"],
      "Projet mis à jour et client informé.",
    );
  } catch (e) {
    return fail(e);
  }
}
export async function replySupport(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireAdmin();
  try {
    const { error } = await db
      .from("support_requests")
      .update({
        response: text(10).parse(data(f, "response")),
        status: z.enum(["open", "resolved"]).parse(data(f, "status")),
        responded_at: new Date().toISOString(),
      })
      .eq("id", uuid.parse(data(f, "id")));
    if (error) return { message: "Impossible de répondre." };
    return done(["/admin/support", "/support"], "Réponse enregistrée.");
  } catch (e) {
    return fail(e);
  }
}
export async function saveService(_: Result, f: FormData): Promise<Result> {
  const { db } = await requireAdmin();
  try {
    const values = {
      name: text(3, 120).parse(data(f, "name")),
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .max(120)
        .parse(data(f, "slug")),
      summary: text(10, 300).parse(data(f, "summary")),
      description: text(20, 4000).parse(data(f, "description")),
      category_id: uuid.parse(data(f, "category_id")),
      active: data(f, "active") === "on",
    };
    const id = data(f, "id");
    const { error } = id
      ? await db.from("services").update(values).eq("id", uuid.parse(id))
      : await db.from("services").insert(values);
    if (error)
      return {
        message:
          error.code === "23505"
            ? "Cet identifiant existe déjà."
            : "Impossible d’enregistrer ce service.",
      };
    return done(
      ["/admin/services", "/services", "/home"],
      "Catalogue mis à jour.",
    );
  } catch (e) {
    return fail(e);
  }
}

export async function activateOwner(): Promise<Result> {
  const { db } = await requireUser("/profile");
  const { error } = await db.rpc("activate_owner");
  if (error) return { message: error.message };
  return done(["/profile", "/admin"], "Administration activée.", "/admin");
}

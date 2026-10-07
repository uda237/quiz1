import { requireAdmin } from "@/lib/session";
import { Heading, Field, TextField } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { saveService } from "@/app/actions";
import type { Database } from "@/lib/database.types";
type Service = Database["public"]["Tables"]["services"]["Row"];
function ServiceForm({
  service,
  categories,
}: {
  service?: Service;
  categories: { id: string; name: string }[];
}) {
  return (
    <ActionForm
      action={saveService}
      label={service ? "Mettre à jour" : "Créer le service"}
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <Field
        name="name"
        label="Nom du service"
        defaultValue={service?.name}
        minLength={3}
        maxLength={120}
      />
      <Field
        name="slug"
        label="Identifiant du lien"
        defaultValue={service?.slug}
        placeholder="site-web"
        maxLength={120}
      />
      <label className="field">
        Catégorie
        <select
          name="category_id"
          defaultValue={service?.category_id || categories[0]?.id}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <TextField
        name="summary"
        label="Résumé"
        defaultValue={service?.summary || ""}
        maxLength={300}
      />
      <TextField
        name="description"
        label="Description"
        defaultValue={service?.description || ""}
        minLength={20}
      />
      <label className="check">
        <input
          type="checkbox"
          name="active"
          defaultChecked={service?.active ?? true}
        />
        Visible dans le catalogue
      </label>
    </ActionForm>
  );
}
export default async function Services() {
  const { db } = await requireAdmin();
  const [{ data: list, error }, { data: categories, error: ce }] =
    await Promise.all([
      db.from("services").select("*").order("name"),
      db.from("service_categories").select("id,name").order("sort_order"),
    ]);
  if (error || ce) throw error || ce;
  return (
    <section>
      <Heading
        title="Catalogue UQONI"
        description="Les offres sont présentées sur devis. Aucun tarif fixe n’est affiché."
      />
      <details className="card panel">
        <summary>Créer un nouveau service</summary>
        <ServiceForm categories={categories || []} />
      </details>
      <div className="record-list mt-6">
        {list?.map((s) => (
          <details className="card panel" key={s.id}>
            <summary>
              {s.name} · {s.active ? "Visible" : "Masqué"}
            </summary>
            <ServiceForm service={s} categories={categories || []} />
          </details>
        ))}
      </div>
    </section>
  );
}

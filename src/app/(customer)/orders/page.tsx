import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Heading, Empty, Badge } from "@/components/ui";
import { money, date } from "@/lib/format";
export default async function Orders() {
  const { db, user } = await requireUser("/orders");
  const { data: list, error } = await db
    .from("orders")
    .select(
      "id,order_number,status,quote_state,total_xaf,created_at,order_items(service_name)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (
    <section className="container page">
      <Heading
        eyebrow="ESPACE CLIENT"
        title="Mes devis & commandes"
        description="Chaque demande, chaque validation, au même endroit."
      />
      {list?.length ? (
        <div className="record-list">
          {list.map((o) => (
            <Link
              prefetch={false}
              href={`/orders/${o.id}`}
              className="card record"
              key={o.id}
            >
              <div>
                <p className="eyebrow">{o.order_number}</p>
                <h2>
                  {o.order_items?.[0]?.service_name || "Demande de service"}
                </h2>
                <p className="muted">{date(o.created_at)}</p>
              </div>
              <div className="record-end">
                <Badge
                  value={o.status === "draft" ? o.quote_state : o.status}
                />
                <strong>
                  {o.quote_state === "requested"
                    ? "À chiffrer"
                    : money(o.total_xaf)}
                </strong>
                <span>Voir le détail →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="Votre prochain projet commence ici."
          body="Choisissez un service pour recevoir un devis adapté à votre besoin."
          href="/services"
          label="Explorer les services"
        />
      )}
    </section>
  );
}

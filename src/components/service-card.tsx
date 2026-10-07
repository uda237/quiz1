import Link from "next/link";
import {
  ArrowUpRight,
  Layers,
  Workflow,
  Globe,
  Palette,
  ChartNoAxesCombined,
  PenTool,
} from "lucide-react";
const icons = [Layers, Workflow, Palette, PenTool, Globe, ChartNoAxesCombined];
export function ServiceCard({
  service,
  index = 0,
}: {
  service: { id: string; slug: string; name: string; summary: string | null };
  index?: number;
}) {
  const Icon = icons[index % icons.length];
  return (
    <Link
      prefetch={false}
      href={`/services/${service.slug}`}
      className="card service-card"
    >
      <div className="service-art">
        <Icon size={40} strokeWidth={1.25} />
        <span>UQONI / {String(index + 1).padStart(2, "0")}</span>
        <ArrowUpRight className="service-arrow" size={20} />
      </div>
      <div className="service-copy">
        <p className="eyebrow">SUR DEVIS</p>
        <h2>{service.name}</h2>
        <p className="muted">{service.summary}</p>
        <span className="text-link">
          Découvrir le service <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}

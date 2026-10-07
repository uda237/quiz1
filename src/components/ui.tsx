import Link from "next/link";
import { labels } from "@/lib/format";
export function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="muted">{description}</p>}
    </div>
  );
}
export function Empty({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="card empty">
      <div className="empty-mark">＋</div>
      <h2>{title}</h2>
      <p className="muted">{body}</p>
      {href && (
        <Link prefetch={false} className="btn-primary" href={href}>
          {label}
        </Link>
      )}
    </div>
  );
}
export function Badge({ value }: { value: string }) {
  return (
    <span
      className={`badge ${["paid", "completed", "resolved"].includes(value) ? "good" : ""}`}
    >
      {labels[value] || value}
    </span>
  );
}
export function Field({
  label,
  name,
  type = "text",
  required = true,
  defaultValue,
  maxLength = 200,
  minLength,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
      />
    </label>
  );
}
export function TextField({
  label,
  name,
  defaultValue,
  minLength = 10,
  maxLength = 4000,
  required = true,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        name={name}
        rows={4}
        required={required}
        defaultValue={defaultValue}
        minLength={minLength}
        maxLength={maxLength}
      />
    </label>
  );
}

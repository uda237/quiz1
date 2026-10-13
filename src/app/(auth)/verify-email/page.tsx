import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Confirmer mon adresse email" };
export default function Page() {
  return <AuthForm mode="verify-email" />;
}

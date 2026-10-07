import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "UQONI — Votre espace digital", template: "%s · UQONI" },
  description:
    "Découvrez les services UQONI, demandez un devis et suivez vos projets dans un espace unique.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

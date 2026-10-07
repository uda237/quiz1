import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"YUQONI Digital Agency",description:"Services digitaux, commandes et suivi de projets YUQONI."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
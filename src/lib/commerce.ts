export type Service={slug:string;name:string;category:string;description:string;priceFrom:number;delivery:string};
export const services:Service[]=[
{slug:"brand-identity",name:"Identité de marque",category:"Design & Branding",description:"Positionnement visuel, logo et système de marque cohérent.",priceFrom:150000,delivery:"7–14 jours"},
{slug:"business-website",name:"Site web business",category:"Sites Web",description:"Site professionnel responsive pensé pour convertir.",priceFrom:350000,delivery:"10–21 jours"},
{slug:"growth-campaign",name:"Campagne Growth",category:"Marketing Digital",description:"Stratégie, contenus et acquisition pour générer des opportunités.",priceFrom:200000,delivery:"14–30 jours"}];
export const money=(n:number)=>new Intl.NumberFormat("fr-FR").format(n)+" FCFA";
export const quoteStatuses=["Brouillon","Envoyé","Accepté","Refusé"] as const;
export const orderStatuses=["En attente de paiement","Payée","En production","Livrée"] as const;
# YUQONI Digital Agency — APP-01

Foundation de l'application mobile-first de vente et suivi de services digitaux.

## Stack
Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase SSR · Zod · Lucide · Vercel

## Démarrage
1. Copier `.env.example` vers `.env.local`.
2. Ajouter les variables Supabase.
3. `npm install`
4. `npm run dev`
5. Vérifier `npm run build` avant déploiement.

## Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (serveur uniquement)
- NEXT_PUBLIC_APP_URL

## Architecture
- `src/app/(auth)` : authentification
- `src/app/(customer)` : espace client
- `src/app/admin` : administration
- `src/components` : composants UI/métier
- `src/lib/supabase` : clients browser/server

## Sécurité
Ne jamais committer `.env.local`. La service role Supabase ne doit jamais être importée dans un Client Component.

## Phase A
- [x] Next.js / TypeScript
- [x] Tailwind / design tokens
- [x] App Router
- [x] Navigation responsive de base
- [x] Supabase SSR clients
- [x] ENV template
- [ ] Projet Supabase réel
- [ ] Schéma SQL + RLS
- [ ] Variables Vercel
- [ ] Build Preview validé

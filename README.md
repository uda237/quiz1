# UQONI Digital Agency — Application v1

Application responsive de vente de services **sur devis**, avec paiement vérifié manuellement et suivi de production. Next.js 16, React 19, Supabase Auth/SSR/Postgres/RLS, Vercel. Versions de dépendances et lockfile figés.

## Parcours opérationnel

1. Le visiteur consulte les six services, recherche et filtre le catalogue.
2. Il crée un compte, confirme son email puis présente son besoin.
3. UQONI prépare un devis : montant FCFA, périmètre, livrables, délais et conditions.
4. Le client accepte ou décline. Il obtient les coordonnées de paiement via le contact officiel.
5. Après règlement, il soumet sa référence. Le statut reste « vérification en cours ».
6. L’administrateur vérifie l’encaissement réel. Seule sa confirmation crée un projet.
7. L’administrateur publie des étapes et des liens de livrables ; le client suit son projet.
8. Le support permet une conversation par demande, avec réponse et résolution côté administration.

Aucun prix fictif, aucune confirmation de paiement automatique, aucun code PIN/OTP demandé. Les coordonnées bancaires/Mobile Money ne sont pas inventées. Les notifications sont internes à l’application ; aucun envoi de notification Gmail n’est automatisé dans cette version. Gmail reste le canal officiel pour les contrats et les coordonnées de paiement.

## Développement

```sh
npm ci
cp .env.example .env.local
# Renseigner l’URL et la clé publique Supabase.
npm run dev
npm run lint
npm test
npm run build
```

Utiliser `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, ou la clé `anon` comme fallback. **Aucune clé service_role n’est nécessaire à cette application.** Ne jamais publier les mots de passe de test, les fichiers `.env.local` ou les cookies de session.

## Base Supabase

Projet existant : `Uqoni Agency`, référence `izjhroinwwjqajcbgpxd`. Les tables de fondation préexistaient au dépôt. `database/001_operational.sql` contient la modification transactionnelle appliquée pour cette version ; `database/002_owner.sql` ajoute l’activation limitée du propriétaire. `database/003_validation.sql` renforce la validation des devis et la provenance des réponses d’assistance. Ce sont des évolutions de la fondation, pas des scripts à réappliquer sur un schéma déjà mis à jour. Les types du schéma réellement connecté sont dans `src/lib/database.types.ts`.

Les fonctions privilégiées sont dans le schéma non exposé `private`, avec des wrappers publics `SECURITY INVOKER`. Toutes exigent une session, et les mutations d’administration vérifient le rôle dans `profiles`. Le client ne choisit ni son rôle ni le montant encaissé. Le montant du paiement est copié du devis accepté par la base. L’idempotence de la demande et les verrous de validation évitent les doublons ; un paiement non confirmé peut être soumis à nouveau.

Les pages et actions vérifient l’identité côté serveur. La RLS limite les données aux propriétaires, et le rôle administrateur donne accès à la production. Les profils ne peuvent modifier que leurs coordonnées. Les redirections d’authentification sont limitées aux chemins internes, et les livrables n’acceptent que des liens HTTPS.

## Activer le compte propriétaire

Créer et confirmer le compte **uqoni.pro@gmail.com**, se connecter, ouvrir `/profile`, puis cliquer **Activer mon administration**. La base vérifie l’adresse confirmée dans `auth.users`. Les métadonnées fournies à l’inscription ne peuvent jamais accorder ce rôle. Aucun mot de passe administrateur prédéfini n’existe.

## Réglages email à vérifier avant ouverture aux clients

Dans Supabase → Authentication → URL Configuration :

- Définir **Site URL** sur le domaine stable de l’application.
- Ajouter aux redirections autorisées le domaine retenu, avec `/auth/callback` et `/auth/callback?next=/reset-password`.
- Les previews autorisées peuvent être ajoutées explicitement ; limiter les domaines aux déploiements maîtrisés.

Le projet exige actuellement la confirmation email. Configurer un SMTP pour l’envoi à des clients externes et tester un email d’inscription et un email de récupération dans une boîte réelle. Les tests automatisés n’envoient aucun email réel. Les routes `/auth/callback`, `/auth/confirm` et `/reset-password` sont implémentées, mais l’acheminement des emails et les redirections du projet nécessitent une validation de configuration.

Une Preview Vercel utilise la protection du workspace. Pour ouvrir l’application au public, choisir le domaine final et régler sa protection de déploiement après revue. La sécurité applicative Supabase et l’administration restent indépendantes de Vercel Authentication.

## Production quotidienne

- `/admin/orders` : préparer les devis et contrôler les paiements.
- `/admin/projects` : publier l’avancement et les livrables.
- `/admin/services` : créer, éditer ou masquer les offres.
- `/admin/support` : répondre aux demandes.
- `/admin/audit` : consulter les événements métier.

Les listes d’administration présentent les 100 dernières entrées. Le chiffre du dashboard représente la somme des paiements confirmés. Les liens de livrables sont externes : utiliser un partage limité au client dans l’outil qui héberge le document. La permission d’accès à la fiche ne protège pas un lien public.

## Vérification

`tests/workflow.sql` teste le parcours métier et les autorisations dans une transaction **entièrement annulée**. Il contrôle les profils, l’impossibilité de modifier son rôle, l’isolation des clients, l’idempotence des demandes, l’acceptation des devis, les paiements refusés/retransmis, la confirmation réservée à l’admin, la création unique du projet et sa clôture.

`tests/security.test.mjs` vérifie les redirections et les liens de livrables. `tests/workflow.test.mjs` couvre le parcours des vrais formulaires dans Chromium, avec trois comptes de test fournis par un fichier externe. Il utilise la vraie API Supabase et ne remplace pas les données par des mocks. Sans comptes configurés, seul ce test d’intégration est marqué SKIP.

```sh
npx playwright install chromium
UQONI_TEST_FIXTURES=/chemin/comptes-temporaires.json \
node --env-file=.env.local --test tests/*.test.mjs
```

Format du fichier de test : tableau de trois objets `{id,email,password,role}` avec `role` égal à `client`, `other` et `admin`. Utiliser uniquement des comptes temporaires dédiés, et supprimer leurs demandes, paiements, projets, profils et sessions après le test. Les identifiants ne doivent pas être committés.

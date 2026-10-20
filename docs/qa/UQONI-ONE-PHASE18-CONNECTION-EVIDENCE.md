# UQONI ONE — Supabase linkage evidence, phase 18
Date: 2026-10-19
Status: UNRESOLVED

## New checks
- Vercel project quiz1: project connector connections API returned connectors: [].
- Repository .env.example exists but contains no concrete supabase.co project URL.
- Repository README contains no concrete supabase.co project URL.
- Vercel has NEXT_PUBLIC_SUPABASE_URL and public key variable names, but their values are not available in a verifiable plaintext form via the current integration.
- Supabase organization lists three inactive projects; no matching project ref has been established.

## Interpretation
- No Vercel managed connector does NOT imply no manually configured Supabase API URL.
- READY preview and green static tests do NOT imply a reachable/authenticated database.
- Project identity, RLS and role integrity remain NOT_VERIFIED.

## Single missing evidence
An authorized operator should read NEXT_PUBLIC_SUPABASE_URL in Vercel project quiz1, and record only the project reference from https://<project-ref>.supabase.co. Do not copy the anon/publishable key or secrets into the audit.
Compare the reference to connected Supabase project IDs before authorizing any restore, data access, or tests.

No production changes were performed.

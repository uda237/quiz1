# UQONI ONE — G2/G3 Supabase connection reconciliation
Date: 2026-10-19
Status: BLOCKED / NOT VERIFIED

## Observed facts
- Vercel quiz1 declares NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY for preview/production/development.
- The Vercel API returned an encrypted/unreadable NEXT_PUBLIC_SUPABASE_URL, so the project reference could NOT be established.
- Connected Supabase organization lists three projects, all INACTIVE at inspection: jpjezblbdevndlqhxbpn (UQONI Business OS), rlqbhesxmjegendibddy (Uqoni AI Agency), izjhroinwwjqajcbgpxd (Uqoni Agency).
- No evidence proves APP-01 is connected to any of these projects. Do not guess, restore or migrate.
- Static security workflow GitHub run 39310972018 completed successfully; Vercel preview READY. Neither validates runtime Auth or RLS.

## Safe verification procedure
1. In Vercel project quiz1, inspect the Supabase URL hostname in a secure administrator session. Record ONLY its project ref, never keys or credentials.
2. Compare the ref with the connected Supabase projects. If different, identify the actual organization/connection before proceeding.
3. Obtain approval before restoring any inactive project or incurring charges.
4. With a disposable test environment and authorized identities, inspect profiles.role and RLS policies for projects, orders and payments.
5. Run G3-01..G3-10 and store actual evidence (timestamp, actor role, resource, expected/actual, PASS/FAIL).
6. Keep PR #4 draft until security and email/SMTP gates pass.

No live security test has been performed and no production database has been changed.

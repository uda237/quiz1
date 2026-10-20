# UQONI ONE — G3 role integrity review
Date: 2026-10-19
Status: REVIEW REQUIRED — not a confirmed vulnerability

## Evidence from application source
- src/lib/database.types.ts defines profiles.role as public.Enums.app_role.
- profiles.Update includes an optional role property; generated types alone do NOT establish database permission.
- projects.Row includes user_id; it is a candidate ownership boundary, subject to actual database policy checks.
- src/lib/session.ts requireAdmin checks profiles.role === "admin" server-side.
- src/app/workspace/page.tsx uses requireAdmin; the client portal requires Supabase auth.getUser.

## Mandatory negative tests before release
1. Authenticate as disposable non-admin account A.
2. Attempt a direct Supabase API update of A's profiles.role to admin. Expected: database rejects change, or no rows changed; re-read profile and verify unchanged.
3. Attempt to change profiles.id and projects.user_id for records belonging to A or B. Expected: unauthorized owner changes denied.
4. Authenticate as distinct customer B. Attempt reads and writes to A's orders, projects, payments and project updates. Expected: zero unauthorized access.
5. Repeat against any admin/API route directly (not only via UI links).
6. Inspect RLS policies and triggers for every relevant table and capture query/log evidence.
7. Use only synthetic identities/data. Do not promote accounts or change live customer records.

## Findings
Finding G3-RISK-001: Role escalation cannot be ruled out from source types alone. Severity: undetermined pending RLS and authenticated negative test. Status: OPEN / NOT_TESTED.
Finding G3-RISK-002: Cross-tenant ownership isolation cannot be confirmed without actual policies and negative tests. Status: OPEN / NOT_TESTED.

No remediation SQL should be applied before identifying the actual Supabase project and reviewing its policies. Preview-only PR #4 remains unmerged.

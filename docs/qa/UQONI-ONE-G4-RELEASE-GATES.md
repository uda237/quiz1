# UQONI ONE — G4 release decision record
Date: 2026-10-19
Scope: draft PR #4 / feature branch feat/uqoni-one-foundation-20261019
Decision: NO-GO for production (pending evidence)

## Verified
- GitHub Actions static-security workflow run 39312587156: completed/success (commit 9b7aab0).
- Vercel Preview deployment dpl_9dVn9nXzPov21zKq2tt6oU5ecYfj: READY.
- Public /one, authenticated /client, admin /workspace added without replacing legacy commercial routes.
- Server-side gates are present in source; not runtime-proven.

## Required gates before merge
| Gate | Acceptance evidence | Status |
| --- | --- | --- |
| G1 Build | Vercel preview READY | PASS (build only) |
| G2 Identity | Verified APP-01 Supabase project reference, healthy project and test accounts | BLOCKED |
| G3 Access | Anonymous, customer A/B, admin, expired-session and privilege-escalation tests with logs | NOT_RUN |
| G3 RLS | Actual policy review plus negative cross-tenant queries | NOT_RUN |
| G4 End-to-end | Login, return to /workspace, orders, projects and logout in preview | NOT_RUN |
| G5 Operations | SMTP, rollback, owner sign-off and production monitoring plan | NOT_VERIFIED |

## Release constraints
- A READY preview is not a substitute for runtime acceptance.
- No permission bypass, no client data copied to test environments without authorization.
- No production merge, database restore, migrations or credential changes without explicit approval.
- Store evidence links and decisions in UQONI ONE Notion page.

# UQONI ONE — G3/G4 manual runtime acceptance
Date: 2026-10-19
Status: NOT_RUN (awaiting verified APP-01 Supabase project and authorized disposable test identities)

## Preconditions
- Match Vercel NEXT_PUBLIC_SUPABASE_URL project ref to a known, authorized Supabase project.
- Verify its availability and RLS policies. Do not restore inactive projects without approval.
- Create disposable test users A, B and a separately approved admin using non-production data.
- Run in Preview, not production; keep secrets, session cookies and personally identifiable data out of logs.

## Scenarios
| ID | Actor | Action | Expected outcome | Evidence |
| --- | --- | --- | --- | --- |
| G3-01 | anonymous | GET /client | Redirect to /login?next=%2Fclient | status + Location |
| G3-02 | anonymous | GET /workspace | Redirect to /login with next=/workspace | status + Location |
| G3-03 | customer A | GET /client | Allowed | route + timestamp |
| G3-04 | customer A | GET /workspace | Denied/redirect to /home | status + Location |
| G3-05 | admin | GET /workspace | Allowed | route + timestamp |
| G3-06 | customer A | API query projects/orders of B | No records / permission denied | query shape + sanitized response |
| G3-07 | customer B | API query projects/orders of A | No records / permission denied | query shape + sanitized response |
| G3-08 | customer A | API update own profiles.role to admin | Rejected / unchanged after reread | sanitized response + reread |
| G3-09 | customer A | API update projects.user_id to B | Rejected / unchanged after reread | sanitized response + reread |
| G3-10 | expired session | GET /client and /workspace | Login redirect, no private content | status + Location |
| G4-01 | admin | Login with next=/workspace | Returns to /workspace | screenshot (redacted) |
| G4-02 | customer A | Logout then open /client | Login redirect | status + Location |

## Evidence ledger
For each scenario record: ID, environment, deployment commit, date/time, test actor role, expected result, actual result, PASS/FAIL, evidence link, reviewer, corrective action.
Do not mark PASS based on static source assertions, deployment readiness, or the absence of an observed error.
If any unauthorized access succeeds, STOP, mark FAIL, preserve sanitized evidence, and block release.

## Decision
G3/G4: NOT_RUN; release NO-GO until all mandatory scenarios pass and independent review signs off.

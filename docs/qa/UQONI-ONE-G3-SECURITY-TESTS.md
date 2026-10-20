# UQONI ONE — Security verification plan (G3)
Date: 2026-10-19
Status: PENDING — no authenticated test identities supplied.

## Current controls verified in source
- /client invokes Supabase auth.getUser() server-side and redirects unauthenticated users to /login?next=%2Fclient.
- The existing AuthForm reads the next query parameter and applies safeNext, rejecting external origins, protocol-relative paths and control characters.
- /workspace invokes requireAdmin() server-side, which checks the authenticated user's profiles.role equals admin and otherwise redirects to /home.
- Existing /admin also invokes requireAdmin().
- These checks are application-layer gates, not a substitute for database RLS.

## Required tests and evidence
| ID | Scenario | Expected | Observed |
| --- | --- | --- | --- |
| G3-01 | Anonymous GET /client | Redirect to login | NOT_RUN |
| G3-02 | Anonymous GET /workspace | Redirect to login | NOT_RUN |
| G3-03 | Customer GET /workspace | Redirect to /home; no admin data | NOT_RUN |
| G3-04 | Admin GET /workspace | Authorized workspace shown | NOT_RUN |
| G3-05 | Customer A reads customer B project | Database denies / returns no data | NOT_RUN |
| G3-06 | Customer A reads customer B order | Database denies / returns no data | NOT_RUN |
| G3-07 | Non-admin direct /admin and API calls | Denied server-side | NOT_RUN |
| G3-08 | Expired session | Re-authentication required | NOT_RUN |
| G3-09 | Login ?next=https://evil.example | Redirect remains local /home | NOT_RUN |
| G3-10 | Admin role spoofed in user metadata | Cannot elevate role | NOT_RUN |

## Release rule
No PASS until actual request/response logs, user role fixtures, database policies and evidence are captured. Never use a real customer's account as a test fixture without authorization. Keep changes in preview and do not merge PR #4 before security and SMTP gates.

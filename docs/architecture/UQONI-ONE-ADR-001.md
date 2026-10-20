# UQONI ONE — Architecture Decision Record 001

Status: Proposed — implementation branch only
Date: 2026-10-19
Scope: APP-01 (uda237/quiz1)

## Decision
Evolve APP-01 into UQONI ONE without replacing its existing commercial journeys. Provide two isolated surfaces: /client for customers and /workspace for authorized staff. The landing page and existing routes remain unchanged until a tested migration is approved.

## Principles
1. One identity provider (Supabase Auth), but no shared blanket access.
2. Authorize every server action and database query. UI hiding is not authorization.
3. Client resources require verified ownership or organization membership. Internal resources require explicit staff membership and permissions.
4. Use PostgreSQL RLS with deny-by-default policies; never trust user-editable metadata for roles.
5. Keep service-role credentials server-only. Do not expose secrets in NEXT_PUBLIC variables.
6. Log sensitive changes and approval transitions. Never automatically approve a user's own request.
7. Preserve existing CRM canonical client identifiers, projects, quotes and invoices. No duplicate master client registry.
8. Treat Notion and n8n as integrations, not as a substitute for transactional authorization.
9. Deploy changes behind feature flags and validate on preview before production.

## Proposed routes
- /one — application launcher (future)
- /client — customer portal (future)
- /workspace — internal operations portal (future)
- /api/one/* — protected backend endpoints (future)

## Proposed schema (not yet migrated)
- app_catalog: app_id, slug, name, status, launch_url, visibility
- organization_memberships: organization_id, user_id, role, status
- app_entitlements: organization_id, app_id, permission
- audit_events: actor_id, action, entity_type, entity_id, timestamp, request_id

Avoid creating a parallel client master: link to the canonical CRM via external identifiers and verified ownership mapping.

## Delivery gates
G0 inventory existing routes, middleware/proxy, Supabase project linkage, policies, and environment variable *names* (never values).
G1 backend restored only after verified project matching, backups, and change approval.
G2 add guarded launcher and isolated route groups in preview.
G3 RLS negative tests (customer A cannot access B; staff without grant cannot access admin).
G4 auth, SMTP, quote, payment, project, delivery and audit end-to-end tests.
G5 explicit release approval and production monitoring.

## Rollback
No destructive schema migrations. Retain the previous production deployment and disable new routes using feature flags if a gate fails.

## Current evidence
Vercel project quiz1 has a READY production deployment, but reported live=false and SSO protection; public accessibility not certified.
Supabase projects were reported INACTIVE; their association with this deployment is not yet verified.

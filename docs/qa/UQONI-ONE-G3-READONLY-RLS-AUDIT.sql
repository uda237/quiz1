-- UQONI ONE G3: READ-ONLY security inspection.
-- Run only on the verified APP-01 Supabase project as an authorized reviewer.
-- No DDL, no UPDATE/DELETE, no role or user changes.
-- A result is evidence to REVIEW, not a PASS by itself.

-- 1. RLS flags for the critical public tables.
SELECT n.nspname AS schema_name, c.relname AS table_name,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r','p')
  AND c.relname IN ('profiles','projects','orders','payments','tickets')
ORDER BY c.relname;

-- 2. All policies, including their USING and WITH CHECK expressions.
SELECT schemaname, tablename, policyname, permissive, roles, cmd,
       qual AS using_expression, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles','projects','orders','payments','tickets')
ORDER BY tablename, policyname;

-- 3. Grants that might permit users to edit role/owner fields.
SELECT table_schema, table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('profiles','projects','orders','payments','tickets')
  AND grantee IN ('anon','authenticated','PUBLIC')
ORDER BY table_name, grantee, privilege_type;

-- 4. Profile role column and defaults (metadata only; no personal data).
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('id','role')
ORDER BY ordinal_position;

-- 5. Explicit column-level UPDATE grants on profiles.role.
SELECT table_schema, table_name, column_name, grantee, privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'role'
ORDER BY grantee, privilege_type;

-- Reviewer checklist:
-- RLS enabled is necessary, but insufficient. Inspect every policy's scope.
-- In particular, users must not self-promote via profiles.role or writable
-- metadata, and project/order ownership must be enforced by the database.
-- Privileged service-role operations must never be exposed to browser clients.
-- Execute separate negative tests as authenticated customer A and customer B.

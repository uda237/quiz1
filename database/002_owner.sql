begin;
create or replace function private.activate_owner() returns void language plpgsql security definer set search_path='' as $$
declare u auth.users;
begin
 if auth.uid() is null then raise exception 'Connexion requise'; end if;
 select * into u from auth.users where id=auth.uid() for update;
 if lower(u.email)<>'uqoni.pro@gmail.com' or u.email_confirmed_at is null then raise exception 'Seule l’adresse officielle UQONI confirmée peut activer l’administration'; end if;
 if exists(select 1 from public.profiles where role='admin' and id<>u.id) then raise exception 'Un administrateur existe déjà. Contactez cet administrateur.'; end if;
 update public.profiles set role='admin' where id=u.id;
 insert into public.audit_logs(actor_id,event,entity_type,entity_id) values(u.id,'owner_activated','profile',u.id::text);
end $$;
revoke all on function private.activate_owner() from public,anon;
grant execute on function private.activate_owner() to authenticated;
create or replace function public.activate_owner() returns void language sql security invoker set search_path='' as $$ select private.activate_owner(); $$;
revoke all on function public.activate_owner() from public,anon;
grant execute on function public.activate_owner() to authenticated;
commit;

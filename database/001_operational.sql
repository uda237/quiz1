begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, anon;

create or replace function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated, anon;
create or replace function public.is_admin() returns boolean language sql stable security invoker set search_path='' as $$ select private.is_admin(); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

create or replace function private.new_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name,role) values(new.id,left(new.raw_user_meta_data->>'full_name',120),'client') on conflict(id) do nothing;
 return new;
end $$;
revoke all on function private.new_profile() from public;
create trigger uqoni_new_profile after insert on auth.users for each row execute function private.new_profile();
insert into public.profiles(id,full_name,role) select id,left(raw_user_meta_data->>'full_name',120),'client' from auth.users on conflict(id) do nothing;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update(full_name,phone,company,avatar_url) on public.profiles to authenticated;
create or replace function private.guard_profile_role() returns trigger language plpgsql set search_path='' as $$
begin
 if new.role is distinct from old.role and current_user not in ('postgres','supabase_admin','service_role') then raise exception 'Modification de rôle interdite'; end if;
 new.updated_at=now(); return new;
end $$;
create trigger uqoni_profile_role before update on public.profiles for each row execute function private.guard_profile_role();

alter table public.orders add column service_id uuid references public.services(id), add column brief text,
 add column quote_state text not null default 'requested' check(quote_state in ('requested','ready','accepted','declined')),
 add column quote_note text, add column request_key uuid unique, add column quoted_at timestamptz;
alter table public.support_requests add column response text, add column responded_at timestamptz;
create unique index uqoni_project_order_unique on public.projects(order_id) where order_id is not null;
create index if not exists uqoni_orders_user_idx on public.orders(user_id);
create index if not exists uqoni_projects_user_idx on public.projects(user_id);
create index if not exists uqoni_payments_order_idx on public.payments(order_id);
create index if not exists uqoni_order_items_order_idx on public.order_items(order_id);
create index if not exists uqoni_support_user_idx on public.support_requests(user_id);
create index if not exists uqoni_updates_project_idx on public.project_updates(project_id);
create index if not exists uqoni_deliverables_project_idx on public.deliverables(project_id);
create index if not exists uqoni_notifications_user_idx on public.notifications(user_id);

do $$ declare t text; begin
 foreach t in array array['service_categories','services','service_features','service_plans','discounts','orders','order_items','payments','projects','project_updates','deliverables','notifications','support_requests'] loop
  execute format('create policy uqoni_admin_write on public.%I for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))',t);
 end loop;
end $$;
create policy uqoni_notifications_update on public.notifications for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
revoke update on public.notifications from authenticated;
grant update(read_at) on public.notifications to authenticated;
grant insert,delete on public.notifications to authenticated;

create or replace function private.request_quote(p_service uuid,p_brief text,p_key uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); oid uuid; service_name text;
begin
 if u is null then raise exception 'Connexion requise'; end if;
 if p_key is null or length(trim(p_brief))<20 or length(p_brief)>4000 then raise exception 'Décrivez votre besoin (20 à 4000 caractères)'; end if;
 select id into oid from public.orders where request_key=p_key and user_id=u;
 if oid is not null then return oid; end if;
 if (select count(*) from public.orders where user_id=u and created_at>now()-interval '1 hour')>=20 then raise exception 'Trop de demandes. Réessayez plus tard.'; end if;
 select name into service_name from public.services where id=p_service and active;
 if service_name is null then raise exception 'Service indisponible'; end if;
 insert into public.orders(user_id,order_number,service_id,brief,request_key) values(u,'DEV-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),p_service,trim(p_brief),p_key) returning id into oid;
 insert into public.order_items(order_id,service_name,plan_name,unit_price_xaf,line_total_xaf) values(oid,service_name,'Sur devis',0,0);
 insert into public.notifications(user_id,title,body) values(u,'Demande reçue','Votre demande de devis a été enregistrée.');
 insert into public.audit_logs(actor_id,event,entity_type,entity_id) values(u,'quote_requested','order',oid::text);
 return oid;
end $$;

create or replace function private.admin_quote(p_order uuid,p_amount bigint,p_note text) returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if not private.is_admin() then raise exception 'Accès administrateur requis'; end if;
 if p_amount is null or p_amount<1 or p_amount>1000000000 or length(coalesce(p_note,''))>4000 then raise exception 'Devis invalide'; end if;
 select * into o from public.orders where id=p_order for update;
 if o.id is null or o.quote_state not in ('requested','ready') or o.status<>'draft' then raise exception 'Cette demande ne peut plus être modifiée'; end if;
 update public.orders set subtotal_xaf=p_amount,total_xaf=p_amount,quote_note=p_note,quote_state='ready',quoted_at=now(),updated_at=now() where id=p_order;
 update public.order_items set unit_price_xaf=p_amount,line_total_xaf=p_amount where order_id=p_order;
 insert into public.notifications(user_id,title,body) values(o.user_id,'Votre devis est prêt','Consultez et acceptez votre devis dans Mes commandes.');
 insert into public.audit_logs(actor_id,event,entity_type,entity_id,metadata) values(auth.uid(),'quote_issued','order',p_order::text,jsonb_build_object('amount_xaf',p_amount));
end $$;

create or replace function private.respond_quote(p_order uuid,p_accept boolean) returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if auth.uid() is null then raise exception 'Connexion requise'; end if;
 select * into o from public.orders where id=p_order and user_id=auth.uid() for update;
 if o.id is null or o.quote_state<>'ready' or o.status<>'draft' then raise exception 'Devis indisponible'; end if;
 update public.orders set quote_state=case when p_accept then 'accepted' else 'declined' end,status=case when p_accept then 'awaiting_payment'::public.order_status else 'cancelled'::public.order_status end,updated_at=now() where id=p_order;
 insert into public.audit_logs(actor_id,event,entity_type,entity_id) values(auth.uid(),case when p_accept then 'quote_accepted' else 'quote_declined' end,'order',p_order::text);
end $$;

create or replace function private.submit_payment(p_order uuid,p_provider text,p_reference text) returns uuid language plpgsql security definer set search_path='' as $$
declare o public.orders; pid uuid;
begin
 if auth.uid() is null then raise exception 'Connexion requise'; end if;
 if p_provider not in ('Orange Money','MTN Mobile Money','Virement bancaire','Autre') or length(trim(p_reference))<4 or length(p_reference)>120 then raise exception 'Référence de paiement invalide'; end if;
 select * into o from public.orders where id=p_order and user_id=auth.uid() for update;
 if o.id is null or o.status<>'awaiting_payment' or o.quote_state<>'accepted' or o.total_xaf<1 then raise exception 'Commande non payable'; end if;
 select id into pid from public.payments where order_id=p_order and status in ('pending','processing','paid');
 if pid is not null then raise exception 'Un paiement est déjà en cours de vérification'; end if;
 insert into public.payments(order_id,payment_number,provider,provider_reference,status,amount_xaf) values(p_order,'PAY-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),p_provider,trim(p_reference),'pending',o.total_xaf) returning id into pid;
 insert into public.notifications(user_id,title,body) values(o.user_id,'Paiement en vérification','Votre référence a été reçue. Le paiement sera confirmé après vérification de l’encaissement.');
 insert into public.audit_logs(actor_id,event,entity_type,entity_id) values(auth.uid(),'payment_submitted','payment',pid::text);
 return pid;
end $$;

create or replace function private.admin_verify_payment(p_payment uuid,p_confirm boolean) returns void language plpgsql security definer set search_path='' as $$
declare p public.payments; o public.orders; project_id uuid;
begin
 if not private.is_admin() then raise exception 'Accès administrateur requis'; end if;
 -- Lock order before payment, matching submit_payment to avoid deadlocks.
 select * into o from public.orders where id=(select order_id from public.payments where id=p_payment) for update;
 select * into p from public.payments where id=p_payment for update;
 if p.id is null or p.status not in ('pending','processing') or o.status<>'awaiting_payment' then raise exception 'Paiement déjà traité ou invalide'; end if;
 if p.amount_xaf<>o.total_xaf then raise exception 'Montant incohérent'; end if;
 update public.payments set status=case when p_confirm then 'paid'::public.payment_status else 'failed'::public.payment_status end,updated_at=now() where id=p_payment;
 if p_confirm then
  update public.orders set status='processing',updated_at=now() where id=o.id;
  insert into public.projects(user_id,order_id,project_number,name,status) values(o.user_id,o.id,'PRJ-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),(select service_name from public.order_items where order_id=o.id limit 1),'queued') returning id into project_id;
  insert into public.project_updates(project_id,title,body) values(project_id,'Projet créé','Paiement confirmé. Votre projet entre dans la file de production.');
 end if;
 insert into public.payment_events(payment_id,event_type,payload) values(p.id,case when p_confirm then 'manual_verified' else 'manual_rejected' end,jsonb_build_object('verified_by',auth.uid()));
 insert into public.notifications(user_id,title,body) values(o.user_id,case when p_confirm then 'Paiement confirmé' else 'Paiement non confirmé' end,case when p_confirm then 'Votre projet est créé. Suivez-le dans Mes projets.' else 'L’encaissement n’a pas été confirmé. Contactez l’assistance ou transmettez une nouvelle référence.' end);
 insert into public.audit_logs(actor_id,event,entity_type,entity_id) values(auth.uid(),case when p_confirm then 'payment_verified' else 'payment_rejected' end,'payment',p.id::text);
end $$;

create or replace function private.admin_update_project(p_project uuid,p_status text,p_title text,p_body text,p_url text default null,p_file_name text default null) returns void language plpgsql security definer set search_path='' as $$
declare p public.projects;
begin
 if not private.is_admin() then raise exception 'Accès administrateur requis'; end if;
 if p_status not in ('queued','active','review','delivered','completed','blocked','cancelled') or length(trim(p_title))<3 or length(p_title)>200 or length(coalesce(p_body,''))>4000 then raise exception 'Mise à jour invalide'; end if;
 if p_url is not null and (p_url!~'^https://' or length(p_url)>2000 or coalesce(length(trim(p_file_name)),0)<3) then raise exception 'Un lien HTTPS et un nom de livrable sont requis'; end if;
 select * into p from public.projects where id=p_project for update;
 if p.id is null or p.status in ('completed','cancelled') then raise exception 'Projet indisponible ou clôturé'; end if;
 update public.projects set status=p_status::public.project_status,updated_at=now() where id=p_project;
 insert into public.project_updates(project_id,title,body) values(p_project,trim(p_title),p_body);
 if p_url is not null then insert into public.deliverables(project_id,name,url) values(p_project,p_file_name,p_url); end if;
 if p_status='completed' then update public.orders set status='completed',updated_at=now() where id=p.order_id; end if;
 insert into public.notifications(user_id,title,body) values(p.user_id,p_title,p_body);
 insert into public.audit_logs(actor_id,event,entity_type,entity_id,metadata) values(auth.uid(),'project_updated','project',p_project::text,jsonb_build_object('status',p_status));
end $$;

do $$ declare f record; begin
 for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and p.proname in ('request_quote','admin_quote','respond_quote','submit_payment','admin_verify_payment','admin_update_project') loop
  execute format('revoke all on function %s from public,anon',f.signature);
  execute format('grant execute on function %s to authenticated',f.signature);
 end loop;
end $$;


create or replace function public.request_quote(p_service uuid,p_brief text,p_key uuid) returns uuid language sql security invoker set search_path='' as $$ select private.request_quote(p_service,p_brief,p_key); $$;
revoke all on function public.request_quote(uuid,text,uuid) from public,anon;
grant execute on function public.request_quote(uuid,text,uuid) to authenticated;
create or replace function public.admin_quote(p_order uuid,p_amount bigint,p_note text) returns void language sql security invoker set search_path='' as $$ select private.admin_quote(p_order,p_amount,p_note); $$;
revoke all on function public.admin_quote(uuid,bigint,text) from public,anon;
grant execute on function public.admin_quote(uuid,bigint,text) to authenticated;
create or replace function public.respond_quote(p_order uuid,p_accept boolean) returns void language sql security invoker set search_path='' as $$ select private.respond_quote(p_order,p_accept); $$;
revoke all on function public.respond_quote(uuid,boolean) from public,anon;
grant execute on function public.respond_quote(uuid,boolean) to authenticated;
create or replace function public.submit_payment(p_order uuid,p_provider text,p_reference text) returns uuid language sql security invoker set search_path='' as $$ select private.submit_payment(p_order,p_provider,p_reference); $$;
revoke all on function public.submit_payment(uuid,text,text) from public,anon;
grant execute on function public.submit_payment(uuid,text,text) to authenticated;
create or replace function public.admin_verify_payment(p_payment uuid,p_confirm boolean) returns void language sql security invoker set search_path='' as $$ select private.admin_verify_payment(p_payment,p_confirm); $$;
revoke all on function public.admin_verify_payment(uuid,boolean) from public,anon;
grant execute on function public.admin_verify_payment(uuid,boolean) to authenticated;
create or replace function public.admin_update_project(p_project uuid,p_status text,p_title text,p_body text,p_url text default null,p_file_name text default null) returns void language sql security invoker set search_path='' as $$ select private.admin_update_project(p_project,p_status,p_title,p_body,p_url,p_file_name); $$;
revoke all on function public.admin_update_project(uuid,text,text,text,text,text) from public,anon;
grant execute on function public.admin_update_project(uuid,text,text,text,text,text) to authenticated;

insert into public.service_categories(name,slug,sort_order) values ('Architecture & automatisation','systems',1),('Design & communication','creative',2),('Web & croissance','growth',3) on conflict(slug) do nothing;
insert into public.services(category_id,name,slug,summary,description)
select c.id,v.name,v.slug,v.summary,v.description from (values
 ('systems','Business Operating System','business-os','Structurez votre activité dans un système central.','Diagnostic, architecture des bases, processus et tableaux de pilotage. Le périmètre et les livrables sont définis dans le devis.'),
 ('systems','Automatisation & IA','automation-ia','Réduisez les tâches répétitives de votre activité.','Analyse des workflows, intégrations et automatisations adaptées à vos outils. Définition des accès et validation humaine des actions sensibles.'),
 ('creative','Identité de marque','identite-marque','Une identité cohérente pour votre entreprise.','Direction visuelle, logo et déclinaisons selon votre besoin. Formats, nombre de propositions et révisions précisés dans le devis.'),
 ('creative','Création de contenu','creation-contenu','Du contenu conçu pour vos canaux.','Visuels, rédaction et organisation de votre production de contenu. Volume, formats et calendrier validés avant production.'),
 ('growth','Site web & application','site-web','Présentez vos offres et simplifiez le parcours client.','Conception responsive, développement et intégrations. Les pages, fonctionnalités, hébergement et maintenance sont cadrés dans le devis.'),
 ('growth','Marketing digital','marketing-digital','Organisez votre acquisition et mesurez les résultats.','Audit, stratégie, campagnes et mesure des performances. Budget média et honoraires définis séparément dans le devis.')
) as v(category,name,slug,summary,description) join public.service_categories c on c.slug=v.category on conflict(slug) do nothing;
commit;

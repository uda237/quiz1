begin;
alter policy support_insert on public.support_requests to authenticated with check (
 user_id=(select auth.uid()) and status='open' and response is null and responded_at is null
 and length(trim(subject)) between 4 and 200 and length(trim(message)) between 20 and 4000
);
create or replace function private.admin_quote(p_order uuid,p_amount bigint,p_note text) returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if not private.is_admin() then raise exception 'Accès administrateur requis'; end if;
 if p_amount is null or p_amount<1 or p_amount>1000000000 or length(trim(coalesce(p_note,''))) not between 20 and 4000 then raise exception 'Précisez un montant et les conditions du devis (20 à 4000 caractères)'; end if;
 select * into o from public.orders where id=p_order for update;
 if o.id is null or o.quote_state not in ('requested','ready') or o.status<>'draft' then raise exception 'Cette demande ne peut plus être modifiée'; end if;
 update public.orders set subtotal_xaf=p_amount,total_xaf=p_amount,quote_note=p_note,quote_state='ready',quoted_at=now(),updated_at=now() where id=p_order;
 update public.order_items set unit_price_xaf=p_amount,line_total_xaf=p_amount where order_id=p_order;
 insert into public.notifications(user_id,title,body) values(o.user_id,'Votre devis est prêt','Consultez et acceptez votre devis dans Mes commandes.');
 insert into public.audit_logs(actor_id,event,entity_type,entity_id,metadata) values(auth.uid(),'quote_issued','order',p_order::text,jsonb_build_object('amount_xaf',p_amount));
end $$;
commit;

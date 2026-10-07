-- Regression: run in the SQL editor. Every fixture is rolled back.
begin;
do $$
declare a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); admin uuid:=gen_random_uuid(); service uuid; o uuid; p uuid; proj uuid; key uuid:=gen_random_uuid(); denied boolean;
begin
 insert into auth.users(id,email,role,aud,email_confirmed_at,raw_user_meta_data) values
 (a,a||'@example.invalid','authenticated','authenticated',now(),'{"full_name":"Client A","role":"admin"}'),
 (b,b||'@example.invalid','authenticated','authenticated',now(),'{"full_name":"Client B"}'),
 (admin,admin||'@example.invalid','authenticated','authenticated',now(),'{"full_name":"Test Admin"}');
 if (select role from public.profiles where id=a)<>'client' then raise exception 'FAIL: user metadata must not set role'; end if;
 update public.profiles set role='admin' where id=admin;
 select id into service from public.services where active limit 1;
 perform set_config('request.jwt.claim.sub',a::text,true);
 execute 'set local role authenticated';
 denied:=false;begin update public.profiles set role='admin' where id=a;exception when insufficient_privilege then denied:=true;end;
 if not denied then raise exception 'FAIL: role escalation'; end if;
 denied:=false;begin perform public.activate_owner();exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: arbitrary owner activation'; end if;
 o:=public.request_quote(service,'Créer un site web pour présenter les services de test.',key);
 if public.request_quote(service,'Créer un site web pour présenter les services de test.',key)<>o then raise exception 'FAIL: idempotency'; end if;
 denied:=false;begin perform public.admin_quote(o,100000,'Un site de test, livraison en dix jours.');exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: client may quote'; end if;
 denied:=false;begin perform public.submit_payment(o,'MTN Mobile Money','TEST-REF');exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: payment before acceptance'; end if;
 perform set_config('request.jwt.claim.sub',b::text,true);
 if exists(select 1 from public.orders where id=o) then raise exception 'FAIL: cross-client order read'; end if;
 if exists(select 1 from public.order_items where order_id=o) then raise exception 'FAIL: cross-client items'; end if;
 denied:=false;begin perform public.respond_quote(o,true);exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: cross-client accept'; end if;
 perform set_config('request.jwt.claim.sub',admin::text,true);
 perform public.admin_quote(o,100000,'Un site de test, livraison en dix jours.');
 perform set_config('request.jwt.claim.sub',a::text,true);
 perform public.respond_quote(o,true);
 p:=public.submit_payment(o,'MTN Mobile Money','TEST-REF');
 if exists(select 1 from public.projects where order_id=o) then raise exception 'FAIL: project before verified payment'; end if;
 denied:=false;begin perform public.admin_verify_payment(p,true);exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: self payment confirmation'; end if;
 denied:=false;begin perform public.submit_payment(o,'MTN Mobile Money','TEST-REF-2');exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: duplicate pending payment'; end if;
 perform set_config('request.jwt.claim.sub',admin::text,true);
 perform public.admin_verify_payment(p,false);
 perform set_config('request.jwt.claim.sub',a::text,true);
 p:=public.submit_payment(o,'MTN Mobile Money','TEST-REF-RETRY');
 perform set_config('request.jwt.claim.sub',admin::text,true);
 perform public.admin_verify_payment(p,true);
 denied:=false;begin perform public.admin_verify_payment(p,true);exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL: double verification'; end if;
 select id into proj from public.projects where order_id=o;
 if proj is null or (select count(*) from public.projects where order_id=o)<>1 then raise exception 'FAIL: project creation'; end if;
 perform public.admin_update_project(proj,'delivered','Livraison de test','Voici le livrable.','https://example.com/test','Livrable test');
 perform set_config('request.jwt.claim.sub',b::text,true);
 if exists(select 1 from public.projects where id=proj) or exists(select 1 from public.deliverables where project_id=proj) or exists(select 1 from public.project_updates where project_id=proj) or exists(select 1 from public.payments where id=p) then raise exception 'FAIL: cross-client project/payment data'; end if;
 perform set_config('request.jwt.claim.sub',a::text,true);
 if not exists(select 1 from public.deliverables where project_id=proj) then raise exception 'FAIL: owner cannot read deliverable'; end if;
 if (select amount_xaf from public.payments where id=p)<>100000 then raise exception 'FAIL: trusted amount'; end if;
 perform set_config('request.jwt.claim.sub',admin::text,true);
 perform public.admin_update_project(proj,'completed','Projet terminé','Le projet est livré et terminé.');
 if (select status from public.orders where id=o)<>'completed' then raise exception 'FAIL: completion sync'; end if;
 execute 'reset role';
end $$;
rollback;
select 'PASS: profile provisioning, metadata isolation, role escalation, ownership RLS, quote idempotency, quote acceptance, payment rejection/retry, verification authorization, no premature project, single project, delivery, completion' as result;

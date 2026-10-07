"use server";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
export async function createQuoteRequest(formData:FormData){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");
 const serviceId=String(formData.get("service_id")||"");
 const brief=String(formData.get("brief")||"").trim();
 if(!serviceId||brief.length<10) redirect("/quotes/new?service="+encodeURIComponent(serviceId)+"&error=brief");
 const orderNumber="Q-"+Date.now().toString(36).toUpperCase();
 const {data,error}=await supabase.from("orders").insert({user_id:user.id,service_id:serviceId,order_number:orderNumber,status:"draft",quote_state:"requested",brief,subtotal_xaf:0,discount_xaf:0,total_xaf:0,currency:"XAF"}).select("id").single();
 if(error) redirect("/quotes/new?service="+encodeURIComponent(serviceId)+"&error=create");
 redirect("/orders/"+data.id);
}
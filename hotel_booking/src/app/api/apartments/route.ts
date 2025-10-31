import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const guests = searchParams.get("guests");

  let query = supabaseServer().from("apartments").select("*");

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (guests) {
    query = query.gte("guests", guests);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("apartments")
    .insert({
      title: body.title,
      description: body.description,
      location: body.location,
      price_per_day: body.price_per_day,
      category_id: body.category_id
    })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, apartment: data });
}

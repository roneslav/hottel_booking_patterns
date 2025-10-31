import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = supabaseServer();

  const { user_id, apartment_id, start_date, end_date } = body;

  const { data: existing } = await supabase
    .from("bookings")
    .select("*")
    .eq("apartment_id", apartment_id)
    .lte("start_date", end_date)
    .gte("end_date", start_date);

  if (existing?.length) {
    return NextResponse.json({ error: "This period is unavailable" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id,
      apartment_id,
      start_date,
      end_date,
      status: "pending"
    })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, booking: data });
}

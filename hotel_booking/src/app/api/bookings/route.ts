import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const supabase = supabaseServer();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apartment_id = searchParams.get("apartment_id");
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");

  if (!apartment_id || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const { data: conflict } = await supabase
    .from("bookings")
    .select("id")
    .eq("apartment_id", apartment_id)
    .lte("start_date", end_date)
    .gte("end_date", start_date);

  return NextResponse.json({ available: !conflict || conflict.length === 0 });
}


export async function POST(req: Request) {
  const body = await req.json();

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

// app/api/user/bookings/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id,
      check_in,
      check_out,
      total_price,
      status,
      guests,
      services,
      apartment_id,
      apartments (
        title,
        city
      )
    `)
    .eq("user_id", user.id)
    .order("check_in", { ascending: false });

    console.log(bookings);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(bookings);
}
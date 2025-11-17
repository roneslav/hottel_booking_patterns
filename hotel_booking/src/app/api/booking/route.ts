// app/api/booking/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    apartment_id,
    check_in,
    check_out,
    guests = 1,
    services = [],
  } = body;

  if (!apartment_id || !check_in || !check_out) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: apartment } = await supabase
    .from("apartments")
    .select("price")
    .eq("id", apartment_id)
    .single();

  if (!apartment) {
    return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
  }

  const nights = Math.max(
    1,
    Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 3600 * 24))
  );

  let total = Number(apartment.price) * Number(nights);

  if (services.length > 0) {
    const { data: selectedServices } = await supabase
      .from("services")
      .select("price")
      .in("id", services);

    if (selectedServices) {
      total += selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
    }
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      apartment_id,
      user_id: user.id,
      check_in,
      check_out,
      guests,
      total_price: total,
      status: "pending",
      services: services.length > 0 ? services : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, booking }, { status: 201 });
}
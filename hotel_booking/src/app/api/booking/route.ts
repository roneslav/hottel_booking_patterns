// app/api/booking/route.ts

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

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

  // Отримуємо ціну апартаментів
  const { data: apartment } = await supabase
    .from("apartments")
    .select("price")
    .eq("id", apartment_id)
    .single();

  if (!apartment) {
    return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
  }

  // Кількість ночей
  const nights = Math.max(
    1,
    Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 3600 * 24))
  );

  let total = Number(apartment.price) * nights;

  // Додаємо ціну послуг
  if (services.length > 0) {
    const { data: selectedServices } = await supabase
      .from("services")
      .select("price")
      .in("id", services);

    if (selectedServices) {
      total += selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
    }
  }

  // Створюємо бронювання
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
    .select("id, total_price")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Додаємо 5% бонусів користувачу
  const bonusPoints = Math.floor(total * 0.05); // 5%

  const { error: bonusError } = await supabase.rpc("add_bonus_points", {
    points: bonusPoints,
  });

  if (bonusError) {
    console.error("Bonus points error:", bonusError);
    // Не ламаємо бронювання, якщо бонуси не нарахувалися
  }

  return NextResponse.json(
    { success: true, booking, bonusPoints },
    { status: 201 }
  );
}
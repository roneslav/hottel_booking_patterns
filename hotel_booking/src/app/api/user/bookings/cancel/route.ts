// app/api/user/bookings/cancel/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { bookingId } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: booking } = await supabase
    .from("bookings")
    .select("user_id, total_price")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);

  // 5% бонусів
  await supabase.rpc("add_bonus_points", {
    user_id: user.id,
    points: Math.floor(booking.total_price * 0.05),
  });

  return NextResponse.json({ success: true });
}
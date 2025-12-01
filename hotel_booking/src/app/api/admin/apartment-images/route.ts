// app/api/admin/apartment-images/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { image_id } = await req.json();

  // Отримуємо шлях до файлу
  const { data: image } = await supabase
    .from("apartment_images")
    .select("image_url")
    .eq("id", image_id)
    .single();

  if (image) {
    const fileName = image.image_url.split("/").pop();
    await supabase.storage.from("apartment-images").remove([fileName!]);
  }

  const { error } = await supabase
    .from("apartment_images")
    .delete()
    .eq("id", image_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
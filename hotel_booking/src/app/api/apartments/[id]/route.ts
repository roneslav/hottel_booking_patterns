import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data: apartment, error } = await supabaseServer()
    .from("apartments")
    .select(`
      *,
      apartment_images (
        id,
        image_url,
        sort_order
      )
    `)
    .eq("id", id)
    .single();

  if (error || !apartment) {
    return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
  }

  // Сортуємо фото за sort_order, потім по ID
  const sortedImages = (apartment.apartment_images || []).sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  // Формуємо масив URL
  const imageUrls = sortedImages.map((img: any) => img.image_url);

  // Повертаємо чистий об'єкт
  const { apartment_images, ...rest } = apartment;

  return NextResponse.json({
    ...rest,
    images: imageUrls.length > 0 ? imageUrls : null,
  });
}
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const city = searchParams.get("city");
//   const guests = searchParams.get("guests");

//   let query = supabaseServer()
//     .from("apartments")
//     .select(`
//       *,
//       apartment_images!left (
//         image_url
//       )
//     `);

//   if (city) {
//     query = query.ilike("city", `%${city}%`);
//   }

//   if (guests) {
//     query = query.gte("guests", Number(guests));
//   }

//   query = query.order("created_at", { ascending: false });

//   const { data: apartments, error } = await query;

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   const result = apartments.map(apartment => {
//     const firstImage = apartment.apartment_images?.[0]?.image_url || null;

//     const { apartment_images, ...rest } = apartment;

//     return {
//       ...rest,
//       imageUrl: firstImage,
//     };
//   });

//   return NextResponse.json(result);
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get("city");
  const guests = searchParams.get("guests");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const extras = searchParams.get("extras"); // наприклад: "WiFi,Parking"

  let query = supabaseServer()
    .from("apartments")
    .select(`
      *,
      categories(name),
      apartment_images!left (image_url)
    `);

  // Фільтри
  if (city) query = query.ilike("city", `%${city}%`);
  if (guests) query = query.gte("guests", Number(guests));
  if (category) query = query.eq("category_id", category);
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));
  if (extras) {
    const extrasList = extras.split(",");
    extrasList.forEach((extra: string) => {
      query = query.contains("amenities", [extra.trim()]);
    });
  }

  query = query.order("created_at", { ascending: false });

  const { data: apartments, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = apartments.map(apartment => {
    const firstImage = apartment.apartment_images?.[0]?.image_url || null;
    const categoryName = apartment.categories?.name || "Standard";

    const { apartment_images, categories, ...rest } = apartment;

    return {
      ...rest,
      imageUrl: firstImage,
      categoryName,
    };
  });

  return NextResponse.json(result);
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

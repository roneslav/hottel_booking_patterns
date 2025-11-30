// app/api/admin/apartments/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient(); // ← await!

  const { data, error } = await supabase
    .from("apartments")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}



// export async function POST(req: Request) {
//   const supabase = await createServerClient();
//   const body = await req.json();

//   const { data, error } = await supabase
//     .from("apartments")
//     .insert(body)
//     .select();

//   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(data[0], { status: 201 });
// }

// export async function PUT(req: Request) {
//   const supabase = await createServerClient();
//   const { id, ...update } = await req.json();

//   const { data, error } = await supabase
//     .from("apartments")
//     .update(update)
//     .eq("id", id)
//     .select();

//   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(data[0]);
// }

export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("apartments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
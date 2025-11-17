// app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET — всі послуги
export async function GET() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — створити
export async function POST(req: Request) {
  const supabase = await createServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("services")
    .insert({
      name: body.name,
      description: body.description,
      price: body.price,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

// PUT — оновити
export async function PUT(req: Request) {
  const supabase = await createServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("services")
    .update({
      name: body.name,
      description: body.description,
      price: body.price,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE — видалити
export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
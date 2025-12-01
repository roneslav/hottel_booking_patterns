// app/api/account/update-profile/route.ts
import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const formData = await req.formData();
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || null;

  if (!name || name.length < 2) {
    return NextResponse.redirect(new URL("/account/profile?error=Name too short", req.url));
  }

  const { error } = await supabase
    .from("users")
    .update({ name, phone, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.redirect(new URL("/account/profile?error=Update failed", req.url));
  }

  return NextResponse.redirect(new URL("/account/profile?success=1", req.url));
}
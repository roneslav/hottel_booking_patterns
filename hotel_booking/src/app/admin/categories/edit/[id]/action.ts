// app/admin/categories/edit/[id]/action.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/dist/client/components/navigation.react-server";


export async function updateCategory(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!name || name.length < 2) {
    return { error: "Назва має містити мінімум 2 символи" };
  }

  const supabase = await createServerClient();
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);

  if (error) return { error: error.message };

  redirect("/admin/categories");
}
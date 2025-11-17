// app/admin/categories/create/action.ts
"use server";

import { redirect } from "next/navigation";

export async function createCategory(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString().trim();

  if (!name || name.length < 2) {
    return { error: "Name must be at least 2 characters long" };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.error || "Creation error" };
  }

  redirect("/admin/categories");
}
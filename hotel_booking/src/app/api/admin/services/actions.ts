// app/api/admin/services/actions.ts
"use server";

import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function createService(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const price = parseFloat(formData.get("price") as string);

  if (!name || name.length < 3) return { error: "Назва має бути мінімум 3 символи" };
  if (isNaN(price) || price <= 0) return { error: "Вкажіть коректну ціну" };

  const res = await fetch(`${API_URL}/api/admin/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, price }),
  });

  if (!res.ok) {
    const err = await res.json();
    return { error: err.error || "Помилка створення" };
  }

  redirect("/admin/services");
}

export async function updateService(prevState: any, formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const price = parseFloat(formData.get("price") as string);

  if (!id) return { error: "ID послуги не вказано" };
  if (!name || name.length < 3) return { error: "Назва має бути мінімум 3 символи" };
  if (isNaN(price) || price <= 0) return { error: "Вкажіть коректну ціну" };

  const res = await fetch(`${API_URL}/api/admin/services`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, description, price }),
  });

  if (!res.ok) {
    const err = await res.json();
    return { error: err.error || "Помилка оновлення" };
  }

  redirect("/admin/services");
}
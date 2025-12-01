// app/admin/apartments/[id]/edit/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import ApartmentForm from "@/components/admin/ApartmentForm";
import { redirect } from "next/navigation";

export default async function EditApartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.is_admin !== true) {
    redirect("/auth/signin");
  }

const { data: apartment, error: aptError } = await supabase
  .from("apartments")
  .select(`
    *,
    categories(name),
    apartment_images (
      id,
      image_url,
      sort_order
    )
  `)
  .eq("id", id)
  .single();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (aptError || !apartment) {
    console.error("Apartment error:", aptError);
    return <p className="text-center text-red-500">Apartment not found</p>;
  }

  if (catError) {
    console.error("Categories error:", catError);
    return <p className="text-center text-red-500">Failed to load categories</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Apartment</h1>
      <ApartmentForm categories={categories} apartment={apartment} />
    </div>
  );
}
// app/admin/apartments/create/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import ApartmentForm from "@/components/admin/ApartmentForm";

export default async function CreateApartment() {
  const supabase = await createServerClient();
  const { data: categories } = await supabase.from("categories").select();
  console.log("Fetched categories:", categories);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Apartment</h1>
      <ApartmentForm categories={categories} />
    </div>
  );
}
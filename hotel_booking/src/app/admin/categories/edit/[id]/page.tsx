// app/admin/categories/edit/[id]/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { updateCategory } from "./action";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) redirect("/auth/signin");

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!category) redirect("/admin/categories");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Edit Category
          </h1>
          <CategoryForm action={updateCategory} initialData={{ name: category.name }} />
        </div>
      </div>
    </div>
  );
}
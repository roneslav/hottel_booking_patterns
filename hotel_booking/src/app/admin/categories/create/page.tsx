// app/admin/categories/create/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "./action";

export default async function CreateCategoryPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.is_admin !== true) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl Mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Create New Category
          </h1>

          <CategoryForm action={createCategory} />
        </div>
      </div>
    </div>
  );
}
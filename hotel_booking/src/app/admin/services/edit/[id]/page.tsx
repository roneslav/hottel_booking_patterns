// app/admin/services/edit/[id]/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) redirect("/auth/signin");

  const { data: service } = await supabase
    .from("services")
    .select("id, name, description, price")
    .eq("id", id)
    .single();

  if (!service) redirect("/admin/services");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Edit Service
          </h1>
          <ServiceForm service={service} />
        </div>
      </div>
    </div>
  );
}
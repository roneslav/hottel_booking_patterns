// app/admin/layout.tsx
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("Redirecting to /auth/signin — no user");
    redirect("/auth/signin");
  }

  const isAdmin = user.user_metadata?.is_admin === true;
  console.log("isAdmin =", isAdmin);

  if (!isAdmin) {
    console.log("Redirecting to / — not admin");
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
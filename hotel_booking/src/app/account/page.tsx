// app/account/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, User, LogOut, Gift } from "lucide-react";

export default async function AccountPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  // Отримуємо профіль + бонуси
  const { data: profile } = await supabase
    .from("users")
    .select("name, bonus_points")
    .eq("id", user.id)
    .single();

  const bonusPoints = profile?.bonus_points || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Welcome back,</h1>
                <p className="text-xl mt-2 opacity-90">{profile?.name || user.email}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Gift className="h-10 w-10 mx-auto mb-2" />
                <p className="text-3xl font-bold">{bonusPoints}</p>
                <p className="text-sm opacity-90">Bonus Points</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/account/bookings" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full group-hover:scale-110 transition">
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">My Bookings</h3>
                  <p className="text-gray-600 dark:text-gray-400">View and manage your trips</p>
                </div>
              </div>
            </Link>

            <Link href="/account/profile" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full group-hover:scale-110 transition">
                  <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Profile</h3>
                  <p className="text-gray-600 dark:text-gray-400">Update personal information</p>
                </div>
              </div>
            </Link>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
              <div className="flex items-center gap-4">
                <Gift className="h-12 w-12" />
                <div>
                  <h3 className="text-2xl font-bold">Loyalty Program</h3>
                  <p className="opacity-90">Earn 1 point per $1 spent</p>
                  <p className="text-sm mt-2">100 points = $10 discount</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
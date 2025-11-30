// app/admin/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const supabase = await createServerClient();

  // Паралельно отримуємо всі метрики
  const [
    { count: apartmentsCount },
    { count: bookingsCount },
    monthlyRevenueResult,
    occupancyResult,
  ] = await Promise.all([
    supabase.from("apartments").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.rpc("get_current_month_revenue").select(),
    supabase.rpc("get_occupancy_rate_30d").select(),
  ]);

  console.log("Monthly Revenue Result:", monthlyRevenueResult);
  console.log("Occupancy Result:", occupancyResult);

  // Явно типізуємо і витягуємо значення
  const monthlyRevenue = Number(monthlyRevenueResult.data?.[0]?.revenue ?? 0);
  const occupancyRate = Number(occupancyResult.data?.[0]?.rate ?? 0);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Кількість апартаментів */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 dark:text-blue-300">Total Apartments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-blue-800 dark:text-blue-200">
              {apartmentsCount ?? 0}
            </p>
          </CardContent>
        </Card>

        {/* Кількість бронювань */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-700 dark:text-emerald-300">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-emerald-800 dark:text-emerald-200">
              {bookingsCount ?? 0}
            </p>
          </CardContent>
        </Card>

        {/* Дохід за місяць */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-700 dark:text-purple-300">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-purple-800 dark:text-purple-200">
              ${(monthlyRevenue).toLocaleString("en-US")}
            </p>
          </CardContent>
        </Card>

        {/* Завантаженість */}
        <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-700 dark:text-orange-300">Occupancy (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-orange-800 dark:text-orange-200">
              {occupancyRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
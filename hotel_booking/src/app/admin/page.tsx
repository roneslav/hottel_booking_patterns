// app/admin/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboard() {
  const supabase = await createServerClient(); // ← await!

  const [
    { count: apartments },
    { count: bookings },
    { data: revenue },
    { data: occupancy },
  ] = await Promise.all([
    supabase.from("apartments").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.rpc("monthly_revenue"),
    supabase.rpc("occupancy_rate"),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Apartments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{apartments || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookings || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${revenue?.[0]?.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{occupancy?.[0]?.rate || 0}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// app/admin/reports/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import ReportsClient from "./ReportsClient";

export const revalidate = 60; // Кеш на 60 секунд

export default async function ReportsPage() {
  const supabase = await createServerClient();

  // 1. Дохід по місяцях — намагаємося взяти з RPC, інакше фолбек
  let monthlyRevenue: { month: string; revenue: number }[] = [];

  try {
    const { data, error } = await supabase.rpc("get_monthly_revenue");
    if (!error && data) {
      monthlyRevenue = data;
    } else {
      throw error;
    }
  } catch {
    monthlyRevenue = await generateMonthlyRevenue(supabase);
  }

  // 2. Завантаженість за останні 30 днів
  const occupancyRate = await calculateOccupancy(supabase);

  // 3. Популярність категорій
  const { data: categoryStats } = await supabase
    .from("bookings")
    .select("apartments!inner(categories(name))");

  const categoryMap = (categoryStats || []).reduce<Record<string, number>>((acc, booking: any) => {
    const name = booking.apartments?.categories?.name || "Без категорії";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 4. Топ-10 клієнтів + загальна статистика
  const { data: topClients } = await supabase
    .from("bookings")
    .select("user_id, total_price, users(name, email)")
    .order("created_at", { ascending: false });

  const clientMap = (topClients || []).reduce<Record<string, any>>((acc, booking: any) => {
    const email = booking.users?.email || "Анонім";
    if (!acc[email]) {
      acc[email] = {
        name: booking.users?.name || email.split("@")[0],
        email,
        bookings: 0,
        spent: 0,
      };
    }
    acc[email].bookings += 1;
    acc[email].spent += Number(booking.total_price || 0);
    return acc;
  }, {} as Record<string, any>);

  const top10Clients = Object.values(clientMap)
    .sort((a: any, b: any) => b.spent - a.spent)
    .slice(0, 10);

  const totalBookings = topClients?.length || 0;
  const totalRevenue = topClients?.reduce((sum, b: any) => sum + Number(b.total_price || 0), 0) || 0;
  const avgCheck = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <ReportsClient
      monthlyRevenue={monthlyRevenue}
      occupancyRate={occupancyRate}
      categoryData={categoryData}
      top10Clients={top10Clients}
      totalBookings={totalBookings}
      avgCheck={avgCheck}
    />
  );
}

// Фолбек: дохід по місяцях без RPC
async function generateMonthlyRevenue(supabase: any) {
  const { eachMonthOfInterval, subMonths, startOfMonth, endOfMonth, format } = await import("date-fns");

  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date(),
  });

  const results = await Promise.all(
    months.map(async (month) => {
      const from = startOfMonth(month).toISOString();
      const to = endOfMonth(month).toISOString();

      const { data } = await supabase
        .from("bookings")
        .select("total_price")
        .gte("created_at", from)
        .lte("created_at", to);

      const revenue = data?.reduce((sum: number, booking: any) => sum + Number(booking.total_price || 0), 0) || 0;

      return {
        month: format(month, "MMM yyyy"),
        revenue,
      };
    })
  );

  return results;
}

// Завантаженість (відсоток зайнятих ночей за 30 днів)
async function calculateOccupancy(supabase: any): Promise<number> {
  const days = 30;
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  // Отримуємо всі бронювання, які перетинаються з періодом
  const { data: bookings } = await supabase
    .from("bookings")
    .select("check_in, check_out")
    .or(
      `and(check_in.gte.${startDate.toISOString()},check_in.lte.${endDate.toISOString()}),` +
      `and(check_out.gte.${startDate.toISOString()},check_out.lte.${endDate.toISOString()}),` +
      `and(check_in.lte.${startDate.toISOString()},check_out.gte.${endDate.toISOString()})`
    );

  let bookedNights = 0;

  bookings?.forEach((b: any) => {
    const checkIn = new Date(b.check_in);
    const checkOut = new Date(b.check_out);

    const periodStart = checkIn < startDate ? startDate : checkIn;
    const periodEnd = checkOut > endDate ? endDate : checkOut;

    if (periodStart < periodEnd) {
      bookedNights += Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 3600 * 24));
    }
  });

  const { count } = await supabase
    .from("apartments")
    .select("*", { count: "exact", head: true });

  const totalPossibleNights = (count || 1) * days;

  return totalPossibleNights > 0 ? Number(((bookedNights / totalPossibleNights) * 100).toFixed(1)) : 0;
}
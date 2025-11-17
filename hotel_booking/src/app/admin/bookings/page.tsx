// app/admin/bookings/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { format } from "date-fns";

export default async function BookingsPage() {
  const supabase = await createServerClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      check_in,
      check_out,
      total_price,
      status,
      apartments(title),
      profiles:users(name, email)
    `)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Apartment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {bookings?.map((b: any) => (
              <tr key={b.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {b.profiles?.name || b.profiles?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {b.apartments?.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {format(new Date(b.check_in), "dd MMM")} - {format(new Date(b.check_out), "dd MMM yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ${b.total_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    b.status === "confirmed" ? "bg-green-100 text-green-800" :
                    b.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
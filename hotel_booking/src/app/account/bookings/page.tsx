// app/account/bookings/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Users, DollarSign, Home, AlertCircle } from "lucide-react";

type Booking = {
  id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  guests: number;
  apartments: {
    title: string;
    city: string;
    imageUrl?: string;
  };
};

export default async function MyBookingsPage() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id,
      check_in,
      check_out,
      total_price,
      status,
      guests,
      apartments (
        title,
        city      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
  }

  const upcoming = bookings?.filter(b => new Date(b.check_in) >= new Date()) || [];
  const past = bookings?.filter(b => new Date(b.check_in) < new Date()) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          My Bookings
        </h1>

        {/* If there are no bookings */}
        {(!bookings || bookings.length === 0) && (
          <div className="text-center py-20">
            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              You have no bookings yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start your journey with us today!
            </p>
            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              <Home className="h-5 w-5" />
              Search Apartments
            </Link>
          </div>
        )}

        {/* Upcoming Bookings */}
        {upcoming.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Upcoming Trips
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
              ))}
            </div>
          </section>
        )}

        {/* Минулі бронювання */}
        {past.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Past Trips
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) {
  const nights = Math.ceil(
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 3600 * 24)
  );

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }[booking.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Зображення */}
      <div className="relative h-48 bg-gray-200">
        {booking.apartments.imageUrl ? (
          <img
            src={booking.apartments.imageUrl}
            alt={booking.apartments.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {booking.status === "pending" && "Pending"}
            {booking.status === "confirmed" && "Confirmed"}
            {booking.status === "cancelled" && "Cancelled"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {booking.apartments.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" />
            {booking.apartments.city}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            {format(new Date(booking.check_in), "d MMM")} – {format(new Date(booking.check_out), "d MMM yyyy")}
            <span className="text-gray-500">· {nights} {nights === 1 ? "night" : "nights"}</span>
          </p>
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Users className="h-4 w-4" />
            {booking.guests} {booking.guests === 1 ? "guest" : booking.guests < 5 ? "guests" : "guests"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${booking.total_price}
            </span>
          </div>

          {isUpcoming && booking.status === "pending" && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Pending confirmation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
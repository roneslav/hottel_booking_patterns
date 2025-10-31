// app/book/apartment/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Calendar, Users, ChevronLeft, AlertCircle } from "lucide-react";
import { format } from "date-fns";

type Apartment = {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  guests?: number;
};

async function getApartment(id: string): Promise<Apartment> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apartments/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export default async function BookApartmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const checkIn = query.checkIn;
  const checkOut = query.checkOut;
  const guests = query.guests ? parseInt(query.guests, 10) : undefined;

  if (!checkIn || !checkOut || !guests) {
    redirect(`/apartments/${id}`);
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
    redirect(`/apartments/${id}`);
  }

  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  let apartment: Apartment;
  try {
    apartment = await getApartment(id);
  } catch {
    notFound();
  }

  const totalPrice = apartment.price * nights;

  // Перевірка авторизації
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/auth/signin?redirectTo=/book/apartment/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  }

  // Перевірка доступності
  const { data: conflict } = await supabase
    .from("bookings")
    .select("id")
    .eq("apartment_id", id)
    .lte("start_date", checkOut)
    .gte("end_date", checkIn);

  const isAvailable = !conflict || conflict.length === 0;

  const handleBooking = async () => {
    "use server";
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/book-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        apartment_id: parseInt(id),
        start_date: checkIn,
        end_date: checkOut,
      }),
    });

    const result = await res.json();

    if (result.success) {
      redirect(`/booking/confirmation?bookingId=${result.booking[0].id}`);
    } else {
      return result.error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-blue-700 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href={`/apartments/${id}`} className="text-blue-100 hover:text-white flex items-center gap-1 text-sm">
            <ChevronLeft className="h-4 w-4" />
            Back to apartment
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Confirm Your Booking</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ліворуч — інформація */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">{apartment.title}</h2>
              {apartment.imageUrl && (
                <img src={apartment.imageUrl} alt={apartment.title} className="w-full h-48 object-cover rounded-md mt-3" />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                  <p className="font-medium">{format(checkInDate, "dd MMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                  <p className="font-medium">{format(checkOutDate, "dd MMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guests</p>
                  <p className="font-medium">{guests} guest{guests > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>${apartment.price} × {nights} nights</span>
                  <span>${apartment.price * nights}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Праворуч — форма */}
          <div>
            <form action={handleBooking} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
              {!isAvailable && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300">
                    These dates are no longer available. Please choose different dates.
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking for</p>
                <p className="font-medium">{user.email}</p>
              </div>

              <button
                type="submit"
                disabled={!isAvailable}
                className={`w-full py-3 rounded-md font-semibold transition-all ${
                  isAvailable
                    ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isAvailable ? "Confirm & Pay" : "Unavailable"}
              </button>

              <p className="text-xs text-center text-gray-500">
                You won't be charged yet
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
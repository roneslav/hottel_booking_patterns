// app/account/bookings/page.tsx

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { Calendar, MapPin, Users, Home, XCircle, Clock, Package, ArrowLeft } from "lucide-react";

async function cancelBooking(formData: FormData) {
  "use server";
  const supabase = await createServerClient();
  const bookingId = formData.get("bookingId") as string;

  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);

  const { data: booking } = await supabase
    .from("bookings")
    .select("total_price")
    .eq("id", bookingId)
    .single();

  if (booking) {
    await supabase.rpc("add_bonus_points", {
      points: Math.floor(booking.total_price * 0.05),
    });
  }

  redirect("/account/bookings");
}

export default async function MyBookingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  // Головний запит — витягуємо apartment_images разом з апартаментами
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      check_in,
      check_out,
      total_price,
      status,
      guests,
      services,
      apartments (
        id,
        title,
        city,
        apartment_images!left (image_url)
      )
    `)
    .eq("user_id", user.id)
    .order("check_in", { ascending: false });

  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 text-center">
        <Calendar className="h-20 w-20 mx-auto text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold mb-4">No bookings yet</h2>
        <Link href="/apartments" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg inline-flex items-center gap-2">
          <Home className="h-5 w-5" /> Browse Apartments
        </Link>
      </div>
    );
  }

  // Створюємо мапу: apartment_id → перше фото
  const apartmentImagesMap = new Map<string, string>();
  bookings.forEach((booking: any) => {
    const images = booking.apartments?.apartment_images;
    if (Array.isArray(images) && images.length > 0 && images[0].image_url) {
      apartmentImagesMap.set(booking.apartments.id, images[0].image_url);
    }
  });

  // Послуги
  const serviceIds = [...new Set(bookings.flatMap(b => JSON.parse(b.services || "[]")))];
  const { data: services = [] } = serviceIds.length > 0
    ? await supabase.from("services").select("id, name").in("id", serviceIds)
    : { data: [] };

  const serviceMap = Object.fromEntries(services?.map(s => [s.id, s.name]) || []);

  const now = new Date();
  const upcoming = bookings.filter((b: any) => new Date(b.check_in) >= now && b.status !== "cancelled");
  const past = bookings.filter((b: any) => new Date(b.check_in) < now || b.status === "cancelled");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">

      <div className="max-w-7xl mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Account
        </Link>
        <h1 className="text-4xl font-bold mb-10">My Bookings</h1>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="h-7 w-7 text-blue-600" />
              Upcoming Trips
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((booking: any) => {
                const apartment = booking.apartments;
                const imageUrl = apartmentImagesMap.get(apartment.id);
                const nights = differenceInDays(new Date(booking.check_out), new Date(booking.check_in));
                const canCancel = new Date(booking.check_in) > new Date(Date.now() + 48 * 60 * 60 * 1000);
                const selectedServices = JSON.parse(booking.services || "[]")
                  .map((id: string) => serviceMap[id])
                  .filter(Boolean);

                return (
                  <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
                    <div className="h-56 relative">
                      {imageUrl ? (
                        <img src={imageUrl} alt={apartment.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <Home className="h-20 w-20 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{apartment.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {apartment.city}
                        </p>
                      </div>

                      <div className="space-y-3 text-sm">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          {format(new Date(booking.check_in), "dd MMM")} – {format(new Date(booking.check_out), "dd MMM yyyy")}
                          <span className="text-gray-500 ml-2">· {nights} night{nights > 1 ? "s" : ""}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                        </p>
                        {selectedServices.length > 0 && (
                          <p className="flex items-start gap-2">
                            <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                            <span>{selectedServices.join(", ")}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="text-sm text-gray-500">Total paid</p>
                          <p className="text-3xl font-bold">${booking.total_price}</p>
                        </div>

                        {canCancel && (
                          <form action={cancelBooking}>
                            <input type="hidden" name="bookingId" value={booking.id} />
                            <button type="submit" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 hover:underline hover:cursor-pointer">
                              <XCircle className="h-5 w-5" />
                              Cancel
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Past Trips</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((booking: any) => {
                const apartment = booking.apartments;
                const imageUrl = apartmentImagesMap.get(apartment.id);

                return (
                  <div key={booking.id} className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden opacity-85">
                    <div className="h-48 relative">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" className="w-full h-full object-cover brightness-75" />
                      ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
                      )}
                      {booking.status === "cancelled" && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">Cancelled</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg">{apartment.title}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(booking.check_in), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
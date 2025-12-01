// app/booking/apartment/[id]/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: apartment } = await supabase
    .from("apartments")
    .select("id, title, price, guests, city")
    .eq("id", id)
    .single();

  if (!apartment) redirect("/apartments");

  const { data: services } = await supabase.from("services").select("id, name, price");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Book: {apartment.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <BookingForm apartment={apartment} services={services || []} user={user} />
          </div>

          {/* Динамічний підсумок */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Booking Summary
              </h2>
              <div id="booking-summary" className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between text-sm">
                  <span>Dates:</span>
                  <span id="summary-dates" className="font-medium">Not selected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Number of nights:</span>
                  <span id="summary-nights" className="font-medium">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Guests:</span>
                  <span id="summary-guests" className="font-medium">1</span>
                </div>
                <div id="summary-services" className="text-sm hidden">
                  <span>Services:</span>
                  <ul id="services-list" className="mt-1 space-y-1"></ul>
                </div>
                <hr className="my-4 border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span id="total-price">$0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
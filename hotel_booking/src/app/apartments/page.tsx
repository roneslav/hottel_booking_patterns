import Link from "next/link";
import { MapPin, Home, Star } from "lucide-react";
import SearchForm from "@/components/forms/SearchForm";

type Apartment = {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  city?: string;
  rating?: number;
};

async function getApartments(searchParams: URLSearchParams) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apartments`);
  searchParams.forEach((value, key) => url.searchParams.set(key, value));
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

export default async function ApartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const params = new URLSearchParams();
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value) params.set(key, Array.isArray(value) ? value[0] : value);
  });

  const apartments: Apartment[] = await getApartments(params);

  const city = resolvedParams.city as string | undefined;
  const checkIn = resolvedParams.checkIn as string | undefined;
  const checkOut = resolvedParams.checkOut as string | undefined;
  const guests = (resolvedParams.guests as string | undefined) || "1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <header className="bg-blue-700 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {city ? `Apartments in ${city}` : "Find your perfect apartment"}
          </h1>
          <p className="mt-3 text-lg md:text-xl text-blue-100">
            {checkIn && checkOut
              ? `${checkIn} — ${checkOut} · ${guests} ${guests === "1" ? "guest" : "guests"}`
              : "Cozy homes, modern apartments, and more..."}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <SearchForm
          defaultCity={city}
          defaultCheckIn={checkIn}
          defaultCheckOut={checkOut}
          defaultGuests={guests}
        />
      </div>

      {/* Apartments Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {apartments.length} {apartments.length === 1 ? "Apartment" : "Apartments"} Available
          </h2>
        </div>

        {apartments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No apartments found{city && ` in "${city}"`}.
            </p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apartment) => (
              <div
                key={apartment.id}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  {apartment.imageUrl ? (
                    <img
                      src={apartment.imageUrl}
                      alt={apartment.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-500">
                      <Home className="h-12 w-12 mb-2" />
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/apartments/${apartment.id}?${params.toString()}`}>
                      {apartment.title}
                    </Link>
                  </h3>

                  {apartment.city && (
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {apartment.city}
                    </p>
                  )}

                  {apartment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {apartment.description}
                    </p>
                  )}

                  {apartment.rating !== undefined && (
                    <div className="flex items-center gap-1 mt-3">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {apartment.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">(reviews)</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-5">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${apartment.price}
                      </span>
                      <span className="text-sm text-gray-500"> / night</span>
                    </div>
                    <Link
                      href={`/apartments/${apartment.id}?${params.toString()}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md transition-all transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
// app/apartments/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, Home, Wifi, Car, Coffee, Users, Calendar, ChevronLeft } from "lucide-react";
import { useSearch } from "@/lib/searchContext/SearchContext";
import BookingCard from "@/components/booking/BookingCard";

type Apartment = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  images?: string[];
  city: string;
  address?: string;
  rating?: number;
  reviewsCount?: number;
  amenities?: string[];
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
};

async function getApartment(id: string): Promise<Apartment> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apartments/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Not found");
    throw new Error("Failed to fetch");
  }

  return res.json();
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export default async function ApartmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const checkIn = query.checkIn;
  const checkOut = query.checkOut;
  const guests = query.guests ? parseInt(query.guests, 10) : undefined;

  const checkInStr = checkIn ? formatDate(checkIn) : "";
  const checkOutStr = checkOut ? formatDate(checkOut) : "";
  const dateRange = checkInStr && checkOutStr ? `${checkInStr} — ${checkOutStr}` : "Check-in — Check-out";

  let apartment: Apartment;

  try {
    apartment = await getApartment(id);
  } catch (err) {
    notFound();
  }

  const images = apartment.images || (apartment.imageUrl ? [apartment.imageUrl] : []);
  const rating = apartment.rating || 0;
  const reviewsCount = apartment.reviewsCount || 0;
  const displayGuests = guests ?? apartment.guests ?? 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-blue-700 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/apartments" className="text-blue-100 hover:text-white flex items-center gap-1 text-sm">
            <ChevronLeft className="h-4 w-4" />
            Back to apartments
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title & Rating */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {apartment.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="h-5 w-5" />
              {apartment.city}{apartment.address ? `, ${apartment.address}` : ""}
            </p>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900 dark:text-white">{rating}</span>
                <span className="text-sm text-gray-500">({reviewsCount} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {images.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-4 mb-8 h-96 md:h-[500px] rounded-xl overflow-hidden shadow-xl">
              {/* Головне фото — займає ліву половину */}
              <div className="col-span-4 md:col-span-2 row-span-2">
                <img
                  src={images[0]}
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Решта 4 фото справа */}
              {images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className={`${i === 3 ? "relative" : ""} overflow-hidden`}
                >
                  <img
                    src={img}
                    alt={`${apartment.title} - ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {i === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button
                        onClick={() => alert("Full gallery coming soon!")} // або модалка
                        className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                      >
                        +{images.length - 5} more
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Home className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {apartment.description && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">About this place</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {apartment.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {apartment.amenities && apartment.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-3">
                  {apartment.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      {amenity === "WiFi" && <Wifi className="h-5 w-5 text-blue-600" />}
                      {amenity === "Parking" && <Car className="h-5 w-5 text-green-600" />}
                      {amenity === "Kitchen" && <Coffee className="h-5 w-5 text-orange-600" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guest Info */}
            {(apartment.guests || apartment.bedrooms || apartment.beds || apartment.bathrooms) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Sleeps</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {apartment.guests && (
                    <div>
                      <Users className="h-8 w-8 mx-auto text-blue-600 mb-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Guests</p>
                      <p className="font-semibold">{apartment.guests}</p>
                    </div>
                  )}
                  {apartment.bedrooms && (
                    <div>
                      <Home className="h-8 w-8 mx-auto text-purple-600 mb-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                      <p className="font-semibold">{apartment.bedrooms}</p>
                    </div>
                  )}
                  {apartment.beds && (
                    <div>
                      <div className="h-8 w-8 mx-auto bg-gray-300 dark:bg-gray-600 rounded mb-1 flex items-center justify-center">
                        <span className="text-xs font-bold">Bed</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Beds</p>
                      <p className="font-semibold">{apartment.beds}</p>
                    </div>
                  )}
                  {apartment.bathrooms && (
                    <div>
                      <div className="h-8 w-8 mx-auto bg-blue-100 dark:bg-blue-900 rounded mb-1 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-300">Bath</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                      <p className="font-semibold">{apartment.bathrooms}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Where you'll be</h2>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <MapPin className="h-12 w-12 text-blue-600" />
                <span className="ml-2 text-gray-600">Map coming soon</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {apartment.city}{apartment.address ? `, ${apartment.address}` : ""}
              </p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard
              apartmentId={apartment.id}
              price={apartment.price}
              maxGuests={apartment.guests || 4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
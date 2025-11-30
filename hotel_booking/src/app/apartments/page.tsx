// app/apartments/page.tsx
// НЕ додавай "use client" — це серверний компонент!

import Link from "next/link";
import { MapPin, Home, Star, Users } from "lucide-react";
import SearchForm from "@/components/forms/SearchForm";
import { redirect } from "next/navigation";

type Apartment = {
  id: string;
  title: string;
  city: string;
  price: number;
  guests: number;
  imageUrl?: string | null;
  description?: string;
  categoryName: string;
  amenities?: string[];
};

async function getApartments(searchParams: URLSearchParams) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apartments`);
  searchParams.forEach((value, key) => url.searchParams.append(key, value));
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, { next: { revalidate: 3600 } });
  return res.ok ? res.json() : [];
}

// Ось правильний Server Action!
async function applyFilters(formData: FormData) {
  "use server";

  const params = new URLSearchParams();

  // Обробляємо звичайні поля
  const category = formData.get("category");
  const minPrice = formData.get("minPrice");
  const maxPrice = formData.get("maxPrice");
  const guests = formData.get("guests");

  if (category) params.set("category", category.toString());
  if (minPrice) params.set("minPrice", minPrice.toString());
  if (maxPrice) params.set("maxPrice", maxPrice.toString());
  if (guests) params.set("guests", guests.toString());

  // Обробляємо чекбокси extras (може бути кілька)
  const extras = formData.getAll("extras");
  if (extras.length > 0) {
    params.set("extras", extras.join(","));
  }

  redirect(`/apartments?${params.toString()}`);
}

export default async function ApartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) urlParams.set(k, Array.isArray(v) ? v[0] : v);
  });

  const apartments: Apartment[] = await getApartments(urlParams);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">Find Your Perfect Room</h1>
          <p className="mt-4 text-xl opacity-90">Comfortable stays at great prices</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 mb-8">
        <SearchForm />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ФІЛЬТРИ — тепер з правильним Server Action */}
          <aside className="lg:col-span-1">
            <form action={applyFilters} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8 sticky top-6">
              <h3 className="text-xl font-bold">Filters</h3>

              {/* Категорія */}
              <div>
                <h4 className="font-semibold mb-3">Room Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="category" value="" defaultChecked={!params.category} className="w-4 h-4 text-blue-600" />
                    <span>All types</span>
                  </label>
                  {categories.map((cat: any) => (
                    <label key={cat.id} className="flex items-center gap-3">
                      <input type="radio" name="category" value={cat.id} defaultChecked={params.category === cat.id} className="w-4 h-4 text-blue-600" />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ціна */}
              <div>
                <h4 className="font-semibold mb-3">Price per night ($)</h4>
                <div className="flex gap-2">
                  <input type="number" name="minPrice" placeholder="Min" defaultValue={params.minPrice as string} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
                  <span className="self-center">—</span>
                  <input type="number" name="maxPrice" placeholder="Max" defaultValue={params.maxPrice as string} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
                </div>
              </div>

              {/* Гості */}
              <div>
                <h4 className="font-semibold mb-3">Guests</h4>
                <select name="guests" defaultValue={params.guests || ""} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                  <option value="">Any</option>
                  {[1,2,3,4].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Список апартаментів */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold mb-8">
              {apartments.length} {apartments.length === 1 ? "room" : "rooms"} available
            </h2>

            {apartments.length === 0 ? (
              <div className="text-center py-20">
                <Home className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No rooms found</p>
                <p className="text-gray-400">Try adjusting filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {apartments.map((apt) => (
                  <Link key={apt.id} href={`/apartments/${apt.id}?${urlParams.toString()}`} className="block group">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                      <div className="h-64 relative">
                        {apt.imageUrl ? (
                          <img src={apt.imageUrl} alt={apt.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Home className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {apt.categoryName}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold group-hover:text-blue-600 transition">{apt.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-2">
                          <MapPin className="w-4 h-4" /> {apt.city}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {apt.guests} guests</span>
                        </div>
                        <div className="flex justify-between items-end mt-6">
                          <div>
                            <span className="text-3xl font-bold">${apt.price}</span>
                            <span className="text-gray-500"> / night</span>
                          </div>
                          <span className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                            View Room
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
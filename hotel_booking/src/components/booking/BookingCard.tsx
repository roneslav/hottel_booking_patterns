// components/booking/BookingCard.tsx
"use client";

import { useSearch } from "@/lib/searchContext/SearchContext";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";

type Props = {
  apartmentId: string;
  price: number;
  maxGuests?: number;
};

export default function BookingCard({ apartmentId, price, maxGuests = 10 }: Props) {
  const { search, updateSearch } = useSearch();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg sticky top-6">
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          ${price}
        </span>
        <span className="text-gray-500">/ night</span>
      </div>

      <div className="space-y-4">
        {/* Дати */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Check in</label>
            <input
              type="date"
              value={search.checkIn}
              onChange={(e) => updateSearch({ checkIn: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Check out</label>
            <input
              type="date"
              value={search.checkOut}
              onChange={(e) => updateSearch({ checkOut: e.target.value })}
              min={search.checkIn || new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">Guests</label>
          <select
            value={search.guests}
            onChange={(e) => updateSearch({ guests: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          >
            {[...Array(maxGuests)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "guest" : i < 4 ? "guests" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Link
        href={`/booking/apartment/${apartmentId}`}
        className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md text-center transition-all transform hover:scale-105"
      >
        Book
      </Link>

      <p className="text-xs text-center text-gray-500 mt-3">
        You will not be charged now.
      </p>
    </div>
  );
}
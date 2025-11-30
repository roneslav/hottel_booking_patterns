"use client";

import { useSearch } from "@/lib/searchContext/SearchContext";
import { Search, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const { search, updateSearch } = useSearch();
  const [showGuests, setShowGuests] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.city) params.set("city", search.city);
    if (search.checkIn) params.set("checkIn", search.checkIn);
    if (search.checkOut) params.set("checkOut", search.checkOut);
    if (search.guests > 1) params.set("guests", search.guests.toString());

    router.push(`/apartments?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-4 border-4 border-yellow-400">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="City"
            value={search.city}
            onChange={(e) => updateSearch({ city: e.target.value })}
            className="w-full pl-10 pr-3 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={search.checkIn}
            onChange={(e) => updateSearch({ checkIn: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full pl-10 pr-3 py-3 text-gray-900 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={search.checkOut}
            onChange={(e) => updateSearch({ checkOut: e.target.value })}
            min={search.checkIn || new Date().toISOString().split("T")[0]}
            className="w-full pl-10 pr-3 py-3 text-gray-900 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        <div className="relative">
          <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowGuests(!showGuests)}
            className="w-full pl-10 pr-3 py-3 text-left text-gray-900 bg-transparent focus:outline-none"
          >
            {search.guests} {search.guests === 1 ? "гість" : search.guests < 5 ? "гості" : "гостей"}
          </button>

          {showGuests && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Adults</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateSearch({ guests: Math.max(1, search.guests - 1) })} className="w-8 h-8 rounded-full border hover:bg-gray-100">-</button>
                  <span className="w-8 text-center">{search.guests}</span>
                  <button type="button" onClick={() => updateSearch({ guests: Math.min(10, search.guests + 1) })} className="w-8 h-8 rounded-full border hover:bg-gray-100">+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-all transform hover:scale-105"
        >
          Search
        </button>
      </div>
    </form>
  );
}
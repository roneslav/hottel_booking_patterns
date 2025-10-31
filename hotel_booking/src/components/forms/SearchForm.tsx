"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Users } from "lucide-react";

type SearchFormProps = {
  defaultCity?: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: string;
};

export default function SearchForm({
  defaultCity = "",
  defaultCheckIn = "",
  defaultCheckOut = "",
  defaultGuests = "1",
}: SearchFormProps) {
  const [city, setCity] = useState(defaultCity);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(Number(defaultGuests));
  const [showGuests, setShowGuests] = useState(false);

  useEffect(() => {
    setCity(defaultCity);
    setCheckIn(defaultCheckIn);
    setCheckOut(defaultCheckOut);
    setGuests(Number(defaultGuests) || 1);
  }, [defaultCity, defaultCheckIn, defaultCheckOut, defaultGuests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 1) params.set("guests", guests.toString());

    window.location.href = `/apartments?${params.toString()}`;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-4 border-4 border-yellow-400">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* City */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-3 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
          />
        </div>

        {/* Check-in */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full pl-10 pr-3 py-3 text-gray-900 bg-transparent focus:outline-none cursor-pointer"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Check-out */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full pl-10 pr-3 py-3 text-gray-900 bg-transparent focus:outline-none cursor-pointer"
            min={checkIn || new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Guests */}
        <div className="relative">
          <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowGuests(!showGuests)}
            className="w-full pl-10 pr-3 py-3 text-left text-gray-900 bg-transparent focus:outline-none"
          >
            {guests} {guests === 1 ? "guest" : "guests"}
          </button>

          {showGuests && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    disabled={guests <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(4, guests + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    disabled={guests >= 4}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Max 4 adults</p>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="mt-4 w-full md:w-auto md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-all transform hover:scale-105"
        >
          Search
        </button>
      </div>
    </form>
  );
}
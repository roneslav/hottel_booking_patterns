// components/booking/BookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/lib/searchContext/SearchContext";

export default function BookingForm({ apartment, services }: any) {
  const router = useRouter();
  const { search, updateSearch } = useSearch();
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Оновлення підсумку при зміні
  useEffect(() => {
    updateSummary();
  }, [search.checkIn, search.checkOut, search.guests, selectedServices]);

  const updateSummary = () => {
    const datesEl = document.getElementById("summary-dates");
    const nightsEl = document.getElementById("summary-nights");
    const guestsEl = document.getElementById("summary-guests");
    const totalEl = document.getElementById("total-price");
    const servicesEl = document.getElementById("summary-services");
    const servicesList = document.getElementById("services-list");

    if (!search.checkIn || !search.checkOut) {
      if (datesEl) datesEl.textContent = "Not selected";
      if (nightsEl) nightsEl.textContent = "-";
      if (totalEl) totalEl.textContent = "$0";
      if (servicesEl) servicesEl.classList.add("hidden");
      return;
    }

    const inDate = new Date(search.checkIn);
    const outDate = new Date(search.checkOut);
    const nights = Math.max(1, Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24)));

    const apartmentCost = Number(apartment.price) * Number(nights);
    let servicesCost = 0;
    const selected = services.filter((s: any) => selectedServices.includes(s.id));
    selected.forEach((s: any) => servicesCost += s.price);

    const total = Number(apartmentCost) + Number(servicesCost);

    // Оновлюємо DOM
    if (datesEl) datesEl.textContent = `${inDate.toLocaleDateString("uk-UA")} – ${outDate.toLocaleDateString("uk-UA")}`;
    if (nightsEl) nightsEl.textContent = `${nights} ${nights === 1 ? "night" : nights < 5 ? "nights" : "nights"}`;
    if (guestsEl) guestsEl.textContent = search.guests.toString();
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    if (selected.length > 0 && servicesList) {
      servicesList.innerHTML = selected.map((s: any) => `
        <li class="flex justify-between">
          <span>${s.name}</span>
          <span class="font-medium">$${s.price}</span>
        </li>
      `).join("");
      if (servicesEl) servicesEl.classList.remove("hidden");
    } else {
      if (servicesEl) servicesEl.classList.add("hidden");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.checkIn || !search.checkOut || new Date(search.checkOut) <= new Date(search.checkIn)) {
      alert("Please select valid dates");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apartment_id: apartment.id,
        check_in: search.checkIn,
        check_out: search.checkOut,
        guests: search.guests,
        services: selectedServices,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.bonusPoints > 0) {
        alert(`Booking successful! You have earned ${result.bonusPoints} bonus points!`);
      } else {
        alert("Booking successful!");
      }
      router.push("/booking/success");
    } else {
      const err = await res.json();
      alert(err.error || "Booking error");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
      {/* Твій попередній код форми без змін */}
      <div>
        <label className="block text-sm font-medium mb-2">Check-in</label>
        <input type="date" required disabled value={search.checkIn} className="w-full px-4 py-3 border rounded-md dark:bg-gray-700" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Check-out</label>
        <input type="date" required disabled value={search.checkOut} className="w-full px-4 py-3 border rounded-md dark:bg-gray-700" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Number of guests</label>
        <select value={search.guests} disabled className="w-full px-4 py-3 border rounded-md dark:bg-gray-700">
          {[...Array(apartment.guests || 6)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? (i > 3 ? "s" : "s") : ""}</option>
          ))}
        </select>
      </div>

      {services.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Additional Services</label>
          <div className="space-y-2">
            {services.map((s: any) => (
              <label key={s.id} className="flex items-center gap-3 cursor-pointer">
                <input
                      type="checkbox"
                      checked={selectedServices.includes(s.id)}
                      onChange={(e) => {
                        setSelectedServices(prev =>
                          e.target.checked ? [...prev, s.id] : prev.filter(id => id !== s.id)
                        );
                      }}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                <span>{s.name} — ${s.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !search.checkIn || !search.checkOut}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-md text-lg transition"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
}
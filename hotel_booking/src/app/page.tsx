"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Star, Check, Globe, Headphones, Shield } from "lucide-react";
import SearchForm from "@/components/forms/SearchForm";

export default function Home() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [showGuests, setShowGuests] = useState(false);

  const handleSearch = () => {
    if (!city.trim()) return;

    const params = new URLSearchParams();
    params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (adults > 1) params.set("guests", adults.toString());

    router.push(`/apartments?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <header className="bg-blue-700 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Find your next stay
          </h1>
          <p className="mt-3 text-lg md:text-xl text-blue-100">
            Search deals on hotels, homes, and much more...
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
          <SearchForm />
      </div>

      {/* Why Book With Us */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
          Why book with us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Shield className="h-10 w-10 text-orange-500" />, title: "Book now, pay at the property", subtitle: "FREE cancellation on most rooms" },
            { icon: <Check className="h-10 w-10 text-blue-600" />, title: "300M+ reviews from fellow travelers", subtitle: "Get trusted information from guests like you" },
            { icon: <Globe className="h-10 w-10 text-green-600" />, title: "2+ million properties worldwide", subtitle: "Hotels, guest houses, apartments, and more" },
            { icon: <Headphones className="h-10 w-10 text-purple-600" />, title: "Trusted 24/7 customer service", subtitle: "We're always here to help" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
// app/admin/services/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/services")
      .then(r => r.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Error loading services");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete service?")) return;

    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices(services.filter(s => s.id !== id));
    } else {
      alert("Failed to delete");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Additional Services</h1>
        <Link href="/admin/services/create" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          + Add Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No services</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{service.icon}</span>
                <h3 className="text-xl font-semibold">{service.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description || "Без опису"}</p>
              <p className="text-2xl font-bold text-green-600">${service.price}</p>

              <div className="mt-6 flex gap-3">
                <Link href={`/admin/services/edit/${service.id}`} className="text-blue-600 hover:underline text-sm">
                  Edit
                </Link>
                <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
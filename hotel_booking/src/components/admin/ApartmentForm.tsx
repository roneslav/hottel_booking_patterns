// components/admin/ApartmentForm.tsx
"use client";
import { useRouter } from "next/navigation";

export default function ApartmentForm({ categories, apartment }: { categories: any[] | null; apartment?: any }) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch(
      apartment ? `/api/admin/apartments` : `/api/admin/apartments`,
      {
        method: apartment ? "PUT" : "POST",
        body: JSON.stringify(apartment ? { id: apartment.id, ...data } : data),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      router.push("/admin/apartments");
      router.refresh();
    }
  };

  // ЗАХИСТ ВІД null
  if (!categories) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{apartment ? "Edit Apartment" : "Create Apartment"}</h2>

      <input
        name="title"
        placeholder="Title"
        defaultValue={apartment?.title}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <textarea
        name="description"
        placeholder="Description"
        defaultValue={apartment?.description}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        rows={4}
      />
      <input
        name="city"
        placeholder="City"
        defaultValue={apartment?.city}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        name="price"
        type="number"
        placeholder="Price per night"
        defaultValue={apartment?.price}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        name="guests"
        type="number"
        placeholder="Max guests"
        defaultValue={apartment?.guests}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      
      <select
        name="category_id"
        defaultValue={apartment?.category_id || ""}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="" disabled>Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
      >
        {apartment ? "Update Apartment" : "Create Apartment"}
      </button>
    </form>
  );
}
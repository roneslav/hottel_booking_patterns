// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  created_at: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(data);
      } else {
        alert("Fetching error: " + data.error);
      }
      setLoading(false);
    }

    fetchCategories();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">No categories</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{cat.name}</h3>
              <div className="mt-4 flex gap-4 text-sm">
                <Link href={`/admin/categories/edit/${cat.id}`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    if (confirm("Delete category?")) {
                      const res = await fetch(`/api/admin/categories?id=${cat.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        setCategories(categories.filter((c) => c.id !== cat.id));
                      } else {
                        alert("Deletion error");
                      }
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
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
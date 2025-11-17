// components/admin/CategoryForm.tsx
"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";

type Props = {
  action: (prevState: any, formData: FormData) => Promise<void | { error?: string } | null>;
  initialData?: { name: string };
};

export default function CategoryForm({ action, initialData }: Props) {
  // Тепер useActionState — новий API
  const [state, formAction, pending] = useActionState(action, null);

  // Показуємо помилку (якщо є)
  useEffect(() => {
    if (state?.error) {
      alert(state.error);
    }
  }, [state]);

  function SubmitButton() {
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-3 px-4 rounded-md transition flex items-center justify-center gap-2"
      >
        {pending ? "Saving..." : initialData ? "Update Category" : "Create Category"}
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category Name
        </label>
        <input
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={50}
          defaultValue={initialData?.name}
          placeholder="Наприклад: Апартаменти, Вілла, Студія..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
        />
      </div>

      {state?.error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded">
          {state.error}
        </div>
      )}

      <div className="flex gap-4">
        <SubmitButton />
        <Link
          href="/admin/categories"
          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-md text-center transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
// components/admin/ServiceForm.tsx
"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { createService, updateService } from "@/app/api/admin/services/actions";

type Service = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

type Props = {
  service?: Service;
};

export default function ServiceForm({ service }: Props) {
  const action = service ? updateService : createService;
  type ActionState = { error?: string } | null;
  const [state, formAction, pending] = useActionState(action, null) as [ActionState, any, boolean];

  useEffect(() => {
    if (state?.error) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Name
        </label>
        <input
          name="name"
          type="text"
          required
          minLength={3}
          maxLength={100}
          defaultValue={service?.name}
          placeholder="For example: Airport Transfer"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (optional)
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={service?.description || ""}
          placeholder="Additional information about the service..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price ($)
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={service?.price}
          placeholder="25"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {state?.error && (
        <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded">
          {state.error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-3 px-6 rounded-md transition"
        >
          {pending ? "Saving..." : service ? "Update Service" : "Create Service"}
        </button>
        <Link
          href="/admin/services"
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-center text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-md transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
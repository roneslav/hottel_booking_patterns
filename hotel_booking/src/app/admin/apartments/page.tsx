// app/admin/apartments/page.tsx
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function ApartmentsPage() {
  const supabase = await createServerClient();
  const { data: apartments } = await supabase
    .from("apartments")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apartments</h1>
        <Link href="/admin/apartments/create">
          <Button>Add Apartment</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {apartments?.map((apt) => (
          <div key={apt.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{apt.title}</h3>
              <p className="text-sm text-gray-600">{apt.city} • {apt.categories?.name}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/apartments/edit/${apt.id}`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
              <form action={`/api/admin/apartments?id=${apt.id}`} method="DELETE">
                <Button variant="destructive" size="sm">Delete</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
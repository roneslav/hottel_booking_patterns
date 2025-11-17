"use client";

import Header from "@/components/header/Header";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = async (uid: string) => {
    console.log("Fetching profile for user ID:", uid);

    const { data, error } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", uid)
      .maybeSingle();

    console.log("Profile fetch result:", data, error);

    // if (error && error.code !== "PGRST116") {
    //   console.error("Profile fetch error:", error);
    // }

    if (data) {
      setUser({
        id: uid,
        name: data.name,
        email: data.email,
      });
      console.log("User profile set:", {
        id: uid,
        name: data.name,
        email: data.email,
      });
    } else {
      console.warn("No profile in public.users for ID:", uid);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        redirect("/auth/signin");
        return;
      }

      await fetchProfile(session.user.id);
    };

    init();
  }, []);

  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    redirect("/auth/signin");
    return null;
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            My Account
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
// components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Home, UserPlus, LogIn, User, LogOut } from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // ЄДИНИЙ слухач авторизації
  useEffect(() => {
    const fetchProfile = async (uid: string) => {
        console.log("Fetching profile for user ID:", uid);
      const { data, error } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", uid)
        .maybeSingle();

        console.log("Profile fetch result:", data, error);

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error);
      }

      if (data) {
        setUser({
          id: uid,
          name: data.name,
          email: data.email,
        });
      } else {
        console.warn("No profile in public.users for ID:", uid);
        setUser(null);
      }
    };

    // 1. Початкове завантаження
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };
    init();

    // 2. Слухач змін
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session?.user?.id);

        if (event === "SIGNED_IN" && session?.user) {
          await fetchProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-32 h-8 animate-pulse" />
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-24 h-8 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <Home className="h-7 w-7" />
            <span className="text-xl font-bold">StayHub</span>
          </Link>

          {/* Права частина */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all"
                >
                  <User className="h-4 w-4" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all transform hover:scale-105"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
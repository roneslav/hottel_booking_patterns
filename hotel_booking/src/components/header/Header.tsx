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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session?.user?.id);

      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", uid)
        .single();

      if (error) {
        console.warn("Profile not found or error:", error.message);
        setUser(null);
        return;
      }

      setUser({
        id: uid,
        name: data.name || "User",
        email: data.email,
      });
    } catch (err) {
      console.error("Unexpected profile fetch error:", err);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded w-8 h-8 animate-pulse" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded w-24 h-6 animate-pulse" />
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-20 h-8 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Home className="h-7 w-7" />
            <span className="text-xl font-bold">StayHub</span>
          </Link>

          <nav className="flex items-center gap-3">
            {user ? (
              <>
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
              </>
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
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
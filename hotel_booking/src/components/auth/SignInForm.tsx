"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogIn } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Слухаємо авторизацію
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/");
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Welcome Back</h2>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/30 p-2 rounded">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          required
          minLength={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <LogIn className="h-4 w-4" />
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
          Register
        </a>
      </p>
    </form>
  );
}
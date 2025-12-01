// app/account/profile/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/auth/signin");

    // Отримуємо поточні дані профілю
    const { data: profile } = await supabase
        .from("users")
        .select("name, phone")
        .eq("id", user.id)
        .single();

    console.log("Profile data:", profile);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
            <div className="max-w-2xl mx-auto">
                {/* Back to Account */}
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Account
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                                <User className="h-16 w-16" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Edit Profile</h1>
                                <p className="opacity-90 mt-1">Update your personal information</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        action="/api/account/update-profile"
                        method="POST"
                        className="p-8 space-y-8"
                    >
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={profile?.name || ""}
                                placeholder="John Doe"
                                required
                                className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition"
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-lg cursor-not-allowed"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Email cannot be changed. Contact support if needed.
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                                <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Phone Number (optional)
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                defaultValue={profile?.phone || ""}
                                placeholder="+380991234567"
                                className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-5 rounded-xl transition flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Save className="h-6 w-6" />
                                Save Changes
                            </button>

                            <Link
                                href="/account"
                                className="px-8 py-5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-medium transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Success message (якщо є) */}
                {/* Messages */}
                {(() => {
                    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
                    const success = params?.get("success");
                    const error = params?.get("error");

                    if (success) {
                        return (
                            <div className="mt-8 p-6 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl text-green-800 dark:text-green-300 text-center font-semibold">
                                Profile updated successfully!
                            </div>
                        );
                    }

                    if (error) {
                        return (
                            <div className="mt-8 p-6 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl text-red-800 dark:text-red-300 text-center font-semibold">
                                Failed to update profile. Please try again.
                            </div>
                        );
                    }

                    return null;
                })()}
            </div>
        </div>
    );
}
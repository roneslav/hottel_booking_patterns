"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bed, Calendar, Tag, DollarSign, BarChart, LogOut } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/apartments", label: "Apartments", icon: Bed },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/services", label: "Services", icon: DollarSign },
  { href: "/admin/reports", label: "Reports", icon: BarChart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              pathname.startsWith(href)
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-6">
        <button className="flex items-center gap-3 text-red-600 hover:text-red-700">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
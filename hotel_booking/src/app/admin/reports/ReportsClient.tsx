// app/admin/reports/ReportsClient.tsx
"use client";

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

export default function ReportsClient({
  monthlyRevenue,
  occupancyRate,
  categoryData,
  top10Clients,
  totalBookings,
  avgCheck,
}: {
  monthlyRevenue: { month: string; revenue: number }[];
  occupancyRate: number;
  categoryData: { name: string; value: number }[];
  top10Clients: any[];
  totalBookings: number;
  avgCheck: number;
}) {
  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-4xl font-bold">Reports and analytics</h1>

      {/* Monthly Revenue */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">Monthly Revenue</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="4 4" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Картки зі статистикою */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-medium">Occupancy (30 days)</h3>
          <p className="text-6xl font-bold mt-4">{occupancyRate.toFixed(1)}%</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-medium">Total Bookings</h3>
          <p className="text-6xl font-bold mt-4">{totalBookings}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-medium">Average Check</h3>
          <p className="text-6xl font-bold mt-4">${avgCheck}</p>
        </div>
      </div>

      {/* Categories + Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popularity of Categories */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Popularity of Categories</h2>
          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Clients */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Top 10 Clients</h2>
          <div className="space-y-4">
            {top10Clients.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No clients available</p>
            ) : (
              top10Clients.map((client: any, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${client.spent.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{client.bookings} bookings</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
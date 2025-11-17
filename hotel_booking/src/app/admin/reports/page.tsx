// app/admin/reports/page.tsx
export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Revenue by Month</h3>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-500">Chart placeholder</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Occupancy Rate</h3>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-500">Chart placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
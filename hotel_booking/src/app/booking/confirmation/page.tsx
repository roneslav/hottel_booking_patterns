// app/booking/confirmation/page.tsx
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const query = (await searchParams).bookingId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your booking ID: <span className="font-mono font-semibold">#{query}</span>
        </p>
        <Link
          href="/account"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
        >
          Go to My Bookings
        </Link>
      </div>
    </div>
  );
}
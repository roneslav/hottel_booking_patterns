// app/bookings/success/page.tsx
import Link from "next/link";
import { CheckCircle, Home, Calendar, MapPin, Users, DollarSign, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Booking Success - StayHub",
};

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-green-600 text-white py-10 px-8 text-center">
          <CheckCircle className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Booking Successful!</h1>
          <p className="text-green-100 text-lg">Thank you for trusting StayHub</p>
        </div>

        {/* Main content */}
        <div className="p-8 space-y-8">
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Your booking has been confirmed. We have sent the details to your email.
            </p>
          </div>

          {/* Brief booking information (can be expanded later) */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              What’s next?
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>You will receive a confirmation email within 5 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>The host will send you the address and check-in instructions</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span>If you have any questions, feel free to contact us anytime</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <Link
              href="/apartments"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition transform hover:scale-105"
            >
              <Home className="h-5 w-5" />
              Search more apartments
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <Link
              href="/account/bookings"
              className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-4 px-6 rounded-lg transition"
            >
              <DollarSign className="h-5 w-5" />
              My bookings
            </Link>
          </div>

          {/* Additional block */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p>Need help?</p>
            <a href="mailto:support@stayhub.com" className="text-blue-600 hover:underline">
              support@stayhub.com
            </a>
            {" • "}
            <a href="tel:+380123456789" className="text-blue-600 hover:underline">
              +38 (012) 345-67-89
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
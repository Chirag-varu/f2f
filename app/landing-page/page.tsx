"use client";
import Link from "next/link";
export default function LandingPage() {
  return (
    <main className="bg-gradient-to-b from-green-50 to-amber-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center bg-gradient-to-b from-green-100 to-amber-50">
        <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 mb-4 leading-tight ">
          Turn Farm Waste Into Value
        </h1>
        <p className="text-lg md:text-2xl text-green-700 mb-8 max-w-2xl">
          Trusted digital marketplace connecting farmers and industries for efficient, sustainable bio-energy sourcing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#get-started" className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition">
            List Your Farm Waste
          </Link>
          <Link href="#get-started" className="bg-white border border-green-700 text-green-800 font-semibold px-8 py-3 rounded-lg shadow hover:bg-green-50 transition">
            Find Sustainable Fuel
          </Link>
        </div>
      </section>
      {/* ...existing code for other sections... */}
    </main>
  );
}

"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-krishi-beige text-foreground">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b bg-krishi-beige/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-krishi-darkbrown">
            Farm 2 Fuel
          </div>

          <div className="flex gap-3">
            <Link
              href="/login/farmer"
              className="rounded-lg border border-krishi-brown px-4 py-2 text-sm font-medium text-krishi-brown hover:bg-krishi-cream"
            >
              Login
            </Link>
            <Link
              href="/signup/farmer"
              className="rounded-lg bg-krishi-brown px-4 py-2 text-sm font-medium text-white hover:bg-krishi-darkbrown"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-krishi-darkbrown md:text-6xl">
          Turn Agricultural Waste
          <span className="block text-krishi-olive">
            Into Sustainable Industrial Value
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A trusted digital marketplace connecting farmers and industries to
          unlock value from agricultural waste while building a cleaner,
          circular economy.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup/farmer"
            className="rounded-xl bg-krishi-brown px-8 py-3 text-base font-semibold text-white shadow hover:bg-krishi-darkbrown"
          >
            List Your Farm Waste
          </Link>

          <Link
            href="/signup/industry"
            className="rounded-xl border border-krishi-brown bg-white px-8 py-3 text-base font-semibold text-krishi-darkbrown hover:bg-krishi-cream"
          >
            Source Sustainable Materials
          </Link>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-3xl font-semibold text-krishi-darkbrown">
          How Krishi Loop Works
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-krishi-darkbrown">
              1. Farmers Upload Waste
            </h3>
            <p className="text-sm text-muted-foreground">
              Farmers list agricultural waste with quantity, type, and images
              directly from their dashboard.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-krishi-darkbrown">
              2. Industries Discover
            </h3>
            <p className="text-sm text-muted-foreground">
              Industries browse verified waste listings suitable for bio-energy,
              packaging, and processing.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-krishi-darkbrown">
              3. Circular Value Created
            </h3>
            <p className="text-sm text-muted-foreground">
              Waste becomes a resource, increasing farmer income and reducing
              environmental impact.
            </p>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section id="benefits" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-3xl font-semibold text-krishi-darkbrown">
          Why Choose Krishi Loop
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-krishi-darkbrown">
              For Farmers
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Extra income from farm waste</li>
              <li>• Simple mobile-first experience</li>
              <li>• Transparent and trusted marketplace</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-krishi-darkbrown">
              For Industries
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Reliable access to raw biomass</li>
              <li>• Lower sourcing costs</li>
              <li>• Measurable sustainability impact</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-krishi-beige px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          © 2026 Krishi Loop. Building a sustainable rural future.
        </div>
      </footer>
    </main>
  );
}

"use client";
import WasteForm from "@/components/WasteForm";
import ListingCard from "@/components/ListingCard";
export default function FarmerDashboard() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Waste Listings</h1>
      <WasteForm />
      {/* Map over listings */}
      <div className="mt-8">
        {/* <ListingCard ... /> */}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import UploadWasteForm from "@/components/UploadWasteForm";
import FarmerListings from "@/components/FarmerListings";

import { Button } from "@/components/ui/button";

type Tab = "upload" | "listings";

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [farmerId, setFarmerId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("krishi_session");
    if (!raw) {
      toast.error("Please login again");
      return;
    }

    try {
      const session = JSON.parse(raw) as {
        farmerId: string;
        role: string;
      };

      if (session.role !== "farmer") {
        toast.error("Unauthorized access");
        return;
      }

      setFarmerId(session.farmerId);
    } catch {
      toast.error("Invalid session");
    }
  }, []);

  if (!farmerId) return null;

  return (
    <div className="min-h-screen bg-krishi-beige">
      {/* Navbar */}
      <div className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-krishi-darkbrown">
            Farmer Dashboard
          </h1>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              className={
                activeTab === "upload"
                  ? "bg-krishi-brown text-white hover:bg-krishi-darkbrown"
                  : ""
              }
              onClick={() => setActiveTab("upload")}
            >
              Upload Waste
            </Button>

            <Button
              variant={activeTab === "listings" ? "default" : "outline"}
              className={
                activeTab === "listings"
                  ? "bg-krishi-brown text-white hover:bg-krishi-darkbrown"
                  : ""
              }
              onClick={() => setActiveTab("listings")}
            >
              My Listings
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "upload" && <UploadWasteForm />}

        {activeTab === "listings" && <FarmerListings farmerId={farmerId} />}
      </div>
    </div>
  );
}

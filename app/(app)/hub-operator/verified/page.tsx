"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import HubNavbar from "@/components/hub/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

export default function VerifiedPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function fetchData() {
    try {
      const res = await fetch("/api/hub/verified");
      const data = await res.json();
      setBatches(data.batches || []);
    } catch {
      toast.error("Failed to load verified batches");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function markDelivered(id: string) {
    try {
      setLoadingId(id);

      const res = await fetch("/api/hub/deliver-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Marked as delivered");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Delivery failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <HubNavbar />

      <div className="p-6">
        <h1 className="mb-4 text-xl font-semibold">Verified Batches</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle>{b.material.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <img
                  src={b.image_url}
                  className="h-40 w-full rounded object-cover"
                />

                <p>{b.quantity_kg} kg</p>
                <p>{b.farmer.full_name}</p>

                <Button
                  className="w-full"
                  disabled={loadingId === b.id}
                  onClick={() => markDelivered(b.id)}
                >
                  {loadingId === b.id ? "Processing..." : "Done Delivery"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

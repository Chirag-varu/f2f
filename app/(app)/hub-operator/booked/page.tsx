"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import HubNavbar from "@/components/hub/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookedPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  async function fetchBatches() {
    try {
      const res = await fetch("/api/hub/booked");
      const data = await res.json();
      setBatches(data.batches || []);
    } catch {
      toast.error("Failed to load booked batches");
    }
  }

  useEffect(() => {
    fetchBatches();
  }, []);

  async function verifyBatch(batchId: string) {
    try {
      setVerifyingId(batchId);

      const res = await fetch("/api/hub/verify-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: batchId })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Batch verified");

      // refresh booked list
      fetchBatches();
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <>
      <HubNavbar />

      <div className="p-6">
        <h1 className="mb-4 text-xl font-semibold">Booked Batches</h1>

        {batches.length === 0 && (
          <p className="text-muted-foreground">No booked batches.</p>
        )}

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
                  disabled={verifyingId === b.id}
                  onClick={() => verifyBatch(b.id)}
                >
                  {verifyingId === b.id ? "Verifying..." : "Verify"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

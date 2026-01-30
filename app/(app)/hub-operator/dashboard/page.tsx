"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

type Batch = {
  id: string;
  quantity_kg: number;
  moisture_percentage: number;
  quality_grade: string | null;
  image_url: string;

  material: {
    id: string;
    name: string;
  };

  farmer: {
    id: string;
    full_name: string;
    district: string;
    state: string;
    phone_number: string;
  };
};

export default function HubDashboard() {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("session");
    if (!raw) {
      toast.error("Unauthorized");
      router.push("/hub-operator/login");
      return;
    }

    const session = JSON.parse(raw);
    if (session.role !== "hub_operator") {
      toast.error("Access denied");
      router.push("/hub-operator/login");
      return;
    }

    fetchBatches();
  }, []);

  async function fetchBatches() {
    try {
      const res = await fetch("/api/hub/waste-batches");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setBatches(data.batches || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load batches");
    } finally {
      setLoading(false);
    }
  }

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

      // refetch after verify
      await fetchBatches();
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">
        Loading hub inventory…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hub Inventory</h1>
        <span className="text-sm text-muted-foreground">
          {batches.length} batches at hub
        </span>
      </div>

      {batches.length === 0 && (
        <p className="text-muted-foreground">No waste batches available.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {batches.map((b) => (
          <Card key={b.id} className="overflow-hidden shadow">
            <img
              src={b.image_url}
              className="h-48 w-full object-cover"
            />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{b.material.name}</CardTitle>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">
                  At Hub
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded bg-gray-100 p-2">
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{b.quantity_kg} kg</p>
                </div>

                <div className="rounded bg-gray-100 p-2">
                  <p className="text-muted-foreground">Moisture</p>
                  <p className="font-medium">
                    {b.moisture_percentage}%
                  </p>
                </div>
              </div>

              <div className="rounded border p-3 text-sm">
                <p className="font-medium">{b.farmer.full_name}</p>
                <p className="text-muted-foreground">
                  {b.farmer.district}, {b.farmer.state}
                </p>
                <p className="text-muted-foreground">
                  📞 {b.farmer.phone_number}
                </p>
              </div>

              <Button
                className="w-full"
                disabled={verifyingId === b.id}
                onClick={() => verifyBatch(b.id)}
              >
                {verifyingId === b.id
                  ? "Verifying..."
                  : "Verify Batch"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

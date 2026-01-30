"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import HubNavbar from "@/components/hub/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function BookedPage() {
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/hub/booked")
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => toast.error("Failed to load booked batches"));
  }, []);

  return (
    <>
      <HubNavbar />
      <div className="p-6">
        <h1 className="mb-4 text-xl font-semibold">Booked Batches</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle>{b.material.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={b.image_url} className="h-40 w-full rounded object-cover" />
                <p>{b.quantity_kg} kg</p>
                <p>{b.farmer.full_name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

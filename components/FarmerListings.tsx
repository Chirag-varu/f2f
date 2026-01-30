"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WasteBatch = {
  id: string;
  farmer_id: string;
  material_type: string; // material ID
  quantity_kg: number;
  status: string;
  image_url: string;
  created_at: string;
};

type Material = {
  id: string;
  name: string;
};

type Props = {
  farmerId: string;
};

export default function FarmerListings({ farmerId }: Props) {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* ---------- Fetch waste batches ---------- */
  useEffect(() => {
    async function fetchBatches() {
      try {
        const res = await fetch("/waste_batches.json");
        const data: WasteBatch[] = await res.json();

        const mine = data.filter((batch) => batch.farmer_id === farmerId);

        setBatches(mine);
      } catch {
        toast.error("Failed to load waste listings");
      }
    }

    fetchBatches();
  }, [farmerId]);

  /* ---------- Fetch materials ---------- */
  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await fetch("/materials.json");
        const data: Material[] = await res.json();
        setMaterials(data);
      } catch {
        toast.error("Failed to load materials");
      }
    }

    fetchMaterials();
  }, []);

  /* ---------- Build material lookup ---------- */
  const materialMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const material of materials) {
      map[material.id] = material.name;
    }
    return map;
  }, [materials]);

  /* ---------- Loading state ---------- */
  if (loading && batches.length === 0) {
    return <p className="text-muted-foreground">Loading listings...</p>;
  }

  if (batches.length === 0) {
    return (
      <p className="text-muted-foreground">
        You have not uploaded any waste yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {batches.map((batch) => {
        const materialName =
          materialMap[batch.material_type] ?? "Unknown material";

        return (
          <Card
            key={batch.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <img
              src={batch.image_url}
              alt={materialName}
              className="h-40 w-full object-cover"
            />

            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-krishi-darkbrown">
                {materialName}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>Quantity: {batch.quantity_kg} kg</p>
              <p>Status: {batch.status}</p>
              <p className="text-xs">
                Uploaded on {new Date(batch.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

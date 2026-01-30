"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Material = {
  id: string;
  name: string;
};

export default function UploadWasteForm() {
  const [farmerId, setFarmerId] = useState<string | null>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialId, setMaterialId] = useState<string>("");

  const [quantity, setQuantity] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  /* ---------- Resolve farmer session ---------- */
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

  /* ---------- Cleanup preview ---------- */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!farmerId) {
      toast.error("Farmer not logged in");
      return;
    }

    if (!materialId || !quantity || !image) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("farmer_id", farmerId);
    formData.append("material_type", materialId);
    formData.append("quantity_kg", quantity);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch("/api/waste-batches", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      toast.success("Waste batch uploaded successfully");

      setMaterialId("");
      setQuantity("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-krishi-beige px-4 py-10">
      <Card className="w-full max-w-xl border border-border shadow-lg rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-krishi-darkbrown">
            Upload Waste Batch
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Add agricultural waste details for industry discovery
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Material Select */}
            <div className="space-y-2">
              <Label className="text-sm">Material Type</Label>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label className="text-sm">Quantity in kg</Label>
              <Input
                type="number"
                placeholder="Approximate weight"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label className="text-sm">Waste Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-white"
              />

              {preview && (
                <div className="mt-3 rounded-xl border bg-card p-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Uploading a new image will replace this one
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-krishi-brown text-white hover:bg-krishi-darkbrown"
            >
              {loading ? "Uploading batch..." : "Submit Waste Batch"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

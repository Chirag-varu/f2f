"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function UploadWasteForm() {
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [materialType, setMaterialType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("farmer_id");
    if (!id) toast.error("Farmer not logged in");
    setFarmerId(id);
    console.log("Farmer ID:", id);
  }, []);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!farmerId) return toast.error("Farmer not logged in");

    console.log("Submitting...")

    if (!materialType || !quantity || !image)
      return toast.error("Please fill all fields and upload an image");

    const formData = new FormData();
    formData.append("farmer_id", farmerId);
    formData.append("material_type", materialType);
    formData.append("quantity_kg", quantity);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch("/api/waste-batches", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Waste batch uploaded successfully");

      setMaterialType("");
      setQuantity("");
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Upload Waste Batch</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Material */}
            <div className="space-y-2">
              <Label>Material Type</Label>
              <Input
                placeholder="e.g. Rice straw"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantity (kg)</Label>
              <Input
                type="number"
                placeholder="Approximate weight"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Upload Image</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {preview && (
                <div className="mt-3 rounded-xl border p-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Selecting another image will replace this one
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Uploading..." : "Submit Batch"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

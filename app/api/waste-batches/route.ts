import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { supabaseServer } from "@/lib/supabaseServer";

type WasteBatch = {
  id: string;
  farmer_id: string;
  hub_id: string | null;
  material_type: string;
  quantity_kg: number;
  moisture_percentage: number;
  quality_grade: string | null;
  status: "available";
  image_url: string;
  created_at: string;
};

const DATA_PATH = path.join(process.cwd(), "public", "waste_batches.json");

function readWasteBatches(): WasteBatch[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as WasteBatch[];
}

function writeWasteBatches(data: WasteBatch[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const farmer_id = formData.get("farmer_id");
  const material_type = formData.get("material_type");
  const quantityRaw = formData.get("quantity_kg");
  const image = formData.get("image");

  if (
    typeof farmer_id !== "string" ||
    typeof material_type !== "string" ||
    typeof quantityRaw !== "string" ||
    !(image instanceof File)
  ) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const quantity_kg = Number(quantityRaw);

  if (Number.isNaN(quantity_kg) || quantity_kg <= 0) {
    return NextResponse.json({ error: "INVALID_QUANTITY" }, { status: 400 });
  }

  /* ---------- Upload image to Supabase bucket ---------- */

  const fileExt = image.name.split(".").pop() ?? "jpg";
  const filePath = `${farmer_id}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabaseServer.storage
    .from("waste_images")
    .upload(filePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "IMAGE_UPLOAD_FAILED" }, { status: 500 });
  }

  const { data: publicUrl } = supabaseServer.storage
    .from("waste_images")
    .getPublicUrl(filePath);

  const image_url = publicUrl.publicUrl;

  /* ---------- Append to JSON file ---------- */

  const batches = readWasteBatches();

  const newBatch: WasteBatch = {
    id: crypto.randomUUID(),
    farmer_id,
    hub_id: null,
    material_type,
    quantity_kg,
    moisture_percentage: 20,
    quality_grade: null,
    status: "available",
    image_url,
    created_at: new Date().toISOString(),
  };

  batches.push(newBatch);
  writeWasteBatches(batches);

  return NextResponse.json({
    success: true,
    batch: newBatch,
  });
}

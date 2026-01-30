import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "waste_batches.json");

export type WasteBatch = {
  id: string;
  farmer_id: string;
  hub_id: string | null;
  material_type: string;
  quantity_kg: number;
  moisture_percentage: number;
  quality_grade: string | null;
  status: "available" | "assigned" | "completed";
  image_url: string;
  created_at: string;
};

export function readWasteBatches(): WasteBatch[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeWasteBatches(data: WasteBatch[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

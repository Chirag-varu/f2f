import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const root = process.cwd();

    const wastes = JSON.parse(
      fs.readFileSync(path.join(root, "public", "waste_batches.json"), "utf-8")
    );

    const materials = JSON.parse(
      fs.readFileSync(path.join(root, "public", "materials.json"), "utf-8")
    );

    const users = JSON.parse(
      fs.readFileSync(path.join(root, "public", "users.json"), "utf-8")
    );

    const booked = wastes.filter((w: any) => w.status === "booked");

    const enriched = booked.map((w: any) => {
      const material = materials.find((m: any) => m.id === w.material_type);
      const farmer = users.find((u: any) => u.id === w.farmer_id);

      return {
        ...w,
        material,
        farmer
      };
    });

    return NextResponse.json({ batches: enriched });
  } catch {
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}

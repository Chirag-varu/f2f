import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const root = process.cwd();

    const wasteRaw = fs.readFileSync(
      path.join(root, "public", "waste_batches.json"),
      "utf-8"
    );

    const materialsRaw = fs.readFileSync(
      path.join(root, "public", "materials.json"),
      "utf-8"
    );

    const usersRaw = fs.readFileSync(
      path.join(root, "public", "users.json"),
      "utf-8"
    );

    const wastes = JSON.parse(wasteRaw);
    const materials = JSON.parse(materialsRaw);
    const users = JSON.parse(usersRaw);

    // Filter only at_hub
    const atHub = wastes.filter((w: any) => w.status === "at_hub");

    // Enrich data
    const enriched = atHub.map((w: any) => {
      const material = materials.find((m: any) => m.id === w.material_type);
      const farmer = users.find((u: any) => u.id === w.farmer_id);

      return {
        id: w.id,
        quantity_kg: w.quantity_kg,
        moisture_percentage: w.moisture_percentage,
        quality_grade: w.quality_grade,
        status: w.status,
        image_url: w.image_url,
        created_at: w.created_at,

        material: material
          ? {
              id: material.id,
              name: material.name
            }
          : null,

        farmer: farmer
          ? {
              id: farmer.id,
              full_name: farmer.full_name,
              district: farmer.district,
              state: farmer.state,
              phone_number: farmer.phone_number
            }
          : null
      };
    });

    return NextResponse.json({
      batches: enriched
    });
  } catch (err) {
    return NextResponse.json(
      { error: "FAILED_TO_FETCH_DATA" },
      { status: 500 }
    );
  }
}

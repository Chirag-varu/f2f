import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { batch_id } = await req.json();

    if (!batch_id) {
      return NextResponse.json(
        { error: "BATCH_ID_REQUIRED" },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "waste_batches.json"
    );

    const raw = fs.readFileSync(filePath, "utf-8");
    const batches = JSON.parse(raw);

    const index = batches.findIndex((b: any) => b.id === batch_id);

    if (index === -1) {
      return NextResponse.json(
        { error: "BATCH_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Update status
    batches[index].status = "verified";

    // Optional: update verified timestamp
    batches[index].verified_at = new Date().toISOString();

    // Save back
    fs.writeFileSync(filePath, JSON.stringify(batches, null, 2));

    return NextResponse.json({
      success: true,
      batch: batches[index]
    });
  } catch (err) {
    return NextResponse.json(
      { error: "FAILED_TO_VERIFY_BATCH" },
      { status: 500 }
    );
  }
}

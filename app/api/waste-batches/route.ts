import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer;
  // 1. Read form data
  const formData = await req.formData();

  const farmer_id = formData.get("farmer_id") as string;
  const material_type = formData.get("material_type") as string;
  const quantity_kg = Number(formData.get("quantity_kg"));
  const file = formData.get("image") as File | null;

  if (!farmer_id || !material_type || !quantity_kg || !file) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  // 2. Verify farmer exists
  const { data: farmer } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", farmer_id)
    .single();

  if (!farmer) {
    return NextResponse.json({ error: "FARMER_NOT_FOUND" }, { status: 403 });
  }

  // 3. Upload image
  const fileExt = file.name.split(".").pop();
  const filePath = `${farmer_id}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("waste_images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "IMAGE_UPLOAD_FAILED" },
      { status: 500 }
    );
  }

  // 4. Get public URL
  const { data: publicUrl } = supabase.storage
    .from("waste_images")
    .getPublicUrl(filePath);

  const image_url = publicUrl.publicUrl;


  const { data: batch, error: insertError } = await supabase
    .from("waste_batches")
    .insert({
      farmer_id,
      material_type,
      quantity_kg,
      moisture_percentage: 20,
      quality_grade: null,
      status: "available",
      hub_id: null,
      image_url
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 6. Provenance event
  await supabase.from("provenance_events").insert({
    waste_batch_id: batch.id,
    event_type: "created",
    performed_by: farmer_id,
    metadata: {
      material_type,
      quantity_kg,
      image_url
    }
  });

  // 7. Response
  return NextResponse.json({
    id: batch.id,
    status: "available",
    image_url
  });
}

import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";


export async function GET() {

  const { data, error } = await supabaseServer
    .from("materials")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    materials: data
  });
}

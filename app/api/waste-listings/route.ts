import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from("waste_listings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from("waste_listings").insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

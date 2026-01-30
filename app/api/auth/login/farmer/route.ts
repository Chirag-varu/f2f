import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabaseServer";
import { isValidPhone } from "@/lib/validators";

function normalizeIndianPhone(phone: string): string {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
}

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json(
      { error: "Phone number and password are required" },
      { status: 400 },
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 },
    );
  }

  const normalizedPhone = normalizeIndianPhone(phone);

  const { data: user, error } = await supabaseServer
    .from("users")
    .select("id, password, role")
    .eq("phone_number", normalizedPhone)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "Invalid phone number or password" },
      { status: 401 },
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Invalid phone number or password" },
      { status: 401 },
    );
  }

  if (user.role !== "farmer") {
    return NextResponse.json(
      { error: "This account is not a farmer account" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    success: true,
    farmerId: user.id,
    role: user.role,
  });
}

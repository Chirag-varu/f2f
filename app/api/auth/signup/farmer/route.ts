import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabaseServer";
import { isStrongPassword, isValidPhone } from "@/lib/validators";

const OTP_SECRET = process.env.OTP_SECRET!;

function normalizeIndianPhone(phone: string): string {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
}

export async function POST(req: Request) {
  const { fullName, phone, password, state, district, verificationToken } =
    await req.json();

  if (
    !fullName ||
    !phone ||
    !password ||
    !state ||
    !district ||
    !verificationToken
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 },
    );
  }

  if (!isStrongPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  let payload;
  try {
    payload = jwt.verify(verificationToken, OTP_SECRET) as {
      phone: string;
      purpose: string;
    };
  } catch {
    return NextResponse.json(
      { error: "Phone number not verified" },
      { status: 403 },
    );
  }

  const normalizedPhone = normalizeIndianPhone(phone);

  if (payload.phone !== normalizedPhone) {
    return NextResponse.json(
      { error: "Phone verification mismatch" },
      { status: 403 },
    );
  }

  const { data: existingUser } = await supabaseServer
    .from("users")
    .select("id")
    .eq("phone_number", normalizedPhone)
    .single();

  if (existingUser) {
    return NextResponse.json(
      { error: "PHONE_ALREADY_EXISTS" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabaseServer
    .from("users")
    .insert({
      full_name: fullName,
      phone_number: normalizedPhone,
      password: hashedPassword,
      role: "farmer",
      state,
      district,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.log(error);
    console.log(data);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    farmerId: data.id,
  });
}

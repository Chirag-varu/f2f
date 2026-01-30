import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseServer } from "@/lib/supabaseServer";
import { isStrongPassword, isValidPhone } from "@/lib/validators";

const OTP_SECRET = process.env.OTP_SECRET!;

function normalizeIndianPhone(phone: string): string {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
}

export async function POST(req: Request) {
  const body = await req.json();

  const { fullName, phone, password, state, district, verificationToken } =
    body;

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

  if (payload.phone !== phone || payload.purpose !== "phone_verification") {
    return NextResponse.json(
      { error: "Phone verification mismatch" },
      { status: 403 },
    );
  }

  const normalizedPhone = normalizeIndianPhone(phone);

  const { data: authUser, error: authError } =
    await supabaseServer.auth.admin.createUser({
      phone: normalizedPhone,
      password,
      phone_confirm: true,
    });

  if (authError) {
    if (
      authError.code === "23505" ||
      authError.message.toLowerCase().includes("already")
    ) {
      return NextResponse.json(
        {
          error: "PHONE_ALREADY_EXISTS",
          message:
            "This phone number is already registered. Please login or use a different number.",
        },
        { status: 409 },
      );
    }

    console.error("Supabase auth error:", authError);
    return NextResponse.json(
      {
        error: "AUTH_CREATION_FAILED",
        message: "Unable to create account. Please try again later.",
      },
      { status: 500 },
    );
  }

  if (!authUser?.user) {
    return NextResponse.json(
      { error: "Auth user not returned" },
      { status: 500 },
    );
  }

  const { error: profileError } = await supabaseServer.from("users").insert({
    id: authUser.user.id,
    full_name: fullName,
    phone_number: normalizedPhone,
    password,
    role: "farmer",
    state,
    district,
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Farmer account created successfully",
    farmerId: authUser.user.id,
  });
}

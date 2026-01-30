import { NextResponse } from "next/server";
import { createOtp } from "@/lib/otpStore";
import { isValidPhone } from "@/lib/validators";
import { supabaseServer } from "@/lib/supabaseServer";

function normalizeIndianPhone(phone: string): string {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
}

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 },
    );
  }

  const normalizedPhone = normalizeIndianPhone(phone);

  const { data: existingUser } = await supabaseServer
    .from("users")
    .select("id")
    .eq("phone_number", normalizedPhone)
    .single();

  if (existingUser) {
    return NextResponse.json(
      { error: "Phone number already registered. Please login." },
      { status: 409 },
    );
  }

  const otp = createOtp(normalizedPhone);

  console.log(`OTP for ${normalizedPhone}: ${otp}`);

  return NextResponse.json({
    success: true,
    message: "OTP sent successfully",
  });
}

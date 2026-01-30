import { NextResponse } from "next/server";
import { createOtp } from "@/lib/otpStore";
import { isValidPhone } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const phone: string = body.phone;

  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 },
    );
  }

  const otp = createOtp(phone);

  console.log(`OTP for ${phone}: ${otp}`);

  return NextResponse.json({
    success: true,
    message: "OTP sent successfully",
  });
}

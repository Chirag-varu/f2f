import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyOtp } from "@/lib/otpStore";
import { isValidPhone } from "@/lib/validators";

const OTP_SECRET = process.env.OTP_SECRET!;

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  if (!phone || !otp || !isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const valid = verifyOtp(phone, otp);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 401 },
    );
  }

  const verificationToken = jwt.sign(
    { phone, purpose: "phone_verification" },
    OTP_SECRET,
    { expiresIn: "10m" },
  );

  return NextResponse.json({
    success: true,
    verificationToken,
  });
}

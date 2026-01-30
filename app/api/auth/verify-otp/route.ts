import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyOtp } from "@/lib/otpStore";
import { isValidPhone } from "@/lib/validators";

const OTP_SECRET = process.env.OTP_SECRET!;

function normalizeIndianPhone(phone: string): string {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
}

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  if (!phone || !otp || !isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const normalizedPhone = normalizeIndianPhone(phone);
  console.log(normalizedPhone, otp)
  const valid = verifyOtp(normalizedPhone, otp);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 401 },
    );
  }

  const verificationToken = jwt.sign(
    { phone: normalizedPhone, purpose: "phone_verification" },
    OTP_SECRET,
    { expiresIn: "10m" },
  );

  return NextResponse.json({
    success: true,
    verificationToken,
  });
}

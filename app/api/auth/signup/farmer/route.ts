import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readUsers, writeUsers } from "@/lib/userFileStore";
import { isStrongPassword, isValidPhone } from "@/lib/validators";
import crypto from "crypto";

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
    payload = jwt.verify(verificationToken, OTP_SECRET) as { phone: string };
  } catch {
    return NextResponse.json({ error: "Phone not verified" }, { status: 403 });
  }

  const normalizedPhone = normalizeIndianPhone(phone);

  if (payload.phone !== normalizedPhone) {
    return NextResponse.json(
      { error: "Phone verification mismatch" },
      { status: 403 },
    );
  }

  const users = readUsers();

  if (users.some((u) => u.phone_number === normalizedPhone)) {
    return NextResponse.json(
      { error: "PHONE_ALREADY_EXISTS" },
      { status: 409 },
    );
  }

  const newUser = {
    id: crypto.randomUUID(),
    full_name: fullName,
    phone_number: normalizedPhone,
    password,
    role: "farmer" as const,
    district,
    state,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return NextResponse.json({
    success: true,
    farmerId: newUser.id,
  });
}

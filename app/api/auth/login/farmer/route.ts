import { NextResponse } from "next/server";
import { readUsers } from "@/lib/userFileStore";
import { isValidPhone } from "@/lib/validators";

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  if (!phone || !password || !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number or password" },
      { status: 400 },
    );
  }

  const users = readUsers();

  const user = users.find(
    (u) =>
      u.phone_number === phone &&
      u.password === password &&
      u.role === "farmer",
  );

  if (!user) {
    return NextResponse.json(
      { error: "Invalid phone number or password" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    farmerId: user.id,
    role: user.role,
  });
}

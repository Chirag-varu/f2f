import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { phone_number, password } = await req.json();

  if (!phone_number || !password) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(raw);

  const user = users.find(
    (u: any) =>
      u.phone_number === phone_number &&
      u.password === password &&
      u.role === "hub_operator"
  );

  if (!user) {
    return NextResponse.json(
      { error: "INVALID_CREDENTIALS_OR_NOT_HUB_OPERATOR" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    id: user.id,
    full_name: user.full_name,
    role: user.role
  });
}

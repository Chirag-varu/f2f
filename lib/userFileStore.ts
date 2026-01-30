import fs from "fs";
import path from "path";

const USERS_PATH = path.join(process.cwd(), "public", "users.json");

export type StoredUser = {
  id: string;
  full_name: string;
  phone_number: string;
  password: string;
  role: "farmer" | "hub_operator";
  district: string;
  state: string;
  created_at: string;
};

export function readUsers(): StoredUser[] {
  const raw = fs.readFileSync(USERS_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeUsers(users: StoredUser[]) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

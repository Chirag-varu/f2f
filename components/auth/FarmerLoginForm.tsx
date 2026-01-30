"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

type User = {
  id: string;
  full_name: string;
  phone_number: string;
  password: string;
  role: string;
};

export function FarmerLoginForm() {
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch("/api/auth/login/farmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    }).catch(() => {});

    try {
      const res = await fetch("/users.json");
      const users: User[] = await res.json();

      const user = users.find(
        (u) => u.phone_number === phone && u.role === "farmer",
      );

      if (!user) {
        setError("No farmer account found with this phone number");
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        setError("Invalid phone number or password");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "krishi_session",
        JSON.stringify({
          farmerId: user.id,
          role: user.role,
        }),
      );

      window.location.href = "/dashboard/farmer";
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden p-0 bg-krishi-beige">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form onSubmit={submitForm} className="p-6 md:p-8 grid gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-krishi-darkbrown">
              Farmer Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back to Krishi Loop
            </p>
          </div>

          {error && (
            <p className="text-sm text-krishi-error text-center">{error}</p>
          )}

          <div className="grid gap-2">
            <Label>Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-krishi-brown hover:bg-krishi-darkbrown text-white"
          >
            Login
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            New farmer?{" "}
            <a href="/signup/farmer" className="underline text-krishi-brown">
              Create an account
            </a>
          </p>
        </form>

        <div className="relative hidden md:block">
          <img
            src="/farmer-signup.png"
            alt="Farmer Login"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-krishi-darkbrown/60" />
        </div>
      </CardContent>
    </Card>
  );
}

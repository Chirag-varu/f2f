"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function HubLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!phone || !password) return toast.error("All fields required");

    try {
      setLoading(true);

      const res = await fetch("/api/hub-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Save session
      localStorage.setItem(
        "session",
        JSON.stringify({
          farmerId: null,
          hubOperatorId: data.id,
          role: "hub_operator",
          name: data.full_name
        })
      );

      toast.success("Login successful");

      router.push("/hub-operator/booked");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Hub Operator Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                placeholder="9876501000"
              />
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>

            <Button disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

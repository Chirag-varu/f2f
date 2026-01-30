"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export function FarmerSignupForm() {
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [verificationToken, setVerificationToken] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const passwordsMatch = password === confirmPassword;

  function resetOtpFlow() {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setVerificationToken("");
  }

  useEffect(() => {
    resetOtpFlow();
  }, [phone]);

  async function sendOtp() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    setLoading(false);

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to send OTP");
      return;
    }

    setOtpSent(true);
  }

  async function verifyOtp() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    setLoading(false);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "OTP verification failed");
      return;
    }

    setVerificationToken(data.verificationToken);
    setOtpVerified(true);
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup/farmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        password,
        state,
        district,
        verificationToken,
      }),
    });

    setLoading(false);
    const data = await res.json();

    if (!res.ok) {
      if (data.error === "PHONE_ALREADY_EXISTS") {
        setError("Phone number already registered. Please login instead.");
        resetOtpFlow();
        return;
      }

      setError(data.error || "Failed to create account");
      return;
    }

    localStorage.setItem(
      "krishi_session",
      JSON.stringify({
        farmerId: data.farmerId,
        role: "farmer",
      }),
    );

    window.location.href = "/dashboard/farmer";
  }

  return (
    <Card className="overflow-hidden p-0 bg-krishi-beige">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form onSubmit={submitForm} className="p-6 md:p-8 grid gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-krishi-darkbrown">
              Farmer Registration
            </h1>
            <p className="text-sm text-muted-foreground">
              Create your Krishi Loop account
            </p>
          </div>

          {error && (
            <p className="text-sm text-krishi-error text-center">
              {error}
              {error.includes("login") && (
                <span className="block mt-1">
                  <a
                    href="/login/farmer"
                    className="underline text-krishi-brown"
                  >
                    Go to Login
                  </a>
                </span>
              )}
            </p>
          )}

          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Phone Number</Label>
            <div className="flex gap-2">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={sendOtp}
                disabled={otpSent || loading}
              >
                Get OTP
              </Button>
            </div>
          </div>

          {otpSent && !otpVerified && (
            <div className="grid gap-2">
              <Label>Enter OTP</Label>
              <div className="flex gap-2">
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-white"
                />
                <Button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading}
                  className="bg-krishi-brown text-white"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

          {otpVerified && (
            <div className="flex items-center gap-2 text-sm text-krishi-olive">
              <CheckCircle size={16} />
              Phone number verified
            </div>
          )}

          <div className="grid gap-2">
            <Label>State</Label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>District</Label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
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

          <div className="grid gap-2">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!passwordsMatch && confirmPassword && (
              <p className="text-xs text-krishi-error">
                Passwords do not match
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!passwordsMatch || !otpVerified || loading}
            className="bg-krishi-brown hover:bg-krishi-darkbrown text-white"
          >
            Create Account
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <a href="/login/farmer" className="underline text-krishi-brown">
              Login here
            </a>
          </p>
        </form>

        <div className="relative hidden md:block">
          <img
            src="/farmer-signup.png"
            alt="Farmer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-krishi-darkbrown/60" />
        </div>
      </CardContent>
    </Card>
  );
}

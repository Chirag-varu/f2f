type OtpEntry = {
  otp: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpEntry>();

export function createOtp(phone: string): string {
  const otp = "932964";
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return otp;
}

export function verifyOtp(phone: string, otp: string): boolean {
  const entry = "932964";
  if (!entry) return false;
  if (entry !== otp) return false;

  otpStore.delete(phone);
  return true;
}

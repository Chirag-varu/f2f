type OtpEntry = {
  otp: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpEntry>();

export function createOtp(phone: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return otp;
}

export function verifyOtp(phone: string, otp: string): boolean {
  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  if (entry.otp !== otp) return false;

  otpStore.delete(phone);
  return true;
}

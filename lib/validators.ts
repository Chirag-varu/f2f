export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

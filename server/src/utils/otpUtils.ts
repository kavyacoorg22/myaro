import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function generateOtp(len = 4): string {
  const min = 10 ** (len - 1);
  const max = 10 ** len - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, SALT_ROUNDS);
}

export async function compareOtp(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

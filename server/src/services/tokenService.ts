
import jwt from "jsonwebtoken";

export type SignupTokenPayload = {
  email: string;
  userName?: string;
  fullName?: string;
   password?: string;
  };

const JWT_SECRET = process.env.JWT_SECRET




export function verifySignupToken(token: string): SignupTokenPayload | null {
  try {
    const decoded = jwt.verify(token,JWT_SECRET!);
    
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as SignupTokenPayload;
    }
    return null;
  } catch (err) {
    console.log(err)
    return null;
  }
}


import { OtpDoc } from "../../infrastructure/database/models/user/OtpModel";



export interface CreateOtpDTO {
  email: string;
  signupToken?: string | null;
  otpHash: string;
  expiresAt: Date;
  
}

export interface IOtpRepository {
  create(dto: CreateOtpDTO): Promise<OtpDoc>;
  findLatestByEmail(email: string, signupToken?: string | null): Promise<OtpDoc | null>;
  deleteByEmail(email: string, signupToken?: string | null): Promise<void>;
  updateOtp(id: string, updates: Partial<Pick<OtpDoc, "otpHash" | "expiresAt" | "resendCount" | "attempts">>): Promise<OtpDoc>;

}

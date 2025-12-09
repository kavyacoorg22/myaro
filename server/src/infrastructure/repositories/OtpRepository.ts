// src/infrastructure/repositories/MongoOtpRepository.ts
import { IOtpRepository, CreateOtpDTO } from "../../domain/repositoryInterface/IOtpRepository";
import OtpModel, { OtpDoc } from "../database/models/user/OtpModel";

export class MongoOtpRepository implements IOtpRepository {
  async create(dto: CreateOtpDTO): Promise<OtpDoc> {
    const doc = await OtpModel.create({
      email: dto.email,
      signupToken: dto.signupToken ?? null,
      otpHash: dto.otpHash,
      expiresAt: dto.expiresAt,
      attempts: 0,
      resendCount: 0,
    });
    return doc;
  }

  async findLatestByEmail(email: string, signupToken: string | null = null): Promise<OtpDoc | null> {
    return OtpModel.findOne({ email, signupToken }).sort({ createdAt: -1 }).exec();
  }

  async deleteByEmail(email: string, signupToken: string | null = null): Promise<void> {
    await OtpModel.deleteMany({ email, signupToken }).exec();
  }

  async updateOtp(id: string, updates: Partial<Pick<OtpDoc, "otpHash" | "expiresAt" | "resendCount" | "attempts">>): Promise<OtpDoc> {
    const doc = await OtpModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    if (!doc) throw new Error("OTP not found");
    return doc;
  }

 
}

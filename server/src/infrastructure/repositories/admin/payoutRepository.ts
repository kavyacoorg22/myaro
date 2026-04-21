import { Types } from "mongoose";
import { Payout } from "../../../domain/entities/payout";
import { PayoutStatus } from "../../../domain/enum/paymentEnum";
import { GenericRepository } from "../genericRepository";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { PayoutDoc, PayoutModel } from "../../database/models/user/payoutModal";
import { IPayoutRepository } from "../../../domain/repositoryInterface/User/admin/IPayoutRepository";
import { EarningsSummaryDto, RecentPayoutDto } from "../../../application/dtos/beautician";

export class PayoutRepository
  extends GenericRepository<Payout, PayoutDoc>
  implements IPayoutRepository
{
  constructor() {
    super(PayoutModel);
  }

  async create(
    data: Omit<Payout, "id" | "createdAt" | "updatedAt">,
  ): Promise<Payout> {
    const doc = await PayoutModel.create({
      ...data,
      paymentId: new Types.ObjectId(data.paymentId),
      customerId: new Types.ObjectId(data.customerId),
      beauticianId: new Types.ObjectId(data.beauticianId),
    });

    return this.map(doc);
  }

  async findByPaymentId(paymentId: string): Promise<Payout | null> {
    const doc = await PayoutModel.findOne({
      paymentId: new Types.ObjectId(paymentId),
    });

    return doc ? this.map(doc) : null;
  }

  async updateStatus(id: string, status: PayoutStatus): Promise<Payout> {
    const doc = await PayoutModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!doc) {
      throw new AppError("Payout not found", HttpStatus.NOT_FOUND);
    }

    return this.map(doc);
  }


async getEarningsSummary(beauticianId: string, joinedSince: Date): Promise<EarningsSummaryDto> {
  const raw = await PayoutModel.aggregate([
    {
      $match: { beauticianId: new Types.ObjectId(beauticianId) },
    },
    {
      $group: {
        _id:          null,
        totalEarnings:      { $sum: { $cond: [{ $eq: ["$status", PayoutStatus.COMPLETED]  }, "$amount", 0] } },
        withdrawableAmount: { $sum: { $cond: [{ $eq: ["$status", PayoutStatus.COMPLETED]  }, "$amount", 0] } },
        pendingAmount:      { $sum: { $cond: [{ $in:  ["$status", [PayoutStatus.PENDING, PayoutStatus.PENDING]] }, "$amount", 0] } },
      },
    },
  ]);

  const r = raw[0];
  return {
    totalEarnings:      r?.totalEarnings      ?? 0,
    withdrawableAmount: r?.withdrawableAmount ?? 0,
    pendingAmount:      r?.pendingAmount      ?? 0,
    joinedSince:        joinedSince.toISOString(),
  };
}

async getRecent(beauticianId: string, limit: number): Promise<RecentPayoutDto[]> {
  const docs = await PayoutModel.find({
    beauticianId: new Types.ObjectId(beauticianId),
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return docs.map((d) => ({
    payoutId:  d._id.toString(),
    amount:    d.amount,
    status:    d.status,
    createdAt: d.createdAt.toISOString(),
  }));
}

  protected map(doc: PayoutDoc): Payout {
    const base = super.map(doc);

    return {
      id: base.id.toString(),
      paymentId: doc.paymentId.toString(),
      customerId: doc.customerId.toString(),
      beauticianId: doc.beauticianId.toString(),
      amount: doc.amount,
      status: doc.status,
      adminNote: doc.adminNote,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

import { Types } from "mongoose";
import { Payout } from "../../../domain/entities/payout";
import { PayoutStatus } from "../../../domain/enum/paymentEnum";

import { GenericRepository } from "../genericRepository";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { PayoutDoc, PayoutModel } from "../../database/models/user/payoutModal";
import { IPayoutRepository } from "../../../domain/repositoryInterface/User/admin/IPayoutRepository";

export class PayoutRepository
  extends GenericRepository<Payout, PayoutDoc>
  implements IPayoutRepository
{
  constructor() {
    super(PayoutModel);
  }

  async create(
    data: Omit<Payout, "id" | "createdAt" | "updatedAt">
  ): Promise<Payout> {
    const doc = await PayoutModel.create({
      ...data,
      paymentId:    new Types.ObjectId(data.paymentId),
      customerId:   new Types.ObjectId(data.customerId),
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

  protected map(doc: PayoutDoc): Payout {
    const base = super.map(doc);

    return {
      id:           base.id.toString(),
      paymentId:    doc.paymentId.toString(),
      customerId:   doc.customerId.toString(),
      beauticianId: doc.beauticianId.toString(),
      amount:       doc.amount,
      status:       doc.status,
      adminNote:    doc.adminNote,
      createdAt:    doc.createdAt,
      updatedAt:    doc.updatedAt,
    };
  }
}
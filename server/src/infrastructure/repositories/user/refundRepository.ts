
import { Types } from "mongoose";
import { Refund } from "../../../domain/entities/refund";
import { RefundMethod, RefundStatus } from "../../../domain/enum/paymentEnum";
import { IRefundRepository } from "../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { RefundDoc, RefundModel } from "../../database/models/user/refundModel";
import { GenericRepository } from "../genericRepository";

export class RefundRepository
  extends GenericRepository<Refund, RefundDoc>
  implements IRefundRepository
{
  constructor() {
    super(RefundModel);
  }

  async create(data: Omit<Refund, "id" | "createdAt" | "updatedAt">): Promise<Refund> {
    const doc = await RefundModel.create(data);
    return this.map(doc);
  }

  async findByPaymentId(paymentId: string): Promise<Refund | null> {
    const doc = await RefundModel.findOne({ paymentId });
    return doc ? this.map(doc) : null;
  }

  async updateStatus(
    id: string,
    status: string,
    extra?: Partial<Refund>,
  ): Promise<Refund | null> {
    const doc = await RefundModel.findByIdAndUpdate(
      id,
      { $set: { status, ...extra } },
      { new: true },
    );
    return doc ? this.map(doc) : null;
  }

  async updateById(id: string, data: Partial<Omit<Refund, "id">>): Promise<Refund | null> {
    const doc=await RefundModel.findByIdAndUpdate(id,
      {$set:data},
      {new:true}
    )
    return doc?this.map(doc):null
  }
  async findAll(params: {
  page:    number;
  limit:   number;
  status?: RefundStatus;
}): Promise<{ refunds: Refund[]; total: number }> {
  const { page, limit, status } = params;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const [docs, total] = await Promise.all([
    RefundModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    RefundModel.countDocuments(filter),
  ]);

  return {
    refunds: docs.map((doc) => this.map(doc)),
    total,
  };
}

async findById(id: string): Promise<Refund | null> {
  const doc = await RefundModel.findById(id);
  return doc ? this.map(doc) : null;
}

async getRefundsByUserId(userId: string): Promise<Refund[]> {
  const docs=await RefundModel.find({userId:new Types.ObjectId(userId),method:RefundMethod.WALLET})
  return docs.map((doc)=>this.map(doc))
}

  protected map(doc: RefundDoc): Refund {
    const base = super.map(doc);
    return {
      id:               base.id.toString(),
      userId:doc.userId.toString(),
      paymentId:        doc.paymentId.toString(),
      amount:           doc.amount,
      method:           doc.method,
      status:           doc.status,
      refundType:       doc.refundType,
      razorpayRefundId: doc.razorpayRefundId,
      reason:           doc.reason,
      adminNote:doc.adminNote,
      processedAt:      doc.processedAt,
      createdAt:        doc.createdAt,
      updatedAt:        doc.updatedAt,
    };
  }
}
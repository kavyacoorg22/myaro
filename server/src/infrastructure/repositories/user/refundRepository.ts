
import { Refund } from "../../../domain/entities/refund";
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

  protected map(doc: RefundDoc): Refund {
    const base = super.map(doc);
    return {
      id:               base.id.toString(),
      paymentId:        doc.paymentId.toString(),
      amount:           doc.amount,
      method:           doc.method,
      status:           doc.status,
      refundType:       doc.refundType,
      razorpayRefundId: doc.razorpayRefundId,
      reason:           doc.reason,
      processedAt:      doc.processedAt,
      createdAt:        doc.createdAt,
      updatedAt:        doc.updatedAt,
    };
  }
}
import { Notification } from "../../../domain/entities/notification";
import { INotificationRepository } from "../../../domain/repositoryInterface/User/INotificationRepository";
import { NotificationDoc, NotificationModel } from "../../database/models/user/notifiactionMdel";

import { GenericRepository } from "../genericRepository";
import { Types } from "mongoose";

export class NotificationRepository
  extends GenericRepository<Notification, NotificationDoc>
  implements INotificationRepository {

  constructor() {
    super(NotificationModel);
  }

  async create(
    data: Omit<Notification, "id" | "createdAt" | "updatedAt">
  ): Promise<Notification> {
    const doc = await NotificationModel.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      metadata: data.metadata
        ? {
            bookingId: data.metadata.bookingId
              ? new Types.ObjectId(data.metadata.bookingId)
              : undefined,
            paymentId: data.metadata.paymentId
              ? new Types.ObjectId(data.metadata.paymentId)
              : undefined,
            refundId: data.metadata.refundId
              ? new Types.ObjectId(data.metadata.refundId)
              : undefined,
          }
        : undefined,
    });

    return this.map(doc);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const docs = await NotificationModel.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    })
      .sort({ createdAt: -1 });

    return docs.map((doc) => this.map(doc));
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const docs = await NotificationModel.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
      isRead: false,
    })
      .sort({ createdAt: -1 });

    return docs.map((doc) => this.map(doc));
  }

  async markAsRead(notificationId: string): Promise<void> {
    const result = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true }
    );

    if (!result) throw new Error("Notification not found");
  }

  async markAllAsRead(userId: string): Promise<void> {
  await NotificationModel.updateMany(
    { userId: new Types.ObjectId(userId), isRead: false },
    { $set: { isRead: true } }
  )
}

  async deleteNotification(notificationId: string): Promise<void> {
    const result = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isDeleted: true }
    );

    if (!result) throw new Error("Notification not found");
  }

  async clearAllNotifications(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { userId: new Types.ObjectId(userId), isDeleted: false },
      { isDeleted: true }
    );
  }

   async findDueNotifications(now: Date): Promise<Notification[]> {
    const docs = await NotificationModel.find({
      scheduledFor: { $lte: now },   // due time reached
      isSent:       false,           // not already sent
      isDeleted:    false,
    }).limit(50)                    

    return docs.map(this.map)
  }

   async markAsSent(id: string): Promise<void> {
    await NotificationModel.updateOne({ _id: id }, { $set: { isSent: true } })
  }

  protected map(doc: NotificationDoc): Notification {
    const base = super.map(doc);

    return {
      id: base.id.toString(),
      userId: doc.userId.toString(),
      type: doc.type,
      category: doc.category,
      title: doc.title,
      message: doc.message,
      metadata: doc.metadata
        ? {
            bookingId: doc.metadata.bookingId?.toString(),
            paymentId: doc.metadata.paymentId?.toString(),
            refundId: doc.metadata.refundId?.toString(),
          }
        : undefined,
      isRead: doc.isRead,
      isDeleted: doc.isDeleted,
      scheduledFor: doc.scheduledFor,
      isSent:doc.isSent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
import { NotificationCategory, NotificationType } from "../../domain/enum/notificationEnum";
import { INotificationRepository } from "../../domain/repositoryInterface/User/INotificationRepository";
import { ISocketEmitter } from "../serviceInterface/ISocketEmitter";
import { SOCKET_EVENTS } from "../events/socketEvents";

export interface INotifyInput {
  userId:    string;
  type:      NotificationType;
  category:  NotificationCategory;
  title:     string;
  message:   string;
  socketEvent: string;
  socketPayload: Record<string, unknown>;
  metadata?: {
    bookingId?: string;
    paymentId?: string;
    refundId?:  string;
  };
}

export class NotificationDispatchService {
  constructor(
    private notificationRepo: INotificationRepository,
    private socketEmitter:    ISocketEmitter,
  ) {}

  async notify(input: INotifyInput): Promise<void> {

    await this.notificationRepo.create({
      userId:   input.userId,
      type:     input.type,
      category: input.category,
      title:    input.title,
      message:  input.message,
      metadata: input.metadata,
      isRead:false,
      isDeleted:false,
      isSent:true
    });

    // ── 2. Emit socket ─────────────────────────────────────────────────────
    this.socketEmitter.emitToRoom(
      `user:${input.userId}`,
      input.socketEvent,
      input.socketPayload,
    );

    this.socketEmitter.emitToRoom(
      `user:${input.userId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        title:         input.title,
        message:       input.message,
        lastMessageAt: new Date(),
      },
    );
  }
}
import cron from "node-cron";
import { INotificationRepository } from "../../domain/repositoryInterface/User/INotificationRepository";
import { ISocketEmitter } from "../../application/serviceInterface/ISocketEmitter";
import { SOCKET_EVENTS } from "../../application/events/socketEvents";
import { IBookingRepository } from "../../domain/repositoryInterface/User/booking/IBookingRepository";
import { BookingStatus } from "../../domain/enum/bookingEnum";

export class NotificationCron {
  constructor(
    private notificationRepo: INotificationRepository,
    private socketEmitter: ISocketEmitter,
    private bookingRepo: IBookingRepository,
  ) {}

  start(): void {
    cron.schedule("*/1 * * * *", async () => {
      const now = new Date();
      const due = await this.notificationRepo.findDueNotifications(now);

      if (!due.length) return;




      for (const notif of due) {
          if (!notif.scheduledFor) continue;

          const scheduledTime = new Date(notif.scheduledFor).getTime();
    const nowTime = now.getTime();
    
    if (nowTime - scheduledTime > 2 * 60 * 1000) {
      await this.notificationRepo.markAsSent(notif.id);
      continue;
    }
        if (notif.metadata?.bookingId) {
          const booking = await this.bookingRepo.findById(
            notif.metadata.bookingId,
          );

          if (!booking || booking.status !== BookingStatus.CONFIRMED) {
            continue;
          }
        }
        this.socketEmitter.emitToRoom(
          `user:${notif.userId}`,
          SOCKET_EVENTS.NEW_NOTIFICATION,
          {
            id: notif.id,
            title: notif.title,
            message: notif.message,
            category: notif.category,
            metadata: notif.metadata,
          },
        );

        await this.notificationRepo.markAsSent(notif.id);
      }

    });
  }
}

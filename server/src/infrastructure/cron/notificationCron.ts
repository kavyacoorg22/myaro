import cron from 'node-cron'
import { INotificationRepository } from '../../domain/repositoryInterface/User/INotificationRepository'
import { ISocketEmitter } from '../../application/serviceInterface/ISocketEmitter'
import { SOCKET_EVENTS } from '../../application/events/socketEvents'


export class NotificationCron {
  constructor(
    private notificationRepo: INotificationRepository,
    private socketEmitter: ISocketEmitter,
  ) {}

  start(): void {
    cron.schedule('*/1 * * * *', async () => {
      const now = new Date()
      const due = await this.notificationRepo.findDueNotifications(now)

      if (!due.length) return

      for (const notif of due) {
        this.socketEmitter.emitToRoom(
          `user:${notif.userId}`,
          SOCKET_EVENTS.NEW_NOTIFICATION,
          {
            id:       notif.id,
            title:    notif.title,
            message:  notif.message,
            category: notif.category,
            metadata: notif.metadata,
          }
        )

        await this.notificationRepo.markAsSent(notif.id)
      }

      console.log(`[NotificationCron] Sent ${due.length} notification(s)`)
    })
  }
}
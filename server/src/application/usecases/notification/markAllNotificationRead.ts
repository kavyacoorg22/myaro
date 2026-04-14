import { INotificationRepository } from "../../../domain/repositoryInterface/User/INotificationRepository"

export class MarkAllNotificationsReadUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<void> {

    const unread = await this.notificationRepo.getUnreadNotifications(userId)

    if (unread.length === 0) return

    await this.notificationRepo.markAllAsRead(userId)
  }
}
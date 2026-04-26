import { INotificationRepository } from "../../../domain/repositoryInterface/User/INotificationRepository";

export class MarkAllNotificationsReadUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<void> {
    const unread = await this._notificationRepo.getUnreadNotifications(userId);

    if (unread.length === 0) return;

    await this._notificationRepo.markAllAsRead(userId);
  }
}

import { INotificationRepository } from "../../../domain/repositoryInterface/User/INotificationRepository"
import { IGetUserNotificationsUseCase } from "../../interface/notification/IGetNotification"
import { IGetUserNotificationsOutput } from "../../interfaceType/notificationType"
import { toNotificationDto } from "../../mapper/userMapper"


export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<IGetUserNotificationsOutput> {
    const notifications = await this.notificationRepo.getUserNotifications(userId)

    const active = notifications.filter(n => !n.isDeleted)

    const unreadCount = active.filter(n => !n.isRead).length

    return {
      notifications: active.map(toNotificationDto),
      unreadCount,
    }
  }
}
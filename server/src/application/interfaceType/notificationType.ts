import { INotificationDto } from "../dtos/notification"

export interface IGetUserNotificationsOutput {
  notifications: INotificationDto[]
  unreadCount: number
}

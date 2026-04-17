import { Notification } from "../../domain/entities/notification"
import { NotificationCategory, NotificationType } from "../../domain/enum/notificationEnum"
import { INotificationDto } from "../dtos/notification"

export interface IGetUserNotificationsOutput {
  notifications: INotificationDto[]
  unreadCount: number
}

export interface ScheduleNotificatonInput {
  userId:     string
  type:       NotificationType
  category:   NotificationCategory
  title:      string
  message:    string
  metadata?:  Notification['metadata']
  scheduledFor: Date              
}
import { Notification } from "../../entities/notification";

export interface INotificationRepository {
  createNotification(data: Notification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  clearAllNotifications(userId: string): Promise<void>;
}

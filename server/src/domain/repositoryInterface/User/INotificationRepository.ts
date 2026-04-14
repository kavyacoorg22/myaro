import { Notification } from "../../entities/notification";

export interface INotificationRepository {
  create(data: Omit<Notification,'id'|'updatedAt'|'createdAt'>): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  clearAllNotifications(userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>  

}

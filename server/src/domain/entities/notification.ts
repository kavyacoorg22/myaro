import { NotificationCategory, NotificationType } from "../enum/notificationEnum"


export interface Notification {
  id: string
  userId: string
  type: NotificationType
  category: NotificationCategory
  title?: string
  message: string
  metadata?: {
    bookingId?: string
    paymentId?: string
    refundId?: string
  }
  isRead: boolean
  isDeleted: boolean
  scheduledFor?: Date 
  isSent:boolean  
  createdAt: Date
  updatedAt: Date
}
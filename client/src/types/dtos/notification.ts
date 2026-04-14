

export interface INotificationDto {
  id: string
  type: string
  category: string
  title: string
  message: string
  metadata?: {
    bookingId?: string
    paymentId?: string
    refundId?: string
  }
  isRead: boolean
  createdAt: string
}
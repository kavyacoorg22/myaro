export enum NotificationType {
  REFUND_PROCESSED = "refund_processed",
  REFUND_FAILED = "refund_failed",

  DISPUTE_CREATED = "dispute_created",
  DISPUTE_RESOLVED = "dispute_resolved",

  REMINDER = "reminder",
  BOOKING = "booking",
  PAYMENT = "payment",
}

export enum NotificationCategory {
  REFUND = "refund",
  DISPUTE = "dispute",
  SYSTEM = "system",
  BOOKING = "booking",
}

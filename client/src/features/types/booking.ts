export type BookingStatus = "pending" | "confirmed" | "rejected" | "rescheduled";

export interface BookingCardProps {
  service: string;
  status: BookingStatus;
  onConfirm?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  reason?: string;
}
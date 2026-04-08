import { BookingAction, BookingStatus } from "../enum/bookingEnum";

export const VALID_TRANSITIONS: Record<BookingStatus, BookingAction[]> = {
  [BookingStatus.REQUESTED]:        [BookingAction.ACCEPT, BookingAction.REJECT, BookingAction.CANCEL],
  [BookingStatus.ACCEPTED]:         [BookingAction.CONFIRM, BookingAction.CANCEL],
  [BookingStatus.CONFIRMED]:        [BookingAction.COMPLETE, BookingAction.CANCEL],
  [BookingStatus.COMPLETED]:        [BookingAction.REQUEST_REFUND],
  [BookingStatus.REJECTED]:         [],
  [BookingStatus.CANCELLED]:        [],
  [BookingStatus.REFUND_REQUESTED]: [BookingAction.APPROVE_REFUND, BookingAction.DISPUTE],
  [BookingStatus.REFUND_APPROVED]:  [BookingAction.PROCESS_REFUND], // ← admin processes
  [BookingStatus.DISPUTE]:          [BookingAction.PROCESS_REFUND], // ← admin resolves
  [BookingStatus.CLOSED]:           [],                             // ← terminal
};

export const ACTION_TO_STATUS: Record<BookingAction, BookingStatus> = {
  [BookingAction.REQUEST]:        BookingStatus.REQUESTED,
  [BookingAction.ACCEPT]:         BookingStatus.ACCEPTED,
  [BookingAction.REJECT]:         BookingStatus.REJECTED,
  [BookingAction.CONFIRM]:        BookingStatus.CONFIRMED,
  [BookingAction.COMPLETE]:       BookingStatus.COMPLETED,
  [BookingAction.CANCEL]:         BookingStatus.CANCELLED,
  [BookingAction.REQUEST_REFUND]: BookingStatus.REFUND_REQUESTED,
  [BookingAction.APPROVE_REFUND]: BookingStatus.REFUND_APPROVED,
  [BookingAction.DISPUTE]:        BookingStatus.DISPUTE,
  [BookingAction.PROCESS_REFUND]: BookingStatus.CLOSED,            // ← final state
};

export const ACTION_MESSAGE: Record<BookingAction, string> = {
  [BookingAction.REQUEST]:        "Booking requested",
  [BookingAction.ACCEPT]:         "Booking accepted",
  [BookingAction.REJECT]:         "Booking rejected",
  [BookingAction.CONFIRM]:        "Booking confirmed",
  [BookingAction.COMPLETE]:       "Booking completed",
  [BookingAction.CANCEL]:         "Booking cancelled",
  [BookingAction.REQUEST_REFUND]: "Refund requested",
  [BookingAction.APPROVE_REFUND]: "Refund approved by beautician",
  [BookingAction.DISPUTE]:        "Refund disputed by beautician",
  [BookingAction.PROCESS_REFUND]: "Refund processed by admin",     // ← add
};
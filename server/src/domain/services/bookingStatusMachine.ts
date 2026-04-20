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
  [BookingAction.PROCESS_REFUND]: BookingStatus.CLOSED,  
  [BookingAction.RELEASE_PAYOUT]:BookingStatus.CLOSED          
};

export const ACTION_TITLE: Record<BookingAction, string> = {
  [BookingAction.REQUEST]:        "New Booking Request",
  [BookingAction.ACCEPT]:         "Booking Accepted",
  [BookingAction.REJECT]:         "Booking Rejected",
  [BookingAction.CONFIRM]:        "Booking Confirmed",
  [BookingAction.COMPLETE]:       "Booking Completed",
  [BookingAction.CANCEL]:         "Booking Cancelled",
  [BookingAction.REQUEST_REFUND]: "Refund Requested",
  [BookingAction.APPROVE_REFUND]: "Refund Approved",
  [BookingAction.DISPUTE]:        "Refund Disputed",
  [BookingAction.PROCESS_REFUND]: "Refund Processed",
  [BookingAction.RELEASE_PAYOUT]: "Payout Released",
};

export const ACTION_MESSAGE: Record<BookingAction, string> = {
  [BookingAction.REQUEST]:        "You have a new booking request.",
  [BookingAction.ACCEPT]:         "Your booking has been accepted.",
  [BookingAction.REJECT]:         "Your booking has been rejected.",
  [BookingAction.CONFIRM]:        "Your booking is confirmed.",
  [BookingAction.COMPLETE]:       "Your booking has been marked as completed.",
  [BookingAction.CANCEL]:         "A booking has been cancelled by the customer.",
  [BookingAction.REQUEST_REFUND]: "A refund has been requested for this booking.",
  [BookingAction.APPROVE_REFUND]: "Your refund has been approved and will be processed shortly.",
  [BookingAction.DISPUTE]:        "The beautician has raised a dispute on the refund request.",
  [BookingAction.PROCESS_REFUND]: "Your refund has been processed successfully.",
  [BookingAction.RELEASE_PAYOUT]: "Your payout has been released to your account.",
};

export const CHAT_ACTION_MESSAGE: Record<BookingAction, string> = {
  [BookingAction.REQUEST]:        "New booking request submitted.",
  [BookingAction.ACCEPT]:         "Your booking has been accepted. Please complete the payment to confirm.",
  [BookingAction.REJECT]:         "Unfortunately your booking has been rejected.",
  [BookingAction.CONFIRM]:        "Payment received. Your booking is confirmed!",
  [BookingAction.COMPLETE]:       "This appointment has been marked as completed. Thank you!",
  [BookingAction.CANCEL]:         "This booking has been cancelled by the customer. A refund has been initiated.",
  [BookingAction.REQUEST_REFUND]: "A refund has been requested for this booking.",
  [BookingAction.APPROVE_REFUND]: "Your refund has been approved and will be processed shortly.",
  [BookingAction.DISPUTE]:        "The beautician has raised a dispute on this refund request. An admin will review it.",
  [BookingAction.PROCESS_REFUND]: "Your refund has been processed and credited to your account.",
  [BookingAction.RELEASE_PAYOUT]: "Your payout has been released to your account.",
};
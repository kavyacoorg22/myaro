import { BookingAction, BookingStatus } from "../enum/bookingEnum";

export const VALID_TRANSITIONS: Record<BookingStatus, BookingAction[]> = {
  [BookingStatus.REQUESTED]:  [BookingAction.ACCEPT, BookingAction.REJECT, BookingAction.CANCEL],
  [BookingStatus.ACCEPTED]:   [BookingAction.CONFIRM, BookingAction.CANCEL],
  [BookingStatus.CONFIRMED]:  [BookingAction.COMPLETE, BookingAction.CANCEL],
  [BookingStatus.COMPLETED]: [ BookingAction.REQUEST_REFUND],[BookingStatus.REJECTED]:   [],
  [BookingStatus.CANCELLED]:  [],
  [BookingStatus.DISPUTE]:    [],
  [BookingStatus.REFUND_REQUESTED]:[BookingAction.APPROVE_REFUND,BookingAction.DISPUTE],
   [BookingStatus.CLOSED]: [],
   [BookingStatus.REFUND_APPROVED]:[]
};

export const ACTION_TO_STATUS: Record<BookingAction, BookingStatus> = {
  [BookingAction.REQUEST]: BookingStatus.REQUESTED,
  [BookingAction.ACCEPT]:  BookingStatus.ACCEPTED,
  [BookingAction.REJECT]:  BookingStatus.REJECTED,
  [BookingAction.COMPLETE]: BookingStatus.COMPLETED,
  [BookingAction.CANCEL]:  BookingStatus.CANCELLED,
  [BookingAction.CONFIRM]: BookingStatus.CONFIRMED,
    [BookingAction.REQUEST_REFUND]: BookingStatus.REFUND_REQUESTED,
    [BookingAction.APPROVE_REFUND]:BookingStatus.REFUND_APPROVED,
    [BookingAction.DISPUTE]:BookingStatus.DISPUTE

};

export const ACTION_MESSAGE: Record<BookingAction, string> = {
  [BookingAction.REQUEST]: "Booking requested",
  [BookingAction.ACCEPT]:  "Booking accepted",
  [BookingAction.REJECT]:  "Booking rejected",
  [BookingAction.COMPLETE]: "Booking completed",
  [BookingAction.CANCEL]:  "Booking cancelled",
  [BookingAction.CONFIRM]: "Booking confirmed",
    [BookingAction.REQUEST_REFUND]: "Refund requested",
    [BookingAction.APPROVE_REFUND]:'Approve Refund',
    [BookingAction.DISPUTE]:'Refund disputed'

};


export function isValidTransition(
  current: BookingStatus,
  action: BookingAction
): boolean {
  return VALID_TRANSITIONS[current].includes(action);
}
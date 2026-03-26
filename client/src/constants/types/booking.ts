export const BookingStatus={
  REQUESTED:'requested',
  ACCEPTED:'accepted',
  REJECTED:'rejected',
  COMPLETED:'completed',
  CANCELLED:'cancelled',
  CONFIRMED:'confirmed',
  DISPUTE:'dispute'
}

export const BookingAction={
  REQUEST:'request',
  ACCEPT:'accept',
  REJECT:'reject',
  COMPLETE:'complete',
  CANCEL:'cancel',
  CONFIRM:'confirm',
}

export type BookingStatusType=(typeof BookingStatus)[keyof typeof BookingStatus]
export type BookingActionType=(typeof BookingAction)[keyof typeof BookingAction]
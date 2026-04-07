export enum BookingStatus{
  REQUESTED='requested',
  ACCEPTED='accepted',
  REJECTED='rejected',
  COMPLETED='completed',
  CANCELLED='cancelled',
  CONFIRMED='confirmed',
  DISPUTE='dispute',
  REFUND_REQUESTED='refund_requested',
  REFUND_APPROVED='refund_approved',
  CLOSED='closed'
}

export enum BookingAction{
  REQUEST='request',
  ACCEPT='accept',
  REJECT='reject',
  COMPLETE='complete',
  CANCEL='cancel',
  CONFIRM='confirm',
  REQUEST_REFUND='refund_request',
  APPROVE_REFUND='approve_refund'
}
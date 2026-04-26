export const bookingMessages = {
  SUCCESS: {
    CREATED: "Booking created successfully",
    FETCHED: "Booking fetched successfully",
    LIST_FETCHED: "Bookings fetched successfully",
    STATUS_UPDATED: "Booking status updated successfully",
    SLOT_RESERVED: "Slot reserved",
    REFUND_REQUESTED: "Refund requested successfully",
    REFUND_APPROVED: "Refund approved successfully",
    REFUND_DISPUTED: "Refund disputed successfully",
    CANCELLED: "Booking cancelled successfully",
    DISPUTES_FETCHED: "Disputes fetched successfully",
    DISPUTE_FETCHED: "Dispute details fetched successfully",
    REFUNDS_FETCHED: "Refunds fetched successfully",
    REFUND_FETCHED: "Refund details fetched successfully",
  },

  ERROR: {
    NOT_FOUND: "Booking not found",
    INVALID_INPUT: "Invalid booking input",
    BOOKING_UPDATE_FAILED: "Failed to update booking.",
    CANCLE_NOT_ALLOWED:
      "Cancellation is not allowed within 3 days of the booking date.",
    INVALID_TRANSITION: (action: string, status: string) =>
      `Cannot ${action} a booking that is ${status}.`,
    ALREADY_PAID: "Booking already paid",
  },
};

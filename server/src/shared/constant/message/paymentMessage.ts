export const paymentMessages = {
  SUCCESS: {
    ORDER_CREATED: "Order created successfully",
    PAYMENT_VERIFIED: "Payment verified successfully",
    REFUND_PROCESSED: "Refund processed successfully",
    PAYOUT_RELEASED: "Payout released successfully",
    REFUND_SUMMARY_FETCHED: "Refund summary fetched successfully",
  },

  ERROR: {
    NOT_FOUND: "Payment not found",
    REFUND_NOT_FOUND: "Refund not found",
    RAZORPAY_ID_MISSING: "Razorpay payment ID missing. Cannot process refund.",
    REFUND_ALREADY_PROCESSED: "Refund already processed.",
    REFUND_ALREDY_EXISTS:"A refund for this booking already exists.",
    REFUND_UPDATE_FAILED: "Failed to update refund.",
     PAYOUT_ALREADY_COMPLETED: "Payout already completed.",
    PAYMENT_IN_PROGRESS: "Payment already in progress", 
    INVALID_PAYMENT_SIGNATURE:"Invalid payment signature",
  },
};
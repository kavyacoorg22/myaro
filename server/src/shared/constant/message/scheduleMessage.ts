export const scheduleMessages = {
  SUCCESS: {
    CREATED: "Schedule added successfully",
    DELETED: "Schedule deleted successfully",
    RECURRING_DELETED: "Recurring slot removed for this date",
    FETCHED: "Schedule data fetched successfully",
    MONTH_FETCHED: "Monthly availability fetched successfully",
  },

  ERROR: {
    INVALID_SLOT_TIME_FORMAT: "Invalid slot time format",
    INVALID_DATE: "Invalid date provided",
    INVALID_INPUT: "Invalid schedule input",
    SLOT_RESERVED:"Slot is temporarily reserved by another user",
    SLOT_RESERVATION_EXPIRED:
      "Slot reservation expired. Please select the slot again.",
    SLOT_ALREADY_BOOKED: "This time slot is already booked",
    NOT_FOUND: "Schedule not found",
    LEAVE_CONFLICT: (date: string) =>
      `Cannot add availability on ${date} — it is marked as leave`,
    SLOT_OVERLAP: (
      start: string,
      end: string,
      nextStart: string,
      nextEnd: string,
    ) => `Time slot ${start}–${end} overlaps with ${nextStart}–${nextEnd}`,
  },

  INFO: {
    EMPTY: "No schedule available",
  },
};

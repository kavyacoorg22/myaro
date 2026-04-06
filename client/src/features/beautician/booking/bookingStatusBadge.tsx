import React from "react";
import { BookingStatus, type BookingStatusType } from "../../../constants/types/booking";


interface Props {
  status: BookingStatusType;
}

const statusConfig: Record<BookingStatusType, { label: string; className: string }> = {
  [BookingStatus.CONFIRMED]: {
    label: "confirmed",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  [BookingStatus.REQUESTED]: {
    label: "requested",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  },
  [BookingStatus.ACCEPTED]: {
    label: "accepted",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  [BookingStatus.REJECTED]: {
    label: "rejected",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
  [BookingStatus.COMPLETED]: {
    label: "completed",
    className: "bg-purple-100 text-purple-700 border border-purple-200",
  },
  [BookingStatus.CANCELLED]: {
    label: "cancelled",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  [BookingStatus.DISPUTE]: {
    label: "dispute",
    className: "bg-orange-100 text-orange-700 border border-orange-200",
  },
};

const BookingStatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;
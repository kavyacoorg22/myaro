import React, { useState } from "react";
import { Calendar, Clock, MapPin, MessageSquare } from "lucide-react";
import type { IBookingListItem } from "../../../types/api/booking";
import BookingStatusBadge from "./bookingStatusBadge";
import BookingDetailsModal from "./bookingDetailModal";
import { formatDate } from "../../../lib/utils/bookingDate";
import { useNavigate } from "react-router";



interface Props {
  item: IBookingListItem;
  variant: "upcoming" | "completed" | "cancelled";
}

const BookingCard: React.FC<Props> = ({ item, variant }) => {
  const { booking, user } = item;
  const [showDetails, setShowDetails] = useState(false);
  const navigate=useNavigate()

 

  return (
    <>
      <div
        className={`bg-white rounded-2xl border ${
          variant === "cancelled" ? "border-red-100" : "border-gray-100"
        } shadow-sm p-4 space-y-3`}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="text-sm font-semibold text-gray-800">{user.fullName}</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-bold text-gray-900">₹{booking.totalPrice}</span>
            {variant === "upcoming" && <BookingStatusBadge status={booking.status} />}
          </div>
        </div>

        {/* Service names for completed/cancelled */}
        {(variant === "completed" || variant === "cancelled") && (
          <p
            className={`text-sm font-medium ${
              variant === "completed" ? "text-violet-500" : "text-gray-400"
            }`}
          >
            {booking.services.map((s) => s.name).join(" & ")}
          </p>
        )}

        {/* Date & time row */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-gray-400" />
            {formatDate(booking.slot.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-gray-400" />
            {booking.slot.time}
          </span>
          {variant === "upcoming" && (
            <span className="flex items-center gap-1 text-violet-500 cursor-pointer hover:underline">
              <MapPin size={13} />
              Location
            </span>
          )}
        </div>

        {/* Cancellation reason */}
        {variant === "cancelled" && booking.rejectionReason && (
          <p className="text-xs text-red-500">Reason : {booking.rejectionReason}</p>
        )}

        {/* Action buttons for upcoming */}
        {variant === "upcoming" && (
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              View details
            </button>
            <button onClick={()=>navigate(`/chat/${booking.chatId}`,{state:{fullName:user.userName,userName:user.userName,profileImg:user.profileImg}})}className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
              <MessageSquare size={14} />
              Contact
            </button>
          </div>
        )}
      </div>

      {showDetails && (
        <BookingDetailsModal booking={booking} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
};

export default BookingCard;
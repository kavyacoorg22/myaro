import { useState } from "react";
import type { IGetBookingByIdDto } from "../../../../types/dtos/booking";

export const BookingDetailModal = ({
  booking,
  loading,
  onClose,
  onAccept,
  onReject,
}: {
  booking:  IGetBookingByIdDto;
  loading:  boolean;
  onClose:  () => void;
  onAccept: () => void;
  onReject: (reason: string) => void;
}) => {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason]       = useState("");
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-5 w-[360px] max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <p className="text-sm font-bold mb-4">Home service request</p>
 
        {/* User info */}
        <div className="text-xs text-gray-600 space-y-1 mb-4">
          <p>
            <span className="text-gray-400 w-20 inline-block">Full Name:</span>
            {booking.fullName}
          </p>
          <p>
            <span className="text-gray-400 w-20 inline-block">Phone:</span>
            {booking.phoneNumber}
          </p>
          <p>
            <span className="text-gray-400 w-20 inline-block">Address:</span>
            {booking.address}
          </p>
        </div>
 
        {/* Services */}
        <div className="border-t border-gray-100 pt-3 mb-4">
          <p className="text-xs text-indigo-500 font-semibold mb-2">
            Services Requested
          </p>
          {booking.services.map((s, i) => (
            <div
              key={i}
              className="flex justify-between text-xs text-gray-700 py-0.5"
            >
              <span>{s.name}</span>
              <span>{s.price}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-bold mt-2 border-t border-gray-100 pt-2">
            <span>Total amount</span>
            <span className="text-indigo-600">₹{booking.totalPrice}</span>
          </div>
        </div>
 
        {/* Slot */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 font-semibold mb-2">
            Preferred Slot
          </p>
          <div className="flex items-center gap-2 border border-indigo-300 rounded-xl px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
            <span className="text-xs text-gray-700">
              {new Date(booking.slot.date).toLocaleDateString()} –{" "}
              {booking.slot.time}
            </span>
          </div>
        </div>
 
        {/* Rejection reason input */}
        {rejecting && (
          <div className="mb-3">
            <textarea
              className="w-full text-xs border border-gray-200 rounded-xl p-2 resize-none outline-none focus:border-rose-300"
              rows={3}
              placeholder="Reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
 
        {/* Actions */}
        <div className="flex gap-3">
          {!rejecting ? (
            <>
              <button
                onClick={onAccept}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => setRejecting(true)}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-rose-400 text-white text-sm font-semibold hover:bg-rose-500 transition disabled:opacity-50"
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onReject(reason)}
                disabled={loading || !reason.trim()}
                className="flex-1 py-2 rounded-xl bg-rose-400 text-white text-sm font-semibold hover:bg-rose-500 transition disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => { setRejecting(false); setReason(""); }}
                className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-semibold transition"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
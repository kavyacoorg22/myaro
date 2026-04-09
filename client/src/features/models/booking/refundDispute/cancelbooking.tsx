import { useState } from "react";
import { BookingApi } from "../../../../services/api/booking";
import { handleApiError } from "../../../../lib/utils/handleApiError";

interface CancelBookingModalProps {
  bookingId: string;
  services: string[];
  date: string;
  totalAmount: number;
  onClose: () => void;
  onCancelled: () => void;
}

export const CancelBookingModal = ({
  bookingId,
  services,
  date,
  totalAmount,
  onClose,
  onCancelled,
}: CancelBookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await BookingApi.cancelRefund(bookingId);
      setShowConfirmation(true);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Refund Confirmation Screen ─────────────────────────────────────────────
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl w-[340px] p-6 flex flex-col items-center text-center">
          <div className="text-5xl mb-3">💰</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Refund Confirmation
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Refund initiated due to customer cancellation. Your refund will be
            processed automatically via Razorpay.
          </p>

          <div className="w-full text-sm space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Service:</span>
              <span className="font-semibold text-gray-800">
                {services.join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Booking Date:</span>
              <span className="font-semibold text-gray-800">{date}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray-500">Refund Amount:</span>
              <span className="font-bold text-green-600">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          <div className="w-full bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
            <p className="text-xs text-green-700 text-center">
              ✓ Refund will be credited to your original payment method within
              5–7 business days.
            </p>
          </div>

          <button
            onClick={onCancelled}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            OK
          </button>

          <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
            🔒 Secured by Razorpay
          </p>
        </div>
      </div>
    );
  }

  // ── Cancel Confirmation Screen ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[340px] p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚠️</span>
          <h2 className="text-base font-bold text-red-600">
            Cancel Service Booking
          </h2>
        </div>

        <p className="text-sm text-gray-700 font-medium mb-4">
          Are you sure you want to cancel this appointment?
        </p>

        {/* Booking details */}
        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Service:</span>
            <span className="font-medium text-gray-800">
              {services.join(", ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium text-gray-800">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-medium text-gray-800">₹{totalAmount}</span>
          </div>
        </div>

        {/* Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-5">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Note: </span>
            Cancelling this booking will initiate an automatic refund process.
            You cannot reschedule once canceled.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Keep booking
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60"
          >
            {loading ? "Cancelling..." : "Yes, cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
};
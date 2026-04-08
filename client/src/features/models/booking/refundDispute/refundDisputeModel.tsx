import { useState } from "react";
import type { IGetBookingByIdDto } from "../../../../types/dtos/booking";
import { BookingApi } from "../../../../services/api/booking";
import { handleApiError } from "../../../../lib/utils/handleApiError";

interface DisputeRefundModalProps {
  booking: IGetBookingByIdDto;
  onClose: () => void;
  onDisputed: () => void;
}

export const DisputeRefundModal = ({
  booking,
  onClose,
  onDisputed,
}: DisputeRefundModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please describe why you disagree with the refund.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await BookingApi.disputeRefund(booking.id, reason.trim());
      onDisputed();
      onClose();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[340px] p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-orange-500 font-semibold text-base">
          Dispute Refund Request
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 -mt-2">
          Please describe why you disagree with the refund.
        </p>

        {/* Textarea */}
        <textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError("");
          }}
          placeholder="Example – customer canceled after I arrived at their location..."
          rows={4}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
        />

        {/* Note box */}
        <div className="bg-amber-50 rounded-xl px-3 py-2 flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-gray-700">Note</p>
          <p className="text-xs text-gray-500">
            Please describe why you disagree with the refund.
          </p>
        </div>

        {/* Inline error */}
        {error && (
          <p className="text-xs text-rose-500 -mt-2">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            disabled={loading}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-medium text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
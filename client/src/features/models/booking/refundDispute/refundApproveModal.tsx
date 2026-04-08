
import { useState } from "react";
import type { IGetBookingByIdDto } from "../../../../types/dtos/booking";
import { BookingApi } from "../../../../services/api/booking";
import { handleApiError } from "../../../../lib/utils/handleApiError";
import { RefundApprovedModal } from "./refundApprovedModal";
import { DisputeRefundModal } from "./refundDisputeModel";

interface RefundApproveModalProps {
  booking: IGetBookingByIdDto;
  onClose: () => void;
  onDispute: () => void;
  onApproved: () => void; }
 
export const RefundApproveModal = ({
  booking,
  onClose,
  onDispute,
  onApproved,
}: RefundApproveModalProps) => {
  const [loading, setLoading]   = useState(false);
  const [approved, setApproved] = useState(false);
  const [disputing, setDisputing] = useState(false);

 
  const serviceDate = booking.slot.date
    ? new Date(booking.slot.date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }) +
      " – " +
      new Date(booking.slot.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
 
  const amount       = booking.totalPrice ?? booking.totalPrice ?? "—";
  const customerName = booking.fullName ?? booking.fullName ?? "Customer";
 
  const handleApprove = async () => {
    setLoading(true);
    try {
      await BookingApi.approverefund(booking.id);
      setApproved(true);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleApprovedClose = () => {
    setApproved(false);
    onApproved();
    onClose();
  };
 
  // ── Show success modal after approval ──────────────────────────────────────
  if (approved) {
    return <RefundApprovedModal onClose={handleApprovedClose} />;
  }

  if (disputing) {
  return (
    <DisputeRefundModal
      booking={booking}
      onClose={() => setDisputing(false)}
      onDisputed={onDispute}
    />
  );
}
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-amber-50 rounded-2xl shadow-xl w-[340px] p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-orange-500 font-semibold text-base">
          Refund Request Received
        </h2>
 
        {/* Details */}
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex gap-4">
            <span className="text-gray-500 w-28">Customer:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500 w-28">Service Date:</span>
            <span className="font-medium">{serviceDate}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500 w-28">Amount:</span>
            <span className="font-medium">{amount}</span>
          </div>
        </div>
 
        {/* Reason box */}
        <div className="bg-white rounded-xl p-3 flex flex-col gap-1 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Reason</p>
          <p className="text-sm text-gray-600 italic">
            "{booking.refundReason ?? "No reason provided."}"
          </p>
        </div>
 
        {/* Helper text */}
        <p className="text-xs text-gray-500 text-center">
          Please confirm if the service was not completed.
        </p>
 
        {/* Actions */}
        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={handleApprove}
            className="flex-1 py-2.5 rounded-xl bg-green-400 hover:bg-green-500 text-white font-medium text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Processing..." : "Approve refund"}
          </button>
          <button
            disabled={loading}
onClick={() => setDisputing(true)}
            className="flex-1 py-2.5 rounded-xl bg-rose-300 hover:bg-rose-400 text-white font-medium text-sm transition-colors disabled:opacity-60"
          >
            Dispute
          </button>
        </div>
      </div>
      
    </div>
     
  );

 
};
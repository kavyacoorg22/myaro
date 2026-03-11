import type { BookingCardProps, BookingStatus } from "../../../types/booking";
import { Pill } from "./pill";

export const BookingCard = ({
  service,
  status,
  onConfirm,
  onReject,
  onComplete,
  onCancel,
  onReschedule,
  reason,
}: BookingCardProps) => {
  const bg: Record<BookingStatus, string> = {
    pending: "bg-emerald-50 border-emerald-200",
    confirmed: "bg-teal-50 border-teal-200",
    rejected: "bg-rose-100 border-rose-300",
    rescheduled: "bg-white border-gray-200",
  };

  return (
    <div className={`rounded-2xl border p-3 w-56 shadow-sm ${bg[status]}`}>
      <p className="text-[11px] text-gray-500 font-medium mb-2">{service}</p>

      {status === "pending" && (
        <div className="flex gap-2">
          <Pill label="✓ Confirm" color="bg-indigo-500 text-white hover:bg-indigo-600" onClick={onConfirm} />
          <Pill label="✕ Reject" color="bg-rose-400 text-white hover:bg-rose-500" onClick={onReject} />
        </div>
      )}

      {status === "confirmed" && (
        <div className="flex gap-2 flex-wrap">
          <Pill label="Confirmed" color="bg-indigo-500 text-white" />
          <Pill label="Cancel" color="bg-amber-400 text-white hover:bg-amber-500" onClick={onCancel} />
          <Pill label="Complete" color="bg-teal-500 text-white hover:bg-teal-600" onClick={onComplete} />
        </div>
      )}

      {status === "rejected" && (
        <div>
          <Pill label="Rejected" color="bg-rose-500 text-white" />
          {reason && <p className="text-[11px] text-rose-600 mt-1">{reason}</p>}
        </div>
      )}

      {status === "rescheduled" && (
        <div className="flex gap-2">
          <Pill label="Re-Schedule" color="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onReschedule} />
          <Pill label="Open" color="bg-gray-900 text-white hover:bg-gray-700" />
        </div>
      )}
    </div>
  );
};
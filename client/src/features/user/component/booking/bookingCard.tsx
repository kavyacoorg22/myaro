import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { BookingDto, IGetBookingByIdDto } from "../../../../types/dtos/booking";
import type { RootState } from "../../../../redux/appStore";
import { UserRole } from "../../../../constants/types/User";
import { BookingApi } from "../../../../services/api/booking";
import { BookingDetailModal } from "./bookingDetailsModal";
import { Pill } from "./pill";
import type { Role } from "../../../../components/config/saidBarContent";
import { BookingAction, type BookingActionType, type BookingStatusType } from "../../../../constants/types/booking";
import { PaymentDetailModal } from "../../../models/booking/paymentDetailModal";
import { useNavigate } from "react-router";

const statusBg: Record<string, string> = {
  requested: "bg-white        border-indigo-200",
  accepted:  "bg-green-50     border-green-200",
  confirmed: "bg-teal-50      border-teal-200",
  completed: "bg-teal-100     border-teal-300",
  rejected:  "bg-rose-100     border-rose-300",
  cancelled: "bg-gray-100     border-gray-300",
  dispute:   "bg-amber-50     border-amber-300",
};

// ── BookingCard ───────────────────────────────────────────────────────────────
export interface BookingCardProps {
  bookingId: string;
  status: BookingStatusType;
}

export const BookingCard = ({ bookingId, status }: BookingCardProps) => {
  const role = useSelector((s: RootState) => s.user.currentUser?.role);
  const [booking, setBooking]               = useState<IGetBookingByIdDto | null>(null);
  const [loading, setLoading]               = useState(false);
  const [showModal, setShowModal]           = useState(false);
  const [showPayModal, setShowPayModal]     = useState(false);  // ← new

  const isBeautician = role === UserRole.BEAUTICIAN;
   const navigate = useNavigate();
  // ── fetch booking on mount ─────────────────────────────────────────────────
  useEffect(() => {
    BookingApi.getBookingByid(bookingId)
      .then((res) => { if (res.data?.data?.data) setBooking(res.data.data.data); })
      .catch(console.error);
  }, [bookingId]);

  // ── call action ────────────────────────────────────────────────────────────
  const callAction = async (action: string, rejectionReason?: string) => {
    if (!booking) return;
    setLoading(true);
    try {
      const res = await BookingApi.updateBookingStatus(
        bookingId,
        action as BookingActionType,
        role as Role,
        rejectionReason,
      );

      const updated = res.data?.data;
      if (updated) {
        setBooking((prev) =>
          prev
            ? {
                ...prev,
                status:          updated.status,
                rejectionReason: updated.rejectionReason ?? prev.rejectionReason,
              }
            : null,
        );
      }
      setShowModal(false);
      setShowPayModal(false);   // ← close pay modal on success
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── loading state ──────────────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="rounded-2xl border border-gray-200 p-3 w-56 bg-white">
        <p className="text-xs text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  const bg = statusBg[status] ?? "bg-white border-gray-200";

  return (
    <>
      <div className={`rounded-2xl border p-3 w-56 shadow-sm ${bg}`}>

        {/* Service names */}
        <p className="text-[11px] text-gray-500 font-medium mb-2">
          {booking.services.map((s) => s.name).join(", ")}
        </p>

        {/* ── REQUESTED ──────────────────────────────────────────────────── */}
        {status === "requested" && (
          <div className="flex gap-2 items-center">
            <Pill label="Requested" variant="default" disabled />
            {isBeautician && (
              <Pill
                label="open"
                variant="ghost"
                onClick={() => setShowModal(true)}
              />
            )}
          </div>
        )}

        {/* ── ACCEPTED ───────────────────────────────────────────────────── */}
        {status === "accepted" && (
          <div className="flex gap-2">
            {isBeautician ? (
              <Pill label="Accepted" variant="default" disabled />
            ) : (
              <Pill
                label="pay & confirm"
                variant="primary"
                disabled={loading}
                onClick={() => setShowPayModal(true)}   // ← open pay modal
              />
            )}
          </div>
        )}

        {/* ── CONFIRMED ──────────────────────────────────────────────────── */}
        {status === "confirmed" && (
          <div className="flex gap-2 flex-wrap">
            <Pill label="Confirmed" variant="default" disabled />
            <Pill
              label="cancel"
              variant="warning"
              disabled={loading}
              onClick={() => callAction("cancel")}
            />
            {!isBeautician && (
              <Pill
                label="Completed"
                variant="success"
                disabled={loading}
                onClick={() => callAction("complet")}
              />
            )}
          </div>
        )}

        {/* ── COMPLETED ──────────────────────────────────────────────────── */}
        {status === "completed" && (
          <Pill label="Completed" variant="success" disabled />
        )}

        {/* ── REJECTED ───────────────────────────────────────────────────── */}
        {status === "rejected" && (
          <div>
            <Pill label="Rejected" variant="danger" disabled />
            {booking.rejectionReason && (
              <p className="text-[11px] text-rose-600 mt-1">
                {booking.rejectionReason}
              </p>
            )}
          </div>
        )}

        {/* ── CANCELLED ──────────────────────────────────────────────────── */}
        {status === "cancelled" && (
          <Pill label="Cancelled" variant="warning" disabled />
        )}

        {/* ── DISPUTE ────────────────────────────────────────────────────── */}
        {status === "dispute" && (
          <Pill label="Dispute" variant="danger" disabled />
        )}
      </div>

      {/* Beautician detail modal */}
      {showModal && isBeautician && (
        <BookingDetailModal
          booking={booking}
          loading={loading}
          onClose={() => setShowModal(false)}
          onAccept={() => callAction("accept")}
          onReject={(reason) => callAction("reject", reason)}
        />
      )}

      {/* Payment detail modal — shown to customer on "pay & confirm" */}
     {showPayModal && !isBeautician && (
  <PaymentDetailModal
    booking={booking}
    loading={loading}
    onClose={() => setShowPayModal(false)}
   onConfirm={async () => {
  try {
    await BookingApi.updateBookingStatus(
      bookingId,
      BookingAction.CONFIRM as BookingActionType,
      role as Role,
    );
    setBooking(prev => prev ? { ...prev, status: 'confirmed' } : null);
    setShowPayModal(false);
    navigate(`/chat/${booking.chatId}`);  // ✅ redirect to chat
  } catch (err) {
    console.error('confirm failed:', err);
    // booking is already confirmed in DB — just navigate anyway
    setShowPayModal(false);
    navigate(`/chat/${booking.chatId}`);
  }
}}
    onCancel={() => {
      setShowPayModal(false);
      callAction("cancel");
    }}
  />
)}
    </>
  );
};
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
import { ServiceCompletionModal } from "../../../models/booking/refundDispute/serviceCompletionModal";
import { WriteReviewModal } from "../../../models/booking/refundDispute/writeReviewModel";
import { RefundConfirmationModal } from "../../../models/booking/refundDispute/refundConformationModal";
import { RefundReasonModal } from "../../../models/booking/refundDispute/refundReasonModal";
import { handleApiError } from "../../../../lib/utils/handleApiError";

const statusBg: Record<string, string> = {
  requested:        "bg-white        border-indigo-200",
  accepted:         "bg-green-50     border-green-200",
  confirmed:        "bg-teal-100     border-teal-200",
  completed:        "bg-teal-100     border-teal-300",
  rejected:         "bg-rose-100     border-rose-300",
  cancelled:        "bg-gray-100     border-gray-300",
  dispute:          "bg-amber-50     border-amber-300",
  refund_requested: "bg-orange-50    border-orange-300", // ← added
};

// ── BookingCard ───────────────────────────────────────────────────────────────
export interface BookingCardProps {
  bookingId: string;
  status: BookingStatusType;
}

export const BookingCard = ({ bookingId, status }: BookingCardProps) => {
  const role = useSelector((s: RootState) => s.user.currentUser?.role);
  const [booking, setBooking]                     = useState<IGetBookingByIdDto | null>(null);
  const [loading, setLoading]                     = useState(false);
  const [showModal, setShowModal]                 = useState(false);
  const [showPayModal, setShowPayModal]           = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showReviewModal, setShowReviewModal]     = useState(false);
  const [showRefundReason, setShowRefundReason]   = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [refundReason, setRefundReason]           = useState("");
  const [refundLoading, setRefundLoading]         = useState(false);
   console.log('status',status)
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
      setShowPayModal(false);
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
                onClick={() => setShowPayModal(true)}
              />
            )}
          </div>
        )}

        {/* ── CONFIRMED ──────────────────────────────────────────────────── */}
        {status === "confirmed" && (
          <div className="flex gap-2 flex-wrap">
            <Pill label="Confirmed" variant="default" disabled />
            {!isBeautician && (
              <>
                <Pill
                  label="cancel"
                  variant="warning"
                  disabled={loading}
                  onClick={() => callAction("cancel")}
                />
                <Pill
                  label="Completed"
                  variant="success"
                  disabled={loading}
                  onClick={() => setShowCompletionModal(true)}
                />
              </>
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

        {/* ── REFUND_REQUESTED ───────────────────────────────────────────── */}
        {status === "refund_requested" && (
          <div className="flex flex-col gap-1">
            {isBeautician ? (
              <>
                <p className="text-[11px] text-orange-700 font-semibold">
                  Refund confirmation request
                </p>
                <Pill label="Open" variant="ghost" onClick={() => setShowModal(true)} />
              </>
            ) : (
              <>
                <Pill label="Refund Requested" variant="warning" disabled />
                {booking.refundReason && (
                  <p className="text-[11px] text-orange-600 mt-1">
                    {booking.refundReason}
                  </p>
                )}
              </>
            )}
          </div>
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
              navigate(`/chat/${booking.chatId}`);
            } catch (err) {
              console.error('confirm failed:', err);
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

      {showCompletionModal && !isBeautician && (
        <ServiceCompletionModal
          loading={loading}
          onClose={() => setShowCompletionModal(false)}
          onComplete={() => {
            callAction("complete");
            setShowCompletionModal(false);
            setShowReviewModal(true);
          }}
          onNotCompleted={() => {
            setShowCompletionModal(false);
            setShowRefundReason(true);
          }}
        />
      )}

      {showReviewModal && (
        <WriteReviewModal
          beauticianId={booking.beauticianId}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showRefundReason && (
        <RefundReasonModal
          onCancel={() => setShowRefundReason(false)}
          onContinue={(reason) => {
            setRefundReason(reason);
            setShowRefundReason(false);
            setShowRefundConfirm(true);
          }}
        />
      )}

      {showRefundConfirm && (
        <RefundConfirmationModal
          loading={refundLoading}
          onCancel={() => setShowRefundConfirm(false)}
          onConfirm={async () => {
            setRefundLoading(true);
            try {
              await BookingApi.requestRefund(bookingId, refundReason);
              setBooking(prev => prev ? { ...prev, status: "refund_requested" } : null); // ← added
            } catch(err) {
              handleApiError(err);
            }
            setRefundLoading(false);
            setShowRefundConfirm(false);
          }}
        />
      )}
    </>
  );
};
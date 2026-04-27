import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type {  IGetBookingByIdDto } from "../../../../types/dtos/booking";
import type { RootState } from "../../../../redux/appStore";
import { UserRole } from "../../../../constants/types/User";
import { BookingApi } from "../../../../services/api/booking";
import { BookingDetailModal } from "./bookingDetailsModal";
import { Pill } from "./pill";
import type { Role } from "../../../../components/config/saidBarContent";
import { type BookingActionType, type BookingStatusType } from "../../../../constants/types/booking";
import { PaymentDetailModal } from "../../../models/booking/paymentDetailModal";
import { useNavigate } from "react-router";
import { ServiceCompletionModal } from "../../../models/booking/refundDispute/serviceCompletionModal";
import { WriteReviewModal } from "../../../models/booking/refundDispute/writeReviewModel";
import { RefundConfirmationModal } from "../../../models/booking/refundDispute/refundConformationModal";
import { RefundReasonModal } from "../../../models/booking/refundDispute/refundReasonModal";
import { handleApiError } from "../../../../lib/utils/handleApiError";
import { RefundApproveModal } from "../../../models/booking/refundDispute/refundApproveModal";
import { CancelBookingModal } from "../../../models/booking/refundDispute/cancelbooking";


// Statuses where a local update has "won" and must not be overwritten by the prop
const TERMINAL_LOCAL_STATUSES = new Set(["refund_approved", "completed", "dispute"]);
 
const statusBg: Record<string, string> = {
  requested:        "bg-white        border-indigo-200",
  accepted:         "bg-green-50     border-green-200",
  confirmed:        "bg-teal-100     border-teal-200",
  completed:        "bg-teal-100     border-teal-300",
  rejected:         "bg-rose-100     border-rose-300",
  cancelled:        "bg-gray-100     border-gray-300",
  dispute:          "bg-amber-50     border-amber-300",
  refund_requested: "bg-orange-50    border-orange-300",
  refund_approved:  "bg-green-50     border-green-300",
};


const isWithin3Days = (slotDate: Date | string): boolean => {
  const now      = new Date();
  const booking  = new Date(slotDate);
  const diffDays = (booking.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
};

const isBookingTimePassed = (slotDate: Date | string): boolean => {
  return new Date() >= new Date(slotDate);
};

// ── BookingCard ───────────────────────────────────────────────────────────────
export interface BookingCardProps {
  bookingId: string;
  status: BookingStatusType;
    initialBooking?: IGetBookingByIdDto;
}

export const BookingCard = ({ bookingId, status , initialBooking}: BookingCardProps) => {
  const role = useSelector((s: RootState) => s.user.currentUser?.role);
const [booking, setBooking] = useState<IGetBookingByIdDto | null>(initialBooking ?? null);
  const [currentStatus, setCurrentStatus]                 = useState<string>(status);
  const [loading, setLoading]                             = useState(false);
  const [showModal, setShowModal]                         = useState(false);
  const [showPayModal, setShowPayModal]                   = useState(false);
  const [showCompletionModal, setShowCompletionModal]     = useState(false);
  const [showReviewModal, setShowReviewModal]             = useState(false);
  const [showRefundReason, setShowRefundReason]           = useState(false);
  const [showRefundConfirm, setShowRefundConfirm]         = useState(false);
  const [refundReason, setRefundReason]                   = useState("");
  const [refundLoading, setRefundLoading]                 = useState(false);
  const [showRefundApprove, setShowRefundApprove]         = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const isBeautician = role === UserRole.BEAUTICIAN;
  const navigate = useNavigate();
 
  useEffect(() => {
    setCurrentStatus((prev) =>
      TERMINAL_LOCAL_STATUSES.has(prev) ? prev : status
    );
  }, [status]);
 
  useEffect(() => {
       if (initialBooking) return;
    BookingApi.getBookingByid(bookingId)
      .then((res) => {
        if (res.data?.data?.data) {
          setBooking(res.data.data.data);
        }
      })
      .catch(console.error);
  }, [bookingId]);
 
  // ── call action ────────────────────────────────────────────────────────────
  const callAction = async (action: string, rejectionReason?: string) => {
    if (!booking) return;
    setLoading(true);
    try {

       if (action === "cancel") {
      const res = await BookingApi.getBookingByid(bookingId);
      const latestStatus = res.data?.data?.data?.status;
      if (latestStatus === "confirmed") {
        setBooking(prev => prev ? { ...prev, status: "confirmed" } : null);
        setCurrentStatus("confirmed");
        return;
      }
    }

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
        if (updated.status) setCurrentStatus(updated.status);
      }
      setShowModal(false);
      setShowPayModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  if (!booking) {
    return (
      <div className="rounded-2xl border border-gray-200 p-3 w-56 bg-white">
        <p className="text-xs text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  // ── Derived flags for confirmed status ─────────────────────────────────────
  const slotDate        = booking.slot?.date ?? null;
  const cancelDisabled  = loading || (slotDate != null ? isWithin3Days(slotDate) : false);
  const completeEnabled = slotDate != null ? isBookingTimePassed(slotDate) : false;

  const bg = statusBg[currentStatus] ?? "bg-white border-gray-200";
 
  return (
    <>
      <div className={`rounded-2xl border p-3 w-56 shadow-sm ${bg}`}>

        {/* Service names */}
        <p className="text-[11px] text-gray-500 font-medium mb-2">
          {booking.services.map((s) => s.name).join(", ")}
        </p>
 
        {/* ── REQUESTED ──────────────────────────────────────────────────── */}
        {currentStatus === "requested" && (
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
        {currentStatus === "accepted" && (
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
        {currentStatus === "confirmed" && (
          <div className="flex gap-2 flex-wrap">
            <Pill label="Confirmed" variant="default" disabled />
            {!isBeautician && (
              <>
                {/* Cancel: disabled if booking is within 3 days */}
                <Pill
                  label="cancel"
                  variant="warning"
                  disabled={cancelDisabled}
                  onClick={() => setShowCancelModal(true)}
                />

                {/* Complete: enabled only after the booking date+time has passed */}
                <Pill
                  label="Completed"
                  variant="success"
                  disabled={!completeEnabled || loading}
                  onClick={() => setShowCompletionModal(true)}
                />
              </>
            )}
          </div>
        )}

        {/* ── COMPLETED ──────────────────────────────────────────────────── */}
        {currentStatus === "completed" && (
          <Pill label="Completed" variant="success" disabled />
        )}
 
        {/* ── REJECTED ───────────────────────────────────────────────────── */}
        {currentStatus === "rejected" && (
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
        {currentStatus === "cancelled" && (
          <Pill label="Cancelled" variant="warning" disabled />
        )}
 
        {/* ── DISPUTE ────────────────────────────────────────────────────── */}
        {currentStatus === "dispute" && (
          <Pill label="Dispute" variant="danger" disabled />
        )}
 
        {/* ── REFUND_REQUESTED ───────────────────────────────────────────── */}
        {currentStatus === "refund_requested" && (
          <div className="flex flex-col gap-1">
            {isBeautician ? (
              <>
                <p className="text-[11px] text-orange-700 font-semibold">
                  Refund confirmation request
                </p>
                <Pill
                  label="Open"
                  variant="ghost"
                  onClick={() => setShowRefundApprove(true)}
                />
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
 
        {/* ── REFUND_APPROVED (local-only) ───────────────────────────────── */}
        {currentStatus === "refund_approved" && (
          <div className="flex flex-col gap-1">
            <Pill label="Refund Approved" variant="success" disabled />
            <p className="text-[10px] text-green-700 mt-1">
              Amount will be returned via Razorpay.
            </p>
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

      {/* Payment detail modal */}
      {showPayModal && !isBeautician && (
        <PaymentDetailModal
          booking={booking}
          loading={loading}
          onClose={() => setShowPayModal(false)}
          onConfirm={async () => {
            try {
               
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
              setBooking(prev => prev ? { ...prev, status: "refund_requested" } : null);
            } catch(err) {
              handleApiError(err);
            }
            setRefundLoading(false);
            setShowRefundConfirm(false);
          }}
        />
      )}

      {showRefundApprove && isBeautician && (
        <RefundApproveModal
          booking={booking}
          onClose={() => setShowRefundApprove(false)}
          onApproved={() => {
            setBooking(prev => prev ? { ...prev, status: "completed" } : null);
            setShowRefundApprove(false);
          }}
          onDispute={async () => {
            await callAction("dispute");
            setShowRefundApprove(false);
          }}
        />
      )}

      {showCancelModal && !isBeautician && (
  <CancelBookingModal
    bookingId={bookingId}
    services={booking.services.map(s => s.name)}
    date={booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : ""}
    totalAmount={booking.totalPrice}
    onClose={() => setShowCancelModal(false)}
    onCancelled={() => {
      setShowCancelModal(false);
      setCurrentStatus("cancelled");
      setBooking(prev => prev ? { ...prev, status: "cancelled" } : null);
    }}
  />
)}
    </>
  );
};
import React, { useEffect, useState } from "react";
import { adminApi } from "../../../services/api/admin";
import { PaymentStatus } from "../../../constants/types/payment";
import { formatDateTime } from "../../../lib/utils/bookingDate";
import type { IGetBookingDetailDto } from "../../../types/dtos/admin";

interface BookingPaymentDetailModalProps {
  bookingId: string;
  onClose: () => void;
  onReleaseSuccess?: () => void;
}

const historyDotColor: Record<string, string> = {
  requested:        "bg-indigo-400",
  accepted:         "bg-blue-400",
  confirmed:        "bg-teal-400",
  completed:        "bg-green-500",
  cancelled:        "bg-gray-400",
  rejected:         "bg-rose-400",
  refund_requested: "bg-orange-400",
  refund_approved:  "bg-emerald-500",
  dispute:          "bg-amber-500",
  paid:             "bg-blue-500",
  released:         "bg-emerald-500",
  ready_to_release: "bg-violet-400",
};

const paymentPillConfig: Record<string, { label: string; className: string }> = {
  [PaymentStatus.PAID]:             { label: "On Hold",          className: "bg-amber-100 text-amber-700 border border-amber-200" },
  [PaymentStatus.RELEASED]:         { label: "Released",         className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  [PaymentStatus.READY_TO_RELEASE]: { label: "Ready to Release", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  [PaymentStatus.REFUNDED]:         { label: "Refunded",         className: "bg-purple-100 text-purple-700 border border-purple-200" },
  [PaymentStatus.PENDING]:          { label: "Pending",          className: "bg-gray-100 text-gray-600 border border-gray-200" },
  [PaymentStatus.FAILED]:           { label: "Failed",           className: "bg-red-100 text-red-700 border border-red-200" },
};

const Divider = () => <hr className="border-gray-100 my-5" />;

interface RowProps {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  mono?: boolean;
  small?: boolean;
}
const Row: React.FC<RowProps> = ({ label, value, bold, mono, small }) => (
  <div className="flex items-center justify-between gap-4">
    <span className={`text-gray-500 shrink-0 ${small ? "text-xs" : "text-sm"}`}>{label}</span>
    <span
      className={`text-right break-all ${small ? "text-xs" : "text-sm"} ${
        bold ? "font-bold text-gray-800" : "text-gray-700"
      } ${mono ? "font-mono" : ""}`}
    >
      {value}
    </span>
  </div>
);

const PaymentStatusPill = ({ status }: { status: string }) => {
  const cfg = paymentPillConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────
const BookingPaymentDetailModal: React.FC<BookingPaymentDetailModalProps> = ({
  bookingId,
  onClose,
  onReleaseSuccess,
}) => {
  const [detail, setDetail]             = useState<IGetBookingDetailDto | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [releasing, setReleasing]       = useState(false);
  const [releaseError, setReleaseError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getBookingdetail(bookingId);
        // IGetBookingDetailOutPut → { data: IGetBookingDetailDto }
        const payload: IGetBookingDetailDto =
          (res as any)?.data?.data ?? (res as any)?.data ?? res;
        setDetail(payload);
      } catch {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [bookingId]);

  const isReadyToRelease = detail?.paymentStatus === PaymentStatus.READY_TO_RELEASE;

  // IReleasePayoutInput = { bookingId: string; adminNote: string }
  // adminNote is passed directly as the POST body via: api.post(url, adminNote)
  const handleRelease = async () => {
    if (!isReadyToRelease) return;
    setReleasing(true);
    setReleaseError(null);
    try {
      await adminApi.releasePayout({
        bookingId,
        adminNote: "Released by admin",
      });
      onReleaseSuccess?.();
      onClose();
    } catch {
      setReleaseError("Failed to release payment. Please try again.");
    } finally {
      setReleasing(false);
    }
  };

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";

  const history = detail?.history ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-800">Booking Payment Details</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-6 pb-2 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-2 text-sm text-gray-400">
              <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Loading...</span>
            </div>

          ) : error ? (
            <div className="py-16 text-center text-sm text-red-400">{error}</div>

          ) : detail ? (
            <>
              <Divider />

              {/* ── Booking Information ── */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Booking Information
              </p>
              <div className="space-y-3">
<Row label="Booking ID:"   value={`BK-${detail.bookingId?.slice(-4).toUpperCase()}`} />                <Row label="Beautician:"  value={detail.beauticianName}                  bold />
                <Row label="Customer:"    value={detail.customerName}                    bold />
                <Row label="Amount:"      value={`₹${detail.amount?.toLocaleString()}`} bold />
                <Row
                  label="Payment Status:"
                  value={<PaymentStatusPill status={detail.paymentStatus} />}
                />
              </div>

              <Divider />

              {/* ── Service Details ── */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Service Details
              </p>
              <ul className="mb-2 space-y-1">
                {(detail.services ?? []).map((s, i) => (
                  <li key={i} className="text-sm text-gray-700">• {s}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Service Date:</span> {formatDate(detail.serviceDate)}
              </p>

              {/* Payment Info box */}
              {detail.paymentId && (
                <div className="mt-4 border border-gray-200 rounded-xl px-4 py-3 space-y-2.5 bg-gray-50/60">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Payment Info</p>
<Row label="Transaction ID:" value={`TXN-${detail.paymentId?.slice(-6).toUpperCase()}`} small />                  <Row label="Method:"         value={detail.method ?? "—"}      small />
                  <Row label="Received on:"    value={formatDate(detail.paidAt)} small />
                </div>
              )}

              {/* Held banner */}
              <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-center text-sm font-medium text-orange-600">
                Currently held by admin
              </div>

              {/* ── Booking History ── */}
              {history.length > 0 && (
                <>
                  <Divider />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Booking History
                  </p>
                  <div className="space-y-1">
                    {history.map((h, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center pt-1">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              historyDotColor[h.status] ?? "bg-gray-300"
                            }`}
                          />
                          {index < history.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 mt-1 min-h-[18px]" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm text-gray-700 font-medium capitalize">
                            {h.status.replace(/_/g, " ")}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {formatDateTime(h.createdAt)} · {h.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Release error */}
              {releaseError && (
                <p className="mt-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  ⚠️ {releaseError}
                </p>
              )}

              <p className="text-sm font-semibold text-gray-700 mt-5 mb-2">Actions</p>
            </>
          ) : null}
        </div>

        {/* Footer Buttons */}
        {!loading && !error && detail && (
          <div className="px-6 pb-6 pt-2 flex gap-3">
            <button
              onClick={handleRelease}
              disabled={!isReadyToRelease || releasing}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 ${
                isReadyToRelease && !releasing
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {releasing ? "Releasing..." : "Release Payment"}
            </button>
            <button
              disabled
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-700 text-white opacity-50 cursor-not-allowed"
            >
              Hold Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPaymentDetailModal;
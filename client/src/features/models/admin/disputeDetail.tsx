import React, { useState, useEffect } from "react";
import { adminApi } from "../../../services/api/admin";
import { formatDateTime } from "../../../lib/utils/bookingDate";

interface DisputeDetailModalProps {
  bookingId: string;
  onClose:   () => void;
}

const DisputeDetailModal: React.FC<DisputeDetailModalProps> = ({ bookingId, onClose }) => {
  const [detail, setDetail]               = useState<any | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getDisputeDetail(bookingId);
        const raw = res?.data?.data ?? res?.data ?? res;
        setDetail(raw);
      } catch {
        setError("Failed to load dispute details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [bookingId]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleReleasePayment = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await adminApi.releasePayout({
        bookingId,
        adminNote: resolutionNote.trim(),
      });
      setDetail((prev: any) => ({ ...prev, status: "resolved" }));
    } catch {
      setActionError("Failed to release payment. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundCustomer = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await adminApi.processRefund({
        bookingId,
        adminNote: resolutionNote.trim(),
      });
      setDetail((prev: any) => ({ ...prev, status: "resolved" }));
    } catch {
      setActionError("Failed to process refund. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

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
  };

  const statusVal       = detail?.status;
  const history         = detail?.history ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-800">Dispute Details</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-red-400">{error}</div>
          ) : detail ? (
            <>
              <hr className="border-gray-100 mb-5" />

              {/* ── Dispute Info ─────────────────────────────────── */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Dispute Info
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Dispute ID:",    value: `#${detail.disputeId  ?? bookingId}` },
                  { label: "Booking ID:",    value: `#${detail.bookingId}`                },
                  { label: "Customer:",      value: detail.customerName   ?? "—"          },
                  { label: "Beautician:",    value: detail.beauticianName ?? "—"          },
                  { label: "Amount:",        value: detail.amount != null ? `₹${detail.amount}` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-500 shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-gray-800 text-right break-all">{value}</span>
                  </div>
                ))}

                {/* Status badge */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 shrink-0">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusVal === "resolved"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}>
                    {statusVal === "resolved" ? "Resolved" : "Pending Review"}
                  </span>
                </div>
              </div>

              <hr className="border-gray-100 mb-5" />

              {/* ── Statements ──────────────────────────────────── */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Statements
              </p>
              <div className="space-y-4 mb-6">
                {/* Beautician statement */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Beautician Statement</p>
                  {detail.disputeReason ? (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                      <p className="text-sm text-orange-800 italic">"{detail.disputeReason}"</p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-gray-400">None</p>
                  )}
                </div>

                {/* Customer statement */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer Statement</p>
                  {detail.refundReason ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                      <p className="text-sm text-blue-800 italic">"{detail.refundReason}"</p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-gray-400">None</p>
                  )}
                </div>
              </div>

              {/* ── Booking History ──────────────────────────────── */}
              {history.length > 0 && (
                <>
                  <hr className="border-gray-100 mb-5" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Booking History
                  </p>
                  <div className="space-y-1 mb-6">
                    {history.map((h: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center pt-1">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${historyDotColor[h.status] ?? "bg-gray-300"}`} />
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

              {/* ── Action error ─────────────────────────────────── */}
              {actionError && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">
                  ⚠️ {actionError}
                </p>
              )}

              {/* ── Admin Action — only if not resolved ──────────── */}
              {statusVal !== "resolved" && (
                <>
                  <hr className="border-gray-100 mb-5" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Admin Action
                  </p>

                  {/* Resolution note */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Resolution Note <span className="text-gray-300">(optional)</span>
                    </label>
                    <textarea
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Add a resolution note..."
                      rows={3}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 transition"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReleasePayment}
                      disabled={actionLoading}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95"
                    >
                      {actionLoading ? "Processing..." : "Release Payment"}
                    </button>
                    <button
                      onClick={handleRefundCustomer}
                      disabled={actionLoading}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95"
                    >
                      {actionLoading ? "Processing..." : "Refund Customer"}
                    </button>
                  </div>
                </>
              )}

              {/* ── Already resolved ─────────────────────────────── */}
              {statusVal === "resolved" && (
                <div className="rounded-xl px-4 py-3 text-sm font-medium text-center bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Dispute has been resolved
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DisputeDetailModal;
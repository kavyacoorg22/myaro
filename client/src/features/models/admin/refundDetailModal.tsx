import React, { useState, useEffect } from "react";
import { adminApi } from "../../../services/api/admin";

export interface RefundDetailModalProps {
  refundId: string;
  onClose:  () => void;
}

const RefundDetailModal: React.FC<RefundDetailModalProps> = ({ refundId, onClose }) => {
  const [detail, setDetail]               = useState<any | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState<string | null>(null);
  const [adminNote, setAdminNote]         = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getRefundDetail(refundId);
        const raw = res?.data?.data ?? res?.data ?? res;
        setDetail(raw);
      } catch {
        setError("Failed to load refund details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [refundId]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await adminApi.processRefund({
        bookingId: detail.bookingId,
        adminNote: adminNote.trim(),
      });
      setDetail((prev: any) => ({ ...prev, status: "success" }));
    } catch {
      setActionError("Failed to approve refund. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const statusVal     = detail?.status;
  const refundIdVal   = detail?.refundId   ?? refundId;
  const bookingIdVal  = detail?.bookingId;
  const customerVal   = detail?.customerName;
  const amountVal     = detail?.amount;
  const reasonVal     = detail?.refundReason;
  const custStatement = detail?.customerStatement;
  const beauResponse  = detail?.beauticianResponse;
  const history       = detail?.history ?? [];  

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending",  className: "bg-amber-100 text-amber-700 border border-amber-200" },
    success: { label: "Approved", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
    failed:  { label: "Rejected", className: "bg-red-100 text-red-700 border border-red-200" },
  };
  const statusStyle = statusConfig[statusVal] ?? { label: statusVal, className: "bg-gray-100 text-gray-600" };

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-800">Refund Request Details</h2>
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

              {/* ── Refund Info ─────────────────────────────────────── */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Refund Info
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Refund ID:",  value: `#${refundIdVal}` },
                  { label: "Booking ID:", value: bookingIdVal ? `#${bookingIdVal}` : "—" },
                  { label: "Customer:",   value: customerVal  ?? "—" },
                  { label: "Amount:",     value: amountVal != null ? `₹${amountVal}` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-500 shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-gray-800 text-right break-all">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 shrink-0">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.className}`}>
                    {statusStyle.label}
                  </span>
                </div>
              </div>

              {/* ── Reason ──────────────────────────────────────────── */}
              {reasonVal && (
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-800 mb-2">Reason</p>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                    <p className="text-sm text-orange-700 italic">"{reasonVal}"</p>
                  </div>
                </div>
              )}

              <hr className="border-gray-100 mb-5" />

              {/* ── Statements ──────────────────────────────────────── */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Statements
              </p>
              <div className="space-y-3 mb-6">
                {/* ✅ Customer Statement */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500 shrink-0">Customer Statement:</span>
                  {custStatement && custStatement !== "None" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      ✓ Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                      None
                    </span>
                  )}
                </div>

                {/* ✅ Beautician Response */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500 shrink-0">Beautician Response:</span>
                  {beauResponse && beauResponse !== "None" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      ✓ Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                      None
                    </span>
                  )}
                </div>
              </div>

              {/* ── Booking History ──────────────────────────────────── */}
              {history.length > 0 && (
                <>
                  <hr className="border-gray-100 mb-5" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Booking History
                  </p>
                  <div className="space-y-1 mb-6">
                    {history.map((h: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* timeline dot + line */}
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
                            {new Date(h.createdAt).toLocaleString()} · {h.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Action error ────────────────────────────────────── */}
              {actionError && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">
                  ⚠️ {actionError}
                </p>
              )}

              {/* ── Approve section — only for pending ──────────────── */}
              {statusVal === "pending" && (
                <>
                  <hr className="border-gray-100 mb-5" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Admin Action
                  </p>
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Admin Note <span className="text-gray-300">(optional)</span>
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add a note for this refund approval..."
                      rows={3}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none outline-none focus:border-emerald-300 focus:ring-1 focus:ring-emerald-100 transition"
                    />
                  </div>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95"
                  >
                    {actionLoading ? "Processing..." : "✓ Approve Refund"}
                  </button>
                </>
              )}

              {/* ── Already processed ───────────────────────────────── */}
              {statusVal !== "pending" && (
                <div className={`rounded-xl px-4 py-3 text-sm font-medium text-center ${
                  statusVal === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {statusVal === "success" ? "✓ Refund has been approved" : "✗ Refund has been rejected"}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RefundDetailModal;
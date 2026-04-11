import React, { useState, useEffect } from "react";
import { adminApi } from "../../../services/api/admin";

export interface RefundDetailModalProps {
  refundId: string;
  onClose: () => void;
}

const RefundDetailModal: React.FC<RefundDetailModalProps> = ({ refundId, onClose }) => {
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
     const res = await adminApi.getRefundDetail(refundId);


const raw = res?.data?.data ?? res?.data ?? res;
const payload =  raw;

console.log("[RefundDetailModal] payload:", payload);
setDetail(payload);
      } catch (err) {
        console.error("[RefundDetailModal] error:", err);
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

  const pick = (obj: any, ...keys: string[]) => {
    for (const k of keys) {
      if (obj?.[k] != null && obj[k] !== "") return obj[k];
    }
    return null;
  };

  const refundIdVal    = pick(detail, "refundId", "_id", "id");
  const bookingIdVal   = pick(detail, "bookingId", "booking_id");
  const customerVal    = pick(detail, "customerName", "customer", "userName", "user");
  const amountVal      = pick(detail, "amount", "refundAmount");
  const reasonVal      = pick(detail, "reason", "refundReason");
  const statusVal      = pick(detail, "status", "refundStatus");
  const custStatement  = pick(detail, "customerStatement", "userStatement", "statement");
  const beauResponse   = pick(detail, "beauticianResponse", "providerResponse", "beauticianStatement");

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

        <div className="px-6 pb-6">
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

              {/* Refund Info */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Refund Info
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Refund ID:",  value: refundIdVal  ? `#${refundIdVal}`  : `#${refundId}` },
                  { label: "Booking ID:", value: bookingIdVal ? `#${bookingIdVal}` : "—" },
                  { label: "Customer:",   value: customerVal  ?? "—" },
                  { label: "Amount:",     value: amountVal    != null ? `₹${amountVal}` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-500 shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-gray-800 text-right break-all">{value}</span>
                  </div>
                ))}
              </div>

              {/* Reason */}
              {reasonVal && (
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-800 mb-2">Reason</p>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                    <p className="text-sm text-orange-700 italic">"{reasonVal}"</p>
                  </div>
                </div>
              )}

              <hr className="border-gray-100 mb-5" />

              {/* Statements */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Statements
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Customer Statement:</span>
                  <span className="text-sm font-bold text-gray-800">{custStatement ?? "None"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Beautician Response:</span>
                  <span className="text-sm font-bold text-gray-800">{beauResponse ?? "None"}</span>
                </div>
              </div>

              {/* Action Buttons — only for pending */}
              {statusVal === "pending" && (
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150"
                    onClick={() => { /* wire up approve API */ }}
                  >
                    Approve Refund
                  </button>
                
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
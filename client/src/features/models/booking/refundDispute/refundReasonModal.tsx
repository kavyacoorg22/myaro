//customer <-----> beautician is not done work

import { useState } from "react";
 
interface RefundReasonModalProps {
  onCancel: () => void;
  onContinue: (reason: string) => void;
}
 
export const RefundReasonModal = ({ onCancel, onContinue }: RefundReasonModalProps) => {
  const [reason, setReason] = useState("");
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5">
 
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
 
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">What happened?</h2>
          <p className="text-sm text-gray-500 mt-1">
            If not completed: Payment is held by admin until issue is resolved
          </p>
        </div>
 
        {/* Textarea */}
        <div className="w-full">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Describe the issue
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please Explain what happened and why service was not completed"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition resize-none"
          />
        </div>
 
        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl py-3 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onContinue(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm rounded-xl py-3 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
 
 
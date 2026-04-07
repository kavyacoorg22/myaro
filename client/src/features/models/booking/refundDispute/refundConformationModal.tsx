interface RefundConfirmationModalProps {
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
 
export const RefundConfirmationModal = ({
  loading = false,
  onCancel,
  onConfirm,
}: RefundConfirmationModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90dvh] overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-5">
 
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 15a4 4 0 01-8 0m8 0V9a4 4 0 00-8 0v6m8 0H8m-2 0a6 6 0 1112 0"
            />
          </svg>
        </div>
 
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Refund Confirmation</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your refund will be processed automatically
          </p>
        </div>
 
        {/* Info box — green */}
        <div className="w-full bg-green-50 border border-green-100 rounded-2xl p-4 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-gray-800">Automatic Refund Process</p>
            <p className="text-xs text-gray-500">Via Razorpay Payment Gateway</p>
          </div>
 
          <div className="flex flex-col gap-3">
            {/* Refund Method */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-800">Refund Method</p>
                <p className="text-xs text-gray-500">Your original payment method</p>
              </div>
            </div>
 
            {/* Processing Time */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-800">Processing Time</p>
                <p className="text-xs text-gray-500">5-7 business days</p>
              </div>
            </div>
 
            {/* Refund Destination */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-800">Refund Destination</p>
                <p className="text-xs text-gray-500">Same account/card/UPI you used for payment</p>
              </div>
            </div>
          </div>
        </div>
 
        {/* How it works — blue/purple */}
        <div className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
          <span className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-semibold text-indigo-700 mb-1">How it works</p>
            <p className="text-[11px] text-indigo-500 leading-relaxed">
              Once the beautician confirms that the service was not offered, your refund will be
              automatically processed by Razorpay to your original payment method within 24–48 hours.
              The amount will reflect in your account within 5–7 business days.
            </p>
          </div>
        </div>
 
        {/* Secured */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secured by Razorpay
        </div>
 
        </div>{/* end scrollable */}
 
        {/* Sticky footer */}
        <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl py-3 transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl py-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing…" : "Confirm Refund"}
          </button>
        </div>
      </div>
    </div>
  );
};
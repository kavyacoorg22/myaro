interface RefundApprovedModalProps {
  onClose: () => void;
}

export const RefundApprovedModal = ({ onClose }: RefundApprovedModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[300px] p-6 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green badge icon */}
        <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-md">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-gray-900 font-bold text-lg text-center">
          Refund Approved
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm text-center">
          Amount will be returned to customer via Razorpay.
        </p>

        {/* Razorpay badge */}
        <div className="flex items-center gap-1.5 text-green-600 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secured by Razorpay</span>
        </div>

        {/* OK button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};
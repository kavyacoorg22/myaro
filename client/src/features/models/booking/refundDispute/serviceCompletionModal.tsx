import { useEffect, useRef } from "react";

interface ServiceCompletionModalProps {
  loading?: boolean;
  onComplete: () => void;
  onNotCompleted: () => void;
  onClose: () => void;
}

export const ServiceCompletionModal = ({
  loading = false,
  onComplete,
  onNotCompleted,
  onClose,
}: ServiceCompletionModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5 animate-fade-in">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"
            />
          </svg>
        </div>

        {/* Title & subtitle */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Service Completion</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please give feedback that will help beautician to grow their business
          </p>
        </div>

        {/* Info box */}
        <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                />
              </svg>
            </span>
            <p className="text-xs font-semibold text-gray-800">Important: Payment Release</p>
          </div>
          <p className="text-xs text-gray-500 -mt-2 pl-7">
            Your confirmation helps release payment to the beautician. Please confirm honestly:
          </p>

          {/* Conditions */}
          <div className="bg-white rounded-xl px-4 py-3 flex flex-col gap-2 text-xs">
            <p>
              <span className="text-amber-500 font-semibold">If service completed: </span>
              <span className="text-gray-600">Payment will be released to beautician immediately</span>
            </p>
            <p>
              <span className="text-amber-500 font-semibold">If not completed: </span>
              <span className="text-gray-600">Payment is held by admin until issue is resolved</span>
            </p>
          </div>

          <p className="text-[11px] text-gray-400 pl-1">
            💡 Your honest feedback ensures fair payment and helps maintain service quality
          </p>
        </div>

        {/* Question */}
        <p className="text-sm font-semibold text-gray-800 text-center">
          Has the beautician completed the home service?
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onComplete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white font-semibold text-sm rounded-xl py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Yes, completed
          </button>

          <button
            onClick={onNotCompleted}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-semibold text-sm rounded-xl py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            No, not completed
          </button>
        </div>
      </div>
    </div>
  );
};
import { useState } from "react";
import { CommentLikeApi } from "../../../../services/api/commentLike";

interface WriteReviewModalProps {
  beauticianId: string;
  onClose: () => void;
}

const RATING_LABELS = ["", "Terrible", "Poor", "Okay", "Good", "Excellent"];

export const WriteReviewModal = ({ beauticianId, onClose }: WriteReviewModalProps) => {
  const [text, setText]       = useState("");
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || rating === 0) return;
    setLoading(true);
    try {
      await CommentLikeApi.addHomeServiceComment(text.trim(), beauticianId, rating);
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5">

        {done ? (
          <>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold">Review submitted!</p>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl py-3 transition-all"
            >
              Close
            </button>
          </>
        ) : (
          <>
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">Write a review</h2>
              <p className="text-sm text-gray-500 mt-1">How was your experience with the beautician?</p>
            </div>

            {/* Star Rating */}
            <div className="w-full">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-3xl leading-none transition-colors focus:outline-none"
                    style={{ color: star <= (hovered || rating) ? "#f59e0b" : "#d1d5db" }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1 h-4">
                {rating > 0 ? RATING_LABELS[rating] : ""}
              </p>
            </div>

            {/* Textarea */}
            <div className="w-full">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Share Your Experience
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us about your experience with the beautician"
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 transition resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl py-3 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !text.trim() || rating === 0}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm rounded-xl py-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
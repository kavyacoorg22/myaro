import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import type { IGetHomeServiceCommentsDto } from "../../types/dtos/commetLike";
import { CommentLikeApi } from "../../services/api/commentLike";

const LIMIT = 10;

interface Props {
  beauticianId: string;
  onClose: () => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className="w-3.5 h-3.5"
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
      />
    ))}
  </div>
);

export const ReviewModal = ({ beauticianId, onClose }: Props) => {
  const [reviews, setReviews]         = useState<IGetHomeServiceCommentsDto[]>([]);
  const [loading, setLoading]         = useState(false);
  const [cursor, setCursor]           = useState<string | null>(null);
  const [hasMore, setHasMore]         = useState(true);
  const [avgRating, setAvgRating]     = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async (nextCursor: string | null = null) => {
    setLoading(true);
    try {
      const res = await CommentLikeApi.getHomeServiceComment(
        beauticianId,
        LIMIT,
        nextCursor
      );
      const data = res.data?.data;
      const fetched = data?.comments ?? [];

      setReviews((prev) => (nextCursor ? [...prev, ...fetched] : fetched));
      setCursor(data?.nextCursor ?? null);
      setHasMore(!!data?.nextCursor);

      // Only set summary on first load
      if (!nextCursor) {
        setAvgRating(data?.avgRating ?? 0);
        setTotalReviews(data?.totalReviews ?? 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-lg flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Customer reviews
            </h2>
            {/* Avg rating summary */}
            {totalReviews > 0 && (
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-2xl font-bold text-gray-900 leading-none">
                  {avgRating.toFixed(1)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <StarRating rating={avgRating} />
                  <span className="text-xs text-gray-400">
                    {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading && reviews.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <Star className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.commentId} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-700 shrink-0 overflow-hidden">
                  {review.profileImg ? (
                    <img
                      src={review.profileImg}
                      alt={review.userName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    review.userName?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {review.userName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Per-review stars */}
                  {review.rating !== undefined && (
                    <div className="mt-0.5 mb-1">
                      <StarRating rating={review.rating} />
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            ))
          )}

          {hasMore && (
            <button
              onClick={() => fetchReviews(cursor)}
              disabled={loading}
              className="w-full text-xs text-indigo-600 hover:text-indigo-800 py-2 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
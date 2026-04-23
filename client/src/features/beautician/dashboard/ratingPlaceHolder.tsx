import { Star } from "lucide-react";

interface RatingCardProps {
  avgRating: number;
  totalReviews: number;
}

export const RatingCard: React.FC<RatingCardProps> = ({ avgRating, totalReviews }) => {
  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-700">Rating</h3>
        <div className="flex-1 flex flex-col items-center justify-center py-6 gap-1">
          <p className="text-sm text-gray-400">No reviews yet</p>
          <p className="text-xs text-gray-300">Rating will appear once you receive reviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Rating</h3>

      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
        <div className="flex flex-col gap-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-4 h-4"
                fill={s <= Math.round(avgRating) ? "#f59e0b" : "none"}
                stroke={s <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>
    </div>
  );
};
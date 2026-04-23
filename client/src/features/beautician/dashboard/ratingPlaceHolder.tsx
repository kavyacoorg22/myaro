export const RatingPlaceholder: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-2">
    <h3 className="text-sm font-semibold text-gray-700">Rating</h3>
    <div className="flex-1 flex flex-col items-center justify-center py-6 gap-1">
      <p className="text-sm text-gray-400">No reviews yet</p>
      <p className="text-xs text-gray-300">Rating will appear once you receive reviews</p>
    </div>
  </div>
);
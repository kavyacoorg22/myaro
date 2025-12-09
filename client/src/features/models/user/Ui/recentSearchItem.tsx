import { X } from "lucide-react";
import type { IRecentSearch, ISearchResult } from "../../../../types/api/public";

export const RecentSearchItem: React.FC<{
  result: IRecentSearch;
  onClick: () => void;
  onRemove: () => void;
}> = ({ result, onClick, onRemove }) => {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group">
      <button
        onClick={onClick}
        className="flex items-center gap-3 flex-1"
      >
        <img
          src={result.profileImg}
          alt={result.userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">{result.userName}</p>
          <p className="text-sm text-gray-500">{result.fullName}</p>
        </div>
      </button>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-full"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};
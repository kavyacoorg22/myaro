import type { IRecentSearch, ISearchResult } from "../../../../types/api/public";
import { RecentSearchItem } from "./recentSearchItem";

export const RecentSearches: React.FC<{
  recentSearches: IRecentSearch[];
  handleClearAll: () => void;
  handleResultClick: (result: ISearchResult) => void;
  handleRemoveRecent: (id: string) => void;
}> = ({ recentSearches, handleClearAll, handleResultClick, handleRemoveRecent }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent</h3>
        {recentSearches.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {recentSearches.length > 0 ? (
        <div className="space-y-1">
          {recentSearches.map((result) => (
            <RecentSearchItem
              key={result.beauticianId}
              result={result}
              onClick={() => handleResultClick(result)}
              onRemove={() => handleRemoveRecent(result.searchHistoryId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No recent searches
        </div>
      )}
    </div>
  );
};
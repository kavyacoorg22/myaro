import type { ISearchResult } from "../../../../types/api/public";
import { SearchResultItem } from "./searchResultItem";


export const SearchResults: React.FC<{
  isLoading: boolean;
  searchResults: ISearchResult[];
  handleResultClick: (result: ISearchResult) => void;
}> = ({ isLoading, searchResults, handleResultClick }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Searching...
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-1">
        {searchResults.map((result) => (
          <SearchResultItem
            key={result.beauticianId}
            result={result}
            onClick={() => handleResultClick(result)}
          />
        ))}
      </div>
    </div>
  );
};
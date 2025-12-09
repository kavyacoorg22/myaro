import React from 'react';
import { Search, } from 'lucide-react';
import { ScrollArea } from '../../../../components/ui/scrollArea';
import type { IRecentSearch, ISearchResult } from '../../../../types/api/public';
import { SearchResults } from './searchResultComponent';
import { RecentSearches } from './recentSearchComponent';



interface SearchModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: IRecentSearch[];
  searchResults: ISearchResult[];
  isLoading: boolean;
  handleRemoveRecent: (id: string) => void;
  handleClearAll: () => void;
  handleResultClick: (result: ISearchResult) => void;
}

export const SearchModalUI: React.FC<SearchModalUIProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  recentSearches,
  searchResults,
  isLoading,
  handleRemoveRecent,
  handleClearAll,
  handleResultClick,
}) => {
  if (!isOpen) return null;

  return (
    <>
    
      <div 
        className="fixed inset-0 bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-2xl font-semibold mb-4">Search</h2>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              autoFocus
            />
          </div>
        </div>

      
        <ScrollArea className="h-[calc(100vh-140px)]">
          {searchQuery ? (
        
            <SearchResults
              isLoading={isLoading}
              searchResults={searchResults}
              handleResultClick={handleResultClick}
            />
          ) : (
            /* Recent Searches */
            <RecentSearches
              recentSearches={recentSearches}
              handleClearAll={handleClearAll}
              handleResultClick={handleResultClick}
              handleRemoveRecent={handleRemoveRecent}
            />
          )}
        </ScrollArea>
      </div>
    </>
  );
};




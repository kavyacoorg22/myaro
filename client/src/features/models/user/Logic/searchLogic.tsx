import React, { useState, useEffect } from 'react';
import { SearchModalUI } from '../Ui/search';
import type { IRecentSearch, ISearchResult } from '../../../../types/api/public';
import { publicAPi } from '../../../../services/api/public';
import { useNavigate } from 'react-router-dom';
import { publicFrontendRoutes } from '../../../../constants/frontendRoutes/publicFrontendRoutes';


interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<IRecentSearch[]>([]);
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()

  
  useEffect(() => {
    if (isOpen) {
      fetchRecentSearches();
    }
  }, [isOpen,recentSearches]);


  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);




  const fetchRecentSearches = async () => {
  try {
    const response = await publicAPi.getSearchHistory();
    
    
    
    const searchArray = response.data?.data || []
  
    
    setRecentSearches(searchArray);
  } catch (error) {
    console.error('Failed to fetch recent searches:', error);
  }
};
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      
       const response = await publicAPi.getSearchResult(query);
      
      
      console.log('Searching for:', query);
      console.log('backend response... frontend',response.data?.data?.beautician)
      setSearchResults(response.data?.data?.beautician ||[]);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRecent = async (id: string) => {
    try {
      await publicAPi.removeSearchHistory(id)
      
      setRecentSearches(prev => prev.filter(item => item.beauticianId !== id));
    } catch (error) {
      console.error('Failed to remove recent search:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await publicAPi.clearSearchHistory()
      
      setRecentSearches([]);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  const handleResultClick = async (result: ISearchResult) => {
    try {
     
      navigate(publicFrontendRoutes.profileByid.replace(':id',result.beauticianId))
      
      
       await publicAPi.addSearchHistory(result.beauticianId);
      
      console.log('Clicked on:', result.userName);
      onClose();
    } catch (error) {
      console.error('Failed to handle result click:', error);
    }
  };



  return (
    <SearchModalUI
      isOpen={isOpen}
      onClose={onClose}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      recentSearches={recentSearches}
      searchResults={searchResults}
      isLoading={isLoading}
      handleRemoveRecent={handleRemoveRecent}
      handleClearAll={handleClearAll}
      handleResultClick={handleResultClick}
    />
  );
};
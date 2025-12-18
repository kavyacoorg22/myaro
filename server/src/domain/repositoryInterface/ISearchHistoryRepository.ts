
import { SearchHistory } from "../entities/searchHistory";

export interface ISearchHistoryRepository {
  getRecentSearches(userId: string): Promise<SearchHistory[]>;
  addSearchHistory(userId: string, beauticianId: string): Promise<SearchHistory>;
  removeSearchHistory(searchHistoryId: string): Promise<void>;
  clearAllSearchHistory(userId: string): Promise<void>;
}
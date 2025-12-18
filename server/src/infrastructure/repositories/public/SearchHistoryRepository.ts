import { SearchHistory } from '../../../domain/entities/searchHistory';
import { ISearchHistoryRepository } from '../../../domain/repositoryInterface/ISearchHistoryRepository';
import { SearchHistoryDoc, SearchHistoryModel } from '../../database/models/user/searchModel';


export class SearchHistoryRepository implements ISearchHistoryRepository {

  


  async getRecentSearches(userId: string): Promise<SearchHistory[]> {
    const searches = await SearchHistoryModel.find({
      userId,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();

    return searches.map(doc => this.toSearchHistoryDomain(doc as unknown as SearchHistoryDoc));
  }

  async addSearchHistory(userId: string, beauticianId: string): Promise<SearchHistory> {
    const existingSearch = await SearchHistoryModel.findOne({
      userId,
      beauticianId,
      isDeleted: false
    });

    if (existingSearch) {
      existingSearch.updatedAt = new Date();
      await existingSearch.save();
      return this.toSearchHistoryDomain(existingSearch);
    }

    const newSearch = await SearchHistoryModel.create({
      userId,
      beauticianId,
      isDeleted: false
    });

    return this.toSearchHistoryDomain(newSearch);
  }

  async removeSearchHistory(searchHistoryId: string): Promise<void> {
    const result = await SearchHistoryModel.findByIdAndUpdate(
      searchHistoryId,
      { isDeleted: true },
      { new: true }
    );

    if (!result) {
      throw new Error('Search history not found');
    }
  }

  async clearAllSearchHistory(userId: string): Promise<void> {
    await SearchHistoryModel.updateMany(
      { userId, isDeleted: false },
      { isDeleted: true }
    );
  }

  private toSearchHistoryDomain(doc: SearchHistoryDoc): SearchHistory {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      beauticianId: doc.beauticianId.toString(),
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}




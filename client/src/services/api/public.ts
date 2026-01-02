
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute";
import {type BackendResponse } from "../../types/api/api";
import {type ISearchResult, type IProfilePhotoChangeResponse, type profileResponce, type ISearchResponse, type IRecentSearchResponse } from "../../types/api/public";
import api,{ axiosWrapper} from "../axiosWrapper";

export const publicAPi={
  ownProfile: async () => {
    return await axiosWrapper<profileResponce>(api.get(publicApiRoutes.ownProfile));
  },
  callById:async(id:string)=>{
    return await axiosWrapper<profileResponce>(api.get(publicApiRoutes.profileByUserId.replace(':id',id)))
  },
  changeProfilePhoto:async(formData:FormData)=>{
    return await axiosWrapper<IProfilePhotoChangeResponse>(api.patch(publicApiRoutes.profileImage,formData))
  },
   getProfile: async (id:string) => {
    return await axiosWrapper<profileResponce>(api.get(publicApiRoutes.profileByUserId.replace(":id",id)));
  },
  getSearchResult:async(query:string)=>{
    return await axiosWrapper<ISearchResponse>(api.get(publicApiRoutes.search,{
      params:{query}
    }))
  },
  addSearchHistory:async(beauticianId:string)=>{
    return await axiosWrapper<BackendResponse>(api.post(publicApiRoutes.addSearchHistory.replace(':id',beauticianId)))
  },
  getSearchHistory:async()=>{
    return await axiosWrapper<IRecentSearchResponse>(api.get(publicApiRoutes.searchHistory))
  },
  removeSearchHistory:async(searchHistoryId:string)=>{
    return await axiosWrapper<BackendResponse>(api.delete(publicApiRoutes.removeSearchHistory.replace(':id',searchHistoryId)))
  },
  clearSearchHistory:async()=>{
    return await axiosWrapper<BackendResponse>(api.delete(publicApiRoutes.clearSearchHistory))
  }
}
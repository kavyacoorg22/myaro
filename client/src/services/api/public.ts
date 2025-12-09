
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute";
import {type BackendResponse } from "../../types/api/api";
import {type ISearchResult, type IProfilePhotoChangeResponse, type profileResponce, type ISearchResponse, type IRecentSearchResponse } from "../../types/api/public";
import { fetchWrapper } from "../fetchWrapper";


export const publicAPi={
  ownProfile: async () => {
    return await fetchWrapper<profileResponce>(publicApiRoutes.ownProfile, {
      method: 'GET',
    });
  },
  callById:async(id:string)=>{
    return await fetchWrapper<profileResponce>(publicApiRoutes.profileByUserId.replace(':id',id),{
      method:'GET'
    })
  },
  changeProfilePhoto:async(formData:FormData)=>{
    return await fetchWrapper<IProfilePhotoChangeResponse>(publicApiRoutes.profileImage,{
      method:'PATCH',
      body:formData
    })
  },
   getProfile: async (id:string) => {
    return await fetchWrapper<profileResponce>(publicApiRoutes.profileByUserId.replace(":id",id), {
      method: 'GET',
    });
  },
  getSearchResult:async(query:string)=>{
    return await fetchWrapper<ISearchResponse>(publicApiRoutes.search,{
      method:'GET',
      params:{query}
    })
  },
  addSearchHistory:async(beauticianId:string)=>{
    return await fetchWrapper<BackendResponse>(publicApiRoutes.addSearchHistory.replace(':id',beauticianId),{
     method:"POST"
    })
  },
  getSearchHistory:async()=>{
    return await fetchWrapper<IRecentSearchResponse>(publicApiRoutes.searchHistory,{
     method:"GET"
    })
  },
  removeSearchHistory:async(searchHistoryId:string)=>{
    return await fetchWrapper<BackendResponse>(publicApiRoutes.removeSearchHistory.replace(':id',searchHistoryId),{
     method:'DELETE'
    })
  },
  clearSearchHistory:async()=>{
    return await fetchWrapper<BackendResponse>(publicApiRoutes.clearSearchHistory,{
      method:'DELETE'
    })
  }
}
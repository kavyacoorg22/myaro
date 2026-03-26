
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute";
import type { PostType } from "../../features/types/mediaType";
import {type BackendResponse } from "../../types/api/api";
import {   type IGetAvailabilitySlotResponse, type IGetAllHomeFeedResponseData, type IGetTipsAndRentResponseData, type IGetmonthlyAvailabilityReponse, type IGetBeauticianPostResponse, type IGetBeauticianPostResponseData } from "../../types/api/beautician";
import {type IProfilePhotoChangeResponse, type profileResponce, type ISearchResponse, type IRecentSearchResponse, type IChangePasswordRequest,type ISignedUrlResponse, type ISignedUrlFile } from "../../types/api/public";
import type{  IGetBeauticianServicesListResponse, IGetCategoryResponse, IGetPamphletResponse, IGetServiceResponse, PriceFilter } from "../../types/api/services";
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
  },
   getCategory:async()=>{
    return await axiosWrapper<IGetCategoryResponse>(api.get(publicApiRoutes.getCategory))
  },
   getService:async(categoryId:string)=>{
    return await axiosWrapper<IGetServiceResponse>(api.get(publicApiRoutes.getService.replace(':categoryId',categoryId)))
  },
   getAvailbilitySchedule:async(beauticianId:string,date:string)=>{
      return await axiosWrapper<IGetAvailabilitySlotResponse>(api.get(publicApiRoutes.getAvailabilityOfBeautician.replace(':id',beauticianId),{
        params:{date}
      }))
     },
       getServiceList:async(filter:string,priceFilter:PriceFilter,beauticianId:string)=>{
         return await axiosWrapper<IGetBeauticianServicesListResponse>(api.get(publicApiRoutes.getBeauticianServiceList.replace(':id',beauticianId),{
           params:{filter,priceFilter}
         })
       )},
     getPamphlet:async(id:string)=>{
        return await axiosWrapper<IGetPamphletResponse>(api.get(publicApiRoutes.getPamplet.replace(':beauticianId',id)))
       },
      changePassword:async(input:IChangePasswordRequest)=>{
        return await axiosWrapper<BackendResponse>(api.patch(publicApiRoutes.changePassword,{
          input
        }))
      },
    getHomeFeed: async (cursor: string | null = null) => {
  const params = cursor ? { cursor } : {};
  return await axiosWrapper<IGetAllHomeFeedResponseData>(api.get(publicApiRoutes.homefeed, { params }));
},
getTipsRentFeed: async (cursorTips: string | null = null, cursorRent: string | null = null) => {
  const params = { ...(cursorTips && { cursorTips }), ...(cursorRent && { cursorRent }) };
  return await axiosWrapper<IGetTipsAndRentResponseData>(api.get(publicApiRoutes.tipsRentFeed, { params }));
},
getSearchPostResult:async(query:string,cursor:string|null)=>{
   const params = {
    query,
    ...(cursor && { cursor })
  };
  return await axiosWrapper<IGetAllHomeFeedResponseData>(api.get(publicApiRoutes.searchPost,{params}))
},
getSignedUploadUrls: async (files: ISignedUrlFile[]) => {
  return await axiosWrapper<ISignedUrlResponse>(
    api.post(publicApiRoutes.getSignedUrl, { files })
  );
},
 getMonthlyAvailabilityForUser:async(beauticianId:string,month: number, year: number)=>{
    return await axiosWrapper<IGetmonthlyAvailabilityReponse>(api.get(publicApiRoutes.getMonthlyAvailabilityForCustomer.replace(':id',beauticianId), { params: { month, year } }))
   },
 getBeauticianPost:async(beauticianId:string,postType:PostType,limit=12,cursor?:string|null)=>{
   const params={
    postType,
    limit,
    ...(cursor&&{cursor})
   }
  return await axiosWrapper<IGetBeauticianPostResponseData>(api.get(publicApiRoutes.getBeauticianPost.replace(':id',beauticianId),{params}))
 }
  
}
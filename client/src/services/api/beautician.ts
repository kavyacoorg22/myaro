import { beauticianApi } from "../../constants/apiRoutes/beauticianRoutes";
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute";
import type { BackendResponse } from "../../types/api/api";
import {type IGetServiceAreaResponse, type IAddAvailabilityRequest, type IAddServiceAreaRequest, type IBeauticianPaymentDeatilRequest, type IBeauticianPaymentDetailResponse, type IBeauticianProfileUpdate, type IEditProfileResponse, type IGetAvailabilitySlotResponse,  type IVerificationStatusResponse, type Slot, type IAddRecursionScheduleRequest, type IDeleteRecursionScheduleReuest, type IGetmonthlyAvailabilityReponse,  } from "../../types/api/beautician";
import type { ICreatePostInput } from "../../types/api/public";
import { type IGetPamphletResponse, type IAddCustomServiceRequest, type IBeauticianServiceSelectionResponse, type IGetBeauticianServicesListResponse, type IUpsertBeauticianServiceRequest, type PriceFilter,} from "../../types/api/services";
import api,{ axiosWrapper} from "../axiosWrapper";

export const BeauticianApi = {
  beauticianRegister: async (formData:FormData) => {
    return await axiosWrapper<BackendResponse>(api.post(beauticianApi.register,formData));
  },
  getStatus: async () => {
    return await axiosWrapper<IVerificationStatusResponse>(api.get(beauticianApi.getStatus));
  },
   updateRegister: async (data:IBeauticianPaymentDeatilRequest) => {
    return await axiosWrapper<IBeauticianPaymentDetailResponse>(api.patch(beauticianApi.register,data));
  },
  viewProfile:async()=>{
    return await axiosWrapper<IEditProfileResponse>(api.get(beauticianApi.profile))
  },
  updateProfile:async(data:IBeauticianProfileUpdate)=>{
    return await axiosWrapper<BackendResponse>(api.patch(beauticianApi.profile,data))
  },
  getServiceList:async(filter:string,priceFilter:PriceFilter)=>{
    return await axiosWrapper<IGetBeauticianServicesListResponse>(api.get(beauticianApi.getServiceLists,{
      params:{filter,priceFilter}
    })
  )},
   getServiceSeletion:async()=>{
    return await axiosWrapper<IBeauticianServiceSelectionResponse>(api.get(beauticianApi.getServiceSelection))
  },
   uploadPamphlet:async(pamphletImg:FormData)=>{
    return await axiosWrapper<BackendResponse>(api.patch(beauticianApi.addPamphlet,pamphletImg))
   },
   deletePamphlet:async()=>{
    return await axiosWrapper<BackendResponse>(api.delete(beauticianApi.deletePamphlet))
   },
   getPamphlet:async()=>{
    return await axiosWrapper<IGetPamphletResponse>(api.get(beauticianApi.getPamphlet))
   },
   upsertSelectedService:async(data:IUpsertBeauticianServiceRequest)=>{
    return await axiosWrapper<BackendResponse>(api.put(beauticianApi.upsertSelectedService,data))
   },
   addCustomService:async(data:IAddCustomServiceRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(beauticianApi.addCustomService,data))
   },
   addAvailabilitySchedule:async(data:IAddAvailabilityRequest)=>{
    return await axiosWrapper<BackendResponse>(api.put(beauticianApi.addSchedule,data))
   },
   getAvailbilitySchedule:async(date:string)=>{
    return await axiosWrapper<IGetAvailabilitySlotResponse>(api.get(beauticianApi.getSchedule,{
      params:{date}
    }))
   },
   deleteAvailabilitySlot:async(slotToDelete:Slot,scheduleId:string)=>{
    return await axiosWrapper<BackendResponse>(api.delete(beauticianApi.deleteSchedule.replace(':id',scheduleId),{
      data:{slotToDelete}
    }))
   },
   addLocation:async(input:IAddServiceAreaRequest)=>{
    return await axiosWrapper<BackendResponse>(api.patch(beauticianApi.addLocation,input))
   },
   getLocation:async()=>{
    return await axiosWrapper<IGetServiceAreaResponse>(api.get(beauticianApi.getLocation))
   },
   addRecurringSchedule:async(data:IAddRecursionScheduleRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(beauticianApi.addRecurringSlot,data))
   },
   deleteRecurringSchedule:async(recurringId:string,data:IDeleteRecursionScheduleReuest)=>{
    return await axiosWrapper<BackendResponse>(api.delete(beauticianApi.deleteRecurringSlot.replace(':id',recurringId),{data}))
   },
   getMonthlyAvailability:async(month: number, year: number)=>{
    return await axiosWrapper<IGetmonthlyAvailabilityReponse>(api.get(beauticianApi.getMonthlyAvailability, { params: { month, year } }))
   },
 createPost: async (input: ICreatePostInput) => {
  return await axiosWrapper<BackendResponse>(
    api.post(publicApiRoutes.createPost, input)
  );
},
};
import { beauticianApi } from "../../constants/apiRoutes/beauticianRoutes";
import {type IBeauticianProfileResponse } from "../../types/api/admin";
import type { BackendResponse } from "../../types/api/api";
import type { IBeauticianPaymentDeatilRequest, IBeauticianPaymentDetailResponse, IBeauticianProfileUpdate, IEditProfileResponse, IRegisterRequest, IVerificationStatusResponse } from "../../types/api/beautician";
import { fetchWrapper } from "../fetchWrapper";

export const BeauticianApi = {
  beauticianRegister: async (formData:FormData) => {
    return await fetchWrapper<BackendResponse>(beauticianApi.register, {
      method: 'POST',
      body: formData,
    });
  },
  getStatus: async () => {
    return await fetchWrapper<IVerificationStatusResponse>(beauticianApi.getStatus, {
      method: 'GET',
    });
  },
   updateRegister: async (data:IBeauticianPaymentDeatilRequest) => {
    return await fetchWrapper<IBeauticianPaymentDetailResponse>(beauticianApi.register, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  viewProfile:async()=>{
    return await fetchWrapper<IEditProfileResponse>(beauticianApi.profile,{
      method:'GET'
    })
  },
  updateProfile:async(data:IBeauticianProfileUpdate)=>{
    return await fetchWrapper<BackendResponse>(beauticianApi.profile,{
     method:'PATCH',
     body:JSON.stringify(data)
    })
  },
 


};
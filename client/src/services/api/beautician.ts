import { beauticianApi } from "../../constants/apiRoutes/beauticianRoutes";
import {type IBeauticianProfileResponse } from "../../types/api/admin";
import type { BackendResponse } from "../../types/api/api";
import type { IBeauticianPaymentDeatilRequest, IBeauticianPaymentDetailResponse, IBeauticianProfileUpdate, IEditProfileResponse, IRegisterRequest, IVerificationStatusResponse } from "../../types/api/beautician";
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
 


};
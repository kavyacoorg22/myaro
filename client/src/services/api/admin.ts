import { adminApiRoute } from "../../constants/apiRoutes/adminRoutes";
import type { IAdminLoginRequest, IApproveResponse, IBeauticianProfileResponse, IGetAllUserResponse, IGetBeauticianRequest, IGetBeauticianResponse, IGetUserListRequest, IRejectResponse, IToggleStatusRequest } from "../../types/api/admin";
import type { BackendResponse } from "../../types/api/api";
import api,{ axiosWrapper} from "../axiosWrapper";




export const adminApi={
  login:async(data:IAdminLoginRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(adminApiRoute.adminLogin,data) );
  },
  getUsers:async(data:IGetUserListRequest)=>{
    return await axiosWrapper<IGetAllUserResponse>(api.get(adminApiRoute.getAllUser, {
      params:data
    }));
  },

    toggleStatus:async(data:IToggleStatusRequest,id:string)=>{
    return await axiosWrapper<BackendResponse>(api.patch(adminApiRoute.toggleUser.replace(':id',id),data));
  },

   getBeautician:async(data:IGetBeauticianRequest)=>{
    return await axiosWrapper<IGetBeauticianResponse>(api.get(adminApiRoute.getBeautician, {
      params:data
    }));
  },
 
    viewProfile:async(id:string)=>{
    return await axiosWrapper<IBeauticianProfileResponse>(api.get(adminApiRoute.viewBeautician.replace(':id',id)) );
  },

  
    approveBeautician:async(id:string)=>{
    return await axiosWrapper<IApproveResponse>(api.patch(adminApiRoute.approveBeautician.replace(':id',id)));
  },
    rejectBeautician:async(id:string)=>{
    return await axiosWrapper<IRejectResponse>(api.patch(adminApiRoute.rejectBeautician.replace(':id',id)) );
  },
  
}
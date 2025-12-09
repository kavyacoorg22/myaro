import { adminApiRoute } from "../../constants/apiRoutes/adminRoutes";
import type { IAdminLoginRequest, IApproveResponse, IBeauticianProfileResponse, IGetAllUserResponse, IGetBeauticianRequest, IGetBeauticianResponse, IGetUserListRequest, IRejectResponse, IToggleStatusRequest } from "../../types/api/admin";
import type { BackendResponse } from "../../types/api/api";
import { fetchWrapper } from "../fetchWrapper";




export const adminApi={
  login:async(data:IAdminLoginRequest)=>{
    return await fetchWrapper<BackendResponse>(adminApiRoute.adminLogin, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getUsers:async(data:IGetUserListRequest)=>{
    return await fetchWrapper<IGetAllUserResponse>(adminApiRoute.getAllUser, {
      method: 'GET',
      params:data
    });
  },

    toggleStatus:async(data:IToggleStatusRequest,id:string)=>{
    return await fetchWrapper<BackendResponse>(adminApiRoute.toggleUser.replace(':id',id), {
      method: 'PATCH',
      body:JSON.stringify(data)
    });
  },

   getBeautician:async(data:IGetBeauticianRequest)=>{
    return await fetchWrapper<IGetBeauticianResponse>(adminApiRoute.getBeautician, {
      method: 'GET',
      params:data
    });
  },
 
    viewProfile:async(id:string)=>{
    return await fetchWrapper<IBeauticianProfileResponse>(adminApiRoute.viewBeautician.replace(':id',id), {
      method: 'GET',
    
    });
  },

  
    approveBeautician:async(id:string)=>{
    return await fetchWrapper<IApproveResponse>(adminApiRoute.approveBeautician.replace(':id',id), {
      method: 'PATCH',
    });
  },
    rejectBeautician:async(id:string)=>{
    return await fetchWrapper<IRejectResponse>(adminApiRoute.rejectBeautician.replace(':id',id), {
      method: 'PATCH',
    });
  },
  
}
import { adminApiRoute } from "../../constants/apiRoutes/adminRoutes";
import type { CustomServiceStatusType } from "../../constants/types/service";
import type { TabType } from "../../features/types/customServiceType";
import type { IAdminLoginRequest, IApproveResponse, IBeauticianProfileResponse, IGetAllUserResponse, IGetBeauticianRequest, IGetBeauticianResponse, IGetUserListRequest, IRejectResponse, IToggleStatusRequest } from "../../types/api/admin";
import type { BackendResponse } from "../../types/api/api";
import {  type IAddCategoryRequest, type IAddServiceRequest, type IGetAllCustomServiceResponse, type IServiceRequest } from "../../types/api/services";
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
  //services
  addCategory:async(data:IAddCategoryRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(adminApiRoute.addCategory,data))
  },

  addService:async(data:IAddServiceRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(adminApiRoute.addService,data))
  },
  updateService:async(id:string,data:IServiceRequest)=>{
    return await axiosWrapper<BackendResponse>(api.patch(adminApiRoute.updateService.replace(':id',id),data))
  },
  updateCategory:async(id:string,data:IAddCategoryRequest)=>{
    return await axiosWrapper<BackendResponse>(api.patch(adminApiRoute.updateCategory.replace(':id',id),data))
  },
  toggleServiceStatus:async(id:string,data:{isActive:boolean})=>{
    return await axiosWrapper<BackendResponse>(api.patch(adminApiRoute.toggleService.replace(':id',id),data))
  },
  getAllCustomService:async(filter:TabType,page:Number)=>{
    return await axiosWrapper<IGetAllCustomServiceResponse>(api.get(adminApiRoute.getAllCustomService,{
      params:{
        filter:filter,
        page:page,
        limit:10
      }
    }))},
      updateCustomServiceStatus:async(status:CustomServiceStatusType,id:string)=>{
      return await axiosWrapper<BackendResponse>(api.patch(adminApiRoute.changeCustomServiceStatus.replace(':id',id),{status:status}))
    }
  
}
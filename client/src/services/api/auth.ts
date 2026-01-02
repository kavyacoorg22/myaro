import { authRoutes } from "../../constants/apiRoutes/authRoutes";
import type { BackendResponse } from "../../types/api/api";
import {type ILoginResponse, type ICompleteSignup, type ILoginRequest, type IPreSignupResponse, type IResendOtpRequest, type ISendOtprequest, type IForgotpasswordRequest, type IVerifyOtpRequest, type IResetpasswordRequest, type ISignupRequest, type IGoogleLoginInput } from "../../types/api/auth";
import api,{ axiosWrapper} from "../axiosWrapper";



export const authApi={


preSignup: async (data:ISignupRequest) => {
  return await axiosWrapper<IPreSignupResponse>(api.post(authRoutes.preSignup,data));
},

sendOtp:async (data:ISendOtprequest)=>{
 return await axiosWrapper<BackendResponse>(api.post(authRoutes.sendOtp,data));
},

resendOtp:async(data:IResendOtpRequest)=>{ 
  return await axiosWrapper<BackendResponse>(api.post(authRoutes.reSendOtp,data))
}  ,

completeSignup:async(data:ICompleteSignup)=>{
  return await axiosWrapper<BackendResponse>(api.post(authRoutes.completeSignup,data))
},

login:async(data:ILoginRequest)=>{
  return await axiosWrapper<ILoginResponse>(api.post(authRoutes.login,data)
)},

  logout:async()=>{
    return await axiosWrapper<BackendResponse>(api.post(authRoutes.logout))
  },

  forgotPassword:async(email:IForgotpasswordRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(authRoutes.forgotPassword,email))
  },

  verifyOtp:async(data:IVerifyOtpRequest)=>{
    return await axiosWrapper<BackendResponse>(api.post(authRoutes.verifyOtp,data))
  },
  passwordReset:async(data:IResetpasswordRequest)=>{
    return await axiosWrapper<BackendResponse>(api.patch(authRoutes.resetPassword,data))
  },
  refershToken:async()=>{
    return await axiosWrapper(api.post(authRoutes.refresh));
  },
   googleLogin:async(data:IGoogleLoginInput)=>{
  return await axiosWrapper<ILoginResponse>(api.post(authRoutes.googleLogin,data)
)}
}


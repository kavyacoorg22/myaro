import { authRoutes } from "../../constants/apiRoutes/authRoutes";
import type { BackendResponse } from "../../types/api/api";
import {type ILoginResponse, type ICompleteSignup, type ILoginRequest, type IPreSignupResponse, type IResendOtpRequest, type ISendOtprequest, type IForgotpasswordRequest, type IVerifyOtpRequest, type IResetpasswordRequest, type ISignupRequest, type IGoogleLoginInput } from "../../types/api/auth";
import type { IRegisterRequest } from "../../types/api/beautician";
import { fetchWrapper} from "../fetchWrapper";



export const authApi={


preSignup: async (data:ISignupRequest) => {
  return await fetchWrapper<IPreSignupResponse>(authRoutes.preSignup, {
    method: 'POST',
    body: JSON.stringify(data),
  });
},
sendOtp:async (data:ISendOtprequest)=>{


  return await fetchWrapper<BackendResponse>(authRoutes.sendOtp,{
    method:"POST",
    body:JSON.stringify(data),
  });
},

resendOtp:async(data:IResendOtpRequest)=>{
  
  return await fetchWrapper<BackendResponse>(authRoutes.reSendOtp,{
    method:'POST',
    body:JSON.stringify(data)
  })
}  ,

completeSignup:async(data:ICompleteSignup)=>{
  return await fetchWrapper<BackendResponse>(authRoutes.completeSignup,{
    method:"POST",
    body:JSON.stringify(data)
  })
},
login:async(data:ILoginRequest)=>{
  return await fetchWrapper<ILoginResponse>(authRoutes.login,{
    method:"POST",
    body:JSON.stringify(data)
  }
)},

  logout:async()=>{
    return await fetchWrapper<BackendResponse>(authRoutes.logout,{
      method:'POST'
    })
  },

  forgotPassword:async(email:IForgotpasswordRequest)=>{
    return await fetchWrapper<BackendResponse>(authRoutes.forgotPassword,{
      method:'POST',
      body:JSON.stringify(email)
    })
  },
  verifyOtp:async(data:IVerifyOtpRequest)=>{
    return await fetchWrapper<BackendResponse>(authRoutes.verifyOtp,{
      method:"POST",
      body:JSON.stringify(data)
    })
  },
  passwordReset:async(data:IResetpasswordRequest)=>{
    return await fetchWrapper<BackendResponse>(authRoutes.resetPassword,{
      method:"PATCH",
      body:JSON.stringify(data)
    })
  },
  refershToken:async()=>{
    return await fetchWrapper(authRoutes.refresh, {
        method: 'POST',
        credentials: 'include', 
    });
  },
   googleLogin:async(data:IGoogleLoginInput)=>{
  return await fetchWrapper<ILoginResponse>(authRoutes.googleLogin,{
    method:"POST",
    body:JSON.stringify(data)
  }
)}
}


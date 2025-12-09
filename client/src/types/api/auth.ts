import type { UserRoleType } from "../../constants/types/User";
import type { BackendResponse } from "./api"

export interface ISignupRequest{
  email:string,
  userName:string,
  fullName:string,
  password:string,
  confirmPassword:string
}

export interface IPreSignupResponseData {
  signupToken: string;
}

export interface ISendOtprequest{
  email:string
  signupToken?:string
}


export interface IVerifyOtpRequest{
  email:string,
  otp:string,
  signUpToken?:string
}

export interface IResendOtpRequest{
  email:string,
  signupToken:string
}

export interface ICompleteSignup{
  email:string,
  signupToken:string,
  otp:string
}

export interface ILoginRequest{
  identifier:string,
  password:string
}


export interface ILoginResponseData{
  userId:string,
  email:string,
  fullName:string,
  userName:string,
  role:UserRoleType,
  profileImg:string,
  isVerified:boolean,
}

export interface IForgotpasswordRequest{
  email:string
}

export interface IResetpasswordRequest{
  password:string,
  email:string,
  confirmPassword:string,
}

export interface IGoogleLoginInput {
    credential: string;
    role: UserRoleType;
}

export type IPreSignupResponse = BackendResponse<IPreSignupResponseData>;
export type ILoginResponse=BackendResponse<ILoginResponseData>
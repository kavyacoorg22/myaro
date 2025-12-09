import { BooleanSchemaDefinition } from "mongoose";
import { UserRole } from "../../domain/enum/userEnum"

export interface ILoginInput{
  identifier:string,
  password:string,
}

export interface ILoginOutput {
    user: {
         userId:string,
        fullName: string;
        userName:string
        email: string;
        role: UserRole;
        profileImg?: string;
        isVerified:boolean
    };
    accessToken:string,
    refreshToken:string
}


export interface IForgotPasswordInput{
  email:string
}

export interface IResetPasswordInput{
  password:string,
  email:string
}

export interface IResponse{
  success:boolean,
  message:string,
}

export interface IGoogleLoginInput {
    credential: string;
    role: UserRole;
}
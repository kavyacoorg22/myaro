import { UserRole } from "../enum/userEnum"

export type UserId=string


export interface User{
  id:UserId
  email:string,
  fullName:string,
  userName:string,
  passwordHash?:string,
  role:UserRole,
  profileImg?:string,
  isVerified:boolean,
  isActive:boolean
  googleId?: string;
  createdAt:Date,
  updatedAt:Date
}
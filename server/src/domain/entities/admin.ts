
import { UserRole } from "../enum/userEnum";


export interface Admin{
  id:string
  email:string,
  passwordHash:string,
  role:UserRole,
  isActive:boolean,
  createdAt:Date,
  updatedAt:Date
}
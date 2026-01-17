import { CategoryServiceType } from "../enum/serviceEnum";

export interface Category{
  id:string,
  name:string,
  type:CategoryServiceType,
  createdBy:string,
  isActive:boolean,
  description:string,
  createdAt:Date,
  updatedAt:Date
}


export type UserId=string


export interface SearchHistory{
  id:UserId
  userId:string,
  beauticianId:string,
  isDeleted:boolean,
  createdAt:Date,
  updatedAt:Date
}
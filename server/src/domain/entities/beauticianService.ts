
export interface BeauticianService{
  id:string,
  beauticianId:string,
  serviceId?:string,
  categoryId?:string,
  serviceName:string,
  categoryName?:string,
  price:number,
  isHomeServiceAvailable:boolean,
  submissionId?:string,
  createdAt:Date,
  updatedAt:Date
}
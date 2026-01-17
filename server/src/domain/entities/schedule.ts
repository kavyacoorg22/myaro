
export interface Slot{
 startTime:string,
 endTime:string
}

export interface Schedule{
  id:string,
  beauticianId:string,
  slot:Slot,
  date:Date,
  createdAt:Date,
  updatedAt:Date
}
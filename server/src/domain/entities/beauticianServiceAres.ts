
export interface LocationVO{
  placeId:string,
  city:string,
  lat: number,
  lng :number,
  formattedString:string
}

export interface BeauticianServiceArea {
  id: string;
  beauticianId: string;
  homeServiceLocation:LocationVO,
  serviceLocation:LocationVO,
  createdAt: Date;
  updatedAt: Date;
}
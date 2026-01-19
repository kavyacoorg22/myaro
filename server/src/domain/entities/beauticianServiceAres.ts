
export interface LocationVO{
  placeId:string,
  city:string,
  lat: number,
  lng :number,
  formattedString:string
}

export interface ServiceArea {
  id: string;
  beauticianId: string;
  homeServiceLocation:LocationVO[],
  serviceLocation:LocationVO[],
  createdAt: Date;
  updatedAt: Date;
}
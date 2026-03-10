
export interface LocationVO{
  city:string,
  lat: number|null,
  lng :number|null,
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
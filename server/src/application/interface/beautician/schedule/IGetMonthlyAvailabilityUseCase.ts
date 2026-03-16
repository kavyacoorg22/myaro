import { IGetmonthlyAvailabilityOutput } from "../../../interfaceType/scheduleType";


export interface IGetMonthlyAvailabilityUSeCase {
  execute(beaticianId:string,month:number,year:number):Promise<IGetmonthlyAvailabilityOutput>
}
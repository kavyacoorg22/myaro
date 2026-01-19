import { Schedule } from "../../domain/entities/schedule";
import { IGetAvailabilitySlotDto } from "../dtos/beautician";

export function toGetAvailabilitySlotDto(slot:Schedule):IGetAvailabilitySlotDto{
 return{
  slots:slot.slots,
  date:slot.date
 }
} 
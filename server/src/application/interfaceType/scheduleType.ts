import { Slot } from "../../domain/entities/schedule";
import { IGetAvailabilitySlotDto } from "../dtos/beautician";

export interface IAddAvailabilityRequest {
  dates: string[];
  slots: Slot[];
}

export interface IGetAvailabilitySlotResponse{
  availability:IGetAvailabilitySlotDto
}
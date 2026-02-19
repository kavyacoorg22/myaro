import type { Slot } from "../api/beautician";

export interface Service {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

export interface IGetAvailabilitySlotDto {
  scheduleId:string,
  slots: Slot[];
  date: Date;
}

export interface IGetServiceAreaDto {
  homeServiceableLocation?: string[];
  serviceableLocation?: string[];
}

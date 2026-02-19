import type { IAddAvailabilityRequest } from "../../types/api/beautician";

export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
}

export interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'own-beautician' | 'own-customer' | 'view-beautician' | 'view-customer';
  profileName?: string;
  profileUsername?: string;
  profileImage?: string;
  initialDate?: Date;
  initialSelectedDates?: number[];
  onDateSelect?: (dates: number[]) => void;
  onConfirm?: (dates: number[], mode: 'single' | 'multiple') => void;
  existingSlots?: TimeSlot[];
  onSaveSlots?: (request: IAddAvailabilityRequest) => Promise<void>;
  onDeleteSlot?: (slot: TimeSlot) => Promise<void>;
    beauticianId?: string;
}

//view delete add
export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface TimeSlot {
  scheduleId: string;
  startTime: string;
  endTime: string;
}

export interface Slot {
  startTime: string;
  endTime: string;
}



export interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDates: string[]; // ["2026-01-22", "2026-01-23"]
  displayDate: string; // "jan22" or "3 dates"
  viewMode: 'own-beautician' | 'view-beautician';
  existingSlots?: TimeSlot[];
  onSave?: (request: IAddAvailabilityRequest) => Promise<void>;
  onDeleteSlot?: (slot: TimeSlot) => Promise<void>;
    beauticianId?: string;
}

export interface IDeleteSlotRequest {
  slots: Slot[]; 
}
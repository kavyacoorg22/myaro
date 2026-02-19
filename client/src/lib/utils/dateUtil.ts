import type { TimeSlot } from "../../features/types/schedule";

export const formatDatesForAPI = (
  dates: number[],
  year: number,
  month: number
): string[] => {
  return dates.map(date => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dateStr = String(date).padStart(2, '0');
    return `${year}-${monthStr}-${dateStr}`;
  });
};


export const formatDateDisplay = (date: number, monthName: string): string => {
  return `${monthName.slice(0, 3).toLowerCase()}${date}`;
};


export const convertSlotsToTimeSlots = (slots: { startTime: string; endTime: string }[], scheduleId: string): TimeSlot[] => {
  return slots.map(slot => ({
    scheduleId,
    startTime: slot.startTime,
    endTime: slot.endTime
  }));
}
import type { Slot } from "../../types/api/beautician";

export const formatSlotLabel = (slot: Slot): string => {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${String(display).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
  };
  return `${fmt(slot.startTime)} – ${fmt(slot.endTime)}`;
};
 
export const slotKey = (slot: Slot) => `${slot.startTime}-${slot.endTime}`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string;   // "09:00 AM"
  end: string;     // "10:00 AM"
  startHour: number; // 9
  available: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(display).padStart(2, "0")}:00 ${period}`;
};

/**
 * Given a flat list of 1-hour slots (from backend) + a desired duration,
 * check whether `durationHours` consecutive slots starting at `startHour`
 * are ALL available.
 */
export const hasConsecutiveBlock = (
  slots: TimeSlot[],
  startHour: number,
  durationHours: number,
): boolean => {
  for (let h = startHour; h < startHour + durationHours; h++) {
    const slot = slots.find((s) => s.startHour === h);
    if (!slot || !slot.available) return false;
  }
  return true;
};

/**
 * Returns a human-readable end-time label.
 * e.g. startHour=9, duration=2  →  "11:00 AM"
 */
export const getEndTimeLabel = (startHour: number, durationHours: number): string =>
  formatHour(startHour + durationHours);

/**
 * Convert raw backend availability slots to our TimeSlot shape.
 * Backend returns objects like: { start: "09:00", end: "10:00", available: true }
 * Adjust the mapping below to match your actual API response shape.
 */
export const mapBackendSlots = (raw: Slot[]): TimeSlot[] => {
  const expanded: TimeSlot[] = [];

  for (const r of raw) {
    const startHour = parseInt(r.startTime.split(":")[0], 10);
    const endHour   = parseInt(r.endTime.split(":")[0], 10);

    // e.g. 09:00 → 18:00 produces slots at 9, 10, 11, 12, 13, 14, 15, 16, 17
    for (let h = startHour; h < endHour; h++) {
      expanded.push({
        start:     formatHour(h),
        end:       formatHour(h + 1),
        startHour: h,
        available: true,
      });
    }
  }

  return expanded;
};
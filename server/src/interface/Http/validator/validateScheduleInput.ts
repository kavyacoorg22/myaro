import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { Slot } from "../../../domain/entities/schedule";

export const validateAddAvailability = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { dates, slots } = req.body;


  if (!Array.isArray(dates) || dates.length === 0) {
    throw new AppError(
      "At least one date is required",
      HttpStatus.BAD_REQUEST
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);

  for (const dateStr of dates) {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new AppError(
        `Invalid date format: ${dateStr}`,
        HttpStatus.BAD_REQUEST
      );
    }

    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);

    if (normalized < today) {
      throw new AppError(
        "Cannot add availability for past dates",
        HttpStatus.BAD_REQUEST
      );
    }

    if (normalized > maxDate) {
      throw new AppError(
        "Cannot add availability more than 90 days in advance",
        HttpStatus.BAD_REQUEST
      );
    }
  }



  if (!Array.isArray(slots) || slots.length === 0) {
    throw new AppError(
      "At least one time slot is required",
      HttpStatus.BAD_REQUEST
    );
  }

  for (const slot of slots as Slot[]) {
    if (!isValidTime(slot.startTime) || !isValidTime(slot.endTime)) {
      throw new AppError(
        "Invalid time format. Use HH:mm (e.g. 09:00)",
        HttpStatus.BAD_REQUEST
      );
    }

    if (slot.startTime >= slot.endTime) {
      throw new AppError(
        `Invalid slot ${slot.startTime} - ${slot.endTime}`,
        HttpStatus.BAD_REQUEST
      );
    }

    const duration = getDurationInMinutes(slot);
    if (duration < 15) {
      throw new AppError(
        `Slot ${slot.startTime}-${slot.endTime} must be at least 15 minutes`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ---------------- Overlap validation ----------------

  checkSlotOverlaps(slots);

  next();
};

// ================= Helpers =================

function isValidTime(time: string): boolean {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

function getDurationInMinutes(slot: Slot): number {
  const [sh, sm] = slot.startTime.split(":").map(Number);
  const [eh, em] = slot.endTime.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function checkSlotOverlaps(slots: Slot[]) {
  const sorted = [...slots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
//09:00–10:30
//10:00–11:00
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].endTime > sorted[i + 1].startTime) {
      throw new AppError(
        `Overlapping slots detected: ${sorted[i].startTime}-${sorted[i].endTime}`,
        HttpStatus.CONFLICT
      );
    }
  }
}
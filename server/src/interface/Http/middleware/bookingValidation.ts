import { Request, Response, NextFunction } from "express";
import { ICreateBookingInput } from "../../../application/interfaceType/booking";
import { BookingServiceVO } from "../../../domain/entities/booking";

export function validateRequestRefund(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { refundReason } = req.body;

  if (
    refundReason === undefined ||
    refundReason === null ||
    typeof refundReason !== "string" ||
    refundReason.trim() === ""
  ) {
    return res.status(400).json({
      error: "Refund reason is required",
    });
  }

  const trimmedReason = refundReason.trim();

  if (trimmedReason.length < 10) {
    return res.status(400).json({
      error: "Please describe the issue in at least 10 characters",
    });
  }

  if (trimmedReason.length > 500) {
    return res.status(400).json({
      error: "Description is too long (max 500 characters)",
    });
  }

  req.body.refundReason = trimmedReason;

  next();
}


export function validateCreateBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body: ICreateBookingInput = req.body;

  // ── chatId ──────────────────────────────────────────────
  if (!body.chatId || typeof body.chatId !== "string" || body.chatId.trim() === "") {
    return res.status(400).json({ error: "chatId is required" });
  }

  // ── beauticianId ────────────────────────────────────────
  if (!body.beauticianId || typeof body.beauticianId !== "string" || body.beauticianId.trim() === "") {
    return res.status(400).json({ error: "beauticianId is required" });
  }

  // ── services ────────────────────────────────────────────
  if (!Array.isArray(body.services) || body.services.length === 0) {
    return res.status(400).json({ error: "At least one service is required" });
  }

  for (let i = 0; i < body.services.length; i++) {
    const svc: BookingServiceVO = body.services[i];

    if (!svc.serviceId || typeof svc.serviceId !== "string" || svc.serviceId.trim() === "") {
      return res.status(400).json({ error: `services[${i}].serviceId is required` });
    }

    if (!svc.name|| typeof svc.name !== "string" || svc.name.trim() === "") {
      return res.status(400).json({ error: `services[${i}].serviceName is required` });
    }

    if (typeof svc.price !== "number" || isNaN(svc.price) || svc.price < 0) {
      return res.status(400).json({ error: `services[${i}].price must be a non-negative number` });
    }
  }

  // ── totalPrice ──────────────────────────────────────────
  if (typeof body.totalPrice !== "number" || isNaN(body.totalPrice) || body.totalPrice < 0) {
    return res.status(400).json({ error: "totalPrice must be a non-negative number" });
  }

  const calculatedTotal = body.services.reduce((sum:number, svc) => sum + svc.price, 0);
  if (Math.abs(calculatedTotal - body.totalPrice) > 0.01) {
    return res.status(400).json({
      error: `totalPrice (${body.totalPrice}) does not match sum of service prices (${calculatedTotal})`,
    });
  }

  // ── address ─────────────────────────────────────────────
  if (!body.address || typeof body.address !== "string" || body.address.trim() === "") {
    return res.status(400).json({ error: "address is required" });
  }

  if (body.address.trim().length < 5) {
    return res.status(400).json({ error: "address must be at least 5 characters" });
  }

  if (body.address.trim().length > 300) {
    return res.status(400).json({ error: "address must not exceed 300 characters" });
  }

  // ── phoneNumber ─────────────────────────────────────────
  if (!body.phoneNumber || typeof body.phoneNumber !== "string" || body.phoneNumber.trim() === "") {
    return res.status(400).json({ error: "phoneNumber is required" });
  }

  const rawPhone = body.phoneNumber.trim();



  // Full digit string (with country code) for format check
  const allDigits = rawPhone.replace(/\D/g, "");

  if (allDigits.length < 10) {
    return res.status(400).json({ error: "phoneNumber must have at least 10 digits" });
  }

  if (allDigits.length > 15) {
    return res.status(400).json({ error: "phoneNumber must not exceed 15 digits (ITU-T E.164)" });
  }

  // Last 10 digits must be a valid local number (no 000... etc.)
  const localNumber = allDigits.slice(-10);
  if (!/^[6-9]\d{9}$/.test(localNumber)) {
    return res.status(400).json({
      error: "phoneNumber must be a valid 10-digit number starting with 6, 7, 8, or 9",
    });
  }



  // ── slot ────────────────────────────────────────────────
  if (!body.slot || typeof body.slot !== "object") {
    return res.status(400).json({ error: "slot is required" });
  }

  const { date, time } = body.slot;

  // date
  if (!date) {
    return res.status(400).json({ error: "slot.date is required" });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "slot.date is not a valid date" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsedDate < today) {
    return res.status(400).json({ error: "slot.date cannot be in the past" });
  }

  // time
  if (!time || typeof time !== "string" || time.trim() === "") {
    return res.status(400).json({ error: "slot.time is required" });
  }

const timeRangeRegex = /^(1[0-2]|0?[1-9]|1[0-9]|2[0-3]):[0-5]\d\s?(AM|PM)\s?–\s?(1[0-2]|0?[1-9]|1[0-9]|2[0-3]):[0-5]\d\s?(AM|PM)$/i;
if (!timeRangeRegex.test(time.trim())) {
  return res.status(400).json({ error: "slot.time must be in format 'HH:MM AM – HH:MM PM'" });
}


  // ── clientNote ──────────────────────────────────────────
  if (body.clientNote !== null && body.clientNote !== undefined) {
    if (typeof body.clientNote !== "string") {
      return res.status(400).json({ error: "clientNote must be a string or null" });
    }
    if (body.clientNote.trim().length > 500) {
      return res.status(400).json({ error: "clientNote must not exceed 500 characters" });
    }
    // Normalize
    req.body.clientNote = body.clientNote.trim() === "" ? null : body.clientNote.trim();
  }

  // ── Normalize trimmed strings ───────────────────────────
  req.body.chatId       = body.chatId.trim();
  req.body.beauticianId = body.beauticianId.trim();
  req.body.address      = body.address.trim();
  req.body.phoneNumber = rawPhone;  
  req.body.slot.date    = parsedDate;
  req.body.slot.time    = time.trim();

  next();
}
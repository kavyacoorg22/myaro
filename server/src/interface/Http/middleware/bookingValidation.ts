import { Request, Response, NextFunction } from "express";

export function validateRequestRefund(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { refundReason } = req.body;
  console.log(req.body)

  // ✅ Check undefined, null, empty string, spaces
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
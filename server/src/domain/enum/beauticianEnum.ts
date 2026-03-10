export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export type VerificationStatusFilter = VerificationStatus | "all";

export enum ScheduleType {
  AVAILABILITY = "availability",
  LEAVE = "leave",
}

export enum ScheduleEndType{
  NEVER='never',
  ON='on',
  AFTER='after'
}

export enum scheduleSourceType{
  RECURRING='recurring',
  MANUAL='manual'
}

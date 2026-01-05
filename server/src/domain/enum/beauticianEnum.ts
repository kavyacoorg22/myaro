export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED= "verified",
  REJECTED = "rejected",
}

export type VerificationStatusFilter=VerificationStatus|"all"

export enum ScheduleStatus{
  AVAILABLE="available",
  UNAVAILABLE="unAvailable"
}
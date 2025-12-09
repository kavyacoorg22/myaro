export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED= "verified",
  REJECTED = "rejected",
}

export type VerificationStatusFilter=VerificationStatus|"all"
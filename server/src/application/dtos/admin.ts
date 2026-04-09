export interface IProcessRefundDto {
  success:      boolean;
  refundId:     string;
  refundAmount: number;
  status:       string;
  message:      string;
}

export interface IReleasePayoutDto {
  success:      boolean;
  payoutId:     string;
  payoutAmount: number;
  status:       string;
  message:      string;
}
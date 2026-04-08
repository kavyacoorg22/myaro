export interface IProcessRefundDto {
  success:      boolean;
  refundId:     string;
  refundAmount: number;
  status:       string;
  message:      string;
}
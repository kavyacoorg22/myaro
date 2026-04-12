import {
  PaymentMode,
  PaymentStatus,
  RefundStatus,
  RefundType,
} from "../../domain/enum/paymentEnum";

export interface IProcessRefundDto {
  success: boolean;
  refundId: string;
  refundAmount: number;
  status: string;
  message: string;
}

export interface IReleasePayoutDto {
  success: boolean;
  payoutId: string;
  payoutAmount: number;
  status: string;
  message: string;
}

export interface IGetAllBookingDto {
  bookingId: string;
  customerName: string;
  beauticianName: string;
  bookedDate: string;
  serviceDate: string;
  amount: number;
  paymentStatus: PaymentStatus;
}

export interface IGetAllBookingDto {
  bookingId: string;
  customerName: string;
  beauticianName: string;
  bookedDate: string;
  serviceDate: string;
  amount: number;
  paymentStatus: PaymentStatus;
}

export interface IGetBookingDetailDto {
  bookingId: string;
  customerName: string;
  beauticianName: string;
  bookedDate: string;
  serviceDate: string;
  amount: number;
  paymentStatus: PaymentStatus;
  services: string[];
  paymentId: string;
  method: PaymentMode;
  paidAt: string;
     history?: {        
    status:    string;
    role:      string;
    createdAt: Date;
  }[];
}

export interface IGetAllDisputesDto {
  disputeId: string;
  bookingId: string;
  customerName: string;
  beauticianName: string;
  status: string;
  disputeReason: string | null;
  disputeAt: Date | undefined;
}

export interface IGetDisputeDetailDto {
  disputeId: string;
  bookingId: string;
  customerName: string;
  beauticianName: string;
  status: string;
  disputeReason: string | null;
  refundReason: string | null;
  disputeAt: Date | undefined;
  paymentId: string;
  amount: number;
    history?: {        
    status:    string;
    role:      string;
    createdAt: Date;
  }[];
}

export interface IGetAllRefundsDto {
  refundId: string;
  bookingId: string;
  customerName: string;
  amount: number;
  status: RefundStatus;
  refundType: RefundType;
  reason?: string;
  createdAt?: string;
}

export interface IGetRefundDetailDto {
  refundId: string;
  bookingId: string;
  status: RefundStatus;
  customerName: string;
  amount: number;
  refundReason?: string;
  customerStatement: string;
  beauticianResponse: string;
   history?: {        
    status:    string;
    role:      string;
    createdAt: Date;
  }[];
}

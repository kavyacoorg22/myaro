import type { PaymentModeType, PaymentStatusType, RefundStatusType, RefundTypes } from "../../constants/types/payment";

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

export interface IGetAllBookingDto{
  bookingId:string,
  customerName:string,
  beauticianName:string,
  bookedDate:string,
  serviceDate:string,
  amount:number,
  paymentStatus:PaymentStatusType
}

export interface IGetAllBookingDto{
  bookingId:string,
  customerName:string,
  beauticianName:string,
  bookedDate:string,
  serviceDate:string,
  amount:number,
  paymentStatus:PaymentStatusType
}

export interface IGetBookingDetailDto{
  bookingId:string,
  customerName:string,
  beauticianName:string,
  bookedDate:string,
  serviceDate:string,
  amount:number,
  paymentStatus:PaymentStatusType
  services:string[],
  paymentId:string,
  method:PaymentModeType,
  paidAt:string
       history?: {        
    status:    string;
    role:      string;
    createdAt: Date;
  }[];
}

export interface IGetAllDisputesDto{
  disputeId:string,
  bookingId:string,
  customerName:string,
  beauticianName:string,
  status:string
   disputeReason: string | null;
  disputeAt: Date | undefined;
}

export interface IGetDisputeDetailDto{
  disputeId:          string;
  bookingId:          string;
  customerName:       string;
  beauticianName:     string;
  status:             string;
  disputeReason:      string | null;   
  refundReason:       string | null;   
  disputeAt:          Date | undefined;
  paymentId:          string;
  amount:             number;
    history?: {        
    status:    string;
    role:      string;
    createdAt: Date;
  }[];
}

export interface IGetAllRefundsDto{
  refundId:string,
  bookingId:string,
  customerName:string,
  amount:number,
  status:RefundStatusType
   refundType:RefundTypes
    reason?:string
    createdAt?:string
}

export interface IGetRefundDetailDto{
  refundId:string,
  bookingId:string,
    status:RefundStatusType;
  customerName:string,
  amount:number,
  refundReason?:string
   customerStatement:    string;               
  beauticianResponse:   string; 
    history?: {         
    status:    string;
    role:      string;
    createdAt: Date;
  }[];
}

export type UserGrowthDto = {
  month: string;
  customers: number;
  beauticians: number;
};

export type BookingTrendDto = {
  month: string;
  completed: number;
  cancelled: number;
  refunded: number;
};

export type RevenueStatsDto = {
  completed: number;
  refunded: number;
  held: number;
};

export type DashboardOverviewDto = {
  totalUsers: number;
  totalBeauticians: number;
  totalCustomers: number;
  pendingVerifications: number;
  totalRefundAmount: number;
  heldPaymentAmount: number;
  disputesCount: number;
};




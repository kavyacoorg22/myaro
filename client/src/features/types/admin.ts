import type { PaymentStatusType } from "../../constants/types/payment";
import type { TabOption } from "../shared/tabFilterBar";

export interface BookingRow {
  bookingId: string;
  customerName: string;
  beauticianName: string;
  bookedDate: string;
  serviceDate: string;
  amount: number;
  paymentStatus: PaymentStatusType;
}
 
export type FilterValue = "" | "paid" | "released" | "ready_to_release";
 
export const FILTER_OPTIONS: TabOption<FilterValue>[] = [
  { label: "All",              value: ""                 },
  { label: "On Hold",         value: "paid"             },
  { label: "Released",        value: "released"         },
  { label: "Ready to Release",value: "ready_to_release" },
];
 
export const LIMIT = 10;
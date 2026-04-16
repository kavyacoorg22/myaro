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

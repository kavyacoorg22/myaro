import { useEffect, useState } from "react";
import { adminApi } from "../../../../services/api/admin";
import { OverviewCards } from "./overViewCard";
import { UserGrowthChart } from "./userGrowthChart";
import { BookingTrendChart } from "./bookingTrendChart";
import { RevenueBreakdownChart } from "./revenueChart";
import { SaidBar } from "../../../user/component/saidBar/saidbar";
import type { BookingTrendDto, DashboardOverviewDto, RevenueStatsDto, UserGrowthDto } from "../../../../types/dtos/admin";

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);
 
 
const AdminDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
 
  const [overview,     setOverview]     = useState<DashboardOverviewDto | null>(null);
  const [userGrowth,   setUserGrowth]   = useState<UserGrowthDto[]      | null>(null);
  const [bookingTrend, setBookingTrend] = useState<BookingTrendDto[]    | null>(null);
  const [revenue,      setRevenue]      = useState<RevenueStatsDto      | null>(null);
 
  const [growthYear, setGrowthYear] = useState(currentYear);
  const [trendYear,  setTrendYear]  = useState(currentYear);
 
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
 
  // Overview + revenue — fetched once on mount
  useEffect(() => {
    const fetchStatic = async () => {
      try {
        const [ovRes, revRes] = await Promise.all([
          adminApi.getDashBoardOverview(),
          adminApi.getRevenue(),
        ]);
        setOverview(ovRes.data.data);  // DashboardOverviewDto
        setRevenue(revRes.data.data);  // RevenueStatsDto
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStatic();
  }, []);
 
  // User growth — re-fetches when year picker changes
  useEffect(() => {
    adminApi.getUseGrowth(growthYear).then((res) => {
      setUserGrowth(res.data.data); // UserGrowthDto[]
    });
  }, [growthYear]);
 
  // Booking trend — re-fetches when year picker changes
  useEffect(() => {
    adminApi.getBookingTrend(trendYear).then((res) => {
      setBookingTrend(res.data.data); // BookingTrendDto[]
    });
  }, [trendYear]);
 
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-sm">{error}</div>
    );
  }
 
  return (
    <div>
      <SaidBar/>

    <div className="min-h-screen bg-gray-50 px-6 py-8 space-y-8 font-sans ml-60">
 
      {/* Overview Stat Cards */}
      {loading || !overview ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] flex-1 min-w-[140px]" />
          ))}
        </div>
      ) : (
        <OverviewCards data={overview} />
      )}
 
      {/* User Growth + Booking Trend — side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userGrowth ? (
          <UserGrowthChart data={userGrowth} year={growthYear} onYearChange={setGrowthYear} />
        ) : (
          <Skeleton className="h-[316px]" />
        )}
 
        {bookingTrend ? (
          <BookingTrendChart data={bookingTrend} year={trendYear} onYearChange={setTrendYear} />
        ) : (
          <Skeleton className="h-[316px]" />
        )}
      </div>
 
      {/* Revenue Breakdown — full width */}
      {revenue ? (
        <RevenueBreakdownChart data={revenue} />
      ) : (
        <Skeleton className="h-[260px]" />
      )}
 
    </div>
    </div>
  );
};
 
export default AdminDashboard;
 
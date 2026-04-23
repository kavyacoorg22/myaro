
import { CalendarDays, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { DashboardStatsDto } from "../../../types/dtos/beautician";
import { StatCard } from "../../shared/statCard";
import { formatINR } from "../../../lib/utils/formatCurrency";


interface Props {
  stats: DashboardStatsDto;
}

export const DashboardStatsRow: React.FC<Props> = ({ stats }) => (
  <div className="flex flex-wrap gap-3">
    <StatCard
      label={`${stats.completedToday} completed · ${stats.upcomingToday} upcoming`}
      value={stats.todayBookingsCount}
      icon={<CalendarDays size={24} className="text-purple-400" />}
    />
    <StatCard
      label="Pending requests"
      value={stats.pendingRequestsCount}
      icon={<AlertCircle size={24} className="text-amber-400" />}
    />
    <StatCard
      label="Today's earnings"
      value={formatINR(stats.todayEarnings)}
      icon={<CheckCircle size={24} className="text-green-400" />}
    />
    <StatCard
      label={`Monthly earnings · ${new Date().toLocaleString("en-IN", { month: "short", year: "numeric" })}`}
      value={formatINR(stats.monthlyEarnings)}
      icon={<Clock size={24} className="text-blue-400" />}
    />
  </div>
);
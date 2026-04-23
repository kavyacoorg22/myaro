import { useEffect, useState } from "react";
import type { BeauticianDashboardDto } from "../../../types/dtos/beautician";
import { BeauticianApi } from "../../../services/api/beautician";
import { DashboardStatsRow } from "./dashBoardStatsRow";
import { EarningsChart } from "./earningChart";
import { EarningsSummaryCard } from "./earningSummeryCard";
import { RatingPlaceholder } from "./ratingPlaceHolder";
import { RecentPayouts } from "./recentPayouts";
import { SaidBar } from "../../user/component/saidBar/saidbar";

const BeauticianDashboard: React.FC = () => {
  const [data,    setData]    = useState<BeauticianDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    BeauticianApi.getDashBoard()
      .then((res) => setData(res.data.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Loading...
    </div>
  );

  if (error || !data) return (
    <div className="flex items-center justify-center h-64 text-red-400 text-sm">
      {error ?? "Something went wrong"}
    </div>
  );

  return (
    <div>
      <SaidBar/>
    <div className="flex flex-col gap-4 p-6 ml-60">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</p>

      <DashboardStatsRow stats={data.stats} />

      <EarningsChart
        weeklyChart={data.weeklyChart}
        monthlyChart={data.monthlyChart}
      />

      <div className="grid grid-cols-2 gap-4">
        <EarningsSummaryCard earnings={data.earnings} />
        <RatingPlaceholder />
      </div>

      <RecentPayouts payouts={data.recentPayouts} />
    </div>
    </div>
  );
};

export  default BeauticianDashboard
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ChartPointDto } from "../../../types/dtos/beautician";
import { formatINR } from "../../../lib/utils/formatCurrency";


interface Props {
  weeklyChart:  ChartPointDto[];
  monthlyChart: ChartPointDto[];
}

export const EarningsChart: React.FC<Props> = ({ weeklyChart, monthlyChart }) => {
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const data = tab === "weekly" ? weeklyChart : monthlyChart;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Earnings</h3>
        <div className="flex gap-1">
          {(["weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tab === t
                  ? "bg-gray-100 border-gray-300 text-gray-800 font-medium"
                  : "border-gray-200 text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={32}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
formatter={(value) => [formatINR(Number(value)), "Earnings"]}            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <Bar dataKey="earnings" radius={[5, 5, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="#c4b5fd" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
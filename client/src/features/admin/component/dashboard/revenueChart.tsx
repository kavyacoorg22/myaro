import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { RevenueStatsDto } from "../../../../types/dtos/admin";

export const RevenueBreakdownChart: React.FC<{ data: RevenueStatsDto }> = ({ data }) => {
  const chartData = [
    { name: "Completed", value: data.completed },
    { name: "Refunded",  value: data.refunded  },
    { name: "Held",      value: data.held       },
  ];
 
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Revenue Breakdown</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart layout="vertical" data={chartData} margin={{ top: 4, right: 24, left: 16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={72} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]}
          />
          <Bar dataKey="value" fill="#818cf8" radius={[0, 6, 6, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};
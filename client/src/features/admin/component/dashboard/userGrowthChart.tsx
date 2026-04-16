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
import type { UserGrowthDto } from "../../../../types/dtos/admin";

export const UserGrowthChart: React.FC<{
  data: UserGrowthDto[];
  year: number;
  onYearChange: (y: number) => void;
}> = ({ data, year, onYearChange }) => (
  <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-700">User Growth</h2>
      <select
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
       {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).map((y) => (
  <option key={y} value={y}>{y}</option>
))}
      </select>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="customers"   name="Customer"   stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="beauticians" name="Beautician" stroke="#d97706" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  </section>
);
 
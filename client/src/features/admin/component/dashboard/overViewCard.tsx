import type { DashboardOverviewDto } from "../../../../types/dtos/admin";
import { StatCard } from "../../../shared/statCard";

export const OverviewCards: React.FC<{ data: DashboardOverviewDto }> = ({ data }) => {
  const fmt = (n: number) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(0)}k` : `₹${n}`;
 
  const cards = [
    { label: "Total Users",    value: data.totalUsers,              icon: "👥" },
    { label: "Beauticians",    value: data.totalBeauticians,        icon: "💄" },
    { label: "Customers",      value: data.totalCustomers,          icon: "🧑‍🤝‍🧑" },
    { label: "Pending Verify", value: data.pendingVerifications,    icon: "⏳" },
    { label: "Total Refund",   value: fmt(data.totalRefundAmount),  icon: "↩️" },
    { label: "Held Payment",   value: fmt(data.heldPaymentAmount),  icon: "🔒" },
    { label: "Disputes",       value: data.disputesCount,           icon: "⚖️" },
  ];
 
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Dashboard Overview</h2>
      <div className="flex flex-wrap gap-3">
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} />
        ))}
      </div>
    </section>
  );
};
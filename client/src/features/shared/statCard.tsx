interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}
 
export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="flex-1 min-w-[140px] bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-3">
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
    <div className="text-3xl leading-none">{icon}</div>
  </div>
);
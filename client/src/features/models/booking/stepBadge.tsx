export function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center bg-violet-600 text-white">
        {n}
      </span>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </div>
  );
}
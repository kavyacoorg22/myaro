export const Pill = ({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${color}`}
  >
    {label}
  </button>
);
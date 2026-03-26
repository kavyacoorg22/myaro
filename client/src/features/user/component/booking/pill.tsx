export const Pill = ({
  label,
  onClick,
  disabled = false,
  variant  = "default",
}: {
  label:     string;
  onClick?:  () => void;
  disabled?: boolean;
  variant?:  "default" | "primary" | "danger" | "warning" | "success" | "ghost";
}) => {
  const variants: Record<string, string> = {
    default: "bg-gray-200 text-gray-700",
    primary: "bg-indigo-500 text-white hover:bg-indigo-600",
    danger:  "bg-rose-400  text-white hover:bg-rose-500",
    warning: "bg-amber-400 text-white hover:bg-amber-500",
    success: "bg-teal-500  text-white hover:bg-teal-600",
    ghost:   "bg-gray-900  text-white hover:bg-gray-700",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
        active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]}`}
    >
      {label}
    </button>
  );
};
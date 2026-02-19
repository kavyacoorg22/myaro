import type { TimeInputProps } from "../../types/schedule";

export const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, placeholder = "00:00" }) => {
  return (
    <div className="relative">
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        placeholder={placeholder}
      />
    </div>
  );
};
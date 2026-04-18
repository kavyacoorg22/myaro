
import { CalendarHeart, Check, Home, MessageCircle, Store } from "lucide-react";
import type { ServiceModesType } from "../../../constants/types/beautician";
import type { FieldError } from "react-hook-form";

const SERVICE_MODE_OPTIONS: {
  value: ServiceModesType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "HOME",
    label: "Home Visit",
    icon: <Home className="w-5 h-5" />,
    description: "Travel to client's location",
  },
  {
    value: "SHOP",
    label: "At Shop",
    icon: <Store className="w-5 h-5" />,
    description: "Client visits your shop",
  },
  {
    value: "EVENT",
    label: "Event",
    icon: <CalendarHeart className="w-5 h-5" />,
    description: "Weddings & special occasions",
  },
  {
    value: "CONSULTATION",
    label: "Consultation",
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Online or in-person advice",
  },
];

interface ServiceModeSelectorProps {
  value: ServiceModesType[];
  onChange: (modes: ServiceModesType[]) => void;
  error?: FieldError | { message?: string };
}

export const ServiceModeSelector = ({ value, onChange, error }: ServiceModeSelectorProps) => {
  const toggle = (mode: ServiceModesType) => {
    if (value.includes(mode)) {
      onChange(value.filter((m) => m !== mode));

    } else {
      onChange([...value, mode]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-1">
      {SERVICE_MODE_OPTIONS.map(({ value: mode, label, icon, description }) => {
        const isSelected = value.includes(mode);
        return (
          <button
            key={mode}
            type="button"
            onClick={() => toggle(mode)}
            className={`relative flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150
              ${
                isSelected
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            {/* Checkmark badge */}
            <span
              className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center transition-all
                ${isSelected ? "bg-rose-500" : "bg-gray-200"}`}
            >
              {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </span>

            {/* Icon */}
            <span
              className={`mt-0.5 p-1.5 rounded-lg shrink-0
                ${isSelected ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-500"}`}
            >
              {icon}
            </span>

            {/* Text */}
            <span className="flex flex-col min-w-0">
              <span className="text-sm font-semibold leading-tight">{label}</span>
              <span className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

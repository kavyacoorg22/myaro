import { formatSlotLabel, slotKey } from "../../../lib/utils/BookingslotLable";
import type { Slot } from "../../types/schedule";

 
export function SlotGridInner({
  slots,
  selected,
  onSelect,
}: {
  slots: Slot[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  if (slots.length === 0) {
    return (
      <p className="text-center py-6 text-xs text-amber-500">
        No slots available on this date.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot) => {
        const key = slotKey(slot);
        const isSelected = selected === key;
        return (
          <button
            type="button"
            key={key}
            onClick={() => onSelect(key)}
            className={`py-2.5 px-3 rounded-xl text-xs font-medium border-2 transition-all duration-150 text-left
              ${isSelected
                ? "border-violet-600 bg-violet-600 text-white shadow-md"
                : "border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-600"
              }`}
          >
            {formatSlotLabel(slot)}
          </button>
        );
      })}
    </div>
  );
}
 
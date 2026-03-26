import { getEndTimeLabel, hasConsecutiveBlock, type TimeSlot } from "../../../lib/utils/BookingslotLable";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected: string;       // start label e.g. "09:00 AM"
  duration: 1 | 2 | 3;
  onSelect: (start: string) => void;
}

export function TimeSlotPicker({
  slots,
  selected,
  duration,
  onSelect,
}: TimeSlotPickerProps) {
  const selectedSlot = slots.find((s) => s.start === selected);

  /**
   * Filter to only show VALID start times for the chosen duration:
   * - duration=1 → every available slot is a valid start
   * - duration=2 → only slots where slot AND slot+1h are both available
   * - duration=3 → only slots where slot, slot+1h, slot+2h are all available
   */
  const validStartSlots = slots.filter((slot) =>
    hasConsecutiveBlock(slots, slot.startHour, duration),
  );

  // ✅ Toggle: clicking same slot unselects it
  const handleClick = (slot: TimeSlot) => {
    onSelect(selected === slot.start ? "" : slot.start);
  };

  if (slots.length === 0) {
    return (
      <p className="text-xs text-gray-400 text-center py-3">
        No slots available for this date.
      </p>
    );
  }

  if (validStartSlots.length === 0) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        No {duration}h consecutive block available. Try a shorter duration or pick another day.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {validStartSlots.map((slot) => {
          const isSelected = selected === slot.start;
          return (
            <button
              key={slot.start}
              type="button"
              onClick={() => handleClick(slot)}
              className={`py-2.5 px-1 rounded-lg text-xs font-medium border-2 transition-all duration-150 text-center leading-tight
                ${isSelected
                  ? "border-violet-600 bg-violet-600 text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-600"
                }`}
            >
              {duration === 1 ? (
                slot.start
              ) : (
                <>
                  <span className="block">{slot.start}</span>
                  <span className="block opacity-75">→ {getEndTimeLabel(slot.startHour, duration)}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirmation banner */}
      {selected && selectedSlot && (
        <div className="rounded-xl px-3.5 py-2.5 text-xs flex items-start gap-2 bg-violet-50 border border-violet-100">
          <svg className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-violet-700 font-medium">
            {duration === 1 ? (
              <>Slot <strong>{selected}</strong> – <strong>{getEndTimeLabel(selectedSlot.startHour, 1)}</strong> confirmed</>
            ) : (
              <><strong>{duration}h block</strong> confirmed: <strong>{selected}</strong> → <strong>{getEndTimeLabel(selectedSlot.startHour, duration)}</strong></>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
interface DurationPickerProps {
  value: 1 | 2 | 3;
  onChange: (d: 1 | 2 | 3) => void;
}

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-500 mb-2 block">
        Session Duration
      </label>
      <div className="grid grid-cols-3 gap-2">
        {([1, 2, 3] as const).map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => onChange(h)}
            className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-150
              ${value === h
                ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:text-violet-600"
              }`}
          >
            {h} {h === 1 ? "Hour" : "Hours"}
          </button>
        ))}
      </div>
      {value > 1 && (
        <p className="text-xs text-gray-400 mt-1.5">
          We'll book a continuous <strong>{value}h</strong> block for you.
        </p>
      )}
    </div>
  );
}
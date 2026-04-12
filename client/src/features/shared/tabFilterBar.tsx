//admin filter

export interface TabOption<T extends string> {
  label: string;
  value: T;
}
 
export interface TabFilterBarProps<T extends string> {
  options: TabOption<T>[];
  active: T;
  onChange: (value: T) => void;
}
 
export function TabFilterBar<T extends string>({
  options,
  active,
  onChange,
}: TabFilterBarProps<T>) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1 w-fit">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
            active === opt.value
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
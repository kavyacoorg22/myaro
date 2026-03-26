import type { IGetBeauticianServicesListDto } from "../../../types/dtos/service";

export function ServiceCard({
  service,
  selected,
  onToggle,
}: {
  service: IGetBeauticianServicesListDto;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left
        ${selected
          ? "border-violet-500 bg-violet-50 shadow-sm"
          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
            ${selected ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <p className={`text-sm font-medium ${selected ? "text-violet-800" : "text-gray-700"}`}>
            {service.serviceName}
          </p>
          {service.categoryName && (
            <p className="text-xs text-gray-400">{service.categoryName}</p>
          )}
        </div>
      </div>
      <span className={`text-sm font-bold ${selected ? "text-violet-600" : "text-gray-500"}`}>
        ₹{service.price}
      </span>
    </button>
  );
}
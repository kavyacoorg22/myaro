import React, { useEffect, useRef, useState } from "react";
import { MapPin, X, Loader2 } from "lucide-react";
import { extractCity, type NominatimResult } from "../../lib/utils/nominatim";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LocationVO {
  city: string;
  lat: number;
  lng: number;
  formattedString: string;
  shortName?: string;
}

export interface LocationTagInputProps {
  label?: string;
  placeholder?: string;
  value: LocationVO[];
  onChange: (locations: LocationVO[]) => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LocationTagInput: React.FC<LocationTagInputProps> = ({
  label,
  placeholder = "Search and add locations...",
  value,
  onChange,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (result: NominatimResult) => {
    const shortName = result.display_name.split(",")[0].trim();
    const city = extractCity(result.address);

    const already = value.find((l) => l.formattedString === result.display_name);
    if (already) {
      setQuery("");
      setShowDropdown(false);
      return;
    }

    onChange([
      ...value,
      {
        city,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formattedString: result.display_name,
        shortName,
      },
    ]);

    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Remove last tag on backspace when input is empty
    if (e.key === "Backspace" && !query && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block mb-2 text-gray-800 font-medium text-sm">
          {label}
        </label>
      )}

      {/* Tag input box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex flex-wrap items-center gap-1.5 min-h-[44px] px-3 py-2 bg-white rounded-lg border cursor-text transition-all
          ${isFocused ? "border-cyan-400 ring-2 ring-cyan-100" : "border-gray-300 hover:border-gray-400"}`}
      >
        {/* Tags */}
        {value.map((loc, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs rounded-full px-2.5 py-1 font-medium"
          >
            <MapPin className="w-3 h-3 text-cyan-500 flex-shrink-0" />
            {loc.shortName}
            <button
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="text-cyan-400 hover:text-red-400 transition ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <div className="flex items-center gap-1 flex-1 min-w-[120px]">
          <MapPin className={`w-4 h-4 flex-shrink-0 ${value.length === 0 ? "text-gray-400" : "hidden"}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setIsFocused(true); if (suggestions.length > 0) setShowDropdown(true); }}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : "Add more..."}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}
        </div>
      </div>

      {/* Hint */}
      {isFocused && value.length === 0 && !query && (
        <p className="text-xs text-gray-400 mt-1">Type a city or area to search</p>
      )}

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              onMouseDown={(e) => e.preventDefault()} // prevent blur before click
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 flex items-start gap-2 transition border-b border-gray-50 last:border-0"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {s.display_name.split(",")[0].trim()}
                </span>
                <span className="text-xs text-gray-400 line-clamp-1">
                  {s.display_name.split(",").slice(1).join(",").trim()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
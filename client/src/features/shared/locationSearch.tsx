
import React, { useEffect, useRef, useState } from "react";
import { MapPin, X, Loader2 } from "lucide-react";
import { extractCity, type NominatimResult } from "../../lib/utils/nominatim";
export interface LocationResult {
  city: string;
  lat: number;
  lng: number;
  formattedString: string;
}

export interface LocationSearchProps {
  label?: string;
  placeholder?: string;
  initialValue?: string;
  onSelect: (result: LocationResult) => void;
  onClear?: () => void;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  placeholder = "Search location...",
  initialValue = "",
  onSelect,
  onClear,
  className = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(!!initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (isSelected || !query.trim() || query.length < 2) {
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
  }, [query, isSelected]);

  const handleSelect = (result: NominatimResult) => {
    const city = extractCity(result.address);
    setQuery(result.display_name);
    setIsSelected(true);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect({
      city,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      formattedString: result.display_name,
    });
  };

  const handleClear = () => {
    setQuery("");
    setIsSelected(false);
    setSuggestions([]);
    setShowDropdown(false);
    onClear?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(false);
    setQuery(e.target.value);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block mb-2 text-gray-800 font-medium text-sm">
          {label}
        </label>
      )}

      {/* Input */}
      <div className={`flex items-center gap-2 px-3 py-2 bg-white rounded border transition
        ${showDropdown ? "border-cyan-400 ring-2 ring-cyan-100" : "border-gray-300"}
        ${isSelected ? "border-green-400" : ""}`}
      >
        <MapPin className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-green-500" : "text-gray-400"}`} />

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />

        {isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}

        {query && !isLoading && (
          <button onClick={handleClear} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 flex items-start gap-2 transition border-b border-gray-50 last:border-0"
            >
              <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { searchAddress, GeocodedAddress } from "@/lib/geocoding";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: GeocodedAddress) => void;
  placeholder?: string;
  error?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Digite seu endereço",
  error,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeocodedAddress[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search for addresses when input changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAddress(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsSearching(false);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (address: GeocodedAddress) => {
    onChange(address.displayName);
    onAddressSelect(address);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className={error ? "border-destructive" : ""}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((address, index) => (
            <button
              key={`${address.lat}-${address.lng}-${index}`}
              type="button"
              onClick={() => handleSelect(address)}
              className="w-full px-3 py-2 text-left hover:bg-accent flex items-start gap-2 text-sm border-b border-border last:border-b-0"
            >
              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <span className="line-clamp-2">{address.displayName}</span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

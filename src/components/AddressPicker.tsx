import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressPickerProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
}

const AddressPicker = ({ value, onChange, placeholder, className }: AddressPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=gb&addressdetails=1&limit=5`,
        {
          headers: {
            "Accept-Language": "en-GB,en",
          },
        }
      );
      const data = await response.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch (error) {
      console.error("Address search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 500);
  };

  const handleSelectAddress = (address: AddressResult) => {
    setSearchTerm(address.display_name);
    onChange(address.display_name);
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className={cn("pl-10 pr-10", className)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleSelectAddress(result)}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm flex items-start gap-2 group"
              >
                <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-0.5 flex-shrink-0" />
                <span className="flex-1 line-clamp-2">{result.display_name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && !isLoading && results.length === 0 && searchTerm.length >= 3 && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No addresses found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressPicker;

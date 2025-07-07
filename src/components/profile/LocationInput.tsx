"use client";
import {
  faGlobe,
  faLocationDot,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
interface LocationInputProps {
  value: string;
  onChange: (location: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  onLocationPermissionRequest?: () => Promise<boolean>;
  showLocationPermissionButton?: boolean;
}
const GAMBIA_LOCATIONS = [
  "Banjul",
  "Serrekunda",
  "Kanifing",
  "Bakau",
  "Fajara",
  "Kotu",
  "Kololi",
  "Brufut",
  "Sukuta",
  "Latrikunda",
  "Dippa Kunda",
  "London Corner",
  "Westfield",
  "Old Jeshwang",
  "New Jeshwang",
  "Dumbuto",
  "Tallinding",
  "Bundung",
  "Brikama",
  "Gunjur",
  "Sanyang",
  "Kartong",
  "Tujereng",
  "Yundum",
  "Lamin",
  "Marakissa",
  "Janjanbureh",
  "Kuntaur",
  "Bansang",
  "Kaur",
  "Basse",
  "Fatoto",
  "Koina",
  "Kerewan",
  "Farafenni",
  "Kuntaur",
  "Mansa Konko",
  "Soma",
  "Kaiaf",
];
const LocationInput: React.FC<LocationInputProps> = React.memo(
  ({
    value,
    onChange,
    disabled = false,
    placeholder = "Enter your location in The Gambia",
    className = "",
    hasError = false,
    onLocationPermissionRequest,
    showLocationPermissionButton = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
      []
    );
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const filterSuggestions = useCallback((input: string) => {
      setIsLoading(true);
      setTimeout(() => {
        if (!input.trim()) {
          setFilteredSuggestions(GAMBIA_LOCATIONS.slice(0, 12));
        } else {
          const filtered = GAMBIA_LOCATIONS.filter((location) =>
            location.toLowerCase().includes(input.toLowerCase())
          ).slice(0, 12);
          setFilteredSuggestions(filtered);
        }
        setIsLoading(false);
      }, 100);
    }, []);
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        onChange(newValue);
        filterSuggestions(newValue);
        setSelectedIndex(-1);
      },
      [onChange, filterSuggestions]
    );
    const handleSuggestionClick = useCallback(
      (suggestion: string) => {
        onChange(suggestion);
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
      },
      [onChange]
    );
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setSelectedIndex((prev) =>
              prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
            break;
          case "ArrowUp":
            event.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            break;
          case "Enter":
            event.preventDefault();
            if (
              selectedIndex >= 0 &&
              selectedIndex < filteredSuggestions.length
            ) {
              handleSuggestionClick(filteredSuggestions[selectedIndex]);
            }
            break;
          case "Escape":
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
            break;
          case "Tab":
            setIsOpen(false);
            setSelectedIndex(-1);
            break;
        }
      },
      [isOpen, filteredSuggestions, selectedIndex, handleSuggestionClick]
    );
    const handleFocus = useCallback(() => {
      filterSuggestions(value);
      setIsOpen(true);
    }, [value, filterSuggestions]);
    const handleBlur = useCallback((event: React.FocusEvent) => {
      if (dropdownRef.current?.contains(event.relatedTarget as Node)) {
        return;
      }
      setTimeout(() => {
        setIsOpen(false);
        setSelectedIndex(-1);
      }, 150);
    }, []);
    useEffect(() => {
      if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
        suggestionRefs.current[selectedIndex]?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, [selectedIndex]);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSelectedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
      <div className={`relative ${className}`}>
        {}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
            <FontAwesomeIcon
              icon={faLocationDot}
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                hasError
                  ? "text-destructive"
                  : isOpen
                  ? "text-primary"
                  : "text-text-muted group-hover:text-primary"
              }`}
            />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-text-muted/60 ${
              hasError
                ? "border-destructive bg-destructive/5 text-destructive focus:ring-destructive/20"
                : "border-border hover:border-primary/50 bg-background focus:bg-card"
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed bg-secondary/30"
                : "hover:shadow-md focus:shadow-lg"
            }`}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
            }
          />
          {}
          {showLocationPermissionButton && onLocationPermissionRequest && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const granted = await onLocationPermissionRequest();
                  if (granted) {
                    onChange("Current Location");
                  }
                } catch (error) {
                  console.error("Location permission request failed:", error);
                }
              }}
              disabled={disabled}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-primary hover:text-primary-hover transition-colors min-w-[44px] sm:min-w-[48px] justify-center"
              title="Use current location"
            >
              <span className="text-base sm:text-lg">📍</span>
            </button>
          )}
          {}
          <div
            className={`absolute inset-0 rounded-xl ring-2 ring-transparent transition-all duration-200 pointer-events-none ${
              isOpen ? "ring-primary/20 scale-105" : ""
            }`}
          />
        </div>
        {}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-card border border-border/50 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in-up max-h-72 sm:max-h-80 overflow-hidden"
            role="listbox"
          >
            {isLoading ? (
              <div className="px-4 py-6 text-center">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-text-muted">
                  Searching locations...
                </p>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              <div className="overflow-y-auto max-h-72 sm:max-h-80 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <div className="p-2">
                  {}
                  {!value.trim() && (
                    <div className="px-3 py-2 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon
                          icon={faGlobe}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-text-primary">
                          Popular Locations in The Gambia
                        </span>
                      </div>
                    </div>
                  )}
                  <ul className="space-y-1" role="listbox">
                    {filteredSuggestions.map((suggestion, index) => (
                      <li
                        key={suggestion}
                        id={`suggestion-${index}`}
                        ref={(el) => {
                          suggestionRefs.current[index] = el;
                        }}
                        className={`group flex items-center gap-3 px-3 py-3 sm:py-4 cursor-pointer rounded-lg transition-all duration-200 ${
                          index === selectedIndex
                            ? "bg-primary text-white shadow-lg scale-[1.02]"
                            : "text-text-primary hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        role="option"
                        aria-selected={index === selectedIndex}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 ${
                            index === selectedIndex
                              ? "bg-white/20 text-white"
                              : "bg-primary/10 text-primary group-hover:bg-primary/20"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faMapPin}
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium truncate">
                            {suggestion}
                          </p>
                          <p
                            className={`text-xs sm:text-sm truncate ${
                              index === selectedIndex
                                ? "text-white/80"
                                : "text-text-muted"
                            }`}
                          >
                            The Gambia
                          </p>
                        </div>
                        {}
                        {index === selectedIndex && (
                          <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="w-5 h-5 text-text-muted"
                  />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  No locations found
                </p>
                <p className="text-xs text-text-muted">
                  Try searching for a different area in The Gambia
                </p>
              </div>
            )}
            {}
            {!isLoading && filteredSuggestions.length > 0 && (
              <div className="border-t border-border/30 px-4 py-2 bg-secondary/20">
                <p className="text-xs text-text-muted text-center">
                  {filteredSuggestions.length} location
                  {filteredSuggestions.length !== 1 ? "s" : ""} found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
LocationInput.displayName = "LocationInput";
export default LocationInput;

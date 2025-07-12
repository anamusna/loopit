"use client";
import {
  DISTANCE_OPTIONS,
  FILTER_PRESETS,
  SEARCH_SUGGESTIONS,
} from "@/constants/searchFilters";
import { ItemCategory, ItemCondition, SearchFilters } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Select, { SelectState } from "@/tailwind/components/forms/Select";
import {
  faArrowRight,
  faCheck,
  faDollarSign,
  faFilter,
  faMapMarkerAlt,
  faSearch,
  faSliders,
  faStar,
  faTag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { GAMBIA_LOCATIONS } from "./profile/LocationInput";
interface SearchState {
  query: string;
  filters: SearchFilters;
  selectedPreset: string | null;
  isAdvancedOpen: boolean;
  showSuggestionsPanel: boolean;
}
interface SearchActions {
  onSearch?: (query: string, filters?: SearchFilters) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  onClear?: () => void;
}
export interface SearchAndFiltersProps extends SearchActions {
  className?: string;
  placeholder?: string;
  showAdvancedFilters?: boolean;
  autoFocus?: boolean;
  initialQuery?: string;
  initialFilters?: SearchFilters;
  isLoading?: boolean;
  showPresets?: boolean;
  showSuggestions?: boolean;
  compact?: boolean;
  onFilterRemove?: (key: keyof SearchFilters) => void;
  onClearAllFilters?: () => void;
}
const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: ItemCategory.CLOTHING, label: "👕 Clothing" },
  { value: ItemCategory.BOOKS, label: "📚 Books" },
  { value: ItemCategory.FURNITURE, label: "🪑 Furniture" },
  { value: ItemCategory.ELECTRONICS, label: "📱 Electronics" },
  { value: ItemCategory.TOYS, label: "🧸 Toys" },
  { value: ItemCategory.SPORTS, label: "⚽ Sports" },
  { value: ItemCategory.HOUSEHOLD, label: "🏠 Household" },
  { value: ItemCategory.OTHER, label: "📦 Other" },
];

const LOCATION_OPTIONS = [
  { value: "", label: "All Locations" },
  ...GAMBIA_LOCATIONS.map((location) => ({
    value: location,
    label: location,
  })),
];

const CONDITION_OPTIONS = [
  { value: "", label: "All Conditions" },
  { value: ItemCondition.EXCELLENT, label: "🌟 Excellent" },
  { value: ItemCondition.GOOD, label: "✨ Good" },
  { value: ItemCondition.FAIR, label: "👍 Fair" },
  { value: ItemCondition.NEEDS_REPAIR, label: "🔧 Needs Repair" },
];
const getPresetFilters = (presetId: string): SearchFilters => {
  switch (presetId) {
    case "trending":
      return {
        category: ItemCategory.ELECTRONICS,
        location: "Banjul",
        condition: ItemCondition.GOOD,
      };
    case "eco-friendly":
      return {
        category: ItemCategory.ELECTRONICS,
        condition: ItemCondition.EXCELLENT,
        location: "Serrekunda",
      };
    case "new-arrivals":
      return {
        location: "Kanifing",
        condition: ItemCondition.EXCELLENT,
      };
    case "ending-soon":
      return {
        category: ItemCategory.CLOTHING,
        location: "Bakau",
        condition: ItemCondition.GOOD,
      };
    default:
      return {};
  }
};
const getDistanceOptions = () => [
  { value: "", label: "Any Distance" },
  ...DISTANCE_OPTIONS.map((option) => ({
    value: option.value.toString(),
    label: option.label,
  })),
];
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  filterToggle?: React.ReactNode;
}> = ({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  placeholder,
  isLoading,
  inputRef,
  filterToggle,
}) => {
  const trimmedValue = value.trim();
  const canSearch = trimmedValue.length >= 3 || trimmedValue.length === 0;
  const showMinLengthHint = trimmedValue.length > 0 && trimmedValue.length < 3;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="relative"
    >
      <div className="relative group">
        <div
          className={clsx(
            "relative bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm border rounded-2xl shadow-lg shadow-gray-500/5 transition-all duration-300",
            showMinLengthHint
              ? "border-amber-300/60 dark:border-amber-600/60 group-focus-within:border-amber-400/60 dark:group-focus-within:border-amber-500/60"
              : trimmedValue.length >= 3
              ? "border-primary/60 dark:border-primary/500 group-focus-within:border-primary/70 dark:group-focus-within:border-primary/600"
              : "border-gray-200/60 dark:border-gray-700/60 group-focus-within:border-primary/50",
            "group-focus-within:shadow-xl group-focus-within:shadow-primary/10"
          )}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className={clsx(
                "h-4 w-4 transition-all duration-300",
                showMinLengthHint
                  ? "text-amber-500 group-focus-within:text-amber-600"
                  : trimmedValue.length >= 3
                  ? "text-primary group-focus-within:text-primary/80"
                  : "text-gray-400 group-focus-within:text-primary",
                "group-focus-within:scale-110"
              )}
            />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full pl-12 pr-16 py-3 sm:py-4 text-sm sm:text-base bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-0 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {filterToggle && <div className="mr-1">{filterToggle}</div>}
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group/clear"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="h-3 w-3 group-hover/clear:scale-110 transition-transform duration-200"
                />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !canSearch}
              className={clsx(
                "p-1.5 sm:p-2 rounded-lg transition-all duration-300 group/search shadow-md hover:shadow-lg hover:scale-105 active:scale-95",
                canSearch
                  ? "bg-gradient-to-r from-primary to-accent text-white hover:shadow-primary/20"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="h-3 w-3 sm:h-4 sm:w-4 group-hover/search:translate-x-0.5 transition-transform duration-200"
                />
              )}
            </button>
          </div>
        </div>

        {showMinLengthHint && (
          <div className="absolute top-full left-0 mt-1 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/60 rounded-lg text-xs text-amber-700 dark:text-amber-300 animate-fade-in-up">
            Type at least 3 characters to search
          </div>
        )}
      </div>
    </form>
  );
};

const SearchSuggestions: React.FC<{
  show: boolean;
  query: string;
  onSelect: (suggestion: string) => void;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}> = ({ show, query, onSelect, anchorRef, children }) => {
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return SEARCH_SUGGESTIONS.slice(0, 4);
    return SEARCH_SUGGESTIONS.filter((suggestion) =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);
  }, [query]);
  const [dropdownStyle, setDropdownStyle] =
    React.useState<React.CSSProperties>();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (show && anchorRef?.current && typeof window !== "undefined") {
      const rect = anchorRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 99999,
      });
    }
  }, [show, anchorRef]);
  if (!show || filteredSuggestions.length === 0) return null;
  const dropdown = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="animate-elegant-fade-up opacity-0"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-2xl overflow-hidden z-[99999]">
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-800">
              Quick Suggestions
            </div>
            {children && <div className="ml-2">{children}</div>}
          </div>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(suggestion)}
              className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2.5 group/suggestion hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01]"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="h-3 w-3 text-gray-400 group-hover/suggestion:text-primary transition-colors duration-200"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/suggestion:text-gray-900 dark:group-hover/suggestion:text-gray-100">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  if (typeof window !== "undefined" && document.body) {
    return ReactDOM.createPortal(dropdown, document.body);
  }
  return dropdown;
};

const FilterToggle: React.FC<{
  isOpen: boolean;
  activeCount: number;
  onToggle: () => void;
}> = ({ isOpen, activeCount, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={clsx(
      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300",
      "text-xs font-medium hover:scale-105 active:scale-95",
      isOpen || activeCount > 0
        ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
        : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80"
    )}
  >
    <FontAwesomeIcon
      icon={faFilter}
      className={clsx(
        "h-3 w-3 transition-transform duration-300",
        isOpen && "rotate-180"
      )}
    />
    <span className="hidden sm:inline">Filters</span>
    {activeCount > 0 && (
      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
        {activeCount}
      </span>
    )}
  </button>
);
const ActiveFilters: React.FC<{
  badges: Array<{
    label: string;
    onRemove: () => void;
    icon: any;
    key?: keyof SearchFilters;
  }>;
  selectedPreset: string | null;
  activeCount: number;
  onClearAll: () => void;
  onFilterRemove?: (key: keyof SearchFilters) => void;
  onClearAllFilters?: () => void;
}> = ({
  badges,
  selectedPreset,
  activeCount,
  onClearAll,
  onFilterRemove,
  onClearAllFilters,
}) => {
  const totalCount = selectedPreset ? activeCount + 1 : activeCount;
  if (badges.length === 0 && !selectedPreset) return null;
  return (
    <div
      className="mt-3 animate-elegant-fade-up opacity-0"
      style={{ animationDelay: "150ms" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          {selectedPreset && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              <span className="text-xs">
                {FILTER_PRESETS.find((p) => p.id === selectedPreset)?.icon}
              </span>
              <span className="text-xs font-medium">
                {FILTER_PRESETS.find((p) => p.id === selectedPreset)?.name}
              </span>
            </span>
          )}
          Active ({totalCount})
        </span>
        <button
          onClick={() => {
            onClearAll();
            if (onClearAllFilters) onClearAllFilters();
          }}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors duration-200 hover:scale-105"
        >
          Clear All
        </button>
      </div>
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {badges.map((badge, index) => (
            <button
              key={index}
              onClick={() => {
                if (onFilterRemove && badge.key) {
                  onFilterRemove(badge.key);
                } else {
                  badge.onRemove();
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 bg-primary/10 text-primary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 text-xs font-medium group/badge hover:scale-105"
            >
              <FontAwesomeIcon icon={badge.icon} className="h-2.5 w-2.5" />
              <span className="truncate max-w-20 sm:max-w-none">
                {badge.label}
              </span>
              <FontAwesomeIcon
                icon={faTimes}
                className="h-2.5 w-2.5 opacity-60 group-hover/badge:opacity-100 transition-opacity duration-200"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const AdvancedFilters: React.FC<{
  filters: SearchFilters;
  isLoading: boolean;
  onFilterChange: (key: keyof SearchFilters, value: any) => void;
  onClose: () => void;
  onCategorySelect: (categoryValue: string) => void;
  onLocationSelect: (locationValue: string) => void;
}> = ({
  filters,
  isLoading,
  onFilterChange,
  onClose,
  onCategorySelect,
  onLocationSelect,
}) => (
  <div
    className="mt-4 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-xl p-4 animate-elegant-fade-up opacity-0"
    style={{ animationDelay: "50ms" }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <FontAwesomeIcon
          icon={faSliders}
          className="h-3.5 w-3.5 text-primary"
        />
        Filters
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
      >
        <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5" />
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <FontAwesomeIcon icon={faTag} className="h-3 w-3 text-blue-500" />
          Category
        </label>
        <Select
          options={CATEGORY_OPTIONS}
          value={filters.category || ""}
          onValueChange={(value) => {
            if (value) {
              onCategorySelect(value);
            } else {
              onFilterChange("category", undefined);
            }
          }}
          state={SelectState.DEFAULT}
          disabled={isLoading}
          className="rounded-lg text-sm bg-card"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-amber-500" />
          Condition
        </label>
        <Select
          options={CONDITION_OPTIONS}
          value={filters.condition || ""}
          onValueChange={(value) =>
            onFilterChange("condition", value || undefined)
          }
          state={SelectState.DEFAULT}
          disabled={isLoading}
          className="rounded-lg text-sm bg-card"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="h-3 w-3 text-green-500"
          />
          Location
        </label>
        <Select
          options={LOCATION_OPTIONS}
          value={filters.location || ""}
          onValueChange={(value) => {
            if (value) {
              onLocationSelect(value);
            } else {
              onFilterChange("location", undefined);
            }
          }}
          state={SelectState.DEFAULT}
          disabled={isLoading}
          className="rounded-lg text-sm bg-card"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="h-3 w-3 text-red-500"
          />
          Distance
        </label>
        <Select
          options={getDistanceOptions()}
          value={filters.radius?.toString() || ""}
          onValueChange={(value) =>
            onFilterChange("radius", value ? parseInt(value) : undefined)
          }
          state={SelectState.DEFAULT}
          disabled={isLoading}
          className="rounded-lg text-sm bg-card"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <FontAwesomeIcon
            icon={faDollarSign}
            className="h-3 w-3 text-emerald-500"
          />
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange?.min?.toString() || ""}
            onChange={(e) =>
              onFilterChange("priceRange", {
                ...filters.priceRange,
                min: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60 bg-card text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange?.max?.toString() || ""}
            onChange={(e) =>
              onFilterChange("priceRange", {
                ...filters.priceRange,
                max: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60 bg-card text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
        </div>
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          <FontAwesomeIcon
            icon={faCheck}
            className="h-3 w-3 text-emerald-500"
          />
          {
            Object.keys(filters).filter(
              (key) =>
                filters[key as keyof SearchFilters] !== undefined &&
                filters[key as keyof SearchFilters] !== null &&
                filters[key as keyof SearchFilters] !== ""
            ).length
          }{" "}
          active filter
          {Object.keys(filters).filter(
            (key) =>
              filters[key as keyof SearchFilters] !== undefined &&
              filters[key as keyof SearchFilters] !== null &&
              filters[key as keyof SearchFilters] !== ""
          ).length !== 1
            ? "s"
            : ""}
        </span>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-primary">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Updating...
          </span>
        )}
      </div>
    </div>
  </div>
);
const useSearchState = (
  initialQuery: string,
  initialFilters: SearchFilters
) => {
  const [state, setState] = React.useState<SearchState>({
    query: initialQuery,
    filters: initialFilters,
    selectedPreset: null,
    isAdvancedOpen: false,
    showSuggestionsPanel: false,
  });
  const updateState = useCallback((updates: Partial<SearchState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);
  return { state, updateState };
};
export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  className = "",
  onSearch,
  onFiltersChange,
  onClear,
  placeholder = "What are you looking for?",
  showAdvancedFilters = true,
  autoFocus = false,
  initialQuery = "",
  initialFilters = {},
  isLoading = false,
  showPresets = true,
  showSuggestions = true,
  onFilterRemove,
  onClearAllFilters,
}) => {
  const { state, updateState } = useSearchState(initialQuery, initialFilters);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const updateSearchFilters = useLoopItStore(
    (state) => state.updateSearchFilters
  );
  const router = useRouter();

  const searchInputWrapperRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (JSON.stringify(state.filters) !== JSON.stringify(initialFilters)) {
      updateState({ filters: initialFilters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);
  useEffect(() => {
    const trimmedQuery = state.query.trim();
    if (trimmedQuery.length >= 3) {
      const timeoutId = setTimeout(() => {
        updateSearchFilters(state.filters);
        onSearch?.(trimmedQuery, state.filters);
        onFiltersChange?.(state.filters);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (trimmedQuery.length === 0) {
      updateSearchFilters(state.filters);
      onSearch?.("", state.filters);
      onFiltersChange?.(state.filters);
    }
  }, [
    state.query,
    state.filters,
    updateSearchFilters,
    onSearch,
    onFiltersChange,
  ]);
  const handleSearch = useCallback(() => {
    const trimmedQuery = state.query.trim();
    if (trimmedQuery.length >= 3 || trimmedQuery.length === 0) {
      updateSearchFilters(state.filters);
      onSearch?.(trimmedQuery, state.filters);
      onFiltersChange?.(state.filters);
      updateState({ showSuggestionsPanel: false });
    }
  }, [
    state.query,
    state.filters,
    updateSearchFilters,
    onSearch,
    onFiltersChange,
    updateState,
  ]);
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: any) => {
      const newFilters = { ...state.filters };
      if (value === undefined || value === "") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      updateState({
        filters: newFilters,
        selectedPreset: null,
      });
      onFiltersChange?.(newFilters);
      onSearch?.(state.query, newFilters);
    },
    [state.filters, state.query, onFiltersChange, onSearch, updateState]
  );
  const handleCategorySelect = useCallback(
    (categoryValue: string) => {
      if (categoryValue) {
        router.push(`/items/?category=${encodeURIComponent(categoryValue)}`);
      } else {
        router.push(`/items`);
      }
    },
    [router]
  );

  const handleLocationSelect = useCallback(
    (locationValue: string) => {
      if (locationValue) {
        router.push(`/items/?location=${encodeURIComponent(locationValue)}`);
      } else {
        router.push(`/items`);
      }
    },
    [router]
  );
  const handlePresetSelect = useCallback(
    (presetId: string) => {
      const newFilters = getPresetFilters(presetId);
      updateState({
        selectedPreset: presetId,
        filters: newFilters,
      });
      onFiltersChange?.(newFilters);
      onSearch?.(state.query, newFilters);
    },
    [state.query, onFiltersChange, onSearch, updateState]
  );
  const handleClearAll = useCallback(() => {
    if (onClearAllFilters) {
      onClearAllFilters();
    } else {
      updateState({ filters: {}, selectedPreset: null, query: "" });
      onFiltersChange?.({});
      onSearch?.("", {});
      onClear?.();
    }
  }, [onClearAllFilters, updateState, onFiltersChange, onSearch, onClear]);
  const activeBadges = useMemo(() => {
    const badges: Array<{
      label: string;
      onRemove: () => void;
      icon: any;
      key?: keyof SearchFilters;
    }> = [];
    if (state.filters.category) {
      const categoryOption = CATEGORY_OPTIONS.find(
        (opt) => opt.value === state.filters.category
      );
      badges.push({
        label: categoryOption?.label || state.filters.category,
        icon: faTag,
        onRemove: () => handleFilterChange("category", undefined),
        key: "category",
      });
    }
    if (state.filters.condition) {
      const conditionOption = CONDITION_OPTIONS.find(
        (opt) => opt.value === state.filters.condition
      );
      badges.push({
        label: conditionOption?.label || state.filters.condition,
        icon: faStar,
        onRemove: () => handleFilterChange("condition", undefined),
        key: "condition",
      });
    }
    if (state.filters.location) {
      badges.push({
        label: state.filters.location,
        icon: faMapMarkerAlt,
        onRemove: () => handleFilterChange("location", undefined),
        key: "location",
      });
    }
    if (state.filters.radius) {
      const distanceOption = DISTANCE_OPTIONS.find(
        (opt) => opt.value === state.filters.radius
      );
      badges.push({
        label: distanceOption?.label || state.filters.radius + "km",
        icon: faMapMarkerAlt,
        onRemove: () => handleFilterChange("radius", undefined),
        key: "radius",
      });
    }
    if (
      state.filters.priceRange &&
      (state.filters.priceRange.min || state.filters.priceRange.max)
    ) {
      const min = state.filters.priceRange.min || 0;
      const max = state.filters.priceRange.max || "∞";
      badges.push({
        label: `$${min} - $${max}`,
        icon: faDollarSign,
        onRemove: () => handleFilterChange("priceRange", {}),
        key: "priceRange",
      });
    }
    return badges;
  }, [state.filters, handleFilterChange]);
  const activeFiltersCount = Object.entries(state.filters).filter(
    ([key, value]) => {
      const validKeys: (keyof SearchFilters)[] = [
        "category",
        "condition",
        "location",
        "radius",
        "priceRange",
      ];
      return (
        validKeys.includes(key as keyof SearchFilters) &&
        value !== "" &&
        value !== undefined &&
        value !== null
      );
    }
  ).length;
  return (
    <div
      className={clsx("w-full animate-elegant-fade-up opacity-0", className)}
      style={{ animationDelay: "100ms" }}
    >
      <div className="relative" ref={searchInputWrapperRef}>
        <SearchInput
          value={state.query}
          onChange={(value) => updateState({ query: value })}
          onSubmit={handleSearch}
          onFocus={() =>
            showSuggestions && updateState({ showSuggestionsPanel: true })
          }
          onBlur={() =>
            setTimeout(() => updateState({ showSuggestionsPanel: false }), 200)
          }
          placeholder={placeholder}
          isLoading={isLoading || state.query.trim().length >= 3}
          inputRef={searchInputRef}
          filterToggle={
            showAdvancedFilters ? (
              <FilterToggle
                isOpen={state.isAdvancedOpen}
                activeCount={activeFiltersCount}
                onToggle={() =>
                  updateState({ isAdvancedOpen: !state.isAdvancedOpen })
                }
              />
            ) : undefined
          }
        />
        <SearchSuggestions
          show={showSuggestions && state.showSuggestionsPanel}
          query={state.query}
          onSelect={(suggestion) => {
            updateState({ query: suggestion, showSuggestionsPanel: false });
            updateSearchFilters(state.filters);
            onSearch?.(suggestion, state.filters);
            onFiltersChange?.(state.filters);
          }}
          anchorRef={searchInputWrapperRef}
        />
        <ActiveFilters
          badges={activeBadges}
          selectedPreset={state.selectedPreset}
          activeCount={activeFiltersCount}
          onClearAll={handleClearAll}
          onFilterRemove={onFilterRemove}
          onClearAllFilters={onClearAllFilters}
        />
        {showAdvancedFilters && state.isAdvancedOpen && (
          <AdvancedFilters
            filters={state.filters}
            isLoading={isLoading}
            onFilterChange={handleFilterChange}
            onCategorySelect={handleCategorySelect}
            onLocationSelect={handleLocationSelect}
            onClose={() => updateState({ isAdvancedOpen: false })}
          />
        )}
      </div>
    </div>
  );
};
SearchAndFilters.displayName = "SearchAndFilters";
export default SearchAndFilters;

import {
  Item,
  ItemCategory,
  ItemCondition,
  SearchFilters,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
export interface UseHomepageOptions {
  initialFilters?: SearchFilters;
  enableUrlSync?: boolean;
}
export interface UseHomepageReturn {
  items: Item[];
  searchQuery: string;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  filteredItems: Item[];
  totalItems: number;
  hasActiveFilters: boolean;
  resultsText: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (
    key: keyof SearchFilters,
    value: string | ItemCategory | ItemCondition | undefined
  ) => void;
  clearFilters: () => void;
  clearAllFilters: () => void;
  handleItemClick: (item: Item) => void;
  handleSaveItem: (item: Item) => void;
  handleUnsaveItem: (item: Item) => void;
  handleSwapRequest: (item: Item) => void;
  isItemSaved: (itemId: string) => boolean;
  refreshItems: () => void;
}
export function useHomepage(
  options: UseHomepageOptions = {}
): UseHomepageReturn {
  const { initialFilters = {}, enableUrlSync = false } = options;
  const router = useRouter();
  const {
    items,
    savedItems,
    isLoadingItems,
    error,
    fetchItems,
    saveItem,
    unsaveItem,
    trackItemView,
    setSelectedItem,
    setError,
    clearError,
  } = useLoopItStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  const filteredItems = useMemo(() => {
    let result = items;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.location.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query)
      );
    }
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }
    if (filters.condition) {
      result = result.filter((item) => item.condition === filters.condition);
    }
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase().trim();
      result = result.filter((item) =>
        item.location.toLowerCase().includes(locationQuery)
      );
    }
    return result;
  }, [items, searchQuery, filters]);
  const totalItems = items.length;
  const hasActiveFilters = useMemo(() => {
    return (
      Object.values(filters).some(
        (value) => value !== undefined && value !== ""
      ) || searchQuery.trim() !== ""
    );
  }, [filters, searchQuery]);
  const resultsText = useMemo(() => {
    const count = filteredItems.length;
    const hasQuery = searchQuery.trim() !== "";
    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== ""
    );
    if (hasQuery && hasFilters) {
      return `${count} item${
        count !== 1 ? "s" : ""
      } found for "${searchQuery}" with filters`;
    } else if (hasQuery) {
      return `${count} item${
        count !== 1 ? "s" : ""
      } found for "${searchQuery}"`;
    } else if (hasFilters) {
      return `${count} item${count !== 1 ? "s" : ""} match your filters`;
    } else {
      return `${count} item${count !== 1 ? "s" : ""} available`;
    }
  }, [filteredItems.length, searchQuery, filters]);
  const handleSetSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query);
      clearError();
    },
    [clearError]
  );
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    clearError();
  }, [clearError]);
  const handleSetFilters = useCallback(
    (newFilters: SearchFilters) => {
      setFilters(newFilters);
      clearError();
    },
    [clearError]
  );
  const updateFilter = useCallback(
    (
      key: keyof SearchFilters,
      value: string | ItemCategory | ItemCondition | undefined
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value || undefined,
      }));
      clearError();
    },
    [clearError]
  );
  const clearFilters = useCallback(() => {
    setFilters({});
    clearError();
  }, [clearError]);
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({});
    clearError();
  }, [clearError]);
  const handleItemClick = useCallback(
    (item: Item) => {
      trackItemView(item.id);
      setSelectedItem(item);
      router.push(`/item/${item.id}`);
    },
    [trackItemView, setSelectedItem, router]
  );
  const handleSaveItem = useCallback(
    async (item: Item) => {
      try {
        await saveItem(item.id);
      } catch (error) {
        console.error("Failed to save item:", error);
        setError("Failed to save item. Please try again.");
      }
    },
    [saveItem, setError]
  );
  const handleUnsaveItem = useCallback(
    async (item: Item) => {
      try {
        await unsaveItem(item.id);
      } catch (error) {
        console.error("Failed to unsave item:", error);
        setError("Failed to remove item from saved. Please try again.");
      }
    },
    [unsaveItem, setError]
  );
  const handleSwapRequest = useCallback(
    (item: Item) => {
      console.log("Swap request for:", item.title);
      setSelectedItem(item);
    },
    [setSelectedItem]
  );
  const isItemSaved = useCallback(
    (itemId: string) => {
      return savedItems.some((item) => item.id === itemId);
    },
    [savedItems]
  );
  const refreshItems = useCallback(() => {
    fetchItems();
  }, [fetchItems]);
  useEffect(() => {
    if (!enableUrlSync) return;
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (filters.category) {
      params.set("category", filters.category);
    }
    if (filters.condition) {
      params.set("condition", filters.condition);
    }
    if (filters.location) {
      params.set("location", filters.location);
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [searchQuery, filters, enableUrlSync]);
  return {
    items,
    searchQuery,
    filters,
    isLoading: isLoadingItems,
    error,
    filteredItems,
    totalItems,
    hasActiveFilters,
    resultsText,
    setSearchQuery: handleSetSearchQuery,
    clearSearch,
    setFilters: handleSetFilters,
    updateFilter,
    clearFilters,
    clearAllFilters,
    handleItemClick,
    handleSaveItem,
    handleUnsaveItem,
    handleSwapRequest,
    isItemSaved,
    refreshItems,
  };
}

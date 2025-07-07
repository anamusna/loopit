import { getItemStatusCounts } from "@/data";
import {
  Item,
  ItemCategory,
  ItemCondition,
  ItemStatus,
  SearchFilters,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
export interface UseItemsOptions {
  initialFilters?: SearchFilters;
  enableUrlSync?: boolean;
  itemsPerPage?: number;
}
export interface UseItemsReturn {
  items: Item[];
  searchQuery: string;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  filteredItems: Item[];
  paginatedItems: Item[];
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
  setCurrentPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  handleItemClick: (item: Item) => void;
  handleSaveItem: (item: Item) => void;
  handleUnsaveItem: (item: Item) => void;
  handleSwapRequest: (item: Item) => void;
  isItemSaved: (itemId: string) => boolean;
  refreshItems: () => void;
}
export function useItems(options: UseItemsOptions = {}): UseItemsReturn {
  const {
    initialFilters = {},
    enableUrlSync = true,
    itemsPerPage = 12,
  } = options;
  const router = useRouter();
  const {
    user,
    savedItems,
    isLoadingItems,
    error,
    items,
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
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  const filteredItems = useMemo(() => {
    let result = items || [];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item: Item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
          item.location.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.condition.toLowerCase().includes(query)
      );
    }
    if (filters.category) {
      result = result.filter(
        (item: Item) => item.category === filters.category
      );
    }
    if (filters.condition) {
      result = result.filter(
        (item: Item) => item.condition === filters.condition
      );
    }
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase().trim();
      result = result.filter((item: Item) =>
        item.location.toLowerCase().includes(locationQuery)
      );
    }
    return result;
  }, [items, searchQuery, filters]);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);
  const totalItems = filteredItems.length;
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
  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);
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
      } catch (err) {
        console.error("Failed to save item:", err);
        setError("Failed to save item. Please try again.");
      }
    },
    [saveItem, setError]
  );
  const handleUnsaveItem = useCallback(
    async (item: Item) => {
      try {
        await unsaveItem(item.id);
      } catch (err) {
        console.error("Failed to unsave item:", err);
        setError("Failed to unsave item. Please try again.");
      }
    },
    [unsaveItem, setError]
  );
  const handleSwapRequest = useCallback((item: Item) => {
    console.log("Swap request for item:", item.title);
  }, []);
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
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [searchQuery, filters, currentPage, enableUrlSync]);
  useEffect(() => {
    if (!enableUrlSync) return;
    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get("search");
    const urlCategory = params.get("category");
    const urlCondition = params.get("condition");
    const urlLocation = params.get("location");
    const urlPage = params.get("page");
    if (urlSearch) setSearchQuery(urlSearch);
    const newFilters: SearchFilters = {};
    if (urlCategory) newFilters.category = urlCategory as ItemCategory;
    if (urlCondition) newFilters.condition = urlCondition as ItemCondition;
    if (urlLocation) newFilters.location = urlLocation;
    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
    if (urlPage) {
      const page = parseInt(urlPage);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [enableUrlSync]);
  return {
    items: items || [],
    searchQuery,
    filters,
    isLoading: isLoadingItems,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    startIndex,
    endIndex,
    filteredItems,
    paginatedItems,
    hasActiveFilters,
    resultsText,
    setSearchQuery: handleSetSearchQuery,
    clearSearch,
    setFilters: handleSetFilters,
    updateFilter,
    clearFilters,
    clearAllFilters,
    setCurrentPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    handleItemClick,
    handleSaveItem,
    handleUnsaveItem,
    handleSwapRequest,
    isItemSaved,
    refreshItems,
  };
}
export interface UseMyListingsOptions {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  initialItems?: Item[];
}
export interface UseMyListingsReturn {
  items: Item[];
  filteredItems: Item[];
  statusCounts: ReturnType<typeof getItemStatusCounts>;
  statusFilter: ItemStatus | "all";
  searchQuery: string;
  setStatusFilter: (status: ItemStatus | "all") => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  handleAddItem: () => void;
  handleEditItem: (item: Item) => void;
  handleDeleteItem: (item: Item) => void;
  handleItemClick: (item: Item) => void;
  refreshItems: () => void;
  getStatusOptions: () => Array<{
    value: ItemStatus | "all";
    label: string;
    count: number;
  }>;
}
export function useMyListings(
  options: UseMyListingsOptions = {}
): UseMyListingsReturn {
  const {
    enableAutoRefresh = false,
    refreshInterval = 30000,
    initialItems = [],
  } = options;
  const router = useRouter();
  const user = useLoopItStore((state) => state.user);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      setItems(user.items);
    }
  }, [user]);
  const filteredItems = useMemo(() => {
    let result = items;
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return result;
  }, [items, statusFilter, searchQuery]);
  const statusCounts = useMemo(() => getItemStatusCounts(items), [items]);
  const isEmpty = useMemo(() => items.length === 0, [items]);
  const getStatusOptions = useCallback(() => {
    const options: Array<{
      value: ItemStatus | "all";
      label: string;
      count: number;
    }> = [{ value: "all", label: "All", count: items.length }];
    Object.entries(statusCounts).forEach(([status, count]) => {
      if (status !== "all") {
        options.push({
          value: status as ItemStatus,
          label: status.charAt(0).toUpperCase() + status.slice(1),
          count,
        });
      }
    });
    return options;
  }, [items.length, statusCounts]);
  const handleAddItem = useCallback(() => {
    router.push("/upload");
  }, [router]);
  const handleEditItem = useCallback(
    (item: Item) => {
      router.push(`/item/${item.id}/edit`);
    },
    [router]
  );
  const handleDeleteItem = useCallback(async (item: Item) => {
    try {
      setIsLoading(true);
      setError(null);
      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    } catch (err) {
      setError("Failed to delete item. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleItemClick = useCallback(
    (item: Item) => {
      router.push(`/item/${item.id}`);
    },
    [router]
  );
  const refreshItems = useCallback(() => {
    if (user) {
      setItems([...user.items]);
    }
  }, [user]);
  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setSearchQuery("");
  }, []);
  return {
    items,
    filteredItems,
    statusCounts,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    isLoading,
    error,
    isEmpty,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleItemClick,
    refreshItems,
    getStatusOptions,
  };
}
export const useDashboardItems = () => {
  const store = useLoopItStore();
  const user = store.user;
  const userItems = useMemo(() => user?.items || [], [user]);
  const savedItems = useMemo(() => store.getSavedItems(), [store]);
  const featuredItems = useMemo(() => store.getFeaturedItems(), [store]);
  const itemStats = useMemo(
    () => ({
      totalItems: userItems.length,
      activeItems: userItems.filter(
        (item) => item.status === ItemStatus.AVAILABLE
      ).length,
      savedItemsCount: savedItems.length,
      featuredItemsCount: featuredItems.length,
    }),
    [userItems, savedItems, featuredItems]
  );
  const fetchItems = useCallback(async () => {
    await store.fetchUserItems();
  }, [store]);
  return {
    userItems,
    savedItems,
    featuredItems,
    itemStats,
    fetchItems,
    isLoading: store.isLoadingItems,
  };
};

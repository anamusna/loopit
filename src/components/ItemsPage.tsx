"use client";
import { useItems } from "@/hooks/useItems";
import {
  Item,
  ItemCategory,
  ItemCondition,
  ItemStatus,
  SearchFilters,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import { calculateCommunityCarbonSavings } from "@/utils/environmentalHelpers";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ItemsInfiniteScroll from "./ItemsInfiniteScroll";
import SearchAndFilters from "./SearchAndFilters";

const parseCategoryFromUrl = (
  categoryString: string | null
): ItemCategory | undefined => {
  if (!categoryString) return undefined;

  const normalizedCategory = categoryString.toLowerCase();
  const validCategories = Object.values(ItemCategory);

  if (validCategories.includes(normalizedCategory as ItemCategory)) {
    return normalizedCategory as ItemCategory;
  }

  return undefined;
};

const parseConditionFromUrl = (
  conditionString: string | null
): ItemCondition | undefined => {
  if (!conditionString) return undefined;

  const normalizedCondition = conditionString.toLowerCase();
  const validConditions = Object.values(ItemCondition);

  if (validConditions.includes(normalizedCondition as ItemCondition)) {
    return normalizedCondition as ItemCondition;
  }

  return undefined;
};

const getCategoryDisplayName = (category: ItemCategory): string => {
  const categoryMap: Record<ItemCategory, string> = {
    [ItemCategory.CLOTHING]: "Clothing",
    [ItemCategory.BOOKS]: "Books",
    [ItemCategory.FURNITURE]: "Furniture",
    [ItemCategory.ELECTRONICS]: "Electronics",
    [ItemCategory.TOYS]: "Toys",
    [ItemCategory.SPORTS]: "Sports Equipment",
    [ItemCategory.HOUSEHOLD]: "Household Items",
    [ItemCategory.OTHER]: "Other Items",
  };

  return (
    categoryMap[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
};

interface ItemsPageProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showSearchBar?: boolean;
  showFilters?: boolean;
  initialFilters?: SearchFilters;
  itemsPerLoad?: number;
}

export const CATEGORIES = [
  { label: "All Items", value: "" },
  { label: "Clothing", value: ItemCategory.CLOTHING },
  { label: "Books", value: ItemCategory.BOOKS },
  { label: "Furniture", value: ItemCategory.FURNITURE },
  { label: "Electronics", value: ItemCategory.ELECTRONICS },
  { label: "Toys", value: ItemCategory.TOYS },
  { label: "Sports", value: ItemCategory.SPORTS },
  { label: "Household", value: ItemCategory.HOUSEHOLD },
  { label: "Other", value: ItemCategory.OTHER },
] as const;

export const ItemsPage: React.FC<ItemsPageProps> = React.memo(
  ({
    className = "",
    title = "Discover Amazing Items",
    subtitle = "Find treasures from your local community and help save the planet",
    showHeader = true,
    showSearchBar = true,
    showFilters = true,
    initialFilters = {},
    itemsPerLoad = 24,
  }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const isLoadingItems = useLoopItStore((state) => state.isLoadingItems);
    const error = useLoopItStore((state) => state.error);
    const fetchItems = useLoopItStore((state) => state.fetchItems);
    const searchItems = useLoopItStore((state) => state.searchItems);
    const saveItem = useLoopItStore((state) => state.saveItem);
    const unsaveItem = useLoopItStore((state) => state.unsaveItem);
    const savedItems = useLoopItStore((state) => state.savedItems);
    const toggleMapView = useLoopItStore((state) => state.toggleMapView);
    const mapView = useLoopItStore((state) => state.isMapView);

    const urlParams = useMemo(
      () => ({
        category: parseCategoryFromUrl(searchParams.get("category")),
        location: searchParams.get("location"),
        condition: parseConditionFromUrl(searchParams.get("condition")),
      }),
      [searchParams]
    );

    const dynamicTitle = useMemo(() => {
      if (urlParams.category) {
        const categoryDisplay = getCategoryDisplayName(urlParams.category);
        return `Discover Amazing ${categoryDisplay}`;
      }
      if (urlParams.location) {
        return `Discover Items in ${urlParams.location}`;
      }
      return title;
    }, [urlParams.category, urlParams.location, title]);

    const effectiveInitialFilters = useMemo(() => {
      const filters: SearchFilters = { ...initialFilters };
      if (urlParams.category) {
        filters.category = urlParams.category;
      }
      if (urlParams.location) {
        filters.location = urlParams.location;
      }
      if (urlParams.condition) {
        filters.condition = urlParams.condition;
      }
      return filters;
    }, [
      initialFilters,
      urlParams.category,
      urlParams.location,
      urlParams.condition,
    ]);

    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const [localSearchFilters, setLocalSearchFilters] = useState<SearchFilters>(
      effectiveInitialFilters
    );
    const [isMapView, setIsMapView] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [showComparison, setShowComparison] = useState(false);

    const {
      items: allItems,
      filteredItems,
      paginatedItems,
      refreshItems,
      setSearchQuery,
      setFilters,
    } = useItems({
      initialFilters: effectiveInitialFilters,
      itemsPerPage: itemsPerLoad,
    });

    const processedCategoryRef = useRef<string | null>(null);
    const processedLocationRef = useRef<string | null>(null);
    const processedConditionRef = useRef<string | null>(null);

    useEffect(() => {
      const hasCategoryChanged =
        urlParams.category &&
        processedCategoryRef.current !== urlParams.category;
      const hasLocationChanged =
        urlParams.location &&
        processedLocationRef.current !== urlParams.location;
      const hasConditionChanged =
        urlParams.condition &&
        processedConditionRef.current !== urlParams.condition;

      if (hasCategoryChanged || hasLocationChanged || hasConditionChanged) {
        const newFilters = { ...localSearchFilters };
        if (hasCategoryChanged && urlParams.category) {
          newFilters.category = urlParams.category;
          processedCategoryRef.current = urlParams.category;
        }
        if (hasLocationChanged && urlParams.location) {
          newFilters.location = urlParams.location;
          processedLocationRef.current = urlParams.location;
        }
        if (hasConditionChanged && urlParams.condition) {
          newFilters.condition = urlParams.condition;
          processedConditionRef.current = urlParams.condition;
        }

        setLocalSearchFilters(newFilters);
        setFilters(newFilters);
        searchItems("", newFilters);
      }
    }, [
      urlParams.category,
      urlParams.location,
      urlParams.condition,
      setFilters,
      searchItems,
      localSearchFilters,
    ]);

    useEffect(() => {
      setIsMapView(mapView);
    }, [mapView]);

    useEffect(() => {
      if (!localSearchQuery && Object.keys(localSearchFilters).length === 0) {
        fetchItems();
      }
    }, [fetchItems, localSearchQuery, localSearchFilters]);

    const handleSearch = useCallback(
      (query: string, filters: SearchFilters = {}) => {
        setLocalSearchQuery(query);
        setLocalSearchFilters(filters);
        setSearchQuery(query);
        setFilters(filters);
        if (query.trim() || Object.keys(filters).length > 0) {
          searchItems(query, filters);
        } else {
          fetchItems();
        }
      },
      [searchItems, fetchItems, setSearchQuery, setFilters]
    );

    const handleFiltersChange = useCallback(
      (filters: SearchFilters) => {
        setLocalSearchFilters(filters);
        setFilters(filters);

        const params = new URLSearchParams();

        if (filters.category) {
          params.set("category", filters.category);
        }

        if (filters.location) {
          params.set("location", filters.location);
        }

        if (filters.condition) {
          params.set("condition", filters.condition);
        }

        const query = params.toString();
        const newUrl = `/items${query ? `?${query}` : ""}`;

        // Only check window.location on client side
        if (typeof window !== "undefined") {
          const currentUrl = window.location.pathname + window.location.search;
          if (newUrl !== currentUrl) {
            router.push(newUrl);
          }
        } else {
          router.push(newUrl);
        }

        if (localSearchQuery.trim() || Object.keys(filters).length > 0) {
          searchItems(localSearchQuery, filters);
        } else {
          fetchItems();
        }
      },
      [setFilters, searchItems, fetchItems, localSearchQuery, router]
    );

    const handleItemClick = useCallback(
      (item: Item) => {
        router.push(`/item/${item.id}`);
      },
      [router]
    );

    const handleSaveItem = useCallback(
      (itemId: string) => {
        const isSaved = savedItems.some((item) => item.id === itemId);
        if (isSaved) {
          unsaveItem(itemId);
        } else {
          saveItem(itemId);
        }
      },
      [savedItems, saveItem, unsaveItem]
    );

    const handleShareItem = useCallback((item: Item) => {
      if (typeof window !== "undefined" && navigator.share) {
        navigator.share({
          title: item.title,
          text: item.description,
          url: `${window.location.origin}/item/${item.id}`,
        });
      } else if (typeof window !== "undefined") {
        const url = `${window.location.origin}/item/${item.id}`;
        navigator.clipboard.writeText(url);
        console.log("Link copied to clipboard!");
      }
    }, []);

    const handleReportItem = useCallback((item: Item) => {
      console.log("Report item:", item.id);
    }, []);

    const handleSelectItem = useCallback(
      (itemId: string, selected: boolean) => {
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          if (selected) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
      },
      []
    );

    const handleFilterRemove = useCallback(
      (key: keyof SearchFilters) => {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (key === "category") {
            params.delete("category");
          }
          if (key === "location") {
            params.delete("location");
          }
          if (key === "condition") {
            params.delete("condition");
          }
          const query = params.toString();
          router.push(`/items${query ? `?${query}` : ""}`);
        } else {
          // Fallback for server-side rendering
          if (key === "category") {
            router.push("/items");
          } else {
            router.push("/items");
          }
        }
      },
      [router]
    );

    const handleClearAllFilters = useCallback(() => {
      router.push("/items");
    }, [router]);

    const stats = useMemo(() => {
      const users = useLoopItStore.getState().users;
      const activeUsers = users.filter((user) => user.isActive).length;
      const availableItems = allItems.filter(
        (item) => item.status === ItemStatus.AVAILABLE
      ).length;
      const categories = new Set(allItems.map((item) => item.category)).size;
      const totalCarbonSaved = calculateCommunityCarbonSavings(allItems);
      return {
        total: allItems.length,
        available: availableItems,
        categories,
        activeUsers,
        carbonSaved: totalCarbonSaved,
      };
    }, [allItems]);

    const hasActiveSearch = useMemo(
      () => localSearchQuery || Object.keys(localSearchFilters).length > 0,
      [localSearchQuery, localSearchFilters]
    );

    const activeCategory = useMemo(
      () => urlParams.category || "",
      [urlParams.category]
    );

    const handleCategoryClick = useCallback(
      (categoryValue: string) => {
        if (categoryValue) {
          router.push(`/items/?category=${encodeURIComponent(categoryValue)}`);
        } else {
          router.push(`/items`);
        }
      },
      [router]
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-6">
        <div className="mx-auto px-2 sm:px-4">
          {showHeader && (
            <div className="max-w-4xl mx-auto mb-8 text-center animate-elegant-reveal">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-gradient-x">
                {dynamicTitle}
              </h1>
              <p
                className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-elegant-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                {subtitle}
              </p>
            </div>
          )}

          {showSearchBar && (
            <div className="max-w-4xl mx-auto mb-6">
              <SearchAndFilters
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
                showAdvancedFilters={showFilters}
                autoFocus={false}
                initialFilters={effectiveInitialFilters}
                className="group"
                isLoading={isLoadingItems}
                onFilterRemove={handleFilterRemove}
                onClearAllFilters={handleClearAllFilters}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm
                ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-primary/10 hover:text-primary"
                }
              `}
                onClick={() => handleCategoryClick(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6">
            <ItemsInfiniteScroll
              items={filteredItems}
              isLoading={isLoadingItems}
              hasMore={paginatedItems.length > filteredItems.length}
              onLoadMore={refreshItems}
              onItemClick={handleItemClick}
              onSaveItem={handleSaveItem}
              onShareItem={handleShareItem}
              onReportItem={handleReportItem}
              onSelectItem={handleSelectItem}
              selectedItems={selectedItems}
              viewMode="grid"
              error={error}
              onRetry={fetchItems}
              showLoadMoreButton={false}
              itemsPerLoad={itemsPerLoad}
              emptyStateMessage={
                hasActiveSearch
                  ? "No items match your search criteria. Try adjusting your filters or exploring different categories."
                  : "No items available right now. Be the first to list something amazing!"
              }
              className=""
            />
          </div>
        </div>
      </div>
    );
  }
);

ItemsPage.displayName = "ItemsPage";
export default ItemsPage;

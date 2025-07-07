"use client";
import { useItems } from "@/hooks/useItems";
import { Item, ItemStatus, SearchFilters } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Container from "@/tailwind/components/layout/Container";
import {
  calculateCommunityCarbonSavings,
  formatCarbonSavings,
} from "@/utils/environmentalHelpers";
import {
  faChartLine,
  faCompass,
  faGlobe,
  faLeaf,
  faSearch,
  faStar,
  faTimes,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ItemsInfiniteScroll from "./ItemsInfiniteScroll";
import SearchAndFilters from "./SearchAndFilters";
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
export const ItemsPage: React.FC<ItemsPageProps> = ({
  className = "",
  title = "Discover Amazing Items",
  subtitle = "Find treasures from your local community and help save the planet",
  showHeader = true,
  showSearchBar = true,
  showFilters = true,
  initialFilters = {},
  itemsPerLoad = 24,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localSearchFilters, setLocalSearchFilters] =
    useState<SearchFilters>(initialFilters);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const isLoadingItems = useLoopItStore((state) => state.isLoadingItems);
  const error = useLoopItStore((state) => state.error);
  const fetchItems = useLoopItStore((state) => state.fetchItems);
  const searchItems = useLoopItStore((state) => state.searchItems);
  const saveItem = useLoopItStore((state) => state.saveItem);
  const unsaveItem = useLoopItStore((state) => state.unsaveItem);
  const savedItems = useLoopItStore((state) => state.savedItems);
  const toggleMapView = useLoopItStore((state) => state.toggleMapView);
  const mapView = useLoopItStore((state) => state.isMapView);
  const router = useRouter();
  const {
    items: allItems,
    filteredItems,
    paginatedItems,
    refreshItems,
    setSearchQuery,
    setFilters,
  } = useItems({
    initialFilters: initialFilters,
    itemsPerPage: itemsPerLoad,
  });
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
    },
    [setFilters]
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
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: `${window.location.origin}/item/${item.id}`,
      });
    } else {
      const url = `${window.location.origin}/item/${item.id}`;
      navigator.clipboard.writeText(url);
      console.log("Link copied to clipboard!");
    }
  }, []);
  const handleReportItem = useCallback((item: Item) => {
    console.log("Report item:", item.id);
  }, []);
  const handleSelectItem = useCallback((itemId: string, selected: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);
  const handleClearSelection = useCallback(() => {
    setSelectedItems(new Set());
    setShowComparison(false);
  }, []);
  const handleStartComparison = useCallback(() => {
    if (selectedItems.size >= 2) {
      setShowComparison(true);
    }
  }, [selectedItems.size]);
  const handleMapViewToggle = useCallback(() => {
    toggleMapView();
  }, [toggleMapView]);
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
  }, []);
  const hasActiveSearch =
    localSearchQuery || Object.keys(localSearchFilters).length > 0;
  const statsValues = [
    {
      value: stats.total,
      label: "Total Items",
      icon: faCompass,
      gradient: "from-blue-500 to-indigo-500",
      bg: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      border: "border-blue-200/60 dark:border-blue-800/60",
      delay: "0.1s",
    },
    {
      value: stats.available,
      label: "Available Items",
      icon: faStar,
      gradient: "from-emerald-500 to-green-500",
      bg: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
      border: "border-emerald-200/60 dark:border-emerald-800/60",
      delay: "0.2s",
    },
    {
      value: stats.categories,
      label: "Categories",
      icon: faGlobe,
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      border: "border-purple-200/60 dark:border-purple-800/60",
      delay: "0.3s",
    },
    {
      value: stats.activeUsers,
      label: "Active Members",
      icon: faUsers,
      gradient: "from-orange-500 to-red-500",
      bg: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      border: "border-orange-200/60 dark:border-orange-800/60",
      delay: "0.4s",
    },
  ];
  return (
    <div
      className={clsx(
        "min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-success/5 to-transparent rounded-full blur-2xl animate-breathing" />
      </div>
      <Container className="relative z-10 py-6 sm:py-8 lg:py-12">
        {showHeader && (
          <header className="relative mb-12 lg:mb-16 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl animate-smooth-float" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-tl from-success/8 via-transparent to-primary/8 rounded-full blur-2xl animate-smooth-float-delayed" />
            </div>

            <div className="relative z-10 text-center space-y-6 sm:space-y-8 lg:space-y-10">
              <div
                className="animate-elegant-fade-up opacity-0"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm shadow-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-subtle-pulse" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discover • Trade • Save the Planet
                  </span>
                </div>
              </div>

              <div
                className="animate-elegant-fade-up opacity-0"
                style={{ animationDelay: "0.2s" }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold tracking-tight">
                  <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    {title.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent mt-2">
                    {title.split(" ").slice(2).join(" ")}
                  </span>
                </h1>
              </div>

              <div
                className="animate-elegant-fade-up opacity-0"
                style={{ animationDelay: "0.3s" }}
              >
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400  mx-auto leading-relaxed px-4">
                  {subtitle}
                </p>
              </div>

              <div
                className="animate-elegant-fade-up opacity-0"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/60 dark:border-emerald-800/60 backdrop-blur-sm">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full">
                    <FontAwesomeIcon
                      icon={faLeaf}
                      className="w-4 h-4 text-white"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-sm">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                      {formatCarbonSavings(stats.carbonSaved)} saved
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      by our community
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 lg:mt-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {statsValues.map((stat: any, index: number) => (
                  <div
                    key={stat.label}
                    className={clsx(
                      "group relative bg-gradient-to-br",
                      stat.bg,
                      "backdrop-blur-sm border",
                      stat.border,
                      "rounded-3xl p-6 text-center transition-all duration-500",
                      "hover:scale-105 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5",
                      "animate-fade-in-up cursor-pointer"
                    )}
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative mb-4">
                      <div
                        className={clsx(
                          "inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
                          "bg-gradient-to-r",
                          stat.gradient,
                          "shadow-lg shadow-black/10 dark:shadow-white/10",
                          "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                        )}
                      >
                        <FontAwesomeIcon
                          icon={stat.icon}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                        {stat.value.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 lg:mt-16">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
            </div>
          </header>
        )}

        {showSearchBar && (
          <div className="mb-8 transition-all duration-500">
            <div className="max-w-4xl mx-auto">
              <SearchAndFilters
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
                showAdvancedFilters={showFilters}
                autoFocus={false}
                initialFilters={initialFilters}
                className="group"
                isLoading={isLoadingItems}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3 animate-fade-in-right">
              <Typography
                as={TypographyVariant.P}
                className="text-accent font-medium"
              >
                {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""}{" "}
                selected
              </Typography>
              {selectedItems.size >= 2 && (
                <Button
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  onClick={handleStartComparison}
                  className="flex items-center gap-2 bg-accent hover:bg-accent/90"
                >
                  <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
                  Compare
                </Button>
              )}
              <Button
                variant={ButtonVariant.GHOST}
                size={ButtonSize.SM}
                onClick={handleClearSelection}
                className="p-1 hover:bg-accent/20"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
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
            className="mb-12"
          />
        </div>

        <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 z-[1001]">
          <Button
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.SM}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-105 active:scale-95 transition-all duration-300 animate-subtle-pulse group/fab"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover/fab:scale-110"
            />
          </Button>
        </div>
      </Container>
    </div>
  );
};
ItemsPage.displayName = "ItemsPage";
export default ItemsPage;

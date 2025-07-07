"use client";
import { Item } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faInbox,
  faRefresh,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ItemCard from "./item/ItemCard";
interface ScrollState {
  displayedItems: Item[];
  loadedCount: number;
  isLoadingMore: boolean;
  currentViewMode: "grid" | "list" | "masonry";
}
interface ItemActions {
  onItemClick?: (item: Item) => void;
  onSaveItem?: (itemId: string) => void;
  onShareItem?: (item: Item) => void;
  onReportItem?: (item: Item) => void;
  onSelectItem?: (itemId: string, selected: boolean) => void;
}
export interface ItemsInfiniteScrollProps extends ItemActions {
  className?: string;
  itemsPerLoad?: number;
  items: Item[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  selectedItems?: Set<string>;
  viewMode?: "grid" | "list" | "masonry";
  emptyStateMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  showLoadMoreButton?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
}
const getGridClasses = (viewMode: "grid" | "list" | "masonry") => {
  switch (viewMode) {
    case "list":
      return "flex flex-col space-y-4";
    case "masonry":
      return "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6";
    case "grid":
    default:
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6";
  }
};
const getItemClasses = (viewMode: "grid" | "list" | "masonry") => {
  switch (viewMode) {
    case "list":
      return "w-full";
    case "masonry":
      return "break-inside-avoid mb-6";
    case "grid":
    default:
      return "w-full";
  }
};
const ItemsHeader: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => (
  <div className="text-center space-y-4">
    <Typography
      as={TypographyVariant.H1}
      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary"
    >
      {title}
    </Typography>
    <Typography
      as={TypographyVariant.P}
      className="text-lg text-text-secondary max-w-2xl mx-auto"
    >
      {subtitle}
    </Typography>
  </div>
);
const ResultsSummary: React.FC<{
  displayedCount: number;
  totalCount: number;
}> = ({ displayedCount, totalCount }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <Typography
      as={TypographyVariant.P}
      className="text-sm sm:text-base text-text-muted"
    >
      Showing {displayedCount} of {totalCount} items
    </Typography>
  </div>
);
const LoadingSkeleton: React.FC<{
  itemsPerLoad: number;
  viewMode: "grid" | "list" | "masonry";
}> = ({ itemsPerLoad, viewMode }) => (
  <div className={clsx("animate-pulse", getGridClasses(viewMode))}>
    {Array.from({ length: itemsPerLoad }).map((_, index) => (
      <div
        key={index}
        className={clsx(
          "bg-card rounded-2xl border border-border/30 overflow-hidden",
          getItemClasses(viewMode)
        )}
      >
        <div
          className={clsx(
            "bg-secondary/30",
            viewMode === "list" ? "h-32 w-32" : "aspect-[4/3]"
          )}
        />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-secondary/30 rounded-lg" />
          <div className="h-4 bg-secondary/30 rounded-lg w-3/4" />
          <div className="h-4 bg-secondary/30 rounded-lg w-1/2" />
          <div className="flex justify-between pt-2">
            <div className="h-6 bg-secondary/30 rounded-lg w-16" />
            <div className="h-6 bg-secondary/30 rounded-lg w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
const EmptyState: React.FC<{
  message: string;
  hasItems: boolean;
}> = ({ message, hasItems }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6 shadow-lg">
      <FontAwesomeIcon
        icon={hasItems ? faSearch : faInbox}
        className="w-12 h-12 text-primary/60"
      />
    </div>
    <Typography
      as={TypographyVariant.H3}
      className="text-2xl font-bold text-text-primary mb-3"
    >
      {hasItems ? "No matching items" : "No items available"}
    </Typography>
    <Typography
      as={TypographyVariant.P}
      className="text-text-muted max-w-md leading-relaxed"
    >
      {message}
    </Typography>
  </div>
);
const ErrorState: React.FC<{
  error: string;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6 shadow-lg">
      <FontAwesomeIcon icon={faSearch} className="w-12 h-12 text-destructive" />
    </div>
    <Typography
      as={TypographyVariant.H3}
      className="text-2xl font-bold text-text-primary mb-3"
    >
      Something went wrong
    </Typography>
    <Typography
      as={TypographyVariant.P}
      className="text-text-muted mb-6 max-w-md leading-relaxed"
    >
      {error || "Failed to load items. Please try again."}
    </Typography>
    {onRetry && (
      <Button
        variant={ButtonVariant.PRIMARY}
        size={ButtonSize.LG}
        onClick={onRetry}
        className="flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faRefresh} className="w-4 h-4" />
        Try Again
      </Button>
    )}
  </div>
);
const LoadMoreIndicator: React.FC<{
  isLoading: boolean;
}> = ({ isLoading }) => (
  <div className="flex items-center justify-center py-8">
    {isLoading && (
      <div className="flex items-center gap-3">
        <LoadingSpinner size={LoadingSpinnerSize.MD} />
        <Typography as={TypographyVariant.P} className="text-text-muted">
          Loading more items...
        </Typography>
      </div>
    )}
  </div>
);
const LoadMoreButton: React.FC<{
  onClick: () => void;
  isLoading: boolean;
  canLoadMore: boolean;
}> = ({ onClick, isLoading, canLoadMore }) => {
  if (!canLoadMore) return null;
  return (
    <div className="flex justify-center pt-4">
      <Button
        variant={ButtonVariant.OUTLINE}
        size={ButtonSize.LG}
        onClick={onClick}
        disabled={isLoading}
        isLoading={isLoading}
        className="min-w-[200px]"
      >
        {isLoading ? "Loading..." : "Load More Items"}
      </Button>
    </div>
  );
};
const ItemsGrid: React.FC<{
  items: Item[];
  viewMode: "grid" | "list" | "masonry";
  selectedItems: Set<string>;
  itemActions: ItemActions;
}> = ({ items, viewMode, selectedItems, itemActions }) => {
  const AnimatedItemCard = React.useMemo(() => {
    const MemoizedCard = React.memo(
      ({ item, index }: { item: Item; index: number }) => (
        <div
          className={clsx(
            "transform transition-all duration-300 ease-out",
            "animate-in fade-in slide-in-from-bottom-4",
            getItemClasses(viewMode)
          )}
          style={{
            animationDelay: `${Math.min(index * 50, 500)}ms`,
          }}
        >
          <ItemCard
            item={item}
            onItemClick={() => itemActions.onItemClick?.(item)}
            onSave={() => itemActions.onSaveItem?.(item.id)}
            isSaved={selectedItems.has(item.id)}
            className={clsx(
              "h-full transition-all duration-300",
              viewMode === "list" && "flex flex-row h-32",
              selectedItems.has(item.id) &&
                "ring-2 ring-primary/50 ring-offset-2"
            )}
          />
        </div>
      )
    );
    MemoizedCard.displayName = "AnimatedItemCard";
    return MemoizedCard;
  }, [viewMode, selectedItems, itemActions]);
  return (
    <div className={clsx(getGridClasses(viewMode), "min-h-[400px]")}>
      {items.map((item, index) => (
        <AnimatedItemCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};
const useScrollState = (
  items: Item[],
  itemsPerLoad: number,
  viewMode: "grid" | "list" | "masonry"
) => {
  const [state, setState] = useState<ScrollState>({
    displayedItems: [],
    loadedCount: itemsPerLoad,
    isLoadingMore: false,
    currentViewMode: viewMode,
  });
  const updateDisplayedItems = useCallback(() => {
    const itemsToShow = items.slice(0, state.loadedCount);
    setState((prev) => ({ ...prev, displayedItems: itemsToShow }));
  }, [items, state.loadedCount]);
  const resetPagination = useCallback(() => {
    setState((prev) => ({
      ...prev,
      loadedCount: itemsPerLoad,
      isLoadingMore: false,
    }));
  }, [itemsPerLoad]);
  const updateViewMode = useCallback(
    (newViewMode: "grid" | "list" | "masonry") => {
      setState((prev) => ({ ...prev, currentViewMode: newViewMode }));
    },
    []
  );
  const loadMore = useCallback(
    (newItemsPerLoad: number) => {
      setState((prev) => ({
        ...prev,
        isLoadingMore: true,
        loadedCount: Math.min(prev.loadedCount + newItemsPerLoad, items.length),
      }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, isLoadingMore: false }));
      }, 300);
    },
    [items.length]
  );
  useEffect(() => {
    updateDisplayedItems();
  }, [updateDisplayedItems]);
  useEffect(() => {
    resetPagination();
  }, [items, resetPagination]);
  useEffect(() => {
    updateViewMode(viewMode);
  }, [viewMode, updateViewMode]);
  return { state, loadMore };
};
const useInfiniteScroll = (
  callback: () => void,
  canLoadMore: boolean,
  isLoading: boolean,
  showLoadMoreButton: boolean
) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || showLoadMoreButton) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && canLoadMore && !isLoading) {
          callback();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [callback, canLoadMore, isLoading, showLoadMoreButton]);
  return { loadMoreRef };
};
export const ItemsInfiniteScroll: React.FC<ItemsInfiniteScrollProps> = ({
  className = "",
  itemsPerLoad = 24,
  items,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  selectedItems = new Set(),
  viewMode = "grid",
  emptyStateMessage = "No items found",
  error = null,
  onRetry,
  showLoadMoreButton = false,
  showHeader = false,
  headerTitle = "Browse Items",
  headerSubtitle = "Discover amazing items from your community and find your next treasure",
  ...itemActions
}) => {
  const { state, loadMore } = useScrollState(items, itemsPerLoad, viewMode);
  const handleLoadMore = useCallback(() => {
    if (state.loadedCount < items.length) {
      loadMore(itemsPerLoad);
    } else if (hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [
    state.loadedCount,
    items.length,
    loadMore,
    itemsPerLoad,
    hasMore,
    onLoadMore,
  ]);
  const { loadMoreRef } = useInfiniteScroll(
    handleLoadMore,
    state.loadedCount < items.length || hasMore,
    state.isLoadingMore || isLoading,
    showLoadMoreButton
  );
  const canLoadMore = state.loadedCount < items.length || hasMore;
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }
  if (!isLoading && items.length === 0) {
    return <EmptyState message={emptyStateMessage} hasItems={false} />;
  }
  return (
    <div className={clsx("space-y-8", className)}>
      {showHeader && (
        <ItemsHeader title={headerTitle} subtitle={headerSubtitle} />
      )}
      {!isLoading && state.displayedItems.length > 0 && (
        <ResultsSummary
          displayedCount={state.displayedItems.length}
          totalCount={items.length}
        />
      )}
      {isLoading && state.displayedItems.length === 0 && (
        <LoadingSkeleton
          itemsPerLoad={itemsPerLoad}
          viewMode={state.currentViewMode}
        />
      )}
      {state.displayedItems.length > 0 && (
        <ItemsGrid
          items={state.displayedItems}
          viewMode={state.currentViewMode}
          selectedItems={selectedItems}
          itemActions={itemActions}
        />
      )}
      {showLoadMoreButton && (
        <div ref={loadMoreRef}>
          <LoadMoreIndicator isLoading={state.isLoadingMore} />
        </div>
      )}
      {showLoadMoreButton && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={state.isLoadingMore}
          canLoadMore={canLoadMore && showLoadMoreButton}
        />
      )}
    </div>
  );
};
ItemsInfiniteScroll.displayName = "ItemsInfiniteScroll";
export default ItemsInfiniteScroll;

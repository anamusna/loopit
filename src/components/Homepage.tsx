"use client";
import { useHomepage } from "@/hooks/useHomepage";
import { Item } from "@/shared/types";
import LoadingSpinner from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Container from "@/tailwind/components/layout/Container";
import clsx from "clsx";
import React from "react";
import ItemCard from "./item/ItemCard";
import SearchAndFilters from "./SearchAndFilters";
export interface HomepageProps {
  className?: string;
}
const EmptyState: React.FC<{
  hasFilters: boolean;
  onClearFilters: () => void;
}> = ({ hasFilters, onClearFilters }) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="text-6xl mb-6 opacity-30">🔍</div>
      <Typography
        as={TypographyVariant.H2}
        className="text-2xl font-bold mb-4 text-text-primary"
      >
        {hasFilters ? "No items match your search" : "No items available"}
      </Typography>
      <Typography
        as={TypographyVariant.P}
        className="text-text-muted mb-6 leading-relaxed"
      >
        {hasFilters
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "Be the first to list an item in your community!"}
      </Typography>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
        >
          Clear all filters
        </button>
      )}
    </div>
  </div>
);
const ItemGrid: React.FC<{
  items: Item[];
  isLoading: boolean;
  onItemClick: (item: Item) => void;
  onSaveItem: (item: Item) => void;
  onUnsaveItem: (item: Item) => void;
  isItemSaved: (itemId: string) => boolean;
  className?: string;
}> = ({
  items,
  isLoading,
  onItemClick,
  onSaveItem,
  onUnsaveItem,
  isItemSaved,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-card rounded-xl border border-border p-4"
          >
            <div className="aspect-video bg-secondary/30 rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-secondary/30 rounded w-3/4" />
              <div className="h-3 bg-secondary/30 rounded w-1/2" />
              <div className="h-3 bg-secondary/30 rounded w-full" />
              <div className="h-3 bg-secondary/30 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ItemCard
            item={item}
            onItemClick={onItemClick}
            onSave={onSaveItem}
            onUnsave={onUnsaveItem}
            isSaved={isItemSaved(item.id)}
          />
        </div>
      ))}
    </div>
  );
};
const ResultsHeader: React.FC<{
  resultsText: string;
  totalItems: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}> = ({
  resultsText,
  totalItems,
  filteredCount,
  hasActiveFilters,
  onRefresh,
  isLoading,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <Typography
        as={TypographyVariant.H2}
        className="text-xl sm:text-2xl font-bold text-text-primary mb-1"
      >
        {resultsText}
      </Typography>
      {hasActiveFilters && totalItems !== filteredCount && (
        <Typography
          as={TypographyVariant.SMALL}
          className="text-text-muted text-sm"
        >
          Filtered from {totalItems} total items
        </Typography>
      )}
    </div>
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className={clsx(
        "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        "border border-border hover:border-primary/50 hover:bg-primary/5",
        "text-text-secondary hover:text-primary",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={clsx(
          "w-4 h-4 mr-2 transition-transform duration-500",
          isLoading && "animate-spin"
        )}
      >
        🔄
      </div>
      Refresh
    </button>
  </div>
);
const Homepage: React.FC<HomepageProps> = ({ className = "" }) => {
  const {
    filteredItems,
    searchQuery,
    filters,
    isLoading,
    error,
    totalItems,
    hasActiveFilters,
    resultsText,
    setSearchQuery,
    clearSearch,
    setFilters,
    clearAllFilters,
    handleItemClick,
    handleSaveItem,
    handleUnsaveItem,
    isItemSaved,
    refreshItems,
  } = useHomepage({
    enableUrlSync: true,
  });
  const handleSearchAndFilters = (query: string, filters: any) => {
    setSearchQuery(query);
    setFilters(filters);
  };
  const handleClear = () => {
    clearSearch();
    clearAllFilters();
  };
  return (
    <Container className={clsx("py-6 sm:py-8 lg:py-12", className)}>
      <div className="space-y-8">
        <div className="text-center">
          <Typography
            as={TypographyVariant.H1}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
          >
            Discover Local Items
          </Typography>
          <Typography
            as={TypographyVariant.P}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Find amazing items from your community and give them a new life
          </Typography>
        </div>
        <div className="max-w-4xl mx-auto">
          <SearchAndFilters
            initialQuery={searchQuery}
            initialFilters={filters}
            onSearch={handleSearchAndFilters}
            onFiltersChange={setFilters}
            onClear={handleClear}
            placeholder="Search for items, categories, or locations..."
            isLoading={isLoading}
            showPresets={true}
            showSuggestions={true}
            compact={false}
          />
        </div>
        {error && (
          <Alert
            variant={AlertVariant.ERROR}
            message={error}
            className="max-w-2xl mx-auto"
          />
        )}
        {!error && (
          <>
            <ResultsHeader
              resultsText={resultsText}
              totalItems={totalItems}
              filteredCount={filteredItems.length}
              hasActiveFilters={hasActiveFilters}
              onRefresh={refreshItems}
              isLoading={isLoading}
            />
            {filteredItems.length === 0 && !isLoading ? (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />
            ) : (
              <ItemGrid
                items={filteredItems}
                isLoading={isLoading}
                onItemClick={handleItemClick}
                onSaveItem={handleSaveItem}
                onUnsaveItem={handleUnsaveItem}
                isItemSaved={isItemSaved}
              />
            )}
            {isLoading && filteredItems.length === 0 && (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};
export default Homepage;

"use client";
import { Item } from "@/shared/types";
import clsx from "clsx";
import React from "react";
import ListItem from "../item/ListItem";
import ProductCard from "../item/ProductCard";
export interface ItemsGridProps {
  items: Item[];
  isLoading: boolean;
  onItemClick: (item: Item) => void;
  onSaveItem: (item: Item) => void;
  onUnsaveItem: (item: Item) => void;
  isItemSaved: (itemId: string) => boolean;
  viewMode: "grid" | "list";
  className?: string;
}
const ItemsGrid: React.FC<ItemsGridProps> = React.memo(
  ({
    items,
    isLoading,
    onItemClick,
    onSaveItem,
    onUnsaveItem,
    isItemSaved,
    viewMode,
    className = "",
  }) => {
    if (viewMode === "list") {
      return (
        <div className={clsx("space-y-4", className)}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              onSaveItem={onSaveItem}
              onUnsaveItem={onUnsaveItem}
              isSaved={isItemSaved(item.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      );
    }
    return (
      <div
        className={clsx(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
          className
        )}
      >
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            onSaveItem={onSaveItem}
            onUnsaveItem={onUnsaveItem}
            isSaved={isItemSaved(item.id)}
            isLoading={isLoading}
          />
        ))}
      </div>
    );
  }
);
ItemsGrid.displayName = "ItemsGrid";
export default ItemsGrid;

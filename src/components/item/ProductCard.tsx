"use client";
import { Item } from "@/shared/types";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
export interface ProductCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
  onSaveItem: (item: Item) => void;
  onUnsaveItem: (item: Item) => void;
  isSaved: boolean;
  isLoading?: boolean;
  className?: string;
}
const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({
    item,
    onItemClick,
    onSaveItem,
    onUnsaveItem,
    isSaved,
    isLoading = false,
    className = "",
  }) => {
    const handleSaveToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSaved) {
        onUnsaveItem(item);
      } else {
        onSaveItem(item);
      }
    };
    return (
      <div
        className={clsx(
          "bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer",
          "hover:border-primary/30 hover:-translate-y-1",
          isLoading && "opacity-50 pointer-events-none animate-pulse",
          className
        )}
        onClick={() => onItemClick(item)}
      >
        {}
        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-secondary/20">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30 text-text-muted">
              <div className="text-3xl mb-2 opacity-50">📷</div>
              <Typography
                as={TypographyVariant.P}
                className="text-sm font-medium"
              >
                No Image
              </Typography>
            </div>
          )}
          {}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          {}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleSaveToggle}
              disabled={isLoading}
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                "bg-white/95 backdrop-blur-sm border-2 hover:scale-105",
                isSaved
                  ? "border-red-500 text-red-500 hover:bg-red-50"
                  : "border-gray-300 text-gray-600 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-300"
              )}
              aria-label={isSaved ? "Remove from saved" : "Save item"}
            >
              <FontAwesomeIcon
                icon={isSaved ? faHeart : faHeartRegular}
                className="w-5 h-5 transition-transform duration-200 hover:scale-110"
              />
            </button>
          </div>
          {}
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant={
                item.status === "swapped"
                  ? BadgeVariant.SUCCESS
                  : item.status === "requested"
                  ? BadgeVariant.WARNING
                  : BadgeVariant.INFO
              }
              className="shadow-lg backdrop-blur-sm bg-opacity-90 text-xs font-semibold px-2 py-1"
            >
              {item.status === "swapped" && "Swapped"}
              {item.status === "requested" && "requested"}
              {item.status === "available" &&
                `${
                  item.condition.charAt(0).toUpperCase() +
                  item.condition.slice(1).replace("_", " ")
                }`}
            </Badge>
          </div>
        </div>
        {}
        <div className="p-4 space-y-3">
          {}
          <Typography
            as={TypographyVariant.H4}
            className="font-bold text-text-primary text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200"
          >
            {item.title}
          </Typography>
          {}
          <div className="flex items-center gap-2">
            <Typography
              as={TypographyVariant.SMALL}
              className="text-text-muted text-sm font-medium"
            >
              {item.location}
            </Typography>
          </div>
          {}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center border border-border/50">
              <Typography
                as={TypographyVariant.P}
                className="text-primary font-bold text-xs"
              >
                {item.ownerName?.charAt(0).toUpperCase() || "U"}
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.SMALL}
              className="text-text-secondary text-xs"
            >
              {item.ownerName}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
);
ProductCard.displayName = "ProductCard";
export default ProductCard;

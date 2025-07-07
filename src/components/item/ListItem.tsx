"use client";
import { Item } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
export interface ListItemProps {
  item: Item;
  onItemClick: (item: Item) => void;
  onSaveItem: (item: Item) => void;
  onUnsaveItem: (item: Item) => void;
  isSaved: boolean;
  isLoading?: boolean;
  className?: string;
}
const ListItem: React.FC<ListItemProps> = React.memo(
  ({
    item,
    onItemClick,
    onSaveItem,
    onUnsaveItem,
    isSaved,
    isLoading = false,
    className = "",
  }) => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    };
    const handleSaveToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSaved) {
        onUnsaveItem(item);
      } else {
        onSaveItem(item);
      }
    };
    const handleViewClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onItemClick(item);
    };
    return (
      <div
        className={clsx(
          "bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 group cursor-pointer overflow-hidden",
          className
        )}
      >
        <div className="flex gap-4 p-4" onClick={() => onItemClick(item)}>
          {}
          <div className="relative w-32 h-32 sm:w-40 sm:h-32 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                <div className="text-2xl mb-1 opacity-50">📷</div>
                <span className="text-xs font-medium">No Image</span>
              </div>
            )}
            {}
            <div className="absolute top-2 left-2">
              <span
                className={clsx(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  item.condition === "excellent"
                    ? "bg-success/20 text-success"
                    : item.condition === "good"
                    ? "bg-info/20 text-info"
                    : item.condition === "fair"
                    ? "bg-warning/20 text-warning"
                    : "bg-secondary/30 text-text-muted"
                )}
              >
                {item.condition.replace("_", " ")}
              </span>
            </div>
          </div>
          {}
          <div className="flex-1 min-w-0 space-y-3">
            {}
            <div>
              <h3 className="font-bold text-text-primary text-lg group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-text-muted">{item.location}</span>
                <span className="text-text-muted">•</span>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                  {item.category}
                </span>
              </div>
            </div>
            {}
            <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
            {}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">
                    {item.ownerName?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-text-primary">
                    {item.ownerName}
                  </span>
                  <p className="text-xs text-text-muted">
                    Listed {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-text-muted">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="w-3 h-3 text-info/70"
                  />
                  <span className="text-xs">{item.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-destructive">♥</span>
                  <span className="text-xs">{item.saves}</span>
                </div>
              </div>
            </div>
            {}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-secondary/30 text-text-muted px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {item.tags.length > 4 && (
                  <span className="text-xs text-text-muted px-2 py-1">
                    +{item.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
          {}
          <div className="flex flex-col items-end gap-2 justify-between py-1">
            {}
            <Button
              variant={
                isSaved ? ButtonVariant.DESTRUCTIVE : ButtonVariant.GHOST
              }
              size={ButtonSize.SM}
              isIconOnly
              icon={isSaved ? faHeart : faHeartRegular}
              onClick={handleSaveToggle}
              isDisabled={isLoading}
              className={clsx(
                "w-10 h-10 rounded-full border border-border",
                isSaved
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-card text-text-muted hover:bg-primary/10 hover:text-primary"
              )}
              aria-label={isSaved ? "Remove from saved" : "Save item"}
            />
            {}
            <Button
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.SM}
              onClick={handleViewClick}
              isDisabled={isLoading}
              className="min-w-[100px] rounded-full"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
ListItem.displayName = "ListItem";
export default ListItem;

"use client";
import { Item, ItemStatus } from "@/shared/types";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faEdit,
  faMapMarkerAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useMemo } from "react";
export interface MyItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onItemClick?: (item: Item) => void;
  isLoading?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
}
const MyItemCard: React.FC<MyItemCardProps> = React.memo(
  ({
    item,
    onEdit,
    onDelete,
    onItemClick,
    isLoading = false,
    className = "",
    viewMode = "grid",
  }) => {
    const statusConfig = useMemo(
      () => ({
        [ItemStatus.AVAILABLE]: {
          variant: BadgeVariant.SUCCESS,
          label: "Available",
        },
        [ItemStatus.SWAPPED]: {
          variant: BadgeVariant.PRIMARY,
          label: "Swapped",
        },
        [ItemStatus.REQUESTED]: {
          variant: BadgeVariant.WARNING,
          label: "Requested",
        },
        [ItemStatus.PENDING]: {
          variant: BadgeVariant.INFO,
          label: "Pending",
        },
        [ItemStatus.REPORTED]: {
          variant: BadgeVariant.DESTRUCTIVE,
          label: "Reported",
        },
        [ItemStatus.REJECTED]: {
          variant: BadgeVariant.DESTRUCTIVE,
          label: "Rejected",
        },
        [ItemStatus.REMOVED]: {
          variant: BadgeVariant.DESTRUCTIVE,
          label: "Removed",
        },
      }),
      []
    );
    const currentStatus = statusConfig[
      item.status as keyof typeof statusConfig
    ] || {
      variant: BadgeVariant.SECONDARY,
      label: item.status,
    };
    const canModify = useMemo(
      () => item.status !== ItemStatus.SWAPPED,
      [item.status]
    );
    const handleItemClick = useCallback(() => {
      if (onItemClick) {
        onItemClick(item);
      }
      window.location.href = `/item/${item.id}`;
    }, [item, onItemClick]);
    const handleEdit = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(item);
      },
      [item, onEdit]
    );
    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(item);
      },
      [item, onDelete]
    );
    return (
      <div
        className={clsx(
          "group relative flex flex-col rounded-2xl overflow-hidden shadow-lg bg-card border border-border/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",
          onItemClick && "cursor-pointer",
          isLoading && "opacity-50 pointer-events-none animate-pulse",
          className
        )}
        onClick={handleItemClick}
      >
        <div className="relative flex-1 min-h-[220px] max-h-[260px] bg-secondary/20 flex items-center justify-center">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              style={{ aspectRatio: "4/3" }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-text-muted rounded-t-2xl">
              <div className="text-4xl mb-2 opacity-50">📷</div>
              <Typography
                as={TypographyVariant.P}
                className="text-base font-medium"
              >
                No Image
              </Typography>
            </div>
          )}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant={currentStatus.variant}
              className="shadow-md bg-opacity-90 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {currentStatus.label}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              disabled={!canModify || isLoading}
              className="bg-background/80 hover:bg-primary/10 border border-border/40 rounded-full p-2 shadow-md transition-colors"
              aria-label="Edit item"
            >
              <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={handleDelete}
              disabled={!canModify || isLoading}
              className="bg-background/80 hover:bg-destructive/10 border border-border/40 rounded-full p-2 shadow-md transition-colors"
              aria-label="Delete item"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="w-4 h-4 text-destructive"
              />
            </button>
          </div>
        </div>
        {}
        <div className="flex flex-col justify-between flex-shrink-0 p-4 bg-card rounded-b-2xl min-h-[80px]">
          <Typography
            as={TypographyVariant.H3}
            className="font-bold text-text-primary text-lg leading-tight mb-1 truncate"
          >
            {item.title}
          </Typography>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="w-3 h-3 text-primary/60"
            />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      </div>
    );
  }
);
MyItemCard.displayName = "MyItemCard";
export default MyItemCard;

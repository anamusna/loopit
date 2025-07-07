"use client";
import { CarbonBadge } from "@/components/environmental";
import { CATEGORY_ICONS, CONDITION_ICONS } from "@/constants/searchFilters";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faBookmark,
  faHeart,
  faMapMarkerAlt,
  faShare,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useMemo } from "react";
export interface ItemComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (item: Item) => void;
  onSaveItem?: (itemId: string) => void;
  onShareItem?: (item: Item) => void;
  maxItems?: number;
}
const ItemComparisonModal: React.FC<ItemComparisonModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onItemClick,
  onSaveItem,
  onShareItem,
  maxItems = 4,
}) => {
  const { user } = useLoopItStore();
  const { isItemSaved } = useItems();
  const handleRemoveItem = useCallback(
    (itemId: string) => {
      onRemoveItem?.(itemId);
    },
    [onRemoveItem]
  );
  const handleItemClick = useCallback(
    (item: Item) => {
      onItemClick?.(item);
    },
    [onItemClick]
  );
  const handleSaveItem = useCallback(
    (itemId: string) => {
      onSaveItem?.(itemId);
    },
    [onSaveItem]
  );
  const handleShareItem = useCallback(
    (item: Item) => {
      onShareItem?.(item);
    },
    [onShareItem]
  );
  const comparisonData = useMemo(() => {
    if (items.length === 0) return [];
    const data = [
      {
        label: "Category",
        items: items.map((item) => ({
          value: item.category,
          icon: CATEGORY_ICONS[item.category],
        })),
      },
      {
        label: "Condition",
        items: items.map((item) => ({
          value: item.condition,
          icon: CONDITION_ICONS[item.condition].icon,
          color: CONDITION_ICONS[item.condition].color,
        })),
      },
      {
        label: "Location",
        items: items.map((item) => ({
          value: item.location,
          icon: "📍",
        })),
      },
      {
        label: "Listed",
        items: items.map((item) => ({
          value: new Date(item.createdAt).toLocaleDateString(),
          icon: "📅",
        })),
      },
      {
        label: "Views",
        items: items.map((item) => ({
          value: item.views.toString(),
          icon: "👁️",
        })),
      },
      {
        label: "Requests",
        items: items.map((item) => ({
          value: item.swapRequests.toString(),
          icon: "🤝",
        })),
      },
    ];
    return data;
  }, [items]);
  if (items.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={ModalSize.MD}
        title="Compare Items"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon
              icon={faTimes}
              className="w-8 h-8 text-text-muted"
            />
          </div>
          <Typography
            as={TypographyVariant.H3}
            className="text-lg font-semibold text-text-primary mb-2"
          >
            No Items to Compare
          </Typography>
          <Typography as={TypographyVariant.P} className="text-text-muted">
            Select at least 2 items to start comparing them side by side.
          </Typography>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={ModalSize.FULL}
      title={`Compare Items (${items.length}/${maxItems})`}
      className="max-w-7xl mx-auto"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Typography
              as={TypographyVariant.H3}
              className="text-xl font-semibold text-text-primary"
            >
              Item Comparison
            </Typography>
            <Badge variant={BadgeVariant.PRIMARY} className="text-sm">
              {items.length} items
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        <div
          className={clsx(
            "grid gap-4",
            items.length === 2 && "grid-cols-1 md:grid-cols-2",
            items.length === 3 && "grid-cols-1 md:grid-cols-3",
            items.length === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative aspect-video bg-secondary/20 overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <span className="text-3xl">📷</span>
                  </div>
                )}

                <div className="absolute top-2 left-2">
                  <CarbonBadge item={item} size="sm" showTooltip={false} />
                </div>

                {onRemoveItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  </button>
                )}

                <div className="absolute bottom-2 left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <Typography
                  as={TypographyVariant.H4}
                  className="font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-200"
                >
                  {item.title}
                </Typography>

                <div className="flex items-center gap-2">
                  <Badge variant={BadgeVariant.SECONDARY} className="text-xs">
                    {CATEGORY_ICONS[item.category]} {item.category}
                  </Badge>
                  <Badge
                    variant={BadgeVariant.SECONDARY}
                    className={clsx(
                      "text-xs",
                      CONDITION_ICONS[item.condition].color
                    )}
                  >
                    {CONDITION_ICONS[item.condition].icon} {item.condition}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                  <span className="truncate">{item.ownerName}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                  <Button
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.SM}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveItem(item.id);
                    }}
                    className={clsx(
                      "flex-1 text-xs",
                      isItemSaved(item.id)
                        ? "text-primary hover:text-primary/80"
                        : "text-text-muted hover:text-primary"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={isItemSaved(item.id) ? faHeart : faBookmark}
                      className="w-3 h-3 mr-1"
                    />
                    {isItemSaved(item.id) ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.SM}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareItem(item);
                    }}
                    className="text-xs text-text-muted hover:text-primary"
                  >
                    <FontAwesomeIcon icon={faShare} className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-secondary/20 px-6 py-4 border-b border-border">
              <Typography
                as={TypographyVariant.H4}
                className="font-semibold text-text-primary"
              >
                Detailed Comparison
              </Typography>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {comparisonData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={clsx(
                        "border-b border-border/30",
                        rowIndex % 2 === 0 && "bg-background/50"
                      )}
                    >
                      <td className="px-6 py-4 font-medium text-text-primary min-w-[120px]">
                        {row.label}
                      </td>
                      {row.items.map((item, itemIndex) => (
                        <td
                          key={itemIndex}
                          className="px-6 py-4 text-center border-l border-border/30"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <span
                              className={clsx(
                                "text-sm font-medium",
                                (item as any).color || "text-text-primary"
                              )}
                            >
                              {item.value}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Typography as={TypographyVariant.SMALL} className="text-text-muted">
            Click on any item to view full details
          </Typography>
          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={onClose}
            >
              Close Comparison
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ItemComparisonModal;

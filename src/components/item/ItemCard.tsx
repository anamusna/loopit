"use client";
import { useSwapRequest } from "@/hooks/useSwapRequest";
import { Item, ItemStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Image from "@/tailwind/components/elements/Image";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card, { CardBody } from "@/tailwind/components/layout/Card";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRight,
  faCalendarAlt,
  faCheck,
  faExclamationCircle,
  faEye,
  faHeart,
  faLock,
  faMapMarkerAlt,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import SwapRequestModal from "./SwapRequestModal";
interface ItemCardProps {
  item: Item;
  onSave?: (item: Item) => void;
  onUnsave?: (item: Item) => void;
  onItemClick?: (item: Item) => void;
  isSaved?: boolean;
  isLoading?: boolean;
  className?: string;
}
interface StatusConfig {
  badge: {
    variant: BadgeVariant;
    text: string;
    icon: any;
  };
  button: {
    text: string;
    icon: any;
    variant: ButtonVariant;
    disabled: boolean;
  };
}
const formatDate = (date: Date) => {
  const now = new Date();
  const diffTime = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
};
const getStatusConfig = (
  item: Item,
  isOwnItem: boolean,
  isAuthenticated: boolean
): StatusConfig => {
  switch (item.status) {
    case ItemStatus.SWAPPED:
      return {
        badge: {
          variant: BadgeVariant.SUCCESS,
          text: "Swapped",
          icon: faCheck,
        },
        button: {
          text: "Swapped",
          icon: faCheck,
          variant: ButtonVariant.OUTLINE,
          disabled: true,
        },
      };
    case ItemStatus.REQUESTED:
      return {
        badge: {
          variant: BadgeVariant.WARNING,
          text: "Requested",
          icon: faExclamationCircle,
        },
        button: {
          text: "Requested",
          icon: faLock,
          variant: ButtonVariant.OUTLINE,
          disabled: true,
        },
      };
    default:
      if (isOwnItem) {
        return {
          badge: {
            variant: BadgeVariant.INFO,
            text: "Your Item",
            icon: faUser,
          },
          button: {
            text: "Your Item",
            icon: faCheck,
            variant: ButtonVariant.OUTLINE,
            disabled: true,
          },
        };
      }
      return {
        badge: {
          variant: BadgeVariant.INFO,
          text: "Available",
          icon: faStar,
        },
        button: isAuthenticated
          ? {
              text: "Request Swap",
              icon: faArrowRight,
              variant: ButtonVariant.PRIMARY,
              disabled: false,
            }
          : {
              text: "Login to Request",
              icon: faLock,
              variant: ButtonVariant.PRIMARY,
              disabled: false,
            },
      };
  }
};
const ItemImage: React.FC<{
  item: Item;
  statusConfig: StatusConfig;
  onSave: (e: React.MouseEvent) => void;
  isSaved: boolean;
  isLoading: boolean;
}> = ({ item, statusConfig, onSave, isSaved, isLoading }) => {
  const [heartAnim, setHeartAnim] = useState(false);
  return (
    <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden group/itemcard">
      {item.images && item.images.length > 0 ? (
        <img
          src={item.images[0]}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/itemcard:scale-110 group-hover/itemcard:brightness-110"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center opacity-40">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              No Image
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover/itemcard:opacity-60 transition-opacity duration-500" />
      <div className="absolute top-2 left-2 z-20">
        <div className="flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg px-2 py-1 shadow-lg border border-white/20">
          <FontAwesomeIcon
            icon={statusConfig.badge.icon}
            className={clsx(
              "w-2.5 h-2.5",
              statusConfig.badge.variant === BadgeVariant.SUCCESS &&
                "text-emerald-500",
              statusConfig.badge.variant === BadgeVariant.WARNING &&
                "text-amber-500",
              statusConfig.badge.variant === BadgeVariant.INFO &&
                "text-blue-500"
            )}
          />
          <span
            className={clsx(
              "text-xs font-semibold",
              statusConfig.badge.variant === BadgeVariant.SUCCESS &&
                "text-emerald-700 dark:text-emerald-400",
              statusConfig.badge.variant === BadgeVariant.WARNING &&
                "text-amber-700 dark:text-amber-400",
              statusConfig.badge.variant === BadgeVariant.INFO &&
                "text-blue-700 dark:text-blue-400"
            )}
          >
            {statusConfig.badge.text}
          </span>
        </div>
      </div>
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={(e) => {
            setHeartAnim(true);
            onSave(e);
            setTimeout(() => setHeartAnim(false), 500);
          }}
          disabled={isLoading}
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md border",
            "hover:scale-110 active:scale-95 group/save",
            isSaved
              ? "bg-red-500/90 border-red-400/50 text-white hover:bg-red-600/90"
              : "bg-white/90 dark:bg-gray-900/90 border-white/20 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50/90 dark:hover:bg-red-900/20"
          )}
          aria-label={isSaved ? "Remove from saved" : "Save item"}
          title={isSaved ? "Remove from saved" : "Save item"}
        >
          <FontAwesomeIcon
            icon={isSaved ? faHeart : faHeartRegular}
            className={clsx(
              "w-3.5 h-3.5 transition-transform duration-200 group-hover/save:scale-110",
              heartAnim && "animate-ping-fast text-red-400"
            )}
          />
        </button>
      </div>
      <div className="absolute bottom-2 left-2 z-20">
        <div className="bg-gradient-to-r from-primary/90 to-accent/90 rounded-lg px-2 py-1 shadow-lg">
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
const ItemContent: React.FC<{
  item: Item;
  statusConfig: StatusConfig;
  onSwapRequest: (e: React.MouseEvent) => void;
  isLoading: boolean;
}> = ({ item, statusConfig, onSwapRequest, isLoading }) => (
  <CardBody className="p-3 sm:p-4 space-y-3">
    <div className="space-y-1.5">
      <Typography
        as={TypographyVariant.H3}
        className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300"
      >
        {item.title}
      </Typography>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
          <span className="font-medium truncate max-w-32 sm:max-w-none">
            {item.location}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
          <span className="font-medium">{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </div>
    <Typography
      as={TypographyVariant.P}
      className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed"
    >
      {item.description}
    </Typography>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {item.ownerAvatar ? (
          <Image
            src={item.ownerAvatar}
            alt={item.ownerName}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-gray-200/60 dark:border-gray-700/60"
          />
        ) : (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center border border-gray-200/60 dark:border-gray-700/60">
            <span className="text-primary font-bold text-xs">
              {item.ownerName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate max-w-20 sm:max-w-none">
          {item.ownerName}
        </span>
      </div>
      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-500">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
          <span className="text-xs font-medium">{item.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faHeart} className="w-3 h-3" />
          <span className="text-xs font-medium">{item.saves}</span>
        </div>
      </div>
    </div>
    {item.tags && item.tags.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {item.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium"
          >
            #{tag}
          </span>
        ))}
        {item.tags.length > 2 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 text-xs">
            +{item.tags.length - 2}
          </span>
        )}
      </div>
    )}
    <Button
      variant={statusConfig.button.variant}
      size={ButtonSize.MD}
      onClick={onSwapRequest}
      disabled={isLoading || statusConfig.button.disabled}
      className={clsx(
        "w-full font-semibold transition-all duration-300 group/button",
        "hover:scale-[1.02] active:scale-[0.98]",
        statusConfig.button.variant === ButtonVariant.PRIMARY &&
          "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
      )}
    >
      <FontAwesomeIcon
        icon={statusConfig.button.icon}
        className="w-3.5 h-3.5 mr-2 transition-transform duration-200 group-hover/button:scale-110"
      />
      <span className="text-sm">{statusConfig.button.text}</span>
    </Button>
  </CardBody>
);
const ItemCard: React.FC<ItemCardProps> = React.memo(
  ({
    item,
    onSave,
    onUnsave,
    onItemClick,
    isSaved: isSavedProp = false,
    isLoading = false,
    className = "",
  }) => {
    const { user, isAuthenticated, savedItems, saveItem, unsaveItem } =
      useLoopItStore();
    const {
      isModalOpen,
      selectedItem,
      isSubmitting,
      error,
      openSwapRequestModal,
      closeSwapRequestModal,
      submitSwapRequest,
    } = useSwapRequest();
    const [saving, setSaving] = useState(false);
    const isOwnItem = useMemo(
      () => (user ? item.ownerId === user.id : false),
      [user, item.ownerId]
    );
    const isSaved = useMemo(
      () => savedItems.some((i) => i.id === item.id),
      [savedItems, item.id]
    );
    const statusConfig = useMemo(
      () => getStatusConfig(item, isOwnItem, isAuthenticated),
      [item, isOwnItem, isAuthenticated]
    );
    const handleSaveToggle = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        setSaving(true);
        if (isSaved) {
          await unsaveItem(item.id);
        } else {
          await saveItem(item.id);
        }
        setSaving(false);
      },
      [isSaved, saveItem, unsaveItem, item.id]
    );
    const handleSwapRequest = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        openSwapRequestModal(item);
      },
      [openSwapRequestModal, item]
    );
    const handleItemClick = useCallback(() => {
      onItemClick?.(item);
    }, [onItemClick, item]);
    return (
      <>
        <Card
          className={clsx(
            "group relative overflow-hidden transition-all duration-500 cursor-pointer border border-gray-200/60 dark:border-gray-700/60",
            "bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm",
            "animate-elegant-fade-up opacity-0",
            "hover:scale-[1.025] hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 hover:border-primary/40",
            "hover:ring-2 hover:ring-primary/20 hover:ring-offset-2",
            isLoading && "opacity-50 pointer-events-none animate-pulse",
            className
          )}
          onClick={handleItemClick}
        >
          <ItemImage
            item={item}
            statusConfig={statusConfig}
            onSave={handleSaveToggle}
            isSaved={isSaved}
            isLoading={isLoading || saving}
          />
          <ItemContent
            item={item}
            statusConfig={statusConfig}
            onSwapRequest={handleSwapRequest}
            isLoading={isLoading}
          />

          <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 group-hover:shadow-[0_0_24px_0_rgba(var(--primary-rgb),0.10)] transition-all duration-500" />
        </Card>
        <SwapRequestModal
          isOpen={isModalOpen}
          onClose={closeSwapRequestModal}
          item={selectedItem}
          onSubmit={submitSwapRequest}
          isSubmitting={isSubmitting}
          error={error}
        />
      </>
    );
  }
);
ItemCard.displayName = "ItemCard";
export default ItemCard;

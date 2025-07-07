"use client";
import { CarbonBadge } from "@/components/environmental";
import { useSwapRequest } from "@/hooks/useSwapRequest";
import { Item, ItemStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import LoadingSpinner from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Container from "@/tailwind/components/layout/Container";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faCalendar,
  faChevronDown,
  faChevronUp,
  faExchangeAlt,
  faHeart,
  faMapMarkerAlt,
  faPlus,
  faShare,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useId, useState } from "react";
import ItemCard from "./ItemCard";
import { ItemManagementModal } from "./ItemManagementModal";
import { SwapRequestModal } from "./SwapRequestModal";
export interface ItemDetailProps {
  itemId: string;
  className?: string;
}
const ImageModal: React.FC<{
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ src, alt, isOpen, onClose }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={onClose}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg focus:outline-none"
          aria-label="Close full image view"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-full rounded-xl shadow-2xl object-contain bg-white"
        />
      </div>
    </div>
  );
};
const ImageGallery: React.FC<{
  images: string[];
  title: string;
}> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
      <div className="flex md:flex-col gap-2 md:gap-3 md:mr-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto max-h-[420px] md:max-h-[520px]">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={clsx(
              "w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all duration-300 animate-refined-fade focus:outline-none",
              selectedImage === idx
                ? "border-primary ring-2 ring-primary"
                : "border-gray-200/60 dark:border-gray-700/60 hover:border-primary/60 hover:shadow-light"
            )}
            aria-label={`Show image ${idx + 1}`}
            tabIndex={0}
          >
            <img
              src={image}
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center order-1 md:order-2">
        <button
          className="aspect-[4/5] w-full max-w-[420px] md:max-w-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 shadow-lg flex items-center justify-center group relative focus:outline-none"
          onClick={() => setModalOpen(true)}
          aria-label="View full image"
          tabIndex={0}
        >
          {images.length > 0 ? (
            <img
              src={images[selectedImage]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="text-4xl mb-2 opacity-30">📦</div>
              <Typography
                as={TypographyVariant.P}
                className="text-text-muted font-medium text-sm"
              >
                No Image Available
              </Typography>
            </div>
          )}

          {images.length > 0 && (
            <span className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1.5 shadow-md text-gray-700 group-hover:scale-110 transition-transform">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
            </span>
          )}
        </button>

        <ImageModal
          src={images[selectedImage]}
          alt={title}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};
const ItemInfoSection: React.FC<{
  item: Item;
  isOwner: boolean;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}> = ({ item, isOwner, isSaved, onSave, onUnsave }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };
  const getConditionBadge = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return (
          <Badge
            variant={BadgeVariant.SUCCESS}
            className="text-xs font-semibold"
          >
            Excellent
          </Badge>
        );
      case "good":
        return (
          <Badge
            variant={BadgeVariant.PRIMARY}
            className="text-xs font-semibold"
          >
            Good
          </Badge>
        );
      case "fair":
        return (
          <Badge
            variant={BadgeVariant.WARNING}
            className="text-xs font-semibold"
          >
            Fair
          </Badge>
        );
      case "poor":
        return (
          <Badge
            variant={BadgeVariant.DESTRUCTIVE}
            className="text-xs font-semibold"
          >
            Poor
          </Badge>
        );
      default:
        return (
          <Badge
            variant={BadgeVariant.SECONDARY}
            className="text-xs font-semibold"
          >
            {condition}
          </Badge>
        );
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Typography
            as={TypographyVariant.H1}
            className="text-lg sm:text-xl font-bold text-text-primary leading-tight mb-1"
          >
            {item.title}
          </Typography>
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <span>{item.views} views</span>
            <span>•</span>
            <span>{item.saves} saves</span>
          </div>
        </div>
        {!isOwner && (
          <button
            onClick={isSaved ? onUnsave : onSave}
            className={clsx(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-light",
              "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border hover:scale-105 animate-subtle-lift",
              isSaved
                ? "border-destructive text-destructive hover:bg-destructive-subtle"
                : "border-border text-text-muted hover:text-primary hover:bg-primary-subtle hover:border-primary"
            )}
            aria-label={isSaved ? "Remove from saved" : "Save item"}
          >
            <FontAwesomeIcon
              icon={isSaved ? faHeart : faHeartRegular}
              className="w-4 h-4 transition-transform duration-200"
            />
          </button>
        )}
      </div>

      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/40 dark:border-gray-700/40 p-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center border border-primary/20">
            <FontAwesomeIcon
              icon={faUser}
              className="w-3.5 h-3.5 text-primary"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Typography
              as={TypographyVariant.P}
              className="font-semibold text-sm text-text-primary truncate"
            >
              {item.ownerName}
            </Typography>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
              <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-warning" />
              <span>4.8</span>
              <span>(12 swaps)</span>
              <span>•</span>
              <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
              <span>Listed {formatDate(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/40 dark:border-gray-700/40 flex flex-col items-start hover:shadow-light transition-shadow duration-200">
          <span className="font-medium text-text-primary text-sm">
            {item.category}
          </span>
        </div>
        <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/40 dark:border-gray-700/40 flex flex-col items-start hover:shadow-light transition-shadow duration-200">
          {getConditionBadge(item.condition)}
        </div>
        <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/40 dark:border-gray-700/40 flex items-center gap-1 hover:shadow-light transition-shadow duration-200">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="w-3 h-3 text-primary"
          />
          <span className="font-medium text-text-primary text-sm truncate">
            {item.location}
          </span>
        </div>
        <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/40 dark:border-gray-700/40 flex flex-col items-start hover:shadow-light transition-shadow duration-200">
          <Badge
            variant={
              item.status === ItemStatus.SWAPPED
                ? BadgeVariant.SUCCESS
                : item.status === ItemStatus.REQUESTED
                ? BadgeVariant.WARNING
                : BadgeVariant.INFO
            }
            className="text-xs font-semibold"
          >
            {item.status === ItemStatus.SWAPPED && "Swapped"}
            {item.status === ItemStatus.REQUESTED && "Pending"}
            {item.status === ItemStatus.AVAILABLE && "Available"}
          </Badge>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/60 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200/40 dark:border-emerald-800/40 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🌱</span>
            <div>
              <Typography
                as={TypographyVariant.P}
                className="font-semibold text-sm text-text-primary"
              >
                Environmental Impact
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-xs text-text-muted"
              >
                Carbon savings from reuse
              </Typography>
            </div>
          </div>
          <CarbonBadge
            item={item}
            size="sm"
            showTooltip={true}
            className="shadow-sm"
          />
        </div>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag, index) => (
            <Badge
              key={index}
              variant={BadgeVariant.SECONDARY}
              className="text-xs px-2 py-0.5 font-medium hover:bg-secondary/80 transition-colors duration-200 cursor-pointer animate-refined-fade"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
const SwapActionSection: React.FC<{
  item: Item;
  isOwner: boolean;
  isAuthenticated: boolean;
  onRequestSwap: () => void;
  onAddNewItem?: () => void;
}> = ({ item, isOwner, isAuthenticated, onRequestSwap, onAddNewItem }) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "swapped":
        return <Badge variant={BadgeVariant.SUCCESS}>Swapped</Badge>;
      case "pending":
        return <Badge variant={BadgeVariant.WARNING}>Pending</Badge>;
      case "available":
        return <Badge variant={BadgeVariant.INFO}>Available</Badge>;
      default:
        return <Badge variant={BadgeVariant.SECONDARY}>{status}</Badge>;
    }
  };
  const getButtonContent = () => {
    if (isOwner) {
      return {
        text: "Your Item",
        icon: faUser,
        variant: ButtonVariant.OUTLINE,
        disabled: true,
        className: "bg-secondary/20",
      };
    }
    if (item.status === "swapped") {
      return {
        text: "Already Swapped",
        icon: faExchangeAlt,
        variant: ButtonVariant.OUTLINE,
        disabled: true,
        className: "bg-secondary/20",
      };
    }
    if (item.status === ItemStatus.REQUESTED) {
      return {
        text: "Swap in Progress",
        icon: faExchangeAlt,
        variant: ButtonVariant.OUTLINE,
        disabled: true,
        className: "bg-secondary/20",
      };
    }
    if (!isAuthenticated) {
      return {
        text: "Login to Request Swap",
        icon: faExchangeAlt,
        variant: ButtonVariant.PRIMARY,
        disabled: false,
        className:
          "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
      };
    }
    return {
      text: "Request Swap",
      icon: faExchangeAlt,
      variant: ButtonVariant.PRIMARY,
      disabled: false,
      className:
        "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
    };
  };
  const buttonContent = getButtonContent();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-text-primary">
          Swap Status
        </span>
        {getStatusBadge(item.status)}
      </div>
      <Button
        variant={buttonContent.variant}
        size={ButtonSize.LG}
        onClick={onRequestSwap}
        disabled={buttonContent.disabled}
        className={clsx(
          "w-full min-h-[44px] font-bold text-base transition-all duration-300 rounded-lg",
          buttonContent.className
        )}
      >
        <FontAwesomeIcon icon={buttonContent.icon} className="w-4 h-4 mr-2" />
        {buttonContent.text}
      </Button>
      <div className="flex gap-2">
        <Button
          variant={ButtonVariant.GHOST}
          size={ButtonSize.SM}
          className="flex-1 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 rounded-lg"
        >
          <FontAwesomeIcon icon={faShare} className="w-4 h-4 mr-2" />
          Share
        </Button>
        {onAddNewItem && (
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={onAddNewItem}
            className="flex-1 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 rounded-lg"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
};
const DeliveryInfoBox: React.FC = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-primary" />
      <span className="font-medium text-text-primary text-sm">
        30 day return policy
      </span>
    </div>
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faShare} className="w-4 h-4 text-primary" />
      <span className="text-text-primary text-sm">Free delivery & returns</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-medium text-text-primary text-sm">
        Standard delivery
      </span>
      <span className="text-success font-semibold ml-auto text-sm">free</span>
    </div>
  </div>
);
const ExpandableSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    }
  };
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/40 dark:border-gray-700/40 overflow-hidden transition-all duration-300 hover:shadow-light">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="w-full flex items-center justify-between px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-colors duration-200 group hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
        type="button"
      >
        <Typography
          as={TypographyVariant.H3}
          className="font-semibold text-sm text-left text-text-primary"
        >
          {title}
        </Typography>
        <span className="ml-2 flex items-center">
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className={
              "w-3.5 h-3.5 text-text-muted transition-transform duration-300 " +
              (isExpanded ? "rotate-180" : "rotate-0")
            }
            aria-hidden="true"
          />
        </span>
      </button>
      <div
        id={contentId}
        className={
          "transition-all duration-300 ease-in-out " +
          (isExpanded
            ? "max-h-[200px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible")
        }
        style={{
          overflow: "hidden",
        }}
        aria-hidden={!isExpanded}
      >
        <div className="px-3 pb-3 pt-1 space-y-2">{children}</div>
      </div>
    </div>
  );
};
const RelatedItems: React.FC<{
  items: Item[];
  currentItem: Item;
  onItemClick: (item: Item) => void;
  onSaveItem: (item: Item) => void;
  onUnsaveItem: (item: Item) => void;
  isItemSaved: (itemId: string) => boolean;
}> = ({
  items,
  currentItem,
  onItemClick,
  onSaveItem,
  onUnsaveItem,
  isItemSaved,
}) => {
  const getSimilarItems = () => {
    return items
      .filter(
        (item) =>
          item.id !== currentItem.id &&
          (item.category === currentItem.category ||
            item.tags.some((tag) =>
              currentItem.tags.some((currentTag) =>
                currentTag.toLowerCase().includes(tag.toLowerCase())
              )
            ))
      )
      .slice(0, 6);
  };
  const similarItems = getSimilarItems();
  if (similarItems.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      <Typography
        as={TypographyVariant.H2}
        className="text-lg font-bold text-center text-text-primary"
      >
        Similar Items You Might Like
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {similarItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            onSave={onSaveItem}
            onUnsave={onUnsaveItem}
            isSaved={isItemSaved(item.id)}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};
export const ItemDetail: React.FC<ItemDetailProps> = ({
  itemId,
  className = "",
}) => {
  const router = useRouter();
  const {
    items,
    user,
    isAuthenticated,
    isLoading,
    error,
    fetchItems,
    saveItem,
    unsaveItem,
    savedItems,
  } = useLoopItStore();
  const {
    isModalOpen,
    selectedItem,
    isSubmitting,
    error: swapError,
    openSwapRequestModal,
    closeSwapRequestModal,
    submitSwapRequest,
  } = useSwapRequest();
  const [item, setItem] = useState<Item | null>(null);
  const [isItemLoading, setIsItemLoading] = useState(true);
  const [isItemManagementModalOpen, setIsItemManagementModalOpen] =
    useState(false);
  useEffect(() => {
    const loadItem = async () => {
      setIsItemLoading(true);
      try {
        if (!items || items.length === 0) {
          await fetchItems();
        }
        const foundItem = items?.find((i) => i.id === itemId);
        setItem(foundItem || null);
      } catch (error) {
        console.error("Failed to load item:", error);
      } finally {
        setIsItemLoading(false);
      }
    };
    loadItem();
  }, [itemId, items, fetchItems]);
  const isOwner = item && user ? item.ownerId === user.id : false;
  const isSaved = item
    ? savedItems.some((saved) => saved.id === item.id)
    : false;
  const handleSave = useCallback(async () => {
    if (!item) return;
    try {
      await saveItem(item.id);
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  }, [item, saveItem]);
  const handleUnsave = useCallback(async () => {
    if (!item) return;
    try {
      await unsaveItem(item.id);
    } catch (error) {
      console.error("Failed to unsave item:", error);
    }
  }, [item, unsaveItem]);
  const handleSaveItem = useCallback(
    async (itemToSave: Item) => {
      try {
        await saveItem(itemToSave.id);
      } catch (error) {
        console.error("Failed to save item:", error);
      }
    },
    [saveItem]
  );
  const handleUnsaveItem = useCallback(
    async (itemToUnsave: Item) => {
      try {
        await unsaveItem(itemToUnsave.id);
      } catch (error) {
        console.error("Failed to unsave item:", error);
      }
    },
    [unsaveItem]
  );
  const handleRequestSwap = useCallback(() => {
    if (!item) return;
    openSwapRequestModal(item);
  }, [item, openSwapRequestModal]);
  const handleOpenItemManagementModal = useCallback(() => {
    setIsItemManagementModalOpen(true);
  }, []);
  const handleCloseItemManagementModal = useCallback(() => {
    setIsItemManagementModalOpen(false);
  }, []);
  const handleItemClick = useCallback(
    (clickedItem: Item) => {
      router.push(`/item/${clickedItem.id}`);
    },
    [router]
  );
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  if (isItemLoading || isLoading) {
    return (
      <Container className={clsx("py-4 md:py-8", className)}>
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner className="text-primary" />
        </div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className={clsx("py-4 md:py-8", className)}>
        <Alert
          variant={AlertVariant.ERROR}
          message={error}
          className="max-w-2xl mx-auto"
        />
      </Container>
    );
  }
  if (!item) {
    return (
      <Container className={clsx("py-4 md:py-8", className)}>
        <div className="text-center py-12">
          <Typography
            as={TypographyVariant.H2}
            className="mb-3 text-text-primary"
          >
            Item not found
          </Typography>
          <Typography as={TypographyVariant.P} className="text-text-muted mb-4">
            The item you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </Typography>
          <Button variant={ButtonVariant.PRIMARY} onClick={handleBack}>
            Go Back
          </Button>
        </div>
      </Container>
    );
  }
  return (
    <Container className={clsx("relative py-2 sm:py-4 md:py-6", className)}>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <div className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:h-fit space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-3 sm:p-4 animate-elegant-fade-up">
            <ImageGallery images={item.images} title={item.title} />
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
          <div
            className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/40 dark:border-blue-800/40 p-4 animate-elegant-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <ItemInfoSection
              item={item}
              isOwner={!!isOwner}
              isSaved={isSaved}
              onSave={handleSave}
              onUnsave={handleUnsave}
            />
          </div>

          <div
            className="bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-200/40 dark:border-emerald-800/40 p-4 animate-elegant-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            <SwapActionSection
              item={item}
              isOwner={!!isOwner}
              isAuthenticated={isAuthenticated}
              onRequestSwap={handleRequestSwap}
              onAddNewItem={handleOpenItemManagementModal}
            />
          </div>

          <div
            className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/40 dark:border-amber-800/40 p-4 animate-elegant-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <DeliveryInfoBox />
          </div>

          <div
            className="bg-gradient-to-br from-purple-50/80 to-pink-50/60 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/40 dark:border-purple-800/40 p-4 animate-elegant-fade-up"
            style={{ animationDelay: "250ms" }}
          >
            <div className="space-y-3">
              <ExpandableSection
                title="Material & care"
                defaultExpanded={false}
              >
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary text-sm"
                >
                  Material and care details go here.
                </Typography>
              </ExpandableSection>
              <ExpandableSection title="Details" defaultExpanded={false}>
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary text-sm"
                >
                  Product details go here.
                </Typography>
              </ExpandableSection>
              <ExpandableSection title="Size & fit" defaultExpanded={false}>
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary text-sm"
                >
                  Size and fit info goes here.
                </Typography>
              </ExpandableSection>
              <ExpandableSection title="Brand" defaultExpanded={false}>
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary text-sm"
                >
                  Brand info goes here.
                </Typography>
              </ExpandableSection>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-12">
        <div
          className="bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-gray-900/20 dark:to-gray-800/20 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/40 dark:border-gray-700/40 p-4 sm:p-6 animate-elegant-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <RelatedItems
            items={items}
            currentItem={item}
            onItemClick={handleItemClick}
            onSaveItem={handleSaveItem}
            onUnsaveItem={handleUnsaveItem}
            isItemSaved={(itemId) =>
              savedItems.some((saved) => saved.id === itemId)
            }
          />
        </div>
      </div>

      <SwapRequestModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={closeSwapRequestModal}
        onSubmit={submitSwapRequest}
        isSubmitting={isSubmitting}
        error={swapError}
      />
      <ItemManagementModal
        isOpen={isItemManagementModalOpen}
        onClose={handleCloseItemManagementModal}
        item={null}
        mode="add"
      />
    </Container>
  );
};

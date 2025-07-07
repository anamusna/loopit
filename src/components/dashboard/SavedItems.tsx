"use client";
import { Item } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faHeart,
  faHeartBroken,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";
export const SavedItems: React.FC = () => {
  const router = useRouter();
  const { savedItems, unsaveItem, isLoading } = useLoopItStore();
  const handleUnsaveItem = async (item: Item) => {
    try {
      await unsaveItem(item.id);
    } catch (error) {
      console.error("Failed to unsave item:", error);
    }
  };
  const handleItemClick = (item: Item) => {
    router.push(`/item/${item.id}`);
  };
  const handleBrowseItems = () => {
    router.push("/");
  };
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square sm:aspect-video bg-secondary/30" />
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-4 sm:h-5 bg-secondary/30 rounded w-3/4" />
                <div className="h-3 sm:h-4 bg-secondary/30 rounded w-1/2" />
                <div className="h-8 sm:h-10 bg-secondary/30 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (savedItems.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-sm mx-auto space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faHeart}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-text-muted"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Typography
              as={TypographyVariant.H3}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary"
            >
              No Saved Items
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm sm:text-base text-text-muted leading-relaxed"
            >
              Start browsing to save items you&apos;re interested in
            </Typography>
          </div>

          <Button
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.MD}
            onClick={handleBrowseItems}
            className="w-full sm:w-auto sm:min-w-[180px] min-h-[44px] sm:min-h-[48px] font-medium"
          >
            <FontAwesomeIcon
              icon={faShoppingBag}
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            />
            Browse Items
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
        <div>
          <Typography
            as={TypographyVariant.H3}
            className="text-base sm:text-lg lg:text-xl font-semibold text-text-primary"
          >
            Saved Items ({savedItems.length})
          </Typography>
          <Typography
            as={TypographyVariant.P}
            className="text-xs sm:text-sm text-text-muted mt-1"
          >
            Items you&apos;ve bookmarked for later
          </Typography>
        </div>

        <Button
          variant={ButtonVariant.GHOST}
          size={ButtonSize.SM}
          onClick={() => router.push("/saved")}
          className="self-start xs:self-auto text-xs sm:text-sm font-medium hover:text-primary"
        >
          View All →
        </Button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {savedItems.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="group bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative aspect-square sm:aspect-video overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                  <Typography
                    as={TypographyVariant.P}
                    className="text-2xl sm:text-3xl"
                  >
                    📦
                  </Typography>
                </div>
              )}

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsaveItem(item);
                  }}
                  className="p-1.5 sm:p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                  aria-label="Remove from saved"
                >
                  <FontAwesomeIcon
                    icon={faHeartBroken}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="space-y-1 sm:space-y-2">
                <Typography
                  as={TypographyVariant.H4}
                  className="text-sm sm:text-base font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-200"
                >
                  {item.title}
                </Typography>
                <div className="flex items-center justify-between">
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-xs sm:text-sm text-text-muted capitalize"
                  >
                    {item.category?.replace("_", " ")}
                  </Typography>
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-xs sm:text-sm text-accent font-medium capitalize"
                  >
                    {item.condition?.toLowerCase()}
                  </Typography>
                </div>
              </div>

              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
                className="w-full text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px] hover:border-primary hover:text-primary transition-colors duration-200"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {savedItems.length > 8 && (
        <div className="text-center pt-2 sm:pt-4">
          <Button
            variant={ButtonVariant.GHOST}
            onClick={() => router.push("/saved")}
            className="text-sm sm:text-base font-medium text-primary hover:text-primary-hover transition-colors duration-200"
          >
            View All {savedItems.length} Saved Items →
          </Button>
        </div>
      )}
    </div>
  );
};

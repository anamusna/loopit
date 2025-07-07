"use client";
import Button, { ButtonVariant } from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faRefresh,
  faSadTear,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onRefresh: () => void;
  title?: string;
  description?: string;
  className?: string;
}
const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({
    hasFilters,
    onClearFilters,
    onRefresh,
    title,
    description,
    className = "",
  }) => {
    const defaultTitle = hasFilters
      ? "No items match your search"
      : "No items available";
    const defaultDescription = hasFilters
      ? "Try adjusting your filters or search terms to find what you're looking for."
      : "Be the first to share something amazing with the community!";
    return (
      <div className={`text-center py-16 sm:py-20 lg:py-24 px-6 ${className}`}>
        <div className="max-w-md mx-auto space-y-6">
          {}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={hasFilters ? faSearch : faSadTear}
              className="w-8 h-8 sm:w-10 sm:h-10 text-text-muted"
            />
          </div>
          {}
          <div className="space-y-3">
            <Typography
              as={TypographyVariant.H2}
              className="text-2xl sm:text-3xl font-bold text-text-primary"
            >
              {title || defaultTitle}
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-lg text-text-secondary"
            >
              {description || defaultDescription}
            </Typography>
          </div>
          {}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasFilters && (
              <Button
                variant={ButtonVariant.PRIMARY}
                onClick={onClearFilters}
                className="min-w-[140px]"
              >
                Clear Filters
              </Button>
            )}
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={onRefresh}
              className="min-w-[140px]"
            >
              <FontAwesomeIcon icon={faRefresh} className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";
export default EmptyState;

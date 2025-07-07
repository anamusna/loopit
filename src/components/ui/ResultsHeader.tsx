"use client";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import { faList, faRefresh, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
export interface ResultsHeaderProps {
  resultsText: string;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasActiveFilters: boolean;
  onRefresh: () => void;
  isLoading: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}
const ResultsHeader: React.FC<ResultsHeaderProps> = React.memo(
  ({
    resultsText,
    totalItems,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasActiveFilters,
    onRefresh,
    isLoading,
    viewMode,
    onViewModeChange,
    className = "",
  }) => {
    return (
      <div
        className={clsx(
          "bg-card border-b border-border py-4 px-6 sticky top-0 z-10",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Typography
              as={TypographyVariant.H2}
              className="text-xl sm:text-2xl font-bold text-text-primary"
            >
              {resultsText}
            </Typography>
            {totalItems > 0 && (
              <Typography
                as={TypographyVariant.P}
                className="text-sm sm:text-base text-text-secondary"
              >
                Showing {startIndex + 1}–{endIndex} of {totalItems} items
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </Typography>
            )}
          </div>
          <div className="flex items-center gap-3">
            {}
            <div className="flex border border-border rounded">
              <button
                onClick={() => onViewModeChange("grid")}
                className={clsx(
                  "px-3 py-2 text-sm font-medium transition-colors",
                  viewMode === "grid"
                    ? "bg-text-primary text-background"
                    : "bg-card text-text-secondary hover:bg-secondary/20"
                )}
                aria-label="Grid view"
              >
                <FontAwesomeIcon icon={faTh} className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={clsx(
                  "px-3 py-2 text-sm font-medium transition-colors border-l border-border",
                  viewMode === "list"
                    ? "bg-text-primary text-background"
                    : "bg-card text-text-secondary hover:bg-secondary/20"
                )}
                aria-label="List view"
              >
                <FontAwesomeIcon icon={faList} className="w-4 h-4" />
              </button>
            </div>
            {hasActiveFilters && (
              <Typography
                as={TypographyVariant.SMALL}
                className="text-sm text-primary font-medium"
              >
                Filtered results
              </Typography>
            )}
            <Button
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              onClick={onRefresh}
              disabled={isLoading}
              className="text-text-secondary hover:text-primary"
              aria-label="Refresh results"
            >
              <FontAwesomeIcon
                icon={faRefresh}
                className={clsx("w-4 h-4", isLoading && "animate-spin")}
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
ResultsHeader.displayName = "ResultsHeader";
export default ResultsHeader;

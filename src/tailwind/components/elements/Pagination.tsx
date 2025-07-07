import clsx from "clsx";
import React from "react";
export enum PaginationSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum PaginationVariant {
  DEFAULT = "default",
  OUTLINE = "outline",
  MINIMAL = "minimal",
}
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  variant?: PaginationVariant;
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  isDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
}
const Pagination: React.FC<PaginationProps> = React.memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    size = PaginationSize.MD,
    variant = PaginationVariant.DEFAULT,
    className = "",
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    isDisabled = false,
    prevLabel = "Previous",
    nextLabel = "Next",
    firstLabel = "First",
    lastLabel = "Last",
  }) => {
    const sizeStyles = {
      [PaginationSize.SM]: {
        button: "px-2 py-1 text-sm min-w-[32px] h-8",
        gap: "gap-1",
      },
      [PaginationSize.MD]: {
        button: "px-3 py-2 text-base min-w-[40px] h-10",
        gap: "gap-2",
      },
      [PaginationSize.LG]: {
        button: "px-4 py-3 text-lg min-w-[48px] h-12",
        gap: "gap-3",
      },
    };
    const variantStyles = {
      [PaginationVariant.DEFAULT]: {
        base: "bg-background text-text-primary border border-border hover:bg-secondary",
        active: "bg-primary text-primary-foreground border-primary",
        disabled:
          "bg-background text-text-muted border-border cursor-not-allowed",
      },
      [PaginationVariant.OUTLINE]: {
        base: "bg-transparent text-text-primary border border-border hover:bg-secondary",
        active: "bg-transparent text-primary border-primary",
        disabled:
          "bg-transparent text-text-muted border-border cursor-not-allowed",
      },
      [PaginationVariant.MINIMAL]: {
        base: "bg-transparent text-text-primary hover:bg-secondary",
        active: "bg-primary text-primary-foreground",
        disabled: "bg-transparent text-text-muted cursor-not-allowed",
      },
    };
    const getVisiblePages = React.useMemo(() => {
      const pages: (number | string)[] = [];
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);
      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
      return pages;
    }, [currentPage, totalPages, maxVisiblePages]);
    const handlePageChange = (page: number) => {
      if (isDisabled || page === currentPage || page < 1 || page > totalPages) {
        return;
      }
      onPageChange(page);
    };
    const renderButton = (
      content: React.ReactNode,
      page?: number,
      isActive = false,
      isDisabledButton = false,
      ariaLabel?: string
    ) => {
      const buttonDisabled = isDisabled || isDisabledButton;
      const styles = variantStyles[variant];
      let buttonStyle = styles.base;
      if (isActive) {
        buttonStyle = styles.active;
      } else if (buttonDisabled) {
        buttonStyle = styles.disabled;
      }
      return (
        <button
          type="button"
          className={clsx(
            "inline-flex items-center justify-center font-medium",
            "rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            sizeStyles[size].button,
            buttonStyle
          )}
          onClick={() => page !== undefined && handlePageChange(page)}
          disabled={buttonDisabled}
          aria-label={ariaLabel}
          aria-current={isActive ? "page" : undefined}
        >
          {content}
        </button>
      );
    };
    if (totalPages <= 1) {
      return null;
    }
    return (
      <nav
        className={clsx(
          "flex items-center justify-center",
          sizeStyles[size].gap,
          className
        )}
        role="navigation"
        aria-label="Pagination"
      >
        {}
        {showFirstLast && (
          <>
            {renderButton(
              firstLabel,
              1,
              false,
              currentPage === 1,
              "Go to first page"
            )}
          </>
        )}
        {}
        {showPrevNext && (
          <>
            {renderButton(
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">{prevLabel}</span>
              </span>,
              currentPage - 1,
              false,
              currentPage === 1,
              "Go to previous page"
            )}
          </>
        )}
        {}
        {getVisiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className={clsx(
                  "inline-flex items-center justify-center text-text-muted",
                  sizeStyles[size].button
                )}
                aria-hidden="true"
              >
                ...
              </span>
            );
          }
          const pageNumber = page as number;
          return (
            <React.Fragment key={`page-${pageNumber}`}>
              {renderButton(
                pageNumber,
                pageNumber,
                pageNumber === currentPage,
                false,
                `Go to page ${pageNumber}`
              )}
            </React.Fragment>
          );
        })}
        {}
        {showPrevNext && (
          <>
            {renderButton(
              <span className="flex items-center gap-1">
                <span className="hidden sm:inline">{nextLabel}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>,
              currentPage + 1,
              false,
              currentPage === totalPages,
              "Go to next page"
            )}
          </>
        )}
        {}
        {showFirstLast && (
          <>
            {renderButton(
              lastLabel,
              totalPages,
              false,
              currentPage === totalPages,
              "Go to last page"
            )}
          </>
        )}
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";
export default Pagination;

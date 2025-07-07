import clsx from "clsx";
import React from "react";
export enum BreadcrumbSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum BreadcrumbSeparator {
  SLASH = "/",
  CHEVRON = ">",
  ARROW = "→",
  DOT = "•",
}
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: BreadcrumbSeparator | string;
  size?: BreadcrumbSize;
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = React.memo(
  ({
    items,
    separator = BreadcrumbSeparator.SLASH,
    size = BreadcrumbSize.MD,
    className = "",
    maxItems,
    showHome = false,
    homeLabel = "Home",
    homeHref = "/",
  }) => {
    const sizeStyles = {
      [BreadcrumbSize.SM]: "text-sm",
      [BreadcrumbSize.MD]: "text-base",
      [BreadcrumbSize.LG]: "text-lg",
    };
    const processedItems = React.useMemo(() => {
      let finalItems = [...items];
      if (showHome) {
        finalItems.unshift({
          label: homeLabel,
          href: homeHref,
          isActive: false,
        });
      }
      if (maxItems && finalItems.length > maxItems) {
        const start = finalItems.slice(0, 1);
        const end = finalItems.slice(-(maxItems - 2));
        finalItems = [...start, { label: "...", isActive: false }, ...end];
      }
      return finalItems;
    }, [items, showHome, homeLabel, homeHref, maxItems]);
    const renderItem = (item: BreadcrumbItem, index: number) => {
      const isLast = index === processedItems.length - 1;
      const isEllipsis = item.label === "...";
      const itemClassName = clsx("transition-colors", {
        "text-text-primary font-medium": item.isActive || isLast,
        "text-text-secondary hover:text-text-primary":
          !item.isActive && !isLast && !isEllipsis,
        "text-text-muted cursor-default": isEllipsis,
        "cursor-pointer":
          (item.href || item.onClick) && !item.isActive && !isEllipsis,
      });
      const handleClick = (event: React.MouseEvent) => {
        if (item.onClick && !item.isActive && !isEllipsis) {
          event.preventDefault();
          item.onClick(event);
        }
      };
      if (item.href && !item.isActive && !isEllipsis) {
        return (
          <a
            key={index}
            href={item.href}
            className={itemClassName}
            onClick={handleClick}
            aria-current={item.isActive ? "page" : undefined}
          >
            {item.label}
          </a>
        );
      }
      return (
        <span
          key={index}
          className={itemClassName}
          aria-current={item.isActive ? "page" : undefined}
          onClick={handleClick}
        >
          {item.label}
        </span>
      );
    };
    const renderSeparator = (index: number) => (
      <span
        key={`separator-${index}`}
        className="text-text-muted mx-2"
        aria-hidden="true"
      >
        {separator}
      </span>
    );
    return (
      <nav
        className={clsx("flex items-center", sizeStyles[size], className)}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-0">
          {processedItems.map((item, index) => (
            <React.Fragment key={index}>
              <li>{renderItem(item, index)}</li>
              {index < processedItems.length - 1 && (
                <li>{renderSeparator(index)}</li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = "Breadcrumbs";
export default Breadcrumbs;

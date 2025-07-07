import clsx from "clsx";
import React, { useState } from "react";
export enum TabsSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum TabsVariant {
  DEFAULT = "default",
  PILLS = "pills",
  UNDERLINE = "underline",
  CARDS = "cards",
}
export enum TabsOrientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}
export interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  size?: TabsSize;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  className?: string;
  isFullWidth?: boolean;
  isCentered?: boolean;
  keepContentMounted?: boolean;
}
const Tabs: React.FC<TabsProps> = React.memo(
  ({
    items,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onTabChange,
    size = TabsSize.MD,
    variant = TabsVariant.DEFAULT,
    orientation = TabsOrientation.HORIZONTAL,
    className = "",
    isFullWidth = false,
    isCentered = false,
    keepContentMounted = false,
  }) => {
    const [internalActiveTab, setInternalActiveTab] = useState(
      defaultActiveTab || items[0]?.id || ""
    );
    const isControlled = controlledActiveTab !== undefined;
    const activeTabId = isControlled ? controlledActiveTab : internalActiveTab;
    const handleTabChange = (tabId: string) => {
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      if (onTabChange) {
        onTabChange(tabId);
      }
    };
    const sizeStyles = {
      [TabsSize.SM]: {
        tab: "px-3 py-2 text-sm",
        content: "",
      },
      [TabsSize.MD]: {
        tab: "px-4 py-3 text-base",
        content: "",
      },
      [TabsSize.LG]: {
        tab: "px-6 py-4 text-lg",
        content: "",
      },
    };
    const variantStyles = {
      [TabsVariant.DEFAULT]: {
        container: "border-b border-border",
        tab: {
          base: "border-b-2 border-transparent text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 relative",
          active:
            "border-primary text-primary font-semibold bg-gradient-to-t from-primary/5 to-transparent shadow-sm transform scale-[1.02] relative",
          disabled: "text-text-muted cursor-not-allowed",
        },
      },
      [TabsVariant.PILLS]: {
        container: "",
        tab: {
          base: "rounded-lg text-text-secondary hover:bg-secondary hover:text-text-primary transition-all duration-200 relative overflow-hidden",
          active:
            "bg-gradient-to-r from-primary to-primary-600 text-primary-foreground font-semibold shadow-lg transform scale-[1.05] ring-2 ring-primary/20 relative",
          disabled: "text-text-muted cursor-not-allowed",
        },
      },
      [TabsVariant.UNDERLINE]: {
        container: "",
        tab: {
          base: "border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-all duration-200 relative",
          active:
            "border-primary text-primary font-semibold bg-gradient-to-t from-primary/8 to-transparent relative shadow-sm",
          disabled: "text-text-muted cursor-not-allowed",
        },
      },
      [TabsVariant.CARDS]: {
        container: "border border-border rounded-lg bg-card/50",
        tab: {
          base: "border-r border-border text-text-secondary hover:bg-secondary hover:text-text-primary transition-all duration-200 first:rounded-tl-lg last:rounded-tr-lg last:border-r-0 relative",
          active:
            "bg-gradient-to-b from-background to-background/80 text-text-primary font-semibold shadow-md border-primary/30 relative z-10 transform translate-y-[-1px]",
          disabled: "text-text-muted cursor-not-allowed",
        },
      },
    };
    const tabListClassName = clsx(
      "flex",
      {
        "flex-col": orientation === TabsOrientation.VERTICAL,
        "flex-row": orientation === TabsOrientation.HORIZONTAL,
        "w-full": isFullWidth,
        "justify-center": isCentered && !isFullWidth,
      },
      variantStyles[variant].container
    );
    const renderTabButton = (item: TabItem) => {
      const isActive = activeTabId === item.id;
      const styles = variantStyles[variant].tab;
      let tabStyle = styles.base;
      if (isActive) {
        tabStyle = `${styles.base} ${styles.active}`;
      } else if (item.isDisabled) {
        tabStyle = `${styles.base} ${styles.disabled}`;
      }
      return (
        <button
          key={item.id}
          type="button"
          className={clsx(
            "mx-auto inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group",
            sizeStyles[size].tab,
            tabStyle,
            {
              "flex-1": isFullWidth,
              "animate-pulse": isActive && variant === TabsVariant.PILLS,
            }
          )}
          onClick={() => !item.isDisabled && handleTabChange(item.id)}
          disabled={item.isDisabled}
          role="tab"
          aria-selected={isActive}
          aria-controls={`tabpanel-${item.id}`}
          id={`tab-${item.id}`}
        >
          {isActive && variant === TabsVariant.PILLS && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-primary-600/20 blur-sm animate-pulse" />
          )}

          {isActive &&
            (variant === TabsVariant.DEFAULT ||
              variant === TabsVariant.UNDERLINE) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            )}

          <div className="relative z-10 flex items-center gap-2">
            {item.icon && (
              <span
                className={clsx(
                  "flex-shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-105"
                )}
              >
                {item.icon}
              </span>
            )}
            <span className="transition-all duration-200 hidden sm:inline">
              {item.label}
            </span>
            {item.badge && (
              <span
                className={clsx(
                  "ml-1 px-2 py-0.5 text-xs rounded-full transition-all duration-200 font-medium hidden sm:inline-flex",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-text-secondary group-hover:bg-primary/10 group-hover:text-primary"
                )}
              >
                {item.badge}
              </span>
            )}
          </div>

          {isActive && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          )}
        </button>
      );
    };
    const renderTabContent = () => {
      const activeItem = items.find((item) => item.id === activeTabId);
      if (!activeItem) return null;
      if (keepContentMounted) {
        return (
          <div className="relative">
            {items.map((item) => (
              <div
                key={item.id}
                className={clsx(sizeStyles[size].content, {
                  block: item.id === activeTabId,
                  hidden: item.id !== activeTabId,
                })}
                role="tabpanel"
                aria-labelledby={`tab-${item.id}`}
                id={`tabpanel-${item.id}`}
              >
                {item.content}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div
          className={sizeStyles[size].content}
          role="tabpanel"
          aria-labelledby={`tab-${activeTabId}`}
          id={`tabpanel-${activeTabId}`}
        >
          {activeItem.content}
        </div>
      );
    };
    return (
      <div
        className={clsx(
          "w-full",
          {
            flex: orientation === TabsOrientation.VERTICAL,
            "flex-col": orientation === TabsOrientation.HORIZONTAL,
          },
          className
        )}
      >
        <div
          className={tabListClassName}
          role="tablist"
          aria-orientation={orientation}
        >
          {items.map(renderTabButton)}
        </div>
        <div
          className={clsx(
            "flex-1 mt-4 sm:mt-6 lg:mt-8",
            orientation === TabsOrientation.VERTICAL && "ml-4"
          )}
        >
          {renderTabContent()}
        </div>
      </div>
    );
  }
);
Tabs.displayName = "Tabs";
export default Tabs;

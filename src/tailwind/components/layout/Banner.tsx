import { faXmark } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef, useEffect, useState } from "react";
import Button, { ButtonSize, ButtonVariant } from "../elements/Button";
export enum BannerVariant {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}
export enum BannerSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export interface BannerProps {
  message: React.ReactNode | string;
  actionLabel?: string;
  actionLink?: string;
  variant?: BannerVariant;
  size?: BannerSize;
  isDismissible?: boolean;
  isOpen?: boolean;
  autoHideAfter?: number;
  onDismiss?: () => void;
  onActionClick?: () => void;
  className?: string;
  id?: string;
  "aria-live"?: "polite" | "assertive" | "off";
}
const Banner = React.memo(
  forwardRef<HTMLDivElement, BannerProps>(
    (
      {
        message,
        actionLabel,
        actionLink,
        variant = BannerVariant.INFO,
        size = BannerSize.MD,
        isDismissible = false,
        isOpen = true,
        autoHideAfter,
        onDismiss,
        onActionClick,
        className,
        id,
        "aria-live": ariaLive = "polite",
      },
      ref
    ) => {
      const [isVisible, setIsVisible] = useState(isOpen);
      useEffect(() => {
        if (autoHideAfter && isVisible) {
          const timer = setTimeout(() => {
            handleDismiss();
          }, autoHideAfter);
          return () => clearTimeout(timer);
        }
      }, [autoHideAfter, isVisible]);
      useEffect(() => {
        setIsVisible(isOpen);
      }, [isOpen]);
      const sizeStyles = {
        [BannerSize.SM]: "p-3 text-sm",
        [BannerSize.MD]: "p-4 text-base",
        [BannerSize.LG]: "p-5 text-lg",
      };
      const variantStyles = {
        [BannerVariant.INFO]: "bg-info-subtle text-info border-info/20",
        [BannerVariant.SUCCESS]:
          "bg-success-subtle text-success border-success/20",
        [BannerVariant.WARNING]:
          "bg-warning-subtle text-warning border-warning/20",
        [BannerVariant.ERROR]:
          "bg-destructive-subtle text-destructive border-destructive/20",
      };
      const actionLinkStyles = {
        [BannerVariant.INFO]: "text-info hover:text-info/80",
        [BannerVariant.SUCCESS]: "text-success hover:text-success/80",
        [BannerVariant.WARNING]: "text-warning hover:text-warning/80",
        [BannerVariant.ERROR]: "text-destructive hover:text-destructive/80",
      };
      const buttonSizes = {
        [BannerSize.SM]: ButtonSize.SM,
        [BannerSize.MD]: ButtonSize.MD,
        [BannerSize.LG]: ButtonSize.LG,
      };
      const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
      };
      const handleActionClick = () => {
        if (onActionClick) {
          onActionClick();
        } else if (actionLink) {
          window.open(actionLink, "_blank", "noopener noreferrer");
        }
      };
      if (!isVisible) return null;
      const bannerClassName = clsx(
        "rounded-lg border shadow-sm transition-all duration-200",
        sizeStyles[size],
        variantStyles[variant],
        className
      );
      const bannerId =
        id || `banner-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <div
          ref={ref}
          id={bannerId}
          className={bannerClassName}
          role="banner"
          aria-live={ariaLive}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-medium">{message}</span>

              {actionLabel && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className={clsx(
                    "text-sm font-semibold underline transition-colors",
                    actionLinkStyles[variant]
                  )}
                >
                  {actionLabel}
                </button>
              )}
            </div>

            {isDismissible && (
              <div className="flex-shrink-0">
                <Button
                  variant={ButtonVariant.GHOST}
                  size={buttonSizes[size]}
                  isIconOnly
                  icon={faXmark}
                  onClick={handleDismiss}
                  aria-label="Dismiss banner"
                  className="text-current hover:bg-black/10"
                />
              </div>
            )}
          </div>
        </div>
      );
    }
  )
);
Banner.displayName = "Banner";
export default Banner;

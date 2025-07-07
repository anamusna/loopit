import clsx from "clsx";
import React, { useEffect, useState } from "react";
export enum ToastVariant {
  DEFAULT = "default",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  INFO = "info",
}
export enum ToastPosition {
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}
export enum ToastSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  size?: ToastSize;
  position?: ToastPosition;
  duration?: number;
  isVisible?: boolean;
  showCloseButton?: boolean;
  showIcon?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
const Toast: React.FC<ToastProps> = React.memo(
  ({
    id,
    title,
    description,
    variant = ToastVariant.DEFAULT,
    size = ToastSize.MD,
    position = ToastPosition.TOP_RIGHT,
    duration = 5000,
    isVisible = true,
    showCloseButton = true,
    showIcon = true,
    isClosable = true,
    onClose,
    onClick,
    className = "",
    icon,
    action,
  }) => {
    const [isShowing, setIsShowing] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
      if (duration > 0 && isVisible && isClosable) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, isVisible, isClosable]);
    useEffect(() => {
      setIsShowing(isVisible);
    }, [isVisible]);
    const handleClose = () => {
      if (!isClosable) return;
      setIsAnimating(true);
      setTimeout(() => {
        setIsShowing(false);
        setIsAnimating(false);
        if (onClose) {
          onClose();
        }
      }, 300);
    };
    const sizeStyles = {
      [ToastSize.SM]: {
        container: "p-3 text-sm max-w-sm",
        icon: "w-4 h-4",
        closeButton: "w-4 h-4",
      },
      [ToastSize.MD]: {
        container: "p-4 text-base max-w-md",
        icon: "w-5 h-5",
        closeButton: "w-5 h-5",
      },
      [ToastSize.LG]: {
        container: "p-5 text-lg max-w-lg",
        icon: "w-6 h-6",
        closeButton: "w-6 h-6",
      },
    };
    const variantStyles = {
      [ToastVariant.DEFAULT]: {
        container: "bg-background text-text-primary border-border",
        icon: "text-text-secondary",
      },
      [ToastVariant.SUCCESS]: {
        container: "bg-success-subtle text-success border-success/20",
        icon: "text-success",
      },
      [ToastVariant.WARNING]: {
        container: "bg-warning-subtle text-warning border-warning/20",
        icon: "text-warning",
      },
      [ToastVariant.ERROR]: {
        container:
          "bg-destructive-subtle text-destructive border-destructive/20",
        icon: "text-destructive",
      },
      [ToastVariant.INFO]: {
        container: "bg-info-subtle text-info border-info/20",
        icon: "text-info",
      },
    };
    const positionStyles = {
      [ToastPosition.TOP_LEFT]: "top-4 left-4",
      [ToastPosition.TOP_CENTER]: "top-4 left-1/2 transform -translate-x-1/2",
      [ToastPosition.TOP_RIGHT]: "top-4 right-4",
      [ToastPosition.BOTTOM_LEFT]: "bottom-4 left-4",
      [ToastPosition.BOTTOM_CENTER]:
        "bottom-4 left-1/2 transform -translate-x-1/2",
      [ToastPosition.BOTTOM_RIGHT]: "bottom-4 right-4",
    };
    const defaultIcons = {
      [ToastVariant.DEFAULT]: (
        <svg
          className={sizeStyles[size].icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      [ToastVariant.SUCCESS]: (
        <svg
          className={sizeStyles[size].icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      [ToastVariant.WARNING]: (
        <svg
          className={sizeStyles[size].icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      ),
      [ToastVariant.ERROR]: (
        <svg
          className={sizeStyles[size].icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
        </svg>
      ),
      [ToastVariant.INFO]: (
        <svg
          className={sizeStyles[size].icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      ),
    };
    const toastClassName = clsx(
      "fixed z-50 flex items-start gap-3 rounded-lg border shadow-lg transition-all duration-300 ease-in-out",
      sizeStyles[size].container,
      variantStyles[variant].container,
      positionStyles[position],
      {
        "opacity-100 scale-100": isShowing && !isAnimating,
        "opacity-0 scale-95": !isShowing || isAnimating,
        "cursor-pointer": onClick,
      },
      className
    );
    if (!isShowing && !isAnimating) {
      return null;
    }
    return (
      <div
        className={toastClassName}
        onClick={onClick}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        id={id}
      >
        {showIcon && (
          <div
            className={clsx(
              "flex-shrink-0 mt-0.5",
              variantStyles[variant].icon
            )}
          >
            {icon || defaultIcons[variant]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-current mb-1">{title}</div>
          )}
          {description && (
            <div className="text-current opacity-90">{description}</div>
          )}

          {action && (
            <div className="mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {showCloseButton && isClosable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={clsx(
              "flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded",
              sizeStyles[size].closeButton
            )}
            aria-label="Close notification"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";
export default Toast;

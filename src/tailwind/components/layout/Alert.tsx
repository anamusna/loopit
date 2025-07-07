import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faExclamationCircle,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef, useEffect, useId, useState } from "react";
import Button, { ButtonSize, ButtonVariant } from "../elements/Button";
import Icon, { IconColor, IconSize } from "../elements/Icon";
export enum AlertVariant {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
export enum AlertSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export interface AlertProps {
  title?: string;
  message: React.ReactNode | string;
  children?: React.ReactNode;
  variant?: AlertVariant;
  size?: AlertSize;
  icon?: IconDefinition;
  showIcon?: boolean;
  isDismissible?: boolean;
  isOpen?: boolean;
  autoHideAfter?: number;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onDismiss?: () => void;
  onConfirm?: () => void;
  className?: string;
  id?: string;
  "aria-live"?: "polite" | "assertive" | "off";
}
const Alert = React.memo(
  forwardRef<HTMLDivElement, AlertProps>(
    (
      {
        title,
        message,
        children,
        variant = AlertVariant.INFO,
        size = AlertSize.MD,
        icon,
        showIcon = true,
        isDismissible = true,
        isOpen = true,
        autoHideAfter,
        showConfirmButton = false,
        confirmButtonText = "Confirm",
        cancelButtonText = "Cancel",
        onDismiss,
        onConfirm,
        className,
        id,
        "aria-live": ariaLive = "polite",
      },
      ref
    ) => {
      const [isVisible, setIsVisible] = useState(isOpen);
      const reactId = useId();
      const alertId = id || `alert-${reactId}`;
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
        [AlertSize.SM]: "text-sm p-3",
        [AlertSize.MD]: "text-base p-4",
        [AlertSize.LG]: "text-lg p-5",
      };
      const variantStyles = {
        [AlertVariant.SUCCESS]:
          "bg-success-subtle text-success border-success/20",
        [AlertVariant.ERROR]:
          "bg-destructive-subtle text-destructive border-destructive/20",
        [AlertVariant.WARNING]:
          "bg-warning-subtle text-warning border-warning/20",
        [AlertVariant.INFO]: "bg-info-subtle text-info border-info/20",
      };
      const defaultIcons = {
        [AlertVariant.SUCCESS]: faCheck,
        [AlertVariant.ERROR]: faXmark,
        [AlertVariant.WARNING]: faExclamationCircle,
        [AlertVariant.INFO]: faInfoCircle,
      };
      const iconColors = {
        [AlertVariant.SUCCESS]: IconColor.SUCCESS,
        [AlertVariant.ERROR]: IconColor.DESTRUCTIVE,
        [AlertVariant.WARNING]: IconColor.WARNING,
        [AlertVariant.INFO]: IconColor.PRIMARY,
      };
      const buttonSizes = {
        [AlertSize.SM]: ButtonSize.SM,
        [AlertSize.MD]: ButtonSize.MD,
        [AlertSize.LG]: ButtonSize.LG,
      };
      const iconSizes = {
        [AlertSize.SM]: IconSize.SM,
        [AlertSize.MD]: IconSize.MD,
        [AlertSize.LG]: IconSize.LG,
      };
      const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
      };
      const handleConfirm = () => {
        onConfirm?.();
        setIsVisible(false);
      };
      if (!isVisible) return null;
      const alertClassName = clsx(
        "rounded-lg border shadow-sm transition-all duration-200",
        sizeStyles[size],
        variantStyles[variant],
        className
      );
      const displayIcon = icon || defaultIcons[variant];
      return (
        <div
          ref={ref}
          id={alertId}
          className={alertClassName}
          role="alert"
          aria-live={ariaLive}
        >
          <div className="flex items-start gap-3">
            {showIcon && displayIcon && (
              <div className="flex-shrink-0">
                <Icon
                  icon={displayIcon}
                  size={iconSizes[size]}
                  color={iconColors[variant]}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {title && <h4 className="font-semibold mb-1">{title}</h4>}

              <div className="text-current">{message}</div>

              {children && <div className="mt-2">{children}</div>}

              {showConfirmButton && (
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant={ButtonVariant.PRIMARY}
                    size={buttonSizes[size]}
                    onClick={handleConfirm}
                  >
                    {confirmButtonText}
                  </Button>
                  <Button
                    variant={ButtonVariant.GHOST}
                    size={buttonSizes[size]}
                    onClick={handleDismiss}
                  >
                    {cancelButtonText}
                  </Button>
                </div>
              )}
            </div>

            {isDismissible && !showConfirmButton && (
              <div className="flex-shrink-0">
                <Button
                  variant={ButtonVariant.GHOST}
                  size={buttonSizes[size]}
                  isIconOnly
                  icon={faXmark}
                  onClick={handleDismiss}
                  aria-label="Dismiss alert"
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
Alert.displayName = "Alert";
export default Alert;

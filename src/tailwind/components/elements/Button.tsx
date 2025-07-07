import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef } from "react";
import Icon from "./Icon";
export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  OUTLINE = "outline",
  GHOST = "ghost",
  DESTRUCTIVE = "destructive",
  SUCCESS = "success",
  WARNING = "warning",
}
export enum ButtonSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
}
export enum ButtonShape {
  ROUNDED = "rounded",
  CIRCLE = "circle",
  SQUARE = "square",
}
export enum IconPosition {
  LEFT = "left",
  RIGHT = "right",
}
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  iconPosition?: IconPosition;
  isIconOnly?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconDefinition;
  className?: string;
  iconClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button = React.memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        variant = ButtonVariant.PRIMARY,
        size = ButtonSize.MD,
        shape = ButtonShape.ROUNDED,
        iconPosition = IconPosition.LEFT,
        isIconOnly = false,
        isLoading = false,
        isDisabled = false,
        icon,
        type = "button",
        className = "",
        iconClassName = "",
        onClick,
        ...props
      },
      ref
    ) => {
      const variantStyles = {
        [ButtonVariant.PRIMARY]:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary",
        [ButtonVariant.SECONDARY]:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-secondary",
        [ButtonVariant.OUTLINE]:
          "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
        [ButtonVariant.GHOST]:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
        [ButtonVariant.DESTRUCTIVE]:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-hover focus-visible:ring-destructive",
        [ButtonVariant.SUCCESS]:
          "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 focus-visible:ring-success",
        [ButtonVariant.WARNING]:
          "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 focus-visible:ring-warning",
      };
      const sizeStyles = {
        [ButtonSize.XS]: isIconOnly ? "h-6 w-6 p-1" : "h-6 px-2 text-xs",
        [ButtonSize.SM]: isIconOnly ? "h-8 w-8 p-1.5" : "h-8 px-3 text-sm",
        [ButtonSize.MD]: isIconOnly ? "h-10 w-10 p-2" : "h-10 px-4 text-base",
        [ButtonSize.LG]: isIconOnly ? "h-12 w-12 p-2.5" : "h-12 px-6 text-lg",
        [ButtonSize.XL]: isIconOnly ? "h-14 w-14 p-3" : "h-14 px-8 text-xl",
      };
      const shapeStyles = {
        [ButtonShape.ROUNDED]: "rounded-lg",
        [ButtonShape.CIRCLE]: "rounded-full",
        [ButtonShape.SQUARE]: "rounded-none",
      };
      const iconSizes = {
        [ButtonSize.XS]: "w-3 h-3",
        [ButtonSize.SM]: "w-4 h-4",
        [ButtonSize.MD]: "w-4 h-4",
        [ButtonSize.LG]: "w-5 h-5",
        [ButtonSize.XL]: "w-6 h-6",
      };
      const iconSpacing = {
        [ButtonSize.XS]: "gap-1",
        [ButtonSize.SM]: "gap-1.5",
        [ButtonSize.MD]: "gap-2",
        [ButtonSize.LG]: "gap-2.5",
        [ButtonSize.XL]: "gap-3",
      };
      const disabledStyles =
        "opacity-50 cursor-not-allowed pointer-events-none";
      const loadingStyles = "cursor-wait";
      const buttonClassName = clsx(
        "inline-flex items-center justify-center font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[shape],
        !isIconOnly && icon && iconSpacing[size],
        (isDisabled || props.disabled) && disabledStyles,
        isLoading && loadingStyles,
        className
      );
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading || isDisabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      };
      const renderLoadingSpinner = () => (
        <Icon
          icon={faSpinner}
          isSpin
          className={clsx(iconSizes[size], iconClassName)}
          isFixedWidth
        />
      );
      const renderIcon = (position: IconPosition) => {
        if (!icon || iconPosition !== position) return null;
        return (
          <Icon
            icon={icon}
            className={clsx(iconSizes[size], iconClassName)}
            isFixedWidth
          />
        );
      };
      const renderContent = () => {
        if (isLoading) {
          return renderLoadingSpinner();
        }
        return (
          <>
            {renderIcon(IconPosition.LEFT)}
            {!isIconOnly && children}
            {renderIcon(IconPosition.RIGHT)}
          </>
        );
      };
      return (
        <button
          ref={ref}
          type={type}
          className={buttonClassName}
          disabled={isDisabled || isLoading || props.disabled}
          onClick={handleClick}
          {...props}
        >
          {renderContent()}
        </button>
      );
    }
  )
);
Button.displayName = "Button";
export default Button;

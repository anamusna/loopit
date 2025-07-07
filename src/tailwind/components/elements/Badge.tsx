import clsx from "clsx";
import React from "react";
export enum BadgeVariant {
  DEFAULT = "default",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUCCESS = "success",
  WARNING = "warning",
  DESTRUCTIVE = "destructive",
  INFO = "info",
}
export enum BadgeSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}
const Badge: React.FC<BadgeProps> = React.memo(
  ({
    children,
    variant = BadgeVariant.DEFAULT,
    size = BadgeSize.SM,
    className = "",
    dot = false,
  }) => {
    const sizeStyles = {
      [BadgeSize.SM]: "px-2 py-0.5 text-xs",
      [BadgeSize.MD]: "px-2.5 py-1 text-sm",
      [BadgeSize.LG]: "px-3 py-1.5 text-base",
    };
    const variantStyles = {
      [BadgeVariant.DEFAULT]: "bg-secondary text-secondary-foreground",
      [BadgeVariant.PRIMARY]: "bg-primary text-primary-foreground",
      [BadgeVariant.SECONDARY]: "bg-secondary text-secondary-foreground",
      [BadgeVariant.SUCCESS]: "bg-success text-success-foreground",
      [BadgeVariant.WARNING]: "bg-warning text-warning-foreground",
      [BadgeVariant.DESTRUCTIVE]: "bg-destructive text-destructive-foreground",
      [BadgeVariant.INFO]: "bg-info text-info-foreground",
    };
    const dotStyles = {
      [BadgeSize.SM]: "w-2 h-2",
      [BadgeSize.MD]: "w-2.5 h-2.5",
      [BadgeSize.LG]: "w-3 h-3",
    };
    if (dot) {
      return (
        <span
          className={clsx(
            "inline-block rounded-full",
            dotStyles[size],
            variantStyles[variant],
            className
          )}
          aria-label={typeof children === "string" ? children : "Notification"}
        />
      );
    }
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-full",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
export default Badge;

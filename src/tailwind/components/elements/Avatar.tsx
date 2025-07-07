"use client";
import clsx from "clsx";
import React, { useState } from "react";
export enum AvatarSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XXL = "2xl",
}
export enum AvatarVariant {
  CIRCLE = "circle",
  ROUNDED = "rounded",
  SQUARE = "square",
}
export enum AvatarStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  AWAY = "away",
  BUSY = "busy",
}
export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  status?: AvatarStatus;
  initials?: string;
  className?: string;
  showStatus?: boolean;
  isClickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const Avatar: React.FC<AvatarProps> = React.memo(
  ({
    src,
    alt,
    size = AvatarSize.MD,
    variant = AvatarVariant.CIRCLE,
    status,
    initials,
    className = "",
    showStatus = false,
    isClickable = false,
    onClick,
  }) => {
    const [imageError, setImageError] = useState(false);
    const sizeStyles = {
      [AvatarSize.XS]: "w-6 h-6 text-xs",
      [AvatarSize.SM]: "w-8 h-8 text-sm",
      [AvatarSize.MD]: "w-10 h-10 text-base",
      [AvatarSize.LG]: "w-12 h-12 text-lg",
      [AvatarSize.XL]: "w-16 h-16 text-xl",
      [AvatarSize.XXL]: "w-20 h-20 text-2xl",
    };
    const variantStyles = {
      [AvatarVariant.CIRCLE]: "rounded-full",
      [AvatarVariant.ROUNDED]: "rounded-lg",
      [AvatarVariant.SQUARE]: "rounded-none",
    };
    const statusStyles = {
      [AvatarStatus.ONLINE]: "bg-success",
      [AvatarStatus.OFFLINE]: "bg-text-muted",
      [AvatarStatus.AWAY]: "bg-warning",
      [AvatarStatus.BUSY]: "bg-destructive",
    };
    const statusSizes = {
      [AvatarSize.XS]: "w-1.5 h-1.5",
      [AvatarSize.SM]: "w-2 h-2",
      [AvatarSize.MD]: "w-2.5 h-2.5",
      [AvatarSize.LG]: "w-3 h-3",
      [AvatarSize.XL]: "w-4 h-4",
      [AvatarSize.XXL]: "w-5 h-5",
    };
    const avatarClassName = clsx(
      "relative inline-flex items-center justify-center font-medium",
      "bg-secondary text-secondary-foreground border border-border",
      "overflow-hidden select-none",
      sizeStyles[size],
      variantStyles[variant],
      isClickable && "cursor-pointer hover:opacity-80 transition-opacity",
      className
    );
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isClickable && onClick) {
        onClick(event);
      }
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        isClickable &&
        onClick &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };
    const handleImageError = () => {
      setImageError(true);
    };
    const renderContent = () => {
      if (src && !imageError) {
        return (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        );
      }
      if (initials) {
        return (
          <span className="font-medium text-inherit uppercase">
            {initials.slice(0, 2)}
          </span>
        );
      }
      return (
        <svg
          className="w-1/2 h-1/2 text-text-muted"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    };
    const renderStatusIndicator = () => {
      if (!showStatus || !status) return null;
      return (
        <div
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            statusStyles[status],
            statusSizes[size]
          )}
          aria-label={`Status: ${status}`}
        />
      );
    };
    return (
      <div
        className={avatarClassName}
        onClick={handleClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
      >
        {renderContent()}
        {renderStatusIndicator()}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
export default Avatar;

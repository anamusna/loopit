import clsx from "clsx";
import React from "react";
export enum ProgressBarSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
}
export enum ProgressBarVariant {
  DEFAULT = "default",
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
  INFO = "info",
}
export enum ProgressBarShape {
  ROUNDED = "rounded",
  SQUARE = "square",
  PILL = "pill",
}
export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  shape?: ProgressBarShape;
  className?: string;
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  isStriped?: boolean;
  isIndeterminate?: boolean;
}
const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({
    value,
    max = 100,
    size = ProgressBarSize.MD,
    variant = ProgressBarVariant.DEFAULT,
    shape = ProgressBarShape.ROUNDED,
    className = "",
    showLabel = false,
    showPercentage = false,
    label,
    isStriped = false,
    isIndeterminate = false,
  }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const sizeStyles = {
      [ProgressBarSize.XS]: "h-1",
      [ProgressBarSize.SM]: "h-2",
      [ProgressBarSize.MD]: "h-3",
      [ProgressBarSize.LG]: "h-4",
      [ProgressBarSize.XL]: "h-6",
    };
    const shapeStyles = {
      [ProgressBarShape.ROUNDED]: "rounded-md",
      [ProgressBarShape.SQUARE]: "rounded-none",
      [ProgressBarShape.PILL]: "rounded-full",
    };
    const variantStyles = {
      [ProgressBarVariant.DEFAULT]: {
        bg: "bg-primary",
        text: "text-primary",
      },
      [ProgressBarVariant.SUCCESS]: {
        bg: "bg-success",
        text: "text-success",
      },
      [ProgressBarVariant.WARNING]: {
        bg: "bg-warning",
        text: "text-warning",
      },
      [ProgressBarVariant.DANGER]: {
        bg: "bg-destructive",
        text: "text-destructive",
      },
      [ProgressBarVariant.INFO]: {
        bg: "bg-info",
        text: "text-info",
      },
    };
    const containerClassName = clsx(
      "relative w-full overflow-hidden",
      "bg-secondary border border-border",
      sizeStyles[size],
      shapeStyles[shape],
      className
    );
    const fillClassName = clsx(
      "h-full transition-all duration-300 ease-in-out",
      variantStyles[variant].bg,
      {
        "animate-pulse": isIndeterminate,
        "bg-gradient-to-r from-transparent via-white to-transparent bg-[length:200%_100%] animate-[shimmer_2s_infinite]":
          isStriped,
      }
    );
    const renderLabel = () => {
      if (!showLabel && !showPercentage) return null;
      return (
        <div className="flex items-center justify-between mb-2">
          {showLabel && label && (
            <span className="text-sm font-medium text-text-primary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              className={clsx(
                "text-sm font-medium",
                variantStyles[variant].text
              )}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      );
    };
    return (
      <div className="w-full">
        {renderLabel()}
        <div
          className={containerClassName}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={fillClassName}
            style={{
              width: isIndeterminate ? "100%" : `${percentage}%`,
              transform: isIndeterminate ? "translateX(-100%)" : undefined,
              animation: isIndeterminate
                ? "progress-indeterminate 2s infinite linear"
                : undefined,
            }}
          />
        </div>
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
export default ProgressBar;

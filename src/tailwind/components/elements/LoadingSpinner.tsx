import clsx from "clsx";
import React, { forwardRef } from "react";
export enum LoadingSpinnerSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
}
export enum LoadingSpinnerVariant {
  DEFAULT = "default",
  DOTS = "dots",
  PULSE = "pulse",
  BOUNCE = "bounce",
}
export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  label?: string;
  isVisible?: boolean;
  className?: string;
  "aria-label"?: string;
}
const LoadingSpinner = React.memo(
  forwardRef<HTMLDivElement, LoadingSpinnerProps>(
    (
      {
        size = LoadingSpinnerSize.MD,
        variant = LoadingSpinnerVariant.DEFAULT,
        label = "Loading...",
        isVisible = true,
        className,
        "aria-label": ariaLabel,
      },
      ref
    ) => {
      const sizeStyles = {
        [LoadingSpinnerSize.XS]: "h-3 w-3",
        [LoadingSpinnerSize.SM]: "h-4 w-4",
        [LoadingSpinnerSize.MD]: "h-6 w-6",
        [LoadingSpinnerSize.LG]: "h-8 w-8",
        [LoadingSpinnerSize.XL]: "h-12 w-12",
      };
      if (!isVisible) return null;
      if (variant === LoadingSpinnerVariant.DEFAULT) {
        return (
          <div
            ref={ref}
            className={clsx(
              "inline-block animate-spin rounded-full border-2 border-solid",
              "border-primary border-r-transparent",
              sizeStyles[size],
              className
            )}
            role="status"
            aria-label={ariaLabel || label}
          >
            <span className="sr-only">{label}</span>
          </div>
        );
      }
      if (variant === LoadingSpinnerVariant.DOTS) {
        return (
          <div
            ref={ref}
            className={clsx("flex space-x-1", className)}
            role="status"
            aria-label={ariaLabel || label}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  "rounded-full bg-primary animate-pulse",
                  sizeStyles[size]
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
            <span className="sr-only">{label}</span>
          </div>
        );
      }
      if (variant === LoadingSpinnerVariant.PULSE) {
        return (
          <div
            ref={ref}
            className={clsx(
              "rounded-full bg-primary animate-pulse",
              sizeStyles[size],
              className
            )}
            role="status"
            aria-label={ariaLabel || label}
          >
            <span className="sr-only">{label}</span>
          </div>
        );
      }
      if (variant === LoadingSpinnerVariant.BOUNCE) {
        return (
          <div
            ref={ref}
            className={clsx("flex space-x-1", className)}
            role="status"
            aria-label={ariaLabel || label}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  "rounded-full bg-primary animate-bounce",
                  sizeStyles[size]
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            <span className="sr-only">{label}</span>
          </div>
        );
      }
      return null;
    }
  )
);
LoadingSpinner.displayName = "LoadingSpinner";
export default LoadingSpinner;

import clsx from "clsx";
import React, { forwardRef } from "react";
export enum ToggleSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum ToggleVariant {
  DEFAULT = "default",
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
}
export interface ToggleProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onToggle"
  > {
  size?: ToggleSize;
  variant?: ToggleVariant;
  isChecked?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
  description?: string;
  helperText?: string;
  errorMessage?: string;
  hasError?: boolean;
  labelPosition?: "left" | "right";
  onToggle?: (checked: boolean) => void;
}
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = ToggleSize.MD,
      variant = ToggleVariant.DEFAULT,
      isChecked = false,
      isDisabled = false,
      isRequired = false,
      label,
      description,
      helperText,
      errorMessage,
      hasError = false,
      labelPosition = "right",
      onToggle,
      className = "",
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      [ToggleSize.SM]: {
        track: "w-9 h-5",
        thumb: "w-4 h-4",
        translate: "translate-x-4",
        label: "text-sm",
      },
      [ToggleSize.MD]: {
        track: "w-11 h-6",
        thumb: "w-5 h-5",
        translate: "translate-x-5",
        label: "text-base",
      },
      [ToggleSize.LG]: {
        track: "w-14 h-7",
        thumb: "w-6 h-6",
        translate: "translate-x-7",
        label: "text-lg",
      },
    };
    const variantStyles = {
      [ToggleVariant.DEFAULT]: {
        trackOn: "bg-primary",
        trackOff: "bg-secondary",
      },
      [ToggleVariant.SUCCESS]: {
        trackOn: "bg-success",
        trackOff: "bg-secondary",
      },
      [ToggleVariant.WARNING]: {
        trackOn: "bg-warning",
        trackOff: "bg-secondary",
      },
      [ToggleVariant.DANGER]: {
        trackOn: "bg-destructive",
        trackOff: "bg-secondary",
      },
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      if (onToggle) {
        onToggle(checked);
      }
      if (onChange) {
        onChange(event);
      }
    };
    const trackClassName = clsx(
      "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out border-2 border-transparent",
      "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
      sizeStyles[size].track,
      {
        [variantStyles[variant].trackOn]: isChecked,
        [variantStyles[variant].trackOff]: !isChecked,
        "opacity-50 cursor-not-allowed": isDisabled,
        "cursor-pointer": !isDisabled,
      }
    );
    const thumbClassName = clsx(
      "inline-block bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out",
      sizeStyles[size].thumb,
      {
        [sizeStyles[size].translate]: isChecked,
        "translate-x-0": !isChecked,
      }
    );
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    const hasErrorState = hasError || !!errorMessage;
    return (
      <div className={clsx("space-y-1", className)}>
        <div className="flex items-center gap-3">
          {label && labelPosition === "left" && (
            <label
              htmlFor={toggleId}
              className={clsx(
                "font-medium text-text-primary cursor-pointer",
                sizeStyles[size].label,
                {
                  "after:content-['*'] after:text-destructive after:ml-1":
                    isRequired,
                },
                { "opacity-50": isDisabled }
              )}
            >
              {label}
            </label>
          )}

          <div className={trackClassName}>
            <input
              ref={ref}
              type="checkbox"
              id={toggleId}
              checked={isChecked}
              disabled={isDisabled}
              required={isRequired}
              onChange={handleChange}
              className="sr-only"
              {...props}
            />
            <span className={thumbClassName} />
          </div>

          {label && labelPosition === "right" && (
            <label
              htmlFor={toggleId}
              className={clsx(
                "font-medium text-text-primary cursor-pointer",
                sizeStyles[size].label,
                {
                  "after:content-['*'] after:text-destructive after:ml-1":
                    isRequired,
                },
                { "opacity-50": isDisabled }
              )}
            >
              {label}
            </label>
          )}
        </div>

        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}

        {(helperText || errorMessage) && (
          <p
            className={clsx(
              "text-sm",
              hasErrorState ? "text-destructive" : "text-text-secondary"
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);
Toggle.displayName = "Toggle";
export default Toggle;

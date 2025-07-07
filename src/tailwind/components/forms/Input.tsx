import clsx from "clsx";
import React, { forwardRef, useId } from "react";
export enum InputSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
}
export enum InputVariant {
  DEFAULT = "default",
  FILLED = "filled",
  OUTLINE = "outline",
  GHOST = "ghost",
}
export enum InputState {
  DEFAULT = "default",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  variant?: InputVariant;
  state?: InputState;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  helperText?: string;
  errorMessage?: string;
  label?: string;
  description?: string;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = InputSize.MD,
      variant = InputVariant.DEFAULT,
      state = InputState.DEFAULT,
      isFullWidth = false,
      isDisabled = false,
      isReadOnly = false,
      isRequired = false,
      hasError = false,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      helperText,
      errorMessage,
      label,
      description,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const currentState = hasError ? InputState.ERROR : state;
    const sizeStyles = {
      [InputSize.XS]: {
        input: "px-2 py-1 text-xs",
        icon: "w-3 h-3",
        addon: "px-2 text-xs",
      },
      [InputSize.SM]: {
        input: "px-3 py-2 text-sm",
        icon: "w-4 h-4",
        addon: "px-3 text-sm",
      },
      [InputSize.MD]: {
        input: "px-4 py-3 text-base",
        icon: "w-5 h-5",
        addon: "px-4 text-base",
      },
      [InputSize.LG]: {
        input: "px-4 py-4 text-lg",
        icon: "w-6 h-6",
        addon: "px-4 text-lg",
      },
      [InputSize.XL]: {
        input: "px-5 py-5 text-xl",
        icon: "w-7 h-7",
        addon: "px-5 text-xl",
      },
    };
    const variantStyles = {
      [InputVariant.DEFAULT]: {
        container: "border border-border bg-background",
        input: "bg-transparent",
      },
      [InputVariant.FILLED]: {
        container: "border-0 bg-secondary",
        input: "bg-transparent",
      },
      [InputVariant.OUTLINE]: {
        container: "border-2 border-border bg-transparent",
        input: "bg-transparent",
      },
      [InputVariant.GHOST]: {
        container: "border-0 bg-transparent",
        input: "bg-transparent",
      },
    };
    const stateStyles = {
      [InputState.DEFAULT]: {
        container:
          "hover:border-border-hover focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        icon: "text-text-muted",
      },
      [InputState.SUCCESS]: {
        container:
          "border-success hover:border-success focus-within:border-success focus-within:ring-2 focus-within:ring-success/20",
        icon: "text-success",
      },
      [InputState.WARNING]: {
        container:
          "border-warning hover:border-warning focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20",
        icon: "text-warning",
      },
      [InputState.ERROR]: {
        container:
          "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20",
        icon: "text-destructive",
      },
    };
    const containerClassName = clsx(
      "relative flex items-center rounded-lg transition-colors",
      variantStyles[variant].container,
      stateStyles[currentState].container,
      {
        "w-full": isFullWidth,
        "opacity-50 cursor-not-allowed": isDisabled,
        "cursor-not-allowed": isReadOnly,
      }
    );
    const inputClassName = clsx(
      "flex-1 outline-none transition-colors placeholder:text-text-muted text-text-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "read-only:cursor-not-allowed",
      sizeStyles[size].input,
      variantStyles[variant].input,
      {
        "pl-10": leftIcon && !leftAddon,
        "pr-10": rightIcon && !rightAddon,
        "rounded-l-none": leftAddon,
        "rounded-r-none": rightAddon,
      },
      className
    );
    const reactId = useId();
    const inputId = id || `input-${reactId}`;
    return (
      <div className={clsx("space-y-1", { "w-full": isFullWidth })}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsx("block text-sm font-medium text-text-primary", {
              "after:content-['*'] after:text-destructive after:ml-1":
                isRequired,
            })}
          >
            {label}
          </label>
        )}

        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}

        <div className="relative">
          {leftAddon && (
            <div
              className={clsx(
                "flex items-center border border-r-0 border-border bg-secondary text-text-secondary rounded-l-lg",
                sizeStyles[size].addon
              )}
            >
              {leftAddon}
            </div>
          )}

          <div className={containerClassName}>
            {leftIcon && !leftAddon && (
              <div
                className={clsx(
                  "absolute left-3 flex items-center pointer-events-none",
                  stateStyles[currentState].icon,
                  sizeStyles[size].icon
                )}
              >
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              id={inputId}
              disabled={isDisabled}
              readOnly={isReadOnly}
              required={isRequired}
              className={inputClassName}
              {...props}
            />

            {rightIcon && !rightAddon && (
              <div
                className={clsx(
                  "absolute right-3 flex items-center pointer-events-none",
                  stateStyles[currentState].icon,
                  sizeStyles[size].icon
                )}
              >
                {rightIcon}
              </div>
            )}
          </div>

          {rightAddon && (
            <div
              className={clsx(
                "flex items-center border border-l-0 border-border bg-secondary text-text-secondary rounded-r-lg",
                sizeStyles[size].addon
              )}
            >
              {rightAddon}
            </div>
          )}
        </div>

        {(helperText || errorMessage) && (
          <p
            className={clsx(
              "text-sm",
              currentState === InputState.ERROR
                ? "text-destructive"
                : "text-text-secondary"
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;

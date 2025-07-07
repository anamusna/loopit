import clsx from "clsx";
import React, { forwardRef, useId } from "react";
export enum TextareaSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum TextareaVariant {
  DEFAULT = "default",
  FILLED = "filled",
  OUTLINE = "outline",
  GHOST = "ghost",
}
export enum TextareaState {
  DEFAULT = "default",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}
export enum TextareaResize {
  NONE = "none",
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
  BOTH = "both",
}
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  variant?: TextareaVariant;
  state?: TextareaState;
  resize?: TextareaResize;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  helperText?: string;
  errorMessage?: string;
  label?: string;
  description?: string;
  showCharCount?: boolean;
  maxLength?: number;
}
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = TextareaSize.MD,
      variant = TextareaVariant.DEFAULT,
      state = TextareaState.DEFAULT,
      resize = TextareaResize.VERTICAL,
      isFullWidth = true,
      isDisabled = false,
      isReadOnly = false,
      isRequired = false,
      hasError = false,
      helperText,
      errorMessage,
      label,
      description,
      showCharCount = false,
      maxLength,
      className = "",
      id,
      value,
      ...props
    },
    ref
  ) => {
    const currentState = hasError ? TextareaState.ERROR : state;
    const charCount = typeof value === "string" ? value.length : 0;
    const sizeStyles = {
      [TextareaSize.SM]: {
        textarea: "px-3 py-2 text-sm min-h-[80px]",
        label: "text-sm",
      },
      [TextareaSize.MD]: {
        textarea: "px-4 py-3 text-base min-h-[100px]",
        label: "text-sm",
      },
      [TextareaSize.LG]: {
        textarea: "px-4 py-4 text-lg min-h-[120px]",
        label: "text-base",
      },
    };
    const variantStyles = {
      [TextareaVariant.DEFAULT]: {
        container: "border border-border bg-background",
      },
      [TextareaVariant.FILLED]: {
        container: "border-0 bg-secondary",
      },
      [TextareaVariant.OUTLINE]: {
        container: "border-2 border-border bg-transparent",
      },
      [TextareaVariant.GHOST]: {
        container: "border-0 bg-transparent",
      },
    };
    const stateStyles = {
      [TextareaState.DEFAULT]: {
        container:
          "hover:border-border-hover focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
      },
      [TextareaState.SUCCESS]: {
        container:
          "border-success hover:border-success focus-within:border-success focus-within:ring-2 focus-within:ring-success/20",
      },
      [TextareaState.WARNING]: {
        container:
          "border-warning hover:border-warning focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20",
      },
      [TextareaState.ERROR]: {
        container:
          "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20",
      },
    };
    const resizeStyles = {
      [TextareaResize.NONE]: "resize-none",
      [TextareaResize.VERTICAL]: "resize-y",
      [TextareaResize.HORIZONTAL]: "resize-x",
      [TextareaResize.BOTH]: "resize",
    };
    const containerClassName = clsx(
      "relative rounded-lg transition-colors",
      variantStyles[variant].container,
      stateStyles[currentState].container,
      {
        "w-full": isFullWidth,
        "opacity-50 cursor-not-allowed": isDisabled,
      }
    );
    const textareaClassName = clsx(
      "w-full outline-none transition-colors placeholder:text-text-muted text-text-primary bg-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "read-only:cursor-not-allowed",
      sizeStyles[size].textarea,
      resizeStyles[resize],
      className
    );
    const reactId = useId();
    const textareaId = id || `textarea-${reactId}`;
    return (
      <div className={clsx("space-y-1", { "w-full": isFullWidth })}>
        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              "block font-medium text-text-primary",
              sizeStyles[size].label,
              {
                "after:content-['*'] after:text-destructive after:ml-1":
                  isRequired,
              }
            )}
          >
            {label}
          </label>
        )}

        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}

        <div className={containerClassName}>
          <textarea
            ref={ref}
            id={textareaId}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            maxLength={maxLength}
            value={value}
            className={textareaClassName}
            {...props}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            {(helperText || errorMessage) && (
              <p
                className={clsx(
                  "text-sm",
                  currentState === TextareaState.ERROR
                    ? "text-destructive"
                    : "text-text-secondary"
                )}
              >
                {errorMessage || helperText}
              </p>
            )}
          </div>

          {showCharCount && (
            <div className="flex-shrink-0 ml-4">
              <span
                className={clsx(
                  "text-sm",
                  maxLength && charCount > maxLength
                    ? "text-destructive"
                    : "text-text-muted"
                )}
              >
                {charCount}
                {maxLength && `/${maxLength}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export default Textarea;

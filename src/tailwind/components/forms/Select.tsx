import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef, useId } from "react";
import Icon, { IconColor } from "../elements/Icon";
export enum SelectSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum SelectVariant {
  DEFAULT = "default",
  OUTLINE = "outline",
  FILLED = "filled",
}
export enum SelectState {
  DEFAULT = "default",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
export interface SelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}
export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  size?: SelectSize;
  variant?: SelectVariant;
  state?: SelectState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: IconDefinition;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFullWidth?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
}
const Select = React.memo(
  forwardRef<HTMLSelectElement, SelectProps>(
    (
      {
        options,
        size = SelectSize.MD,
        variant = SelectVariant.DEFAULT,
        state = SelectState.DEFAULT,
        label,
        placeholder,
        helperText,
        errorMessage,
        leftIcon,
        isDisabled = false,
        isRequired = false,
        isFullWidth = true,
        onValueChange,
        onChange,
        className,
        id,
        ...props
      },
      ref
    ) => {
      const sizeStyles = {
        [SelectSize.SM]: "h-8 px-3 text-sm",
        [SelectSize.MD]: "h-10 px-4 text-base",
        [SelectSize.LG]: "h-12 px-5 text-lg",
      };
      const variantStyles = {
        [SelectVariant.DEFAULT]: "bg-background border-border",
        [SelectVariant.OUTLINE]: "bg-transparent border-2 border-border",
        [SelectVariant.FILLED]: "bg-secondary border-transparent",
      };
      const stateStyles = {
        [SelectState.DEFAULT]: "focus:border-primary focus:ring-primary/20",
        [SelectState.ERROR]:
          "border-destructive focus:border-destructive focus:ring-destructive/20",
        [SelectState.SUCCESS]:
          "border-success focus:border-success focus:ring-success/20",
        [SelectState.WARNING]:
          "border-warning focus:border-warning focus:ring-warning/20",
      };
      const iconSpacing = leftIcon
        ? {
            [SelectSize.SM]: "pl-9",
            [SelectSize.MD]: "pl-10",
            [SelectSize.LG]: "pl-12",
          }
        : {};
      const selectClassName = clsx(
        "appearance-none rounded-lg transition-colors",
        "focus:outline-none focus:ring-2",
        "text-text-primary",
        sizeStyles[size],
        variantStyles[variant],
        stateStyles[state],
        leftIcon && iconSpacing[size],
        isFullWidth && "w-full",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      );
      const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
      };
      const reactId = useId();
      const selectId = id || `select-${reactId}`;
      const currentHelperText =
        state === SelectState.ERROR ? errorMessage : helperText;
      const helperTextId = currentHelperText ? `${selectId}-helper` : undefined;
      return (
        <div className={clsx("space-y-2", !isFullWidth && "inline-block")}>
          {label && (
            <label
              htmlFor={selectId}
              className="block text-sm font-medium text-text-primary"
            >
              {label}
              {isRequired && (
                <span className="text-destructive ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}

          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon={leftIcon} size="sm" color={IconColor.MUTED} />
              </div>
            )}

            <select
              ref={ref}
              id={selectId}
              className={selectClassName}
              disabled={isDisabled}
              required={isRequired}
              onChange={handleChange}
              aria-describedby={helperTextId}
              aria-invalid={state === SelectState.ERROR}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}

              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.isDisabled}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {currentHelperText && (
            <p
              id={helperTextId}
              className={clsx(
                "text-sm",
                state === SelectState.ERROR
                  ? "text-destructive"
                  : "text-text-muted"
              )}
            >
              {currentHelperText}
            </p>
          )}
        </div>
      );
    }
  )
);
Select.displayName = "Select";
export default Select;

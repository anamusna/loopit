import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import clsx from "clsx";
import React, { forwardRef } from "react";
import Icon, { IconColor } from "../elements/Icon";
export enum SegmentedControlSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum SegmentedControlVariant {
  DEFAULT = "default",
  FILLED = "filled",
  OUTLINE = "outline",
}
export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: IconDefinition;
  isDisabled?: boolean;
}
export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  size?: SegmentedControlSize;
  variant?: SegmentedControlVariant;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}
const SegmentedControl = React.memo(
  forwardRef<HTMLDivElement, SegmentedControlProps>(
    (
      {
        options,
        value,
        size = SegmentedControlSize.MD,
        variant = SegmentedControlVariant.DEFAULT,
        isDisabled = false,
        isFullWidth = false,
        onChange,
        className,
        id,
        name,
        "aria-label": ariaLabel,
      },
      ref
    ) => {
      const sizeStyles = {
        [SegmentedControlSize.SM]: "text-sm",
        [SegmentedControlSize.MD]: "text-base",
        [SegmentedControlSize.LG]: "text-lg",
      };
      const buttonSizeStyles = {
        [SegmentedControlSize.SM]: "px-3 py-1.5 gap-1.5",
        [SegmentedControlSize.MD]: "px-4 py-2 gap-2",
        [SegmentedControlSize.LG]: "px-5 py-2.5 gap-2.5",
      };
      const containerVariantStyles = {
        [SegmentedControlVariant.DEFAULT]: "bg-secondary border-border",
        [SegmentedControlVariant.FILLED]: "bg-accent border-accent",
        [SegmentedControlVariant.OUTLINE]:
          "bg-transparent border-2 border-border",
      };
      const selectedButtonStyles = {
        [SegmentedControlVariant.DEFAULT]:
          "bg-background text-text-primary shadow-sm border border-border",
        [SegmentedControlVariant.FILLED]:
          "bg-primary text-primary-foreground shadow-sm",
        [SegmentedControlVariant.OUTLINE]:
          "bg-background text-text-primary shadow-sm border border-primary",
      };
      const unselectedButtonStyles = {
        [SegmentedControlVariant.DEFAULT]:
          "text-text-secondary hover:text-text-primary",
        [SegmentedControlVariant.FILLED]:
          "text-text-muted hover:text-text-primary",
        [SegmentedControlVariant.OUTLINE]:
          "text-text-secondary hover:text-text-primary",
      };
      const containerClassName = clsx(
        "inline-flex rounded-lg p-1 border transition-colors",
        sizeStyles[size],
        containerVariantStyles[variant],
        isFullWidth && "w-full",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      );
      const handleOptionChange = (optionValue: string) => {
        if (isDisabled) return;
        onChange(optionValue);
      };
      const controlId =
        id ||
        name ||
        `segmented-control-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <div
          ref={ref}
          id={controlId}
          className={containerClassName}
          role="tablist"
          aria-label={ariaLabel}
        >
          {options.map((option, index) => {
            const isSelected = value === option.value;
            const isOptionDisabled = isDisabled || option.isDisabled;
            const buttonClassName = clsx(
              "flex items-center justify-center rounded-md font-medium",
              "transition-all duration-200 ease-in-out",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              buttonSizeStyles[size],
              isFullWidth && "flex-1",
              isSelected
                ? selectedButtonStyles[variant]
                : unselectedButtonStyles[variant],
              isOptionDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            );
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${controlId}-panel-${index}`}
                disabled={isOptionDisabled}
                onClick={() => handleOptionChange(option.value)}
                className={buttonClassName}
              >
                {option.icon && (
                  <Icon
                    icon={option.icon}
                    size="sm"
                    color={isSelected ? IconColor.INHERIT : IconColor.MUTED}
                  />
                )}

                {option.label}
              </button>
            );
          })}
        </div>
      );
    }
  )
);
SegmentedControl.displayName = "SegmentedControl";
export default SegmentedControl;

import clsx from "clsx";
import React, { forwardRef, useState } from "react";
import Datepicker, {
  DateRangeType,
  DateValueType,
  ShortcutsItem,
} from "react-tailwindcss-datepicker";
export enum DateSelectSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum DateSelectVariant {
  DEFAULT = "default",
  OUTLINE = "outline",
  FILLED = "filled",
}
export enum DateSelectState {
  DEFAULT = "default",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
export interface DateSelectProps {
  size?: DateSelectSize;
  variant?: DateSelectVariant;
  state?: DateSelectState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  initialDate?: DateValueType;
  minDate?: Date;
  maxDate?: Date;
  isDisabled?: boolean;
  isRequired?: boolean;
  useRange?: boolean;
  asSingle?: boolean;
  showShortcuts?: boolean;
  isFullWidth?: boolean;
  onChange: (date: DateRangeType) => void;
  locale?: string;
  shortcuts?: Record<string, ShortcutsItem>;
  className?: string;
  id?: string;
  name?: string;
}
const DateSelect = React.memo(
  forwardRef<HTMLDivElement, DateSelectProps>(
    (
      {
        size = DateSelectSize.MD,
        variant = DateSelectVariant.DEFAULT,
        state = DateSelectState.DEFAULT,
        label,
        placeholder = "Select a date",
        helperText,
        errorMessage,
        initialDate = { startDate: null, endDate: null },
        minDate,
        maxDate,
        isDisabled = false,
        isRequired = false,
        useRange = false,
        asSingle = true,
        showShortcuts = true,
        isFullWidth = true,
        onChange,
        locale = "de",
        shortcuts,
        className,
        id,
        name,
      },
      ref
    ) => {
      const [date, setDate] = useState<DateValueType>(initialDate);
      const dateSelectId =
        id || name || `date-select-${Math.random().toString(36).substr(2, 9)}`;
      const currentHelperText =
        state === DateSelectState.ERROR ? errorMessage : helperText;
      const helperTextId = currentHelperText
        ? `${dateSelectId}-helper`
        : undefined;
      const sizeStyles = {
        [DateSelectSize.SM]: "h-8 px-3 text-sm",
        [DateSelectSize.MD]: "h-10 px-4 text-base",
        [DateSelectSize.LG]: "h-12 px-5 text-lg",
      };
      const variantStyles = {
        [DateSelectVariant.DEFAULT]: "bg-background border-border",
        [DateSelectVariant.OUTLINE]: "bg-transparent border-2 border-border",
        [DateSelectVariant.FILLED]: "bg-secondary border-transparent",
      };
      const stateStyles = {
        [DateSelectState.DEFAULT]:
          "focus-within:border-primary focus-within:ring-primary/20",
        [DateSelectState.ERROR]:
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        [DateSelectState.SUCCESS]:
          "border-success focus-within:border-success focus-within:ring-success/20",
        [DateSelectState.WARNING]:
          "border-warning focus-within:border-warning focus-within:ring-warning/20",
      };
      const inputClassName = clsx(
        "w-full rounded-lg transition-colors",
        "focus:outline-none focus:ring-2",
        "text-text-primary placeholder:text-text-muted",
        sizeStyles[size],
        variantStyles[variant],
        stateStyles[state],
        isDisabled && "opacity-50 cursor-not-allowed"
      );
      const handleDateChange = (newDate: DateValueType) => {
        if (newDate) {
          const startDate = newDate.startDate
            ? newDate.startDate.toLocaleString("de-DE")
            : null;
          const endDate = newDate.endDate
            ? newDate.endDate.toLocaleString("de-DE")
            : null;
          console.log("Selected date range:", { startDate, endDate });
          setDate(newDate);
          onChange(newDate as DateRangeType);
        }
      };
      const defaultShortcuts: Record<string, ShortcutsItem> = {
        today: {
          text: "Heute",
          period: { start: new Date(), end: new Date() },
        },
        thisWeek: {
          text: "Diese Woche",
          period: {
            start: new Date(
              new Date().setDate(new Date().getDate() - new Date().getDay())
            ),
            end: new Date(
              new Date().setDate(
                new Date().getDate() + (6 - new Date().getDay())
              )
            ),
          },
        },
        thisMonth: {
          text: "Dieser Monat",
          period: {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            end: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ),
          },
        },
      };
      const mergedShortcuts = {
        ...defaultShortcuts,
        ...shortcuts,
      };
      return (
        <div
          ref={ref}
          className={clsx(
            "space-y-2",
            !isFullWidth && "inline-block",
            className
          )}
        >
          {label && (
            <label
              htmlFor={dateSelectId}
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

          <Datepicker
            value={date}
            i18n={locale}
            onChange={handleDateChange}
            inputClassName={inputClassName}
            useRange={useRange}
            placeholder={placeholder}
            primaryColor="blue"
            showShortcuts={showShortcuts}
            disabled={isDisabled}
            minDate={minDate}
            asSingle={asSingle}
            maxDate={maxDate}
            configs={{
              shortcuts: mergedShortcuts,
            }}
          />

          {currentHelperText && (
            <p
              id={helperTextId}
              className={clsx(
                "text-sm",
                state === DateSelectState.ERROR
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
DateSelect.displayName = "DateSelect";
export default DateSelect;

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef } from "react";
import Select from "react-select";
import Icon, { IconColor } from "../elements/Icon";
export enum SelectInputSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum SelectInputVariant {
  DEFAULT = "default",
  OUTLINE = "outline",
  FILLED = "filled",
}
export enum SelectInputState {
  DEFAULT = "default",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
export interface SelectInputOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}
export interface SelectInputProps {
  options: SelectInputOption[];
  size?: SelectInputSize;
  variant?: SelectInputVariant;
  state?: SelectInputState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  value?: SelectInputOption | null;
  defaultValue?: SelectInputOption;
  isDisabled?: boolean;
  isRequired?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
  isFullWidth?: boolean;
  onChange: (
    selectedOption: SelectInputOption | SelectInputOption[] | null
  ) => void;
  onInputChange?: (inputValue: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  "aria-invalid"?: boolean;
}
const SelectInput = React.memo(
  forwardRef<any, SelectInputProps>(
    (
      {
        options,
        size = SelectInputSize.MD,
        variant = SelectInputVariant.DEFAULT,
        state = SelectInputState.DEFAULT,
        label,
        placeholder,
        helperText,
        errorMessage,
        value,
        defaultValue,
        isDisabled = false,
        isRequired = false,
        isSearchable = true,
        isMulti = false,
        isClearable = false,
        isFullWidth = true,
        onChange,
        onInputChange,
        onFocus,
        onBlur,
        className,
        id,
        name,
        "aria-label": ariaLabel,
        "aria-describedby": ariaDescribedby,
        "aria-required": ariaRequired,
        "aria-invalid": ariaInvalid,
      },
      ref
    ) => {
      const selectId =
        id || name || `select-input-${Math.random().toString(36).substr(2, 9)}`;
      const currentHelperText =
        state === SelectInputState.ERROR ? errorMessage : helperText;
      const helperTextId = currentHelperText ? `${selectId}-helper` : undefined;
      const controlHeights = {
        [SelectInputSize.SM]: "32px",
        [SelectInputSize.MD]: "40px",
        [SelectInputSize.LG]: "48px",
      };
      const customStyles = {
        control: (base: any, state: any) => ({
          ...base,
          minHeight: controlHeights[size],
          height: controlHeights[size],
          backgroundColor: "hsl(var(--background))",
          borderColor: state.isFocused
            ? "hsl(var(--primary))"
            : state === SelectInputState.ERROR
            ? "hsl(var(--destructive))"
            : "hsl(var(--border))",
          borderWidth: variant === SelectInputVariant.OUTLINE ? "2px" : "1px",
          borderRadius: "8px",
          boxShadow: state.isFocused
            ? `0 0 0 2px hsl(var(--primary) / 0.2)`
            : "none",
          color: "hsl(var(--text-primary))",
          cursor: isDisabled ? "not-allowed" : "default",
          opacity: isDisabled ? 0.5 : 1,
          "&:hover": {
            borderColor: state.isFocused
              ? "hsl(var(--primary))"
              : "hsl(var(--border-hover))",
          },
        }),
        valueContainer: (base: any) => ({
          ...base,
          padding:
            size === SelectInputSize.SM
              ? "0 8px"
              : size === SelectInputSize.LG
              ? "0 16px"
              : "0 12px",
        }),
        input: (base: any) => ({
          ...base,
          color: "hsl(var(--text-primary))",
          fontSize:
            size === SelectInputSize.SM
              ? "14px"
              : size === SelectInputSize.LG
              ? "18px"
              : "16px",
        }),
        placeholder: (base: any) => ({
          ...base,
          color: "hsl(var(--text-muted))",
        }),
        singleValue: (base: any) => ({
          ...base,
          color: "hsl(var(--text-primary))",
        }),
        menu: (base: any) => ({
          ...base,
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 50,
        }),
        option: (base: any, state: any) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "hsl(var(--primary))"
            : state.isFocused
            ? "hsl(var(--accent))"
            : "transparent",
          color: state.isSelected
            ? "hsl(var(--primary-foreground))"
            : "hsl(var(--text-primary))",
          cursor: "pointer",
          "&:active": {
            backgroundColor: state.isSelected
              ? "hsl(var(--primary))"
              : "hsl(var(--accent))",
          },
        }),
        multiValue: (base: any) => ({
          ...base,
          backgroundColor: "hsl(var(--secondary))",
          borderRadius: "6px",
        }),
        multiValueLabel: (base: any) => ({
          ...base,
          color: "hsl(var(--secondary-foreground))",
        }),
        multiValueRemove: (base: any) => ({
          ...base,
          color: "hsl(var(--secondary-foreground))",
          "&:hover": {
            backgroundColor: "hsl(var(--destructive))",
            color: "hsl(var(--destructive-foreground))",
          },
        }),
        indicatorSeparator: (base: any) => ({
          ...base,
          backgroundColor: "hsl(var(--border))",
        }),
        dropdownIndicator: (base: any) => ({
          ...base,
          color: "hsl(var(--text-muted))",
          "&:hover": {
            color: "hsl(var(--text-primary))",
          },
        }),
        clearIndicator: (base: any) => ({
          ...base,
          color: "hsl(var(--text-muted))",
          "&:hover": {
            color: "hsl(var(--destructive))",
          },
        }),
      };
      const customComponents = {
        DropdownIndicator: () => (
          <div className="flex items-center justify-center w-5 h-5 mr-2">
            <Icon icon={faCaretDown} size="sm" color={IconColor.MUTED} />
          </div>
        ),
      };
      return (
        <div
          className={clsx(
            "space-y-2",
            !isFullWidth && "inline-block",
            className
          )}
        >
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

          <Select
            ref={ref}
            inputId={selectId}
            name={name}
            options={options}
            value={value}
            defaultValue={defaultValue}
            onChange={(newValue: any) => {
              if (Array.isArray(newValue)) {
                onChange([...newValue]);
              } else if (newValue) {
                onChange(newValue);
              } else {
                onChange(null);
              }
            }}
            onInputChange={onInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isSearchable={isSearchable}
            isMulti={isMulti}
            isClearable={isClearable}
            styles={customStyles}
            components={customComponents}
            className={clsx("react-select-container", isFullWidth && "w-full")}
            classNamePrefix="react-select"
            aria-label={ariaLabel || label}
            aria-describedby={ariaDescribedby || helperTextId}
            aria-required={ariaRequired || isRequired}
            aria-invalid={ariaInvalid || state === SelectInputState.ERROR}
          />

          {currentHelperText && (
            <p
              id={helperTextId}
              className={clsx(
                "text-sm",
                state === SelectInputState.ERROR
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
SelectInput.displayName = "SelectInput";
export default SelectInput;

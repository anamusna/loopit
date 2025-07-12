import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef, useId, useState } from "react";
import Icon, { IconColor } from "../elements/Icon";
import SelectInput from "./SelectInput";
enum SelectInputState {
  DEFAULT = "default",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
export enum FormControlSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum FormControlVariant {
  DEFAULT = "default",
  OUTLINE = "outline",
  FILLED = "filled",
}
export enum FormControlState {
  DEFAULT = "default",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
export enum FormControlType {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  TEL = "tel",
  URL = "url",
  SEARCH = "search",
  SELECT = "select",
  DATE = "date",
  TIME = "time",
  DATETIME_LOCAL = "datetime-local",
}
export interface FormControlOption {
  value: string;
  label: string;
  ariaLabel?: string;
}
export interface FormControlProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  type?: FormControlType;
  size?: FormControlSize;
  variant?: FormControlVariant;
  state?: FormControlState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  caption?: string;
  options?: FormControlOption[];
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFullWidth?: boolean;
  showLabel?: boolean;
  onValueChange?: (value: string) => void;
  onSelectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  formErrors?: {
    isValid?: boolean;
    [key: string]: string | boolean | undefined;
  };
  fieldName?: string;
  field?: string;
  displayLabel?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement> | unknown) => void;
  user?: Record<string, unknown>;
  className?: string;
}
const FormControl = React.memo(
  forwardRef<HTMLInputElement, FormControlProps>((props, ref) => {
    const {
      type = FormControlType.TEXT,
      size = FormControlSize.MD,
      variant = FormControlVariant.DEFAULT,
      state = FormControlState.DEFAULT,
      label,
      placeholder,
      helperText,
      errorMessage,
      caption,
      options,
      leftIcon,
      rightIcon,
      isDisabled = false,
      isRequired = false,
      isFullWidth = true,
      showLabel = true,
      onValueChange,
      onSelectChange,
      formErrors,
      fieldName,
      field,
      displayLabel = true,
      handleChange,
      user,
      onChange,
      onKeyDown,
      value,
      defaultValue,
      className,
      id,
      name,
      ...restProps
    } = props;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [selectedOption, setSelectedOption] =
      useState<FormControlOption | null>(
        defaultValue ? (defaultValue as unknown as FormControlOption) : null
      );
    const actualFieldName = fieldName || field || name;
    const isValid = formErrors?.isValid;
    const validationMessage = actualFieldName
      ? formErrors?.[actualFieldName]
      : undefined;
    const hasValidationError = isValid === false && validationMessage;
    const currentState = hasValidationError ? FormControlState.ERROR : state;
    const currentHelperText =
      currentState === FormControlState.ERROR
        ? errorMessage || validationMessage
        : helperText;
    const reactId = useId();
    const controlId = id || actualFieldName || reactId;
    const helperTextId = currentHelperText ? `${controlId}-helper` : undefined;
    const sizeStyles = {
      [FormControlSize.SM]: "h-8 px-3 text-sm",
      [FormControlSize.MD]: "h-10 px-4 text-base",
      [FormControlSize.LG]: "h-12 px-5 text-lg",
    };
    const variantStyles = {
      [FormControlVariant.DEFAULT]: "bg-background border-border",
      [FormControlVariant.OUTLINE]: "bg-transparent border-2 border-border",
      [FormControlVariant.FILLED]: "bg-secondary border-transparent",
    };
    const stateStyles = {
      [FormControlState.DEFAULT]: "focus:border-primary focus:ring-primary/20",
      [FormControlState.ERROR]:
        "border-destructive focus:border-destructive focus:ring-destructive/20",
      [FormControlState.SUCCESS]:
        "border-success focus:border-success focus:ring-success/20",
      [FormControlState.WARNING]:
        "border-warning focus:border-warning focus:ring-warning/20",
    };
    const iconSpacing = {
      left: leftIcon
        ? {
            [FormControlSize.SM]: "pl-9",
            [FormControlSize.MD]: "pl-10",
            [FormControlSize.LG]: "pl-12",
          }
        : {},
      right:
        rightIcon || type === FormControlType.PASSWORD
          ? {
              [FormControlSize.SM]: "pr-9",
              [FormControlSize.MD]: "pr-10",
              [FormControlSize.LG]: "pr-12",
            }
          : {},
    };
    const inputClassName = clsx(
      "w-full rounded-lg border transition-colors",
      "focus:outline-none focus:ring-2",
      "text-text-primary placeholder:text-text-muted",
      sizeStyles[size],
      variantStyles[variant],
      stateStyles[currentState],
      leftIcon && iconSpacing.left[size],
      (rightIcon || type === FormControlType.PASSWORD) &&
        iconSpacing.right[size],
      isDisabled && "opacity-50 cursor-not-allowed"
    );
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
      handleChange?.(e);
    };
    const handleSelectInputChange = (
      selectedOption: FormControlOption | FormControlOption[] | null
    ) => {
      const newSelectedOption = Array.isArray(selectedOption)
        ? selectedOption[0]
        : selectedOption;
      if (onSelectChange) {
        const syntheticEvent = {
          target: {
            value: newSelectedOption?.value || "",
            name: actualFieldName || "",
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        onSelectChange(syntheticEvent);
      } else if (handleChange) {
        handleChange(newSelectedOption);
      }
      setSelectedOption(newSelectedOption);
    };
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };
    const inputType =
      type === FormControlType.PASSWORD && isPasswordVisible ? "text" : type;
    const shouldShowLabel = (showLabel || displayLabel) && label;
    return (
      <div
        className={clsx("space-y-2", !isFullWidth && "inline-block", className)}
      >
        {shouldShowLabel && (
          <label
            htmlFor={controlId}
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

          {type === FormControlType.SELECT ? (
            <SelectInput
              options={
                options?.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                })) || []
              }
              value={selectedOption}
              placeholder={placeholder || label || name}
              onChange={handleSelectInputChange}
              isDisabled={isDisabled}
              isRequired={isRequired}
              className="w-full"
              id={controlId}
              state={
                currentState === FormControlState.ERROR
                  ? SelectInputState.ERROR
                  : currentState === FormControlState.SUCCESS
                  ? SelectInputState.SUCCESS
                  : currentState === FormControlState.WARNING
                  ? SelectInputState.WARNING
                  : SelectInputState.DEFAULT
              }
              errorMessage={
                currentState === FormControlState.ERROR
                  ? typeof currentHelperText === "string"
                    ? currentHelperText
                    : undefined
                  : undefined
              }
            />
          ) : (
            <input
              ref={ref}
              id={controlId}
              name={actualFieldName}
              type={inputType}
              value={value}
              defaultValue={
                (typeof user?.[actualFieldName as string] === "string" ||
                typeof user?.[actualFieldName as string] === "number" ||
                Array.isArray(user?.[actualFieldName as string])
                  ? user?.[actualFieldName as string]
                  : defaultValue) as
                  | string
                  | number
                  | readonly string[]
                  | undefined
              }
              placeholder={placeholder}
              disabled={isDisabled}
              required={isRequired}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              className={inputClassName}
              aria-describedby={helperTextId}
              aria-invalid={currentState === FormControlState.ERROR}
              autoComplete="on"
              {...restProps}
            />
          )}

          {type === FormControlType.PASSWORD && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-colors"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              <Icon
                icon={isPasswordVisible ? faEyeSlash : faEye}
                size="sm"
                color={IconColor.MUTED}
              />
            </button>
          )}
          {rightIcon && type !== FormControlType.PASSWORD && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Icon icon={rightIcon} size="sm" color={IconColor.MUTED} />
            </div>
          )}
        </div>

        {currentHelperText && (
          <p
            id={helperTextId}
            className={clsx(
              "text-sm",
              currentState === FormControlState.ERROR
                ? "text-destructive"
                : "text-text-muted"
            )}
            role={currentState === FormControlState.ERROR ? "alert" : undefined}
          >
            {currentHelperText}
          </p>
        )}

        {caption && (
          <p className="text-xs text-text-muted" id={`${controlId}-caption`}>
            {caption}
          </p>
        )}
      </div>
    );
  })
);
FormControl.displayName = "FormControl";
export default FormControl;

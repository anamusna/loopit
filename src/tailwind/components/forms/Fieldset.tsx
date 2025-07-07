import {
  faAdd,
  faLock,
  faLockOpen,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { forwardRef, useEffect, useState } from "react";
import Button, { ButtonSize, ButtonVariant } from "../elements/Button";
import { Typography, TypographyVariant } from "../elements/Typography";
export enum FieldsetSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum FieldsetVariant {
  DEFAULT = "default",
  OUTLINED = "outlined",
  FILLED = "filled",
}
export enum FieldsetType {
  TEXT = "text",
  NOTE = "note",
  RICH_TEXT = "richText",
}
export interface FieldsetProps {
  data?: string;
  title?: string;
  children?: React.ReactNode;
  size?: FieldsetSize;
  variant?: FieldsetVariant;
  type?: FieldsetType;
  isEditing?: boolean;
  isConfidential?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  onButtonClick?: () => void;
  onConfidentialToggle?: () => void;
  className?: string;
  editing?: boolean;
  field?: string;
  id?: string;
  "aria-label"?: string;
}
const SimpleRichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, placeholder, disabled, className }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx(
        "w-full min-h-32 p-3 border rounded-lg resize-vertical",
        "bg-background text-text-primary placeholder:text-text-muted",
        "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
        "focus:outline-none transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      rows={6}
    />
  );
};
const Fieldset = React.memo(
  forwardRef<HTMLDivElement, FieldsetProps>(
    (
      {
        data = "",
        title,
        children,
        size = FieldsetSize.MD,
        variant = FieldsetVariant.DEFAULT,
        type = FieldsetType.TEXT,
        isEditing = false,
        isConfidential = false,
        isDisabled = false,
        onChange,
        onButtonClick,
        onConfidentialToggle,
        className,
        editing = false,
        field = "text",
        id,
        "aria-label": ariaLabel,
      },
      ref
    ) => {
      const [internalValue, setInternalValue] = useState(data);
      useEffect(() => {
        setInternalValue(data);
      }, [data]);
      const actualIsEditing = isEditing || editing;
      const actualType = field === "note" ? FieldsetType.NOTE : type;
      const sizeStyles = {
        [FieldsetSize.SM]: "p-3 text-sm",
        [FieldsetSize.MD]: "p-4 text-base",
        [FieldsetSize.LG]: "p-5 text-lg",
      };
      const variantStyles = {
        [FieldsetVariant.DEFAULT]: "bg-background border-border",
        [FieldsetVariant.OUTLINED]: "bg-transparent border-2 border-border",
        [FieldsetVariant.FILLED]: "bg-secondary border-transparent",
      };
      const buttonSizes = {
        [FieldsetSize.SM]: ButtonSize.SM,
        [FieldsetSize.MD]: ButtonSize.MD,
        [FieldsetSize.LG]: ButtonSize.LG,
      };
      const handleValueChange = (newValue: string) => {
        setInternalValue(newValue);
        onChange?.(newValue);
      };
      const fieldsetClassName = clsx(
        "relative rounded-lg border shadow-sm transition-all duration-200",
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      );
      const fieldsetId =
        id || `fieldset-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <div
          ref={ref}
          id={fieldsetId}
          className={fieldsetClassName}
          role="group"
          aria-label={ariaLabel || title}
        >
          {title && (
            <Typography as={TypographyVariant.H4} className="mb-4">
              {title}
            </Typography>
          )}

          {actualType === FieldsetType.NOTE && onConfidentialToggle && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={onConfidentialToggle}
                  icon={isConfidential ? faLock : faLockOpen}
                  variant={
                    isConfidential ? ButtonVariant.PRIMARY : ButtonVariant.GHOST
                  }
                  size={buttonSizes[size]}
                  className="transition-all duration-200"
                  aria-label={
                    isConfidential
                      ? "Confidential Note"
                      : "Mark as Confidential"
                  }
                  disabled={isDisabled}
                >
                  {isConfidential ? "Confidential" : "Mark as Confidential"}
                </Button>
              </div>
            </div>
          )}

          <div className="min-h-32">
            {actualType === FieldsetType.RICH_TEXT ? (
              <SimpleRichTextEditor
                value={internalValue}
                onChange={handleValueChange}
                placeholder="Enter your content..."
                disabled={isDisabled}
              />
            ) : (
              <SimpleRichTextEditor
                value={internalValue}
                onChange={handleValueChange}
                placeholder={
                  actualType === FieldsetType.NOTE
                    ? "Add your note here..."
                    : "Enter your content..."
                }
                disabled={isDisabled}
              />
            )}
          </div>

          {actualType === FieldsetType.NOTE && onButtonClick && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={onButtonClick}
                icon={actualIsEditing ? faSave : faAdd}
                variant={ButtonVariant.PRIMARY}
                size={buttonSizes[size]}
                className="shadow-sm hover:shadow-md transition-all duration-200"
                disabled={isDisabled}
              >
                {actualIsEditing ? "Save Note" : "Add Note"}
              </Button>
            </div>
          )}

          {children}
        </div>
      );
    }
  )
);
Fieldset.displayName = "Fieldset";
export default Fieldset;

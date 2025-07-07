import { DateRangeType, DateValueType, ShortcutsItem } from "react-tailwindcss-datepicker";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
export interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  includeTime?: boolean;
  className?: string;
  placeholder?: string;
  icon?: IconDefinition;
  min?: Date;
  max?: Date;
  name?: string;
  id?: string;
  required?: boolean;
  "aria-required"?: boolean | "true" | "false";
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
  disabled?: boolean;
}
export interface DatepickerProps {
  label?: string;
  placeholder?: string;
  theme?: "light" | "dark";
  onChange: (date: DateRangeType) => void;
  useRange?: boolean;
  disabled?: boolean;
  asSingle?: boolean;
  initialDate?: DateValueType;
  minDate?: Date;
  maxDate?: Date;
  showShortcuts?: boolean;
  configs?: {
    shortcuts?: Record<string, ShortcutsItem>;
    footer?: React.ReactNode;
  };
  className?: string;
  value: Date | null;
  size?: "xs" | "sm" | "md" | "lg";
  includeTime?: boolean;
  min?: Date;
  max?: Date;
  name?: string;
  id?: string;
  required?: boolean;
  "aria-required"?: boolean | "true" | "false";
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
}

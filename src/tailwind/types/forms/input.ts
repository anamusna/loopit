import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { HTMLInputTypeAttribute } from "react";
export interface InputProps {
  name?: string;
  user?: any;
  type: HTMLInputTypeAttribute;
  label?: string;
  field?: string;
  displayLabel?: boolean;
  placeholder?: string;
  className?: string;
  caption?: any;
  value?: any;
  defaultValue?: any;
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  formErrors?: any;
  formData?: any;
  filterOption?: any;
  onKeyDown?: any;
  onInputChange?: any;
  onIconClick?: any;
  inputFieldRef?: any;
  options?: { value: string; label: string }[];
  validation?: Record<string, { valid: boolean; message: string }>;
  theme?: "dark" | "light";
  onChange?: (e: any) => void;
  handleChange?: (e: any) => void;
}

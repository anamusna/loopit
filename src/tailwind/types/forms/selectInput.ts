import { StylesConfig } from "react-select";
export interface SelectInputProps {
  name?: string;
  label?: string;
  options: SelectOption[];
  defaultValue?: SelectOption | string | number;
  placeholder?: string;
  onChange: (selectedOption: SelectOption | string | number) => void;
  className?: string;
  theme?: "light" | "dark";
  disabled?: boolean;
  isSearchable?: boolean;
  value?: SelectOption | null;
  id?: string;
  required?: boolean;
  "aria-required"?: boolean | "true" | "false";
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
}
export interface SelectOption {
  value: string;
  label: string;
  theme?: "light" | "dark";
  ariaLabel?: string;
}
type GroupType = {
  label: string;
  options: SelectOption[];
};
export type CustomStylesConfig = StylesConfig<SelectOption, true, GroupType>;

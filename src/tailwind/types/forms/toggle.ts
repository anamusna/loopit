import { IconProp } from "@fortawesome/fontawesome-svg-core";
export interface ToggleProps {
  checked: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  icon?: IconProp;
}

import { IconProp, SizeProp as FontAwesomeSizeProp } from "@fortawesome/fontawesome-svg-core";
export interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  className?: string;
  size?: string;
  theme?: "light" | "dark";
  variant?:
  | "primary"
  | "secondary"
  | "outline"
  | "transparent"
  | "danger"
  | "success";
  loading?: boolean;
  icon?: IconProp;
  iconOnly?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: boolean | "dialog" | "menu" | "listbox";
  role?: string;
  tabIndex?: number;
  id?: string;
}
export type SizeProp = FontAwesomeSizeProp | string;

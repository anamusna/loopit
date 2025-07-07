import { IconProp } from "@fortawesome/fontawesome-svg-core";
export interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  src: string;
  alt: string;
  shape?: "circle" | "rounded" | "square";
  status?: "active" | "inactive" | "away";
  borderColor?: string;
  theme?: "light" | "dark";
  variant?: "primary" | "secondary" | "outline" | "transparent";
  loading?: boolean;
  icon?: IconProp;
  iconOnly?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

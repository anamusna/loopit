export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "elevated" | "outlined" | "flat";
  hoverable?: boolean;
  title?: string;
  description?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl" | "fw";
  onClick?: () => void;
  loading?: boolean;
  "aria-label"?: string;
  collapsible?: boolean;
  expanded?: boolean;
}

export interface BreadcrumbProps {
  label?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
  separator?: string;
  icon?: React.ReactNode;
}

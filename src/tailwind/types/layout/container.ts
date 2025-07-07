export interface ContainerProps {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  style?: React.CSSProperties;
  className?: string;
  theme?: "light" | "dark";
}

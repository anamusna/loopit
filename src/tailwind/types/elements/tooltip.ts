export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  fullWidth?: boolean;
  size: string;
  position?: "top" | "bottom" | "left" | "right";
  theme?: "light" | "dark";
  className?: string;
}

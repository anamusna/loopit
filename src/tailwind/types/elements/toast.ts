import { IconProp } from "@fortawesome/fontawesome-svg-core";
type ToastType = "success" | "error" | "info" | "warning";
type ToastSize = "sm" | "md" | "lg";
export interface ToastProps {
  message?: string;
  title?: string;
  type?: ToastType;
  size?: ToastSize;
  duration?: number;
  children?: React.ReactNode;
  icon?: IconProp;
  closable?: boolean;
  className?: string;
  position?: string;
  action?: any;
  theme?: "light" | "dark";
  isVisible?: boolean;
  withIcon?: boolean;
  onDismiss?: () => void;
}

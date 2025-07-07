type AlertType = "success" | "error" | "warning" | "info";
type AlertTheme = "light" | "dark";
type AlertSize = "sm" | "md" | "lg";
export interface AlertProps {
  message: string | React.ReactNode;
  type?: AlertType;
  theme?: AlertTheme;
  size?: AlertSize;
  children?: React.ReactNode;
  title?: string;
  timeout?: any;
  dismissible?: boolean;
  isOpen?: boolean;
  onDismiss?: () => void;
  className?: string;
}

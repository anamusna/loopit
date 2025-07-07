export interface BannerProps {
  message: string;
  actionLabel?: string;
  actionLink?: string;
  theme?: "light" | "dark";
  dismissible?: boolean;
  onDismiss?: () => void;
}

type Tab = {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};
export interface TabsProps {
  tabs: Tab[];
  theme?: string;
  shape?: string;
  defaultActiveTab?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "outline" | "transparent" | "danger" | "success";
  mode?: "underline" | "pills";
  fullWidth?: boolean;
  onTabChange?: (tabId: string) => void;
  customClasses?: {
    tab?: string;
    activeTab?: string;
    content?: string;
  };
}
export type { Tab };

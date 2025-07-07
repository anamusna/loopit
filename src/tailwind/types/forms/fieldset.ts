import { ReactNode } from "react";
export interface FieldsetProps {
  data?: string;
  onChange?: (value: string) => void;
  editing?: boolean;
  onButtonClick?: () => void;
  field?: "text" | "note";
  isConfidential?: boolean;
  onConfidentialToggle?: () => void;
  title?: string;
  children?: ReactNode;
  className?: string;
  legend?: string;
}

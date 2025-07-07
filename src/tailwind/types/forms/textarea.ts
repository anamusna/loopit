export interface TextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  theme?: "light" | "dark";
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
};

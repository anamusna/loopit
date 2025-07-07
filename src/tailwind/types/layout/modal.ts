export interface ModalProps {
  isModalOpen: boolean;
  title: string;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl" | "fw";
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

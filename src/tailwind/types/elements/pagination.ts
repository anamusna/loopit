export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  variant?: string;
  onPageChange?: (page: number) => void;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

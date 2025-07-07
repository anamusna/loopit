export interface TableColumn {
  header: string;
  accessor: string;
  className?: string;
  cell?: (row: any) => React.ReactNode;
  ariaLabel?: string;
}
export interface TableProps {
  data: any[];
  columns: TableColumn[];
  striped?: boolean;
  hoverable?: boolean;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "fw";
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
  rowClick?: (row: any) => void;
  caption?: string;
  summary?: string;
  "aria-label"?: string;
}

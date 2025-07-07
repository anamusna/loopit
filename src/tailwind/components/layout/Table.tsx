import clsx from "clsx";
import React, { forwardRef } from "react";
export enum TableSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  FULL = "full",
}
export enum TableVariant {
  DEFAULT = "default",
  STRIPED = "striped",
  BORDERED = "bordered",
}
export interface TableColumn {
  key?: string;
  accessor?: string;
  header: string;
  cell?: (row: Record<string, unknown>) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}
export interface TableProps {
  data: Record<string, unknown>[];
  columns: TableColumn[];
  size?: TableSize;
  variant?: TableVariant;
  isStriped?: boolean;
  isHoverable?: boolean;
  showBorders?: boolean;
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
  caption?: string;
  summary?: string;
  emptyMessage?: string;
  className?: string;
  rowClassName?:
    | string
    | ((row: Record<string, unknown>, index: number) => string);
  "aria-label"?: string;
  id?: string;
}
const Table = React.memo(
  forwardRef<HTMLDivElement, TableProps>(
    (
      {
        data,
        columns,
        size = TableSize.MD,
        variant = TableVariant.DEFAULT,
        isStriped = false,
        isHoverable = false,
        showBorders = true, 
        onRowClick,
        caption,
        summary,
        emptyMessage = "No data available",
        className,
        rowClassName,
        "aria-label": ariaLabel,
        id,
      },
      ref
    ) => {
      const sizeStyles = {
        [TableSize.SM]: "text-sm",
        [TableSize.MD]: "text-base",
        [TableSize.LG]: "text-lg",
        [TableSize.XL]: "text-xl",
        [TableSize.FULL]: "w-full",
      };
      const variantStyles = {
        [TableVariant.DEFAULT]: "divide-y divide-border",
        [TableVariant.STRIPED]: "divide-y divide-border",
        [TableVariant.BORDERED]: "border border-border divide-y divide-border",
      };
      const getColumnKey = (column: TableColumn) =>
        column.key || column.accessor || "";
      const getCellContent = (
        row: Record<string, unknown>,
        column: TableColumn
      ) => {
        if (column.cell) {
          return column.cell(row);
        }
        const key = getColumnKey(column);
        const value = row[key];
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          React.isValidElement(value)
        ) {
          return value;
        }
        return "";
      };
      const getRowClassName = (row: Record<string, unknown>, index: number) => {
        if (typeof rowClassName === "function") {
          return rowClassName(row, index);
        }
        return rowClassName || "";
      };
      const tableClassName = clsx(
        "min-w-full",
        sizeStyles[size],
        variantStyles[variant],
        isHoverable && "hover:bg-secondary/50"
      );
      const containerClassName = clsx("w-full", className);
      const tableId = id || `table-${Math.random().toString(36).substr(2, 9)}`;
      const DesktopTable = () => (
        <div className="hidden md:block overflow-x-auto">
          <table
            className={tableClassName}
            role="table"
            aria-label={ariaLabel}
            aria-rowcount={data.length + 1}
            aria-colcount={columns.length}
            summary={summary}
          >
            {caption && (
              <caption className="text-text-muted text-sm mb-4">
                {caption}
              </caption>
            )}
            <thead className="bg-secondary/50">
              <tr role="row">
                {columns.map((column) => (
                  <th
                    key={getColumnKey(column)}
                    scope="col"
                    role="columnheader"
                    className={clsx(
                      "px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    role="row"
                    aria-rowindex={rowIndex + 2}
                    className={clsx(
                      "transition-colors duration-150",
                      isStriped && rowIndex % 2 === 0 && "bg-secondary/25",
                      isHoverable && "hover:bg-secondary/50",
                      onRowClick && "cursor-pointer",
                      getRowClassName(row, rowIndex)
                    )}
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {columns.map((column) => (
                      <td
                        key={getColumnKey(column)}
                        role="cell"
                        className={clsx(
                          "px-6 py-4 whitespace-nowrap text-text-primary",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {getCellContent(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
      const MobileTable = () => (
        <div className="md:hidden space-y-4">
          {data.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              {emptyMessage}
            </div>
          ) : (
            data.map((row, rowIndex) => (
              <div
                key={rowIndex}
                role="row"
                aria-rowindex={rowIndex + 2}
                className={clsx(
                  "p-4 rounded-lg border bg-background shadow-sm",
                  "transition-all duration-200",
                  isHoverable && "hover:shadow-md hover:border-border-hover",
                  onRowClick && "cursor-pointer active:scale-95",
                  getRowClassName(row, rowIndex)
                )}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((column) => (
                  <div
                    key={getColumnKey(column)}
                    role="cell"
                    className="mb-3 last:mb-0"
                  >
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      {column.header}
                    </div>
                    <div className="text-text-primary">
                      {getCellContent(row, column)}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      );
      return (
        <div
          ref={ref}
          id={tableId}
          className={containerClassName}
          role="region"
          aria-label={ariaLabel || "Data table"}
        >
          <DesktopTable />
          <MobileTable />
        </div>
      );
    }
  )
);
Table.displayName = "Table";
export default Table;

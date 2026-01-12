

import * as React from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import IconFirstPage from "@/assets/icons/js/테이블페이지더블아이콘02";
import IconPrevPage from "@/assets/icons/js/테이블페이지싱글아이콘01";
import IconNextPage from "@/assets/icons/js/테이블페이지싱글아이콘02";
import IconLastPage from "@/assets/icons/js/테이블페이지더블아이콘01";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  amountColumns?: string[];
  dateColumnConfig?: Record<string, "YYYYMMDD" | "ISO">;
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;
  minWidth?: string;
  hidePagination?: boolean;
  hideToolbar?: boolean;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  amountColumns = [],
  dateColumnConfig = {},
  onRowClick,
  onRowDoubleClick,
  minWidth,
  hidePagination = false,
  hideToolbar = false,
  pageSize = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  const processedColumns = React.useMemo(() => {
    const processColumn = (col: any): any => {
      if (col.columns) {
        return {
          ...col,
          columns: col.columns.map(processColumn),
        };
      }

      const accessorKey = col.accessorKey;
      if (!accessorKey || col.cell) {
        return col;
      }

      if (amountColumns.includes(accessorKey)) {
        return {
          ...col,
          cell: ({ getValue }: { getValue: () => unknown }) => {
            const value = getValue() as number;
            if (typeof value !== "number") return value;
            return value.toLocaleString();
          },
        };
      }

      const dateFormat = dateColumnConfig[accessorKey];
      if (dateFormat) {
        return {
          ...col,
          cell: ({ getValue }: { getValue: () => unknown }) => {
            const value = getValue() as string;
            let date: Date | undefined;

            if (dateFormat === "YYYYMMDD") {
              if (
                typeof value === "string" &&
                value.length === 8 &&
                !isNaN(Number(value))
              ) {
                const year = value.substring(0, 4);
                const month = value.substring(4, 6);
                const day = value.substring(6, 8);
                date = new Date(`${year}-${month}-${day}`);
              }
            } else {
              // Default to ISO string parsing
              date = new Date(value);
            }

            if (date && !isNaN(date.getTime())) {
              return format(date, "yyyy-MM-dd");
            }
            return value; // Return original value if formatting fails
          },
        };
      }

      return col;
    };

    return columns.map(processColumn);
  }, [columns, amountColumns, dateColumnConfig]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 정렬 동작을 명시적으로 설정합니다.
    enableSortingRemoval: true, // 정렬 취소 기능 활성화
    sortDescFirst: false, // 항상 오름차순으로 먼저 정렬
  });

  React.useEffect(() => {
    if (!hidePagination) {
        table.setPageSize(pageSize);
    } else {
        table.setPageSize(data.length > 0 ? data.length : 10);
    }
  }, [table, hidePagination, data.length, pageSize]);

  const renderPageNumbers = () => {
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageNumbers = [];

    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 p-0 rounded-2xl", {
            "bg-[#57e191] text-[#efefef] hover:bg-[#57e191]/90":
              i === currentPage,
          })}
          onClick={() => table.setPageIndex(i - 1)}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col gap-2">
      {!hideToolbar && (
        <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            <div className="text-sm font-medium">
            건수: 총 <span className="text-[#3da072]">{data.length}</span>건
            </div>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="flex-grow rounded-lg border overflow-auto">
          <Table style={{ minWidth }}>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          header.subHeaders.length > 0
                            ? "bg-[#dddddd] border-x-[3px] border-[#f1f1f1]"
                            : "",
                          header.isPlaceholder ? "border-none" : "",
                          header.column.id === "select" ? "px-0 text-center" : "px-4", // Checkbox column padding fix
                          header.index < headerGroup.headers.length - 1 ? "border-r border-gray-300" : ""
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: cn(
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none flex items-center"
                                  : "",
                                header.subHeaders.length > 0
                                  ? "flex items-center justify-center w-full"
                                  : "",
                                header.column.id === "select" ? "flex justify-center items-center w-full" : ""
                              ),
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ArrowUp className="ml-2 h-3 w-3" />,
                              desc: <ArrowDown className="ml-2 h-3 w-3" />,
                            }[header.column.getIsSorted() as string] ??
                              (header.column.getCanSort() ? (
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              ) : null)}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={selectedRowId === row.id ? "selected" : ""}
                    className={cn(
                      "h-10",
                      {
                        "bg-emerald-100": selectedRowId === row.id,
                        "cursor-pointer": !!onRowClick || !!onRowDoubleClick,
                      }
                    )}
                    onClick={() => {
                      if (onRowClick) {
                        setSelectedRowId(row.id);
                        onRowClick(row.original);
                      }
                    }}
                    onDoubleClick={() => {
                      if (onRowDoubleClick) {
                        onRowDoubleClick(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cn("text-left", cell.column.id === "select" ? "px-0 text-center" : "px-4", cell.column.id !== row.getVisibleCells()[row.getVisibleCells().length - 1].column.id ? "border-r border-gray-300" : "")}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!hidePagination && (
            <div className="flex-shrink-0 flex items-center justify-center gap-4 pt-4">
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <IconFirstPage className="size-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <IconPrevPage className="size-4" />
            </Button>
            <div className="flex items-center gap-2">{renderPageNumbers()}</div>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <IconNextPage className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                <IconLastPage className="size-5" />
            </Button>
            </div>
        )}
      </div>
    </div>
  );
}

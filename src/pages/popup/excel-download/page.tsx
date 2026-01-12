

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { DataTable } from "@/components/app/DataTable";
import { PopupRightActions } from "@/components/app/PopupRightActions";
import { cn } from "@/lib/utils";

// Type for the columns passed to the popup and used in the DataTable
type SelectableColumn = {
  accessorKey: string;
  header: string;
  checked: boolean;
};

function ExcelDownloadContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({
    includeHeader: true,
    saveOnlyChecked: false,
    includePattern: false,
    selectAll: false,
    addSheet: false,
    closeWindow: true,
    openExcel: false,
  });
  const [columns, setColumns] = useState<SelectableColumn[]>([]);

  useEffect(() => {
    const columnsParam = searchParams.get("columns");
    if (columnsParam) {
      try {
        const parsedColumns = JSON.parse(columnsParam);
        setColumns(
          parsedColumns.map((col: any) => ({
            accessorKey: col.accessorKey,
            header: col.header,
            checked: true, // Default to checked
          }))
        );
      } catch (e) {
        console.error("Failed to parse columns param:", e);
      }
    }
  }, [searchParams]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleColumnCheck = useCallback((accessorKey: string, checked: boolean) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.accessorKey === accessorKey ? { ...col, checked } : col
      )
    );
  }, []);

  const handleAllColumnsCheck = useCallback((checked: boolean) => {
    setColumns((prev) => prev.map((col) => ({ ...col, checked })));
  }, []);

  // Filter Layout for Save Options
  const saveOptionsLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "includeHeader", type: "checkbox", label: "수평헤더 제목포함" },
        { name: "saveOnlyChecked", type: "checkbox", label: "체크된 항목만 저장" },
        { name: "includePattern", type: "checkbox", label: "패턴 포함" },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "selectAll", type: "checkbox", label: "전체선택" }, 
        { name: "addSheet", type: "checkbox", label: "기존 파일에 시트 추가" },
      ],
    },
  ], []);

  // Filter Layout for After Save Options
  const afterSaveOptionsLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "closeWindow", type: "checkbox", label: "창닫기" },
        { name: "openExcel", type: "checkbox", label: "엑셀 열기" },
      ],
    },
  ], []);

  // Column definitions for the DataTable
  const columnSelectionColumns: ColumnDef<SelectableColumn>[] = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => {
            table.toggleAllRowsSelected(!!value);
            handleAllColumnsCheck(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.checked}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleColumnCheck(row.original.accessorKey, !!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "header",
      header: "열제목",
      cell: ({ row }) => row.original.header,
    },
  ], [handleAllColumnsCheck, handleColumnCheck]);

  const handleSave = () => {
    console.log("Saving with options:", {
      filters,
      selectedColumns: columns.filter(c => c.checked)
    });
    alert("저장이 완료되었습니다. (콘솔 확인)");
    
    if (filters.closeWindow) {
        window.close();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">엑셀 다운로드</h2>
      </div>

      <div className="border-t pt-4">
        {/* Filter Layout 1: Save Options */}
        <div className="flex flex-col gap-2 mb-4">
            <h3 className="font-semibold mb-2">저장시</h3>
            <FilterContainer
                filterLayout={saveOptionsLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Filter Layout 2: After Save Options */}
        <div className="flex flex-col gap-2 mb-4">
            <h3 className="font-semibold mb-2">저장완료 후</h3>
            <FilterContainer
                filterLayout={afterSaveOptionsLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>
        
        {/* Table Layout: Column Selection */}
        <div className="flex-grow">
            <DataTable
                title="저장할 열 선택"
                columns={columnSelectionColumns}
                data={columns}
                onRowClick={(row) => handleColumnCheck(row.accessorKey, !row.checked)} // Toggle on row click
            />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-2 pt-4 pb-4">
         <PopupRightActions 
            actions={[
                { id: "save", text: "저장", onClick: handleSave },
                { id: "close", text: "닫기", onClick: () => window.close() }
            ]} 
         />
      </div>
    </div>
  );
}

export default function ExcelDownloadPage() {
  return (
    <Suspense>
      <ExcelDownloadContent />
    </Suspense>
  );
}



import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type BranchData = {
  id: number;
  branchCode: string;
  branchName: string;
  parentBranch: string;
  commonCode: string;
};

// Mock data for the table
const mockData: BranchData[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  branchCode: `B${100 + i}`,
  branchName: `媛뺣궓${i + 1}吏??,
  parentBranch: "媛뺣궓蹂몄젏",
  commonCode: `C${2000 + i}`,
}));

// Column definitions for the table
const columns: ColumnDef<BranchData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "branchCode", header: "遺?먯퐫?? },
  { accessorKey: "branchName", header: "遺?먮챸" },
  { accessorKey: "parentBranch", header: "?곸쐞遺?? },
  { accessorKey: "commonCode", header: "湲덉쑖湲곌?怨듯넻肄붾뱶" },
];

// DSL for the filter section
const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 2,
        filters: [
            { name: "branchCode", type: "text", label: "遺?먯퐫?? },
            { name: "branchName", type: "text", label: "遺?먮챸" },
        ],
    },
    {
        type: "grid",
        columns: 1,
        filters: [
            { 
              name: "includeClosed", 
              type: "select", 
              label: "?먯젏寃??, 
              options: [
                { value: "include", label: "?ы븿" },
                { value: "exclude", label: "誘명룷?? },
              ],
              defaultValue: "exclude",
            },
        ],
    },
];

import { postPopupMessage } from "@/lib${import.meta.env.BASE_URL}popup-bus";

// ... (imports)

function BranchManagementPopupContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<BranchData | null>(null);
  const openerTabId = searchParams.get("openerTabId");

  useEffect(() => {
    const newFilters: Record<string, any> = {};
    const branchCode = searchParams.get("branchCode");
    const branchName = searchParams.get("branchName");

    if (branchCode) newFilters.branchCode = branchCode;
    if (branchName) newFilters.branchName = branchName;

    setFilters(newFilters);
  }, [searchParams]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);
  
  const handleReset = () => {
    setFilters({});
    setSelectedRow(null);
  }

  const handleProcess = () => {
    if (selectedRow) {
      handleRowDoubleClick(selectedRow);
    } else {
      alert("泥섎━???됱쓣 ?좏깮?댁＜?몄슂.");
    }
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "議고쉶" },
    { id: "process", text: "泥섎━", onClick: handleProcess },
    { id: "reset", text: "珥덇린??, onClick: handleReset },
    { id: "close", text: "?リ린", onClick: () => window.close() },
  ];

  const handleRowDoubleClick = (row: BranchData) => {
    if (openerTabId) {
      postPopupMessage({
        targetTabId: openerTabId,
        source: 'branch-management',
        payload: row,
      });
      window.close();
    } else {
      console.error("Opener Tab ID is missing, cannot send data.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">遺?먭???/h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow">
        <DataTable 
          title="寃?됰궡??
          columns={columns} 
          data={mockData} 
          onRowClick={setSelectedRow}
          onRowDoubleClick={handleRowDoubleClick} 
        />
      </div>
    </div>
  );
}

export default function BranchManagementPopupPage() {
  return <BranchManagementPopupContent />;
}




import { useState, useCallback, Suspense } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// Type definition
type EarlyWarningData = {
  id: number;
  customerName: string;
  realNameNumber: string;
  baseDate: string;
  bankAssociationDefault: string;
  creditAgencyDefault: string;
  cbOverdue: string;
  transactionOpen: string;
  col9: string;
  col10: string;
  col11: string;
  col12: string;
  col13: string;
  col14: string;
  col15: string;
  col16: string;
  col17: string;
  col18: string;
};

// Mock Data
const mockData: EarlyWarningData[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  customerName: `고객${i + 1}`,
  realNameNumber: `800101-1******`,
  baseDate: "2025-12-16",
  bankAssociationDefault: i % 3 === 0 ? "Y" : "N",
  creditAgencyDefault: i % 4 === 0 ? "Y" : "N",
  cbOverdue: i % 5 === 0 ? "Y" : "N",
  transactionOpen: "2023-01-01",
  col9: "-", col10: "-", col11: "-", col12: "-", col13: "-", 
  col14: "-", col15: "-", col16: "-", col17: "-", col18: "-",
}));

// Columns
const columns: ColumnDef<EarlyWarningData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "realNameNumber", header: "실명번호" },
  { accessorKey: "baseDate", header: "기준일자" },
  { accessorKey: "bankAssociationDefault", header: "채불은행연합회" },
  { accessorKey: "creditAgencyDefault", header: "채불신용정보사" },
  { accessorKey: "cbOverdue", header: "cb연체" },
  { accessorKey: "transactionOpen", header: "거래개설" },
  { accessorKey: "col9", header: "기타항목1" },
  { accessorKey: "col10", header: "기타항목2" },
  { accessorKey: "col11", header: "기타항목3" },
  { accessorKey: "col12", header: "기타항목4" },
  { accessorKey: "col13", header: "기타항목5" },
  { accessorKey: "col14", header: "기타항목6" },
  { accessorKey: "col15", header: "기타항목7" },
  { accessorKey: "col16", header: "기타항목8" },
  { accessorKey: "col17", header: "기타항목9" },
  { accessorKey: "col18", header: "기타항목10" },
];

function EarlyWarningPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    searchDate: { start: "2025-12-16", end: "2025-12-16" },
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = () => {
    setFilters({
        searchDate: { start: "2025-12-16", end: "2025-12-16" },
        realNameNumber: ""
    });
  }

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "reset", text: "초기화", onClick: handleReset },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "searchDate", type: "date-range", label: "조회일자" },
        { 
            name: "realNameNumber", 
            type: "long-search", 
            label: "실명번호",
            onButtonClick: () => console.log("Real Name Number Search")
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">조기경보</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Search Section */}
        <div>
            <h3 className="font-semibold mb-2">검색조건</h3>
            <FilterContainer
                filterLayout={filterLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Result Section */}
        <div>
            <DataTable 
                title="조기 경보 발생 내역 검색내용" 
                columns={columns} 
                data={mockData} 
                minWidth="1800px"
                dateColumnConfig={{ baseDate: 'YYYYMMDD' }}
            />
        </div>
      </div>
    </div>
  );
}

export default function EarlyWarningPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EarlyWarningPopupContent />
    </Suspense>
  );
}

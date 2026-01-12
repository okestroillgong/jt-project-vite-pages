

import { useState, useCallback, Suspense, useMemo } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Type definition
type IssuanceData = {
  id: number;
  issueYear: string;
  relNumber: string; // 관련번호 (Previously missingNumber)
  debtorName: string;
  debtorRealNameNum: string;
  debtorAddress: string;
  visitorName: string;
  branch: string;
  processDate: string;
  formType: string;
  col11: string;
  col12: string;
  col13: string;
  col14: string;
  col15: string;
  col16: string;
  col17: string;
  col18: string;
  col19: string;
  col20: string;
};

// Mock Data
const mockData: IssuanceData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  issueYear: "2025",
  relNumber: `REL-${1000 + i}`,
  debtorName: `채무자${i}`,
  debtorRealNameNum: `800101-1******`,
  debtorAddress: `서울시 강남구 역삼동 ${i}번지`,
  visitorName: `방문자${i}`,
  branch: "소비자금융부",
  processDate: "2025-12-17",
  formType: "서식A",
  col11: "-", col12: "-", col13: "-", col14: "-", col15: "-",
  col16: "-", col17: "-", col18: "-", col19: "-", col20: "-",
}));

function IssuanceHistoryPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    issueDate: { start: "2025-12-17", end: "2025-12-17" },
    branchCode: "consumer_finance"
  });
  
  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = () => {
    setFilters({
        issueDate: { start: "2025-12-17", end: "2025-12-17" },
        branchCode: "consumer_finance"
    });
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "reset", text: "재입력", onClick: handleReset },
    { id: "print", text: "출력" },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 2,
        filters: [
            { name: "issueDate", type: "date-range", label: "발급기간" },
            { 
                name: "branchCode", 
                type: "select", 
                label: "지점코드", 
                options: [
                    { value: "consumer_finance", label: "소비자금융부" },
                    { value: "corporate_finance", label: "기업금융부" }
                ] 
            }
        ]
    }
  ];

  const columns: ColumnDef<IssuanceData>[] = useMemo(() => [
    { accessorKey: "id", header: "순번" },
    { accessorKey: "issueYear", header: "발급년" },
    { accessorKey: "relNumber", header: "관련번호" },
    { accessorKey: "debtorName", header: "채무자성명" },
    { accessorKey: "debtorRealNameNum", header: "채무자실명번호" },
    { accessorKey: "debtorAddress", header: "채무자주소" },
    { accessorKey: "visitorName", header: "방문자명" },
    { accessorKey: "branch", header: "처리지점" },
    { accessorKey: "processDate", header: "처리일자" },
    { accessorKey: "formType", header: "서식구분" },
    { accessorKey: "col11", header: "추가항목1" },
    { accessorKey: "col12", header: "추가항목2" },
    { accessorKey: "col13", header: "추가항목3" },
    { accessorKey: "col14", header: "추가항목4" },
    { accessorKey: "col15", header: "추가항목5" },
    { accessorKey: "col16", header: "추가항목6" },
    { accessorKey: "col17", header: "추가항목7" },
    { accessorKey: "col18", header: "추가항목8" },
    { accessorKey: "col19", header: "추가항목9" },
    { accessorKey: "col20", header: "추가항목10" },
  ], []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">발급내역</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Search Section */}
        <div>
            <FilterContainer
                filterLayout={filterLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Result Section */}
        <div>
            {/* Custom Action Buttons Row */}
            <div className="flex justify-end gap-2 mb-2">
                <Button variant="secondary" className="h-[35px] w-24 cursor-pointer rounded-2xl">
                    행추가
                </Button>
                <Button variant="secondary" className="h-[35px] w-24 cursor-pointer rounded-2xl">
                    행삭제
                </Button>
                <Button variant="secondary" className="h-[35px] w-24 cursor-pointer rounded-2xl">
                    저장
                </Button>
            </div>

            <DataTable 
                title="조회결과"
                columns={columns} 
                data={mockData} 
                minWidth="2200px"
                // Removed hideToolbar={true} to use standard behavior
            />
        </div>
      </div>
    </div>
  );
}

export default function IssuanceHistoryPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IssuanceHistoryPopupContent />
    </Suspense>
  );
}

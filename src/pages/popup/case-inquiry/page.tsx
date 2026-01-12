

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { postPopupMessage } from "@/lib/popup-bus";

// Data type for the table
type CaseData = {
  curRow: number;
  IfaffManageDstcd: string; // 관리구분
  rnmNo: string; // 실명번호
  custNm: string; // 고객명
  csNo: string; // 사건번호 (표시용)
  csYy: string; // 사건년월 (데이터용)
  csKind: string; // 사건종류 (데이터용)
  csNoSeq: string; // 사건일련번호 (데이터용)
  csNm: string; // 사건명
  cortCo: string; // 법원명
  lfaffPrgsSttsCd: string; // 진행상태
};

// Mock data
const mockData: CaseData[] = Array.from({ length: 15 }, (_, i) => ({
  curRow: i + 1,
  IfaffManageDstcd: i % 2 === 0 ? "개인회생" : "파산면책",
  rnmNo: `800101-123456${i % 10}`,
  custNm: `고객${i + 1}`,
  csNo: `${String(100000 + i).padStart(6, '0')}${(i % 26 + 10).toString(36).toUpperCase()}`,
  csYy: "2024",
  csKind: "가단",
  csNoSeq: `${10000 + i}`,
  csNm: `대여금 반환 청구의 소 ${i + 1}`,
  cortCo: "서울중앙지방법원",
  lfaffPrgsSttsCd: "진행중",
}));

// Columns
const columns: ColumnDef<CaseData>[] = [
  { accessorKey: "curRow", header: "순번" },
  { accessorKey: "IfaffManageDstcd", header: "관리구분" },
  { accessorKey: "rnmNo", header: "실명번호" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "csNo", header: "사건번호" },
  { accessorKey: "csNm", header: "사건명" },
  { accessorKey: "cortCo", header: "법원명" },
  { accessorKey: "lfaffPrgsSttsCd", header: "진행상태" },
];

function CaseInquiryPopupContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<CaseData[]>([]);
  const openerTabId = searchParams.get("openerTabId");

  // Initialize filters from URL
  useEffect(() => {
    const newFilters: Record<string, any> = {};
    const birthDate = searchParams.get("birthDate");
    const customerName = searchParams.get("customerName");
    const caseNumber = searchParams.get("caseNumber");

    if (birthDate) newFilters.birthDate = birthDate;
    if (customerName) newFilters.customerName = customerName;
    if (caseNumber) newFilters.caseNumber = caseNumber;

    setFilters(newFilters);
    
    if (Object.keys(newFilters).length > 0) {
      setTableData(mockData);
    }
  }, [searchParams]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    setTableData(mockData);
  };

  // Filter Layout
  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "birthDate", type: "text", label: "생년월일" },
        { name: "customerName", type: "text", label: "고객명" },
        { name: "caseNumber", type: "text", label: "사건번호" },
      ],
    },
  ], []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회", onClick: handleSearch },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const handleRowDoubleClick = (row: CaseData) => {
    if (openerTabId) {
      postPopupMessage({
        targetTabId: openerTabId,
        source: 'case-inquiry',
        payload: row,
      });
      window.close();
    } else {
      console.error("Opener Tab ID missing");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">사건 조회</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">사건 검색</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow">
        <DataTable
          title="사건 목록"
          columns={columns}
          data={tableData}
          onRowDoubleClick={handleRowDoubleClick}
        />
      </div>
    </div>
  );
}

export default function CaseInquiryPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaseInquiryPopupContent />
    </Suspense>
  );
}

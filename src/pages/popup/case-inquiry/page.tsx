

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { postPopupMessage } from "@/lib${import.meta.env.BASE_URL}popup-bus";

// Data type for the table
type CaseData = {
  curRow: number;
  IfaffManageDstcd: string; // 愿由ш뎄遺?  rnmNo: string; // ?ㅻ챸踰덊샇
  custNm: string; // 怨좉컼紐?  csNo: string; // ?ш굔踰덊샇 (?쒖떆??
  csYy: string; // ?ш굔?꾩썡 (?곗씠?곗슜)
  csKind: string; // ?ш굔醫낅쪟 (?곗씠?곗슜)
  csNoSeq: string; // ?ш굔?쇰젴踰덊샇 (?곗씠?곗슜)
  csNm: string; // ?ш굔紐?  cortCo: string; // 踰뺤썝紐?  lfaffPrgsSttsCd: string; // 吏꾪뻾?곹깭
};

// Mock data
const mockData: CaseData[] = Array.from({ length: 15 }, (_, i) => ({
  curRow: i + 1,
  IfaffManageDstcd: i % 2 === 0 ? "媛쒖씤?뚯깮" : "?뚯궛硫댁콉",
  rnmNo: `800101-123456${i % 10}`,
  custNm: `怨좉컼${i + 1}`,
  csNo: `${String(100000 + i).padStart(6, '0')}${(i % 26 + 10).toString(36).toUpperCase()}`,
  csYy: "2024",
  csKind: "媛??,
  csNoSeq: `${10000 + i}`,
  csNm: `??ш툑 諛섑솚 泥?뎄????${i + 1}`,
  cortCo: "?쒖슱以묒븰吏諛⑸쾿??,
  lfaffPrgsSttsCd: "吏꾪뻾以?,
}));

// Columns
const columns: ColumnDef<CaseData>[] = [
  { accessorKey: "curRow", header: "?쒕쾲" },
  { accessorKey: "IfaffManageDstcd", header: "愿由ш뎄遺? },
  { accessorKey: "rnmNo", header: "?ㅻ챸踰덊샇" },
  { accessorKey: "custNm", header: "怨좉컼紐? },
  { accessorKey: "csNo", header: "?ш굔踰덊샇" },
  { accessorKey: "csNm", header: "?ш굔紐? },
  { accessorKey: "cortCo", header: "踰뺤썝紐? },
  { accessorKey: "lfaffPrgsSttsCd", header: "吏꾪뻾?곹깭" },
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
        { name: "birthDate", type: "text", label: "?앸뀈?붿씪" },
        { name: "customerName", type: "text", label: "怨좉컼紐? },
        { name: "caseNumber", type: "text", label: "?ш굔踰덊샇" },
      ],
    },
  ], []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "議고쉶", onClick: handleSearch },
    { id: "close", text: "?リ린", onClick: () => window.close() },
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
        <h2 className="text-xl font-bold">?ш굔 議고쉶</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">?ш굔 寃??/h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow">
        <DataTable
          title="?ш굔 紐⑸줉"
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


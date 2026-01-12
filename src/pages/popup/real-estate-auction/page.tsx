

import { useState, useCallback, Suspense, useMemo } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

// Type definition
type AuctionData = {
  id: number;
  inquiryDate: string;
  inquirer: string;
  customerName: string;
  customerNumber: string;
  accountNumber: string;
  loanBalance: number;
  infoType: string;
  courtCode: string;
  caseYear: string;
  [key: string]: any; // Allow dynamic columns
};

// Mock Data
const mockData: AuctionData[] = Array.from({ length: 20 }, (_, i) => {
  const row: AuctionData = {
    id: i + 1,
    inquiryDate: "2025-12-17",
    inquirer: `담당자${i}`,
    customerName: `고객${i}`,
    customerNumber: `CUST${1000+i}`,
    accountNumber: `123-45-6789${i}`,
    loanBalance: 50000000 + (i * 10000),
    infoType: i % 2 === 0 ? "경매" : "공매",
    courtCode: "SEOUL-01",
    caseYear: "2025",
  };
  // Add 20 more dummy columns
  for (let j = 11; j <= 30; j++) {
    row[`col${j}`] = "-";
  }
  return row;
});

function RealEstateAuctionPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    searchDate: { start: "2025-12-17", end: "2025-12-17" },
    center: "all",
    team: "all",
    group: "all",
    counselor: "all"
  });
  
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = () => {
    setFilters({
        searchDate: { start: "2025-12-17", end: "2025-12-17" },
        center: "all",
        team: "all",
        group: "all",
        counselor: "all"
    });
    setSelectedIds(new Set());
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "reset", text: "초기화", onClick: handleReset },
    { id: "excel", text: "엑셀다운로드" }, // Excel download usually opens another popup or downloads directly
  ];

  // Filter Layout
  const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 4,
        filters: [
            { name: "searchDate", type: "date-range", label: "조회일자", colSpan: 2 },
            { name: "center", type: "select", label: "센터", options: [{ value: "all", label: "전체" }] },
            { name: "team", type: "select", label: "팀", options: [{ value: "all", label: "전체" }] },
            
            { name: "group", type: "select", label: "그룹", options: [{ value: "all", label: "전체" }] },
            { name: "counselor", type: "select", label: "상담원", options: [{ value: "all", label: "전체" }] },
            { name: "individualCount", type: "text", label: "개인" },
            { name: "corporateCount", type: "text", label: "법인" },
            
            { name: "rightInfoCount", type: "text", label: "권리정보 총건수" },
            { name: "rightInfoAmt", type: "text", label: "권리정보 총금액" },
            { name: "dutyInfoCount", type: "text", label: "의무정보 총건수" },
            { name: "dutyInfoAmt", type: "text", label: "의무정보 총금액" },
        ]
    }
  ];

  // Selection Logic
  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return newSet;
    });
  }, []);

  const toggleAll = useCallback((checked: boolean) => {
    if (checked) {
        setSelectedIds(new Set(mockData.map(d => d.id)));
    } else {
        setSelectedIds(new Set());
    }
  }, []);

  const columns: ColumnDef<AuctionData>[] = useMemo(() => {
    const baseCols: ColumnDef<AuctionData>[] = [
        {
            id: "select",
            header: ({ table }) => (
              <div className="flex justify-center px-2">
                <Checkbox
                    checked={mockData.length > 0 && selectedIds.size === mockData.length}
                    onCheckedChange={(value) => toggleAll(!!value)}
                    aria-label="Select all"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex justify-center px-2">
                <Checkbox
                    checked={selectedIds.has(row.original.id)}
                    onCheckedChange={() => toggleSelection(row.original.id)}
                    aria-label="Select row"
                    onClick={(e) => e.stopPropagation()}
                />
              </div>
            ),
            size: 40,
            enableSorting: false,
        },
        { accessorKey: "id", header: "순번" },
        { accessorKey: "inquiryDate", header: "조회일자" },
        { accessorKey: "inquirer", header: "조회요청자" },
        { accessorKey: "customerName", header: "고객명" },
        { accessorKey: "customerNumber", header: "고객번호" },
        { accessorKey: "accountNumber", header: "계좌번호" },
        { accessorKey: "loanBalance", header: "대출잔액" },
        { accessorKey: "infoType", header: "정보구분" },
        { accessorKey: "courtCode", header: "관할법원코드" },
        { accessorKey: "caseYear", header: "사건년도" },
    ];

    // Add 20 extra columns dynamically
    const extraCols: ColumnDef<AuctionData>[] = Array.from({ length: 20 }, (_, i) => ({
        accessorKey: `col${i + 11}`,
        header: `추가항목${i + 1}`,
    }));

    return [...baseCols, ...extraCols];
  }, [selectedIds, toggleAll, toggleSelection]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">부동산경매정보</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Search Section */}
        <div>
            <h3 className="font-semibold mb-2">부동산경매정보</h3>
            <FilterContainer
                filterLayout={filterLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Result Section */}
        <div>
            <DataTable 
                title="조회내용" 
                columns={columns} 
                data={mockData} 
                minWidth="2500px"
                amountColumns={["loanBalance"]}
                dateColumnConfig={{ inquiryDate: 'YYYYMMDD' }}
            />
        </div>
      </div>
    </div>
  );
}

export default function RealEstateAuctionPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealEstateAuctionPopupContent />
    </Suspense>
  );
}

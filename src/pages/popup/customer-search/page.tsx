

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type CustomerData = {
  id: number;
  realNameNumber: string;
  centralCustomerNumber: string;
  customerName: string;
  accountNumber: string;
  accountStatus: string;
};

// Mock data for the table
const mockData: CustomerData[] = [
  {
    id: 1,
    realNameNumber: "850315-1XXXXXX",
    centralCustomerNumber: "CUST1001",
    customerName: "김고객1",
    accountNumber: "110-234-567890",
    accountStatus: "정상",
  },
  {
    id: 2,
    realNameNumber: "921101-2XXXXXX",
    centralCustomerNumber: "CUST1002",
    customerName: "이고객2",
    accountNumber: "110-234-567891",
    accountStatus: "해지",
  },
  {
    id: 3,
    realNameNumber: "010520-3XXXXXX",
    centralCustomerNumber: "CUST1003",
    customerName: "박고객3",
    accountNumber: "110-234-567892",
    accountStatus: "정상",
  },
  {
    id: 4,
    realNameNumber: "780830-1XXXXXX",
    centralCustomerNumber: "CUST1004",
    customerName: "최고객4",
    accountNumber: "110-234-567893",
    accountStatus: "해지",
  },
  {
    id: 5,
    realNameNumber: "051225-4XXXXXX",
    centralCustomerNumber: "CUST1005",
    customerName: "정고객5",
    accountNumber: "110-234-567894",
    accountStatus: "정상",
  },
];

// Column definitions for the table
const columns: ColumnDef<CustomerData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "realNameNumber", header: "실명번호" },
  { accessorKey: "centralCustomerNumber", header: "중앙회고객번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "accountStatus", header: "계좌상태" },
];

// DSL for the filter section
const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 3,
        filters: [
            { name: "birthDate", type: "date", label: "생년월일" },
            { name: "customerNumber", type: "text", label: "고객번호" },
            { name: "customerName", type: "text", label: "고객명" },
        ],
    },
    {
        type: "grid",
        columns: 2,
        filters: [
            { name: "extendedSearch", type: "checkbox", label: "확장검색" },
            { name: "accountNumber", type: "text", label: "계좌번호" },
        ],
    },
];

import { postPopupMessage } from "@/lib/popup-bus";

// ... (imports)

function CustomerSearchPopupContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<CustomerData | null>(null);
  const openerTabId = searchParams.get("openerTabId");

  useEffect(() => {
    const newFilters: Record<string, any> = {};
    const customerNumber = searchParams.get("customerNumber");
    const customerName = searchParams.get("customerName");
    const birthDate = searchParams.get("birthDate");
    const accountNumber = searchParams.get("accountNumber");
    const extendedSearch = searchParams.get("extendedSearch");

    if (customerNumber) newFilters.customerNumber = customerNumber;
    if (customerName) newFilters.customerName = customerName;
    if (birthDate) newFilters.birthDate = birthDate;
    if (accountNumber) newFilters.accountNumber = accountNumber;
    if (extendedSearch) newFilters.extendedSearch = extendedSearch === 'true';

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
      alert("처리할 행을 선택해주세요.");
    }
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "process", text: "처리", onClick: handleProcess },
    { id: "reset", text: "초기화", onClick: handleReset },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const handleRowDoubleClick = (row: CustomerData) => {
    const sourceFilter = searchParams.get("sourceFilter");
    if (openerTabId) {
      postPopupMessage({
        targetTabId: openerTabId,
        source: 'customer-search',
        payload: {
          ...row,
          sourceFilter,
        },
      });
      window.close();
    } else {
      // openerTabId가 없는 경우, 아무것도 하지 않고 함수를 종료합니다.
      // console.error("Opener Tab ID is missing, cannot send data."); // 더 이상 에러를 기록하지 않습니다.
      return;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">고객검색</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">검색조건</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow">
        <DataTable 
          title="검색내용"
          columns={columns} 
          data={mockData} 
          onRowClick={setSelectedRow}
          onRowDoubleClick={handleRowDoubleClick} 
        />
      </div>
    </div>
  );
}

export default function CustomerSearchPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerSearchPopupContent />
    </Suspense>
  );
}
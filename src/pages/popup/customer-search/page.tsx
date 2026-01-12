

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
    customerName: "源怨좉컼1",
    accountNumber: "110-234-567890",
    accountStatus: "?뺤긽",
  },
  {
    id: 2,
    realNameNumber: "921101-2XXXXXX",
    centralCustomerNumber: "CUST1002",
    customerName: "?닿퀬媛?",
    accountNumber: "110-234-567891",
    accountStatus: "?댁?",
  },
  {
    id: 3,
    realNameNumber: "010520-3XXXXXX",
    centralCustomerNumber: "CUST1003",
    customerName: "諛뺢퀬媛?",
    accountNumber: "110-234-567892",
    accountStatus: "?뺤긽",
  },
  {
    id: 4,
    realNameNumber: "780830-1XXXXXX",
    centralCustomerNumber: "CUST1004",
    customerName: "理쒓퀬媛?",
    accountNumber: "110-234-567893",
    accountStatus: "?댁?",
  },
  {
    id: 5,
    realNameNumber: "051225-4XXXXXX",
    centralCustomerNumber: "CUST1005",
    customerName: "?뺢퀬媛?",
    accountNumber: "110-234-567894",
    accountStatus: "?뺤긽",
  },
];

// Column definitions for the table
const columns: ColumnDef<CustomerData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "realNameNumber", header: "?ㅻ챸踰덊샇" },
  { accessorKey: "centralCustomerNumber", header: "以묒븰?뚭퀬媛앸쾲?? },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "accountStatus", header: "怨꾩쥖?곹깭" },
];

// DSL for the filter section
const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 3,
        filters: [
            { name: "birthDate", type: "date", label: "?앸뀈?붿씪" },
            { name: "customerNumber", type: "text", label: "怨좉컼踰덊샇" },
            { name: "customerName", type: "text", label: "怨좉컼紐? },
        ],
    },
    {
        type: "grid",
        columns: 2,
        filters: [
            { name: "extendedSearch", type: "checkbox", label: "?뺤옣寃?? },
            { name: "accountNumber", type: "text", label: "怨꾩쥖踰덊샇" },
        ],
    },
];

import { postPopupMessage } from "@/lib${import.meta.env.BASE_URL}popup-bus";

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
      alert("泥섎━???됱쓣 ?좏깮?댁＜?몄슂.");
    }
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "議고쉶" },
    { id: "process", text: "泥섎━", onClick: handleProcess },
    { id: "reset", text: "珥덇린??, onClick: handleReset },
    { id: "close", text: "?リ린", onClick: () => window.close() },
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
      // openerTabId媛 ?녿뒗 寃쎌슦, ?꾨Т寃껊룄 ?섏? ?딄퀬 ?⑥닔瑜?醫낅즺?⑸땲??
      // console.error("Opener Tab ID is missing, cannot send data."); // ???댁긽 ?먮윭瑜?湲곕줉?섏? ?딆뒿?덈떎.
      return;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">怨좉컼寃??/h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">寃?됱“嫄?/h3>
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

export default function CustomerSearchPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerSearchPopupContent />
    </Suspense>
  );
}

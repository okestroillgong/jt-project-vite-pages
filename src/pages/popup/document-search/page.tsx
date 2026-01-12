

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { Button } from "@/components/ui/button";
import { listenForPopupMessages } from "@/lib${import.meta.env.BASE_URL}popup-bus";

// Data type for the table
type DocumentData = {
  id: number;
  registrationDate: string;
  documentName: string;
  customerNumber: string;
  realNameNumber: string;
  customerName: string;
  accountNumber: string;
  applicationNumber: string;
  branch: string;
  employeeId: string;
  employeeName: string;
  uploader: string;
  processedDateTime: string;
};

// Mock data for the table
const mockData: DocumentData[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  registrationDate: `2023-11-${String(i + 1).padStart(2, "0")}`,
  documentName: `[?ъ떊] ?異쒖떊泥?꽌_${i + 1}.pdf`,
  customerNumber: `CUST100${i}`,
  realNameNumber: `900101-1******`,
  customerName: `源怨좉컼${i}`,
  accountNumber: `ACC-00${i}`,
  applicationNumber: `APP-00${i}`,
  branch: "媛뺣궓吏??,
  employeeId: `EMP${10 + i}`,
  employeeName: `諛뺤쭅??{i}`,
  uploader: `?쒖뒪??,
  processedDateTime: `2023-11-${String(i + 1).padStart(2, "0")} 14:30`,
}));

// Column definitions for the table
const columns: ColumnDef<DocumentData>[] = [
  { accessorKey: "registrationDate", header: "?깅줉?쇱옄" },
  { accessorKey: "documentName", header: "臾몄꽌紐? },
  { accessorKey: "customerNumber", header: "怨좉컼踰덊샇" },
  { accessorKey: "realNameNumber", header: "?ㅻ챸踰덊샇" },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "applicationNumber", header: "?좎껌踰덊샇" },
  { accessorKey: "branch", header: "吏??諛?遺?? },
  { accessorKey: "employeeId", header: "?ъ썝踰덊샇" },
  { accessorKey: "employeeName", header: "?ъ썝紐? },
  { accessorKey: "uploader", header: "?낅줈?? },
  { accessorKey: "processedDateTime", header: "泥섎━?쇱옄 諛??쒓컙" },
];

export default function DocumentSearchPopupPage() {
  const searchParams = useSearchParams();
  const openerTabId = searchParams.get("openerTabId");

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [activeTab, setActiveTab] = useState("loan");

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Initialize filters from URL search params
  useEffect(() => {
    const newFilters: Record<string, any> = {};
    
    // Try getting params from window.location directly as fallback
    const searchParamsFromWindow = new URLSearchParams(window.location.search);
    
    const customerNumber = searchParams.get("customerNumber") || searchParamsFromWindow.get("customerNumber");
    const accountNumber = searchParams.get("accountNumber") || searchParamsFromWindow.get("accountNumber");

    console.log("[DocumentSearchPopup] window.location.search:", window.location.search);
    console.log("[DocumentSearchPopup] Resolved - customerNumber:", customerNumber, "accountNumber:", accountNumber);

    if (customerNumber) newFilters.customerNumber = customerNumber;
    if (accountNumber) newFilters.accountNumber = accountNumber;

    console.log("[DocumentSearchPopup] Setting initial filters:", newFilters);

    if (Object.keys(newFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
  }, [searchParams]);

  useEffect(() => {
    const handlePopupMessage = (message: any) => {
      if (message.source === 'customer-search') {
        const customer = message.payload;
        handleFilterChange("customerNumber", customer.centralCustomerNumber);
        handleFilterChange("accountNumber", customer.accountNumber);
      } else if (message.source === 'branch-management') {
        const branch = message.payload;
        handleFilterChange("branchCode", {
          code: branch.branchCode,
          name: branch.branchName,
        });
      }
    };

    const cleanup = listenForPopupMessages(handlePopupMessage);
    return cleanup;
  }, [handleFilterChange]);

  const handleSearch = useCallback(() => {
    console.log(`Searching in tab '${activeTab}' with filters:`, filters);
    const filteredMockData = mockData.map(d => ({
      ...d,
      documentName: `[${activeTab}] 臾몄꽌_${d.id}.pdf`
    }));
    setTableData(filteredMockData);
  }, [filters, activeTab]);

  const handleReset = useCallback(() => {
    setFilters({});
    setTableData([]);
  }, []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "議고쉶", onClick: handleSearch },
    { id: "reset", text: "珥덇린??, onClick: handleReset },
  ];

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "怨좉컼踰덊샇",
          onButtonClick: (value?: any) => {
            const customerNumber = value || '';
            const accountNumber = filters.accountNumber || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&accountNumber=${accountNumber}&openerTabId=${openerTabId}`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "residentBusinessNumber", type: "text", label: "二쇰??ъ뾽?먮쾲?? },
        { name: "accountNumber", type: "text", label: "怨꾩쥖踰덊샇" },
        { name: "applicationNumber", type: "text", label: "?좎껌踰덊샇" },
        { 
          name: "branchCode", 
          type: "search", 
          label: "遺?먯퐫??,
          onButtonClick: (value?: any) => {
            const branchCode = value?.code || '';
            const branchName = value?.name || '';
            window.open(`${import.meta.env.BASE_URL}popup/branch-management?branchCode=${branchCode}&branchName=${branchName}&openerTabId=${openerTabId}`, 'BranchManagement', 'width=1600,height=800');
          }
        },
        { name: "registrant", type: "search", label: "?깅줉?ъ슜?? },
        { name: "document", type: "search", label: "臾몄꽌" },
        { name: "uploader", type: "search", label: "?낅줈?? },
        { name: "processingDate", type: "date-range", label: "泥섎━?쇱옄" },
        {
          name: "documentListType",
          type: "select",
          label: "臾몄꽌紐⑸줉 援щ텇",
          options: [
            { value: "pre-inquiry", label: "?ъ쟾議고쉶(?곷떞)" },
            { value: "application", label: "?좎껌" },
            { value: "review", label: "?ъ궗" },
            { value: "all", label: "?꾩껜" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">臾몄꽌寃??/h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0">
            <TabsTrigger value="loan" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">?ъ떊</TabsTrigger>
            <TabsTrigger value="deposit" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">?섏떊</TabsTrigger>
            <TabsTrigger value="slip" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">?꾪몴</TabsTrigger>
            <TabsTrigger value="check" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">?섑몴</TabsTrigger>
          </TabsList>
        </Tabs>

        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow min-h-0">
        <DataTable title="議고쉶?댁슜" columns={columns} data={tableData} />
      </div>
    </div>
  );
}




import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { Button } from "@/components/ui/button";
import { listenForPopupMessages } from "@/lib/popup-bus";

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
  documentName: `[여신] 대출신청서_${i + 1}.pdf`,
  customerNumber: `CUST100${i}`,
  realNameNumber: `900101-1******`,
  customerName: `김고객${i}`,
  accountNumber: `ACC-00${i}`,
  applicationNumber: `APP-00${i}`,
  branch: "강남지점",
  employeeId: `EMP${10 + i}`,
  employeeName: `박직원${i}`,
  uploader: `시스템`,
  processedDateTime: `2023-11-${String(i + 1).padStart(2, "0")} 14:30`,
}));

// Column definitions for the table
const columns: ColumnDef<DocumentData>[] = [
  { accessorKey: "registrationDate", header: "등록일자" },
  { accessorKey: "documentName", header: "문서명" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "realNameNumber", header: "실명번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "applicationNumber", header: "신청번호" },
  { accessorKey: "branch", header: "지점 및 부서" },
  { accessorKey: "employeeId", header: "사원번호" },
  { accessorKey: "employeeName", header: "사원명" },
  { accessorKey: "uploader", header: "업로더" },
  { accessorKey: "processedDateTime", header: "처리일자 및 시간" },
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
      documentName: `[${activeTab}] 문서_${d.id}.pdf`
    }));
    setTableData(filteredMockData);
  }, [filters, activeTab]);

  const handleReset = useCallback(() => {
    setFilters({});
    setTableData([]);
  }, []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회", onClick: handleSearch },
    { id: "reset", text: "초기화", onClick: handleReset },
  ];

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "고객번호",
          onButtonClick: (value?: any) => {
            const customerNumber = value || '';
            const accountNumber = filters.accountNumber || '';
            window.open(`/popup/customer-search?customerNumber=${customerNumber}&accountNumber=${accountNumber}&openerTabId=${openerTabId}`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "residentBusinessNumber", type: "text", label: "주민사업자번호" },
        { name: "accountNumber", type: "text", label: "계좌번호" },
        { name: "applicationNumber", type: "text", label: "신청번호" },
        { 
          name: "branchCode", 
          type: "search", 
          label: "부점코드",
          onButtonClick: (value?: any) => {
            const branchCode = value?.code || '';
            const branchName = value?.name || '';
            window.open(`/popup/branch-management?branchCode=${branchCode}&branchName=${branchName}&openerTabId=${openerTabId}`, 'BranchManagement', 'width=1600,height=800');
          }
        },
        { name: "registrant", type: "search", label: "등록사용자" },
        { name: "document", type: "search", label: "문서" },
        { name: "uploader", type: "search", label: "업로더" },
        { name: "processingDate", type: "date-range", label: "처리일자" },
        {
          name: "documentListType",
          type: "select",
          label: "문서목록 구분",
          options: [
            { value: "pre-inquiry", label: "사전조회(상담)" },
            { value: "application", label: "신청" },
            { value: "review", label: "심사" },
            { value: "all", label: "전체" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">문서검색</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0">
            <TabsTrigger value="loan" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">여신</TabsTrigger>
            <TabsTrigger value="deposit" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">수신</TabsTrigger>
            <TabsTrigger value="slip" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">전표</TabsTrigger>
            <TabsTrigger value="check" className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">수표</TabsTrigger>
          </TabsList>
        </Tabs>

        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow min-h-0">
        <DataTable title="조회내용" columns={columns} data={tableData} />
      </div>
    </div>
  );
}

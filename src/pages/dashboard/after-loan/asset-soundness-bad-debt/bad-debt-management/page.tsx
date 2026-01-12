

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LeftActions } from "@/components/app/LeftActions";
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// Data type for the table
type BadDebtManagementData = {
  id: number;
  isRegistered: string;
  writeOffType: string;
  selectionDate: string;
  accountName: string;
  customerName: string;
  customerNumber: string;
  loanAccount: string;
};

// Mock data for the table
const mockData: BadDebtManagementData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  isRegistered: i % 2 === 0 ? "Y" : "N",
  writeOffType: `구분${(i % 3) + 1}`,
  selectionDate: `2023-10-${String(10 + i).padStart(2, "0")}`,
  accountName: "일반자금대출",
  customerName: `고객${i + 1}`,
  customerNumber: `CUST${3001 + i}`,
  loanAccount: `ACC${4001 + i}`,
}));

// Column definitions for the table
const columns: ColumnDef<BadDebtManagementData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "isRegistered", header: "등록여부" },
  { accessorKey: "writeOffType", header: "상각구분" },
  { accessorKey: "selectionDate", header: "선정일자" },
  { accessorKey: "accountName", header: "과목명" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "loanAccount", header: "여신계좌" },
];

export default function BadDebtManagementPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === 'customer-search') {
        const customer = message.payload;
        updateFilters(tabId, { 
          customerNumber: customer.centralCustomerNumber,
          accountNumber: customer.realNameNumber 
        });
      } else if (message.source === 'branch-management') {
        const branch = message.payload;
        updateFilters(tabId, { 
          managementBranch: { 
            code: branch.branchName,
            name: branch.branchCode
          } 
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "quarter", type: "select", label: "분기", options: [{value: 'q1', label: '1분기'}] },
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "고객번호",
          defaultValue: "CUST3001",
          readonly: true,
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            const accountNumber = currentState?.filters.accountNumber || '';
            window.open(`/popup/customer-search?customerNumber=${customerNumber}&accountNumber=${accountNumber}&openerTabId=${tabId}`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "accountNumber", type: "text", label: "계좌번호" },
        { 
          name: "managementBranch", 
          type: "search", 
          label: "관리부점",
          readonly: true,
          defaultValue: { code: "B100", name: "강남1지점" },
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const branchCode = value?.code || '';
            const branchName = value?.name || '';
            window.open(`/popup/branch-management?branchCode=${branchCode}&branchName=${branchName}&openerTabId=${tabId}`, 'BranchManagement', 'width=1600,height=800');
          }
        },
        { name: "isRegistered", type: "select", label: "등록여부", options: [{value: 'y', label: 'Y'}, {value: 'n', label: 'N'}] },
        { name: "writeOffType", type: "select", label: "상각구분", options: [{value: 'type1', label: '구분1'}] },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleSearch = () => {
    console.log("Search clicked, fetching data...");
    updateTableData(tabId, "badDebtTable", mockData);
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">대손상각대상 관리</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>재산건전성/대손상각</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>대손상각대상 관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between">
        <LeftActions actions={[{ id: "terminate" }]} />
        <RightActions
          actions={[
            { id: "excel" },
            { id: "register" },
            { id: "search", onClick: handleSearch },
            { id: "data-reset", onClick: () => clearState(tabId) },
            { id: "reset" },
          ]}
        />
      </div>

      <FilterContainer
        filterLayout={filterLayout}
        values={currentState.filters}
        onChange={handleFilterChange}
      />

      <DataTable
        title="조회내용"
        columns={columns}
        data={currentState.tables?.['badDebtTable'] || []}
        amountColumns={["provisionalPayment", "loanBalance"]}
        dateColumnConfig={{ selectionDate: "YYYYMMDD" }}
      />
    </div>
  );
}



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
  writeOffType: `援щ텇${(i % 3) + 1}`,
  selectionDate: `2023-10-${String(10 + i).padStart(2, "0")}`,
  accountName: "?쇰컲?먭툑?異?,
  customerName: `怨좉컼${i + 1}`,
  customerNumber: `CUST${3001 + i}`,
  loanAccount: `ACC${4001 + i}`,
}));

// Column definitions for the table
const columns: ColumnDef<BadDebtManagementData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "isRegistered", header: "?깅줉?щ?" },
  { accessorKey: "writeOffType", header: "?곴컖援щ텇" },
  { accessorKey: "selectionDate", header: "?좎젙?쇱옄" },
  { accessorKey: "accountName", header: "怨쇰ぉ紐? },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "customerNumber", header: "怨좉컼踰덊샇" },
  { accessorKey: "loanAccount", header: "?ъ떊怨꾩쥖" },
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
        { name: "quarter", type: "select", label: "遺꾧린", options: [{value: 'q1', label: '1遺꾧린'}] },
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "怨좉컼踰덊샇",
          defaultValue: "CUST3001",
          readonly: true,
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            const accountNumber = currentState?.filters.accountNumber || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&accountNumber=${accountNumber}&openerTabId=${tabId}`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "accountNumber", type: "text", label: "怨꾩쥖踰덊샇" },
        { 
          name: "managementBranch", 
          type: "search", 
          label: "愿由щ???,
          readonly: true,
          defaultValue: { code: "B100", name: "媛뺣궓1吏?? },
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const branchCode = value?.code || '';
            const branchName = value?.name || '';
            window.open(`${import.meta.env.BASE_URL}popup/branch-management?branchCode=${branchCode}&branchName=${branchName}&openerTabId=${tabId}`, 'BranchManagement', 'width=1600,height=800');
          }
        },
        { name: "isRegistered", type: "select", label: "?깅줉?щ?", options: [{value: 'y', label: 'Y'}, {value: 'n', label: 'N'}] },
        { name: "writeOffType", type: "select", label: "?곴컖援щ텇", options: [{value: 'type1', label: '援щ텇1'}] },
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">??먯긽媛곷???愿由?/h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ궛嫄댁쟾????먯긽媛?/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>??먯긽媛곷???愿由?/BreadcrumbPage>
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
        title="議고쉶?댁슜"
        columns={columns}
        data={currentState.tables?.['badDebtTable'] || []}
        amountColumns={["provisionalPayment", "loanBalance"]}
        dateColumnConfig={{ selectionDate: "YYYYMMDD" }}
      />
    </div>
  );
}


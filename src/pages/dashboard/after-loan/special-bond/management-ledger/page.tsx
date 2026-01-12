

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect, useState } from "react";
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
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";

// Data type for the table
type SpecialBondData = {
  id: number;
  inclusionDate: string;
  inclusionReason: string;
  accountNumber: string;
  
  // Inclusion Bond Details
  inclusionPrincipal: number;
  inclusionInterest: number;
  inclusionTotal: number;

  // Recovery Details
  recoveryPrincipal: number;
  recoveryInterest: number;
  recoveryTotal: number;
};

// Example data
const mockData: SpecialBondData[] = [
  {
    id: 1,
    inclusionDate: "20240101",
    inclusionReason: "연체",
    accountNumber: "123-456-7890",
    inclusionPrincipal: 10000000,
    inclusionInterest: 500000,
    inclusionTotal: 10500000,
    recoveryPrincipal: 1000000,
    recoveryInterest: 50000,
    recoveryTotal: 1050000,
  },
  {
    id: 2,
    inclusionDate: "20240201",
    inclusionReason: "부실",
    accountNumber: "987-654-3210",
    inclusionPrincipal: 20000000,
    inclusionInterest: 1000000,
    inclusionTotal: 21000000,
    recoveryPrincipal: 0,
    recoveryInterest: 0,
    recoveryTotal: 0,
  },
];

// Column definitions with multi-level headers
const columns: ColumnDef<SpecialBondData>[] = [
  {
    accessorKey: "inclusionDate",
    header: "편입일자",
  },
  {
    accessorKey: "inclusionReason",
    header: "편입사유",
  },
  {
    accessorKey: "accountNumber",
    header: "계좌번호",
  },
  {
    header: "편입당시 채권내용",
    columns: [
      {
        accessorKey: "inclusionPrincipal",
        header: "원금",
      },
      {
        accessorKey: "inclusionInterest",
        header: "이자",
      },
      {
        accessorKey: "inclusionTotal",
        header: "계",
      },
    ],
  },
  {
    header: "채권회수내용",
    columns: [
      {
        accessorKey: "recoveryPrincipal",
        header: "원금",
      },
      {
        accessorKey: "recoveryInterest",
        header: "이자",
      },
      {
        accessorKey: "recoveryTotal",
        header: "계",
      },
    ],
  },
];

export default function SpecialBondLedgerPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("bond-details");

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId || message.source !== 'customer-search') return;
      
      const customer = message.payload;
      const sourceFilter = customer.sourceFilter;

      if (sourceFilter === 'customerNumber') {
        updateFilters(tabId, { 
          customerNumber: customer.centralCustomerNumber,
          customerName: customer.customerName 
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "고객번호",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            const customerName = currentState?.filters.customerName || '';
            window.open(`/popup/customer-search?customerNumber=${customerNumber}&customerName=${customerName}&openerTabId=${tabId}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { 
          name: "customerName", 
          type: "text", 
          label: "고객명",
          readonly: true 
        },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleRowClick = (row: SpecialBondData) => {
    console.log("Row clicked:", row);
  };

  const totalRows = mockData.length;

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">특수채권 관리대장</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>특수채권</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>특수채권 관리대장</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <LeftActions 
          actions={[{ id: "compare" }]} 
        />
        <RightActions
          actions={[
            { id: "print" },
            { id: "search" },
            { id: "data-reset", onClick: () => clearState(tabId) },
          ]}
        />
      </div>

      <div>
        <FilterContainer 
          filterLayout={filterLayout} 
          values={currentState.filters}
          onChange={handleFilterChange}
        />
      </div>

      {/* 탭과 테이블을 감싸는 영역 */}
      <div className="flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="justify-start bg-transparent p-0">
            <TabsTrigger value="bond-details">채권내용</TabsTrigger>
            <TabsTrigger value="address-change">채무관련자 주소 변경</TabsTrigger>
            <TabsTrigger value="statute-limit">시효 관리 내용</TabsTrigger>
            <TabsTrigger value="counseling">상담관리</TabsTrigger>
            <TabsTrigger value="legal-procedure">발견재산 및 법적 절차</TabsTrigger>
            <TabsTrigger value="provisional-payment">가지급금 지급 내용</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 테이블 영역 - 탭 아래에 바로 붙음 */}
        <div className="p-0">
            {/* 테이블의 자체 border를 없애거나 조정해야 깔끔할 수 있음 */}
            <div className="[&_div.rounded-md.border]:border-0">
              <DataTable
                columns={columns}
                data={mockData}
                amountColumns={["inclusionPrincipal", "inclusionInterest", "inclusionTotal", "recoveryPrincipal", "recoveryInterest", "recoveryTotal"]}
                dateColumnConfig={{ inclusionDate: "YYYYMMDD" }}
                onRowClick={handleRowClick}
              />
            </div>
        </div>
      </div>
    </div>
  );
}
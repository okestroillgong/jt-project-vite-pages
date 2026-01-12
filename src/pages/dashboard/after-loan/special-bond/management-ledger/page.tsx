

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect, useState } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib${import.meta.env.BASE_URL}popup-bus";
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
    inclusionReason: "?곗껜",
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
    inclusionReason: "遺??,
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
    header: "?몄엯?쇱옄",
  },
  {
    accessorKey: "inclusionReason",
    header: "?몄엯?ъ쑀",
  },
  {
    accessorKey: "accountNumber",
    header: "怨꾩쥖踰덊샇",
  },
  {
    header: "?몄엯?뱀떆 梨꾧텒?댁슜",
    columns: [
      {
        accessorKey: "inclusionPrincipal",
        header: "?먭툑",
      },
      {
        accessorKey: "inclusionInterest",
        header: "?댁옄",
      },
      {
        accessorKey: "inclusionTotal",
        header: "怨?,
      },
    ],
  },
  {
    header: "梨꾧텒?뚯닔?댁슜",
    columns: [
      {
        accessorKey: "recoveryPrincipal",
        header: "?먭툑",
      },
      {
        accessorKey: "recoveryInterest",
        header: "?댁옄",
      },
      {
        accessorKey: "recoveryTotal",
        header: "怨?,
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
          label: "怨좉컼踰덊샇",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            const customerName = currentState?.filters.customerName || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&customerName=${customerName}&openerTabId=${tabId}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { 
          name: "customerName", 
          type: "text", 
          label: "怨좉컼紐?,
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?뱀닔梨꾧텒 愿由щ???/h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?뱀닔梨꾧텒</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>?뱀닔梨꾧텒 愿由щ???/BreadcrumbPage>
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

      {/* ??낵 ?뚯씠釉붿쓣 媛먯떥???곸뿭 */}
      <div className="flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="justify-start bg-transparent p-0">
            <TabsTrigger value="bond-details">梨꾧텒?댁슜</TabsTrigger>
            <TabsTrigger value="address-change">梨꾨Т愿?⑥옄 二쇱냼 蹂寃?/TabsTrigger>
            <TabsTrigger value="statute-limit">?쒗슚 愿由??댁슜</TabsTrigger>
            <TabsTrigger value="counseling">?곷떞愿由?/TabsTrigger>
            <TabsTrigger value="legal-procedure">諛쒓껄?ъ궛 諛?踰뺤쟻 ?덉감</TabsTrigger>
            <TabsTrigger value="provisional-payment">媛吏湲됯툑 吏湲??댁슜</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ?뚯씠釉??곸뿭 - ???꾨옒??諛붾줈 遺숈쓬 */}
        <div className="p-0">
            {/* ?뚯씠釉붿쓽 ?먯껜 border瑜??놁븷嫄곕굹 議곗젙?댁빞 源붾걫?????덉쓬 */}
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

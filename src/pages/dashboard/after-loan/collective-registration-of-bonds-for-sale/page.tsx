

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useState } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";
import { LeftActions } from "@/components/app/LeftActions";
import { RightActions, ActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterFileUpload } from "@/components/filters/FilterFileUpload";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// 1. Type Definitions
type BondsForSaleItem = {
  id: number;
  customerName: string;
  customerNo: string;
  accountNo: string;
  saleYearMonth: string;
  searchStartDate: string;
  searchEndDate: string;
  companyName: string;
  companyContact: string;
  companyAddress: string;
  saleQuarter: string;
};

// 2. Column Definitions
const createColumn = (accessorKey: string, header: string): ColumnDef<BondsForSaleItem> => ({
  accessorKey,
  header,
});

const columns: ColumnDef<BondsForSaleItem>[] = [
  createColumn("customerName", "怨좉컼紐?),
  createColumn("customerNo", "怨좉컼踰덊샇"),
  createColumn("accountNo", "怨꾩쥖踰덊샇"),
  createColumn("saleYearMonth", "留ㅺ컖?곗썡"),
  createColumn("searchStartDate", "議고쉶?쒖옉??),
  createColumn("searchEndDate", "議고쉶醫낅즺??),
  createColumn("companyName", "?낆껜紐?),
  createColumn("companyContact", "?낆껜?곕씫泥?),
  createColumn("companyAddress", "?낆껜二쇱냼"),
  createColumn("saleQuarter", "留ㅺ컖遺꾧린"),
];

// 3. Mock Data
const mockData: BondsForSaleItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  customerName: `怨좉컼${i + 1}`,
  customerNo: `CUST${1000 + i}`,
  accountNo: `123-45-6789${i}`,
  saleYearMonth: "2024-01",
  searchStartDate: "2024-01-01",
  searchEndDate: "2024-01-31",
  companyName: `留ㅺ컖?낆껜${i + 1}`,
  companyContact: "02-1234-5678",
  companyAddress: "?쒖슱??媛뺣궓援?,
  saleQuarter: "1遺꾧린",
}));

export default function CollectiveRegistrationOfBondsForSalePage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("inquiry");

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleSearch = () => {
    console.log("Searching...");
    updateTableData(tabId, 'bondsTable', mockData);
  };

  const handleReset = () => {
    clearState(tabId);
  };

  const handleRegister = () => {
    console.log("Registering...");
  };

  // // 硫???묒? ?ㅼ슫濡쒕뱶 ?앹뾽?쇰줈 蹂寃??? ?꾨옒 二쇱꽍 泥섎━??肄붾뱶瑜??ъ슜?섏꽭??
  // const handleExcelDownload = () => {
  //   const width = 360;
  //   const height = 200;
  //   const left = window.screen.width / 2 - width / 2;
  //   const top = window.screen.height / 2 - height / 2;
  //   window.open(
  //     `${import.meta.env.BASE_URL}popup/multi-excel-download`,
  //     "MultiExcelDownload",
  //     `width=${width},height=${height},left=${left},top=${top}`
  //   );
  // };

  const handleExcelDownload = () => {
    const simpleColumns = columns.map((col) => ({
      accessorKey: (col as any).accessorKey,
      header: (col as any).header,
    }));
    const encodedColumns = encodeURIComponent(JSON.stringify(simpleColumns));
    const width = 500;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${import.meta.env.BASE_URL}popup/excel-download?columns=${encodedColumns}`,
      "ExcelDownload",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // Fix layout for Row 3: "留ㅺ컖遺꾧린" should be one conceptual unit. 
  // FilterContainer grid simply flows. 
  // Let's adjust Row 3 to look better.
  const inquiryFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "regDate", type: "date-range", label: "?깅줉?쇱옄" },
        { name: "customerNo", type: "search", label: "怨좉컼踰덊샇" },
        { name: "customerName", type: "text", label: "怨좉컼紐? },
        
        { name: "saleProcessDate", type: "date-range", label: "留ㅺ컖 泥섎━?? },
        { name: "companyName", type: "text", label: "?낆껜紐? },
        { name: "accountNo", type: "text", label: "怨꾩쥖踰덊샇" },
      ]
    },
    {
        type: "grid",
        columns: 4, // Use 4 cols to fit the quarter split better or just standard 3
        filters: [
            { name: "saleYear", type: "text", label: "留ㅺ컖遺꾧린(??" },
            { name: "saleQuarter", type: "select", label: "遺꾧린", options: [{value: "1", label: "1遺꾧린"}, {value: "2", label: "2遺꾧린"}] },
            { name: "pool", type: "text", label: "pool" },
            { name: "generalSpecial", type: "select", label: "?쇰컲/?뱀닔", options: [{value: "general", label: "?쇰컲"}, {value: "special", label: "?뱀닔"}] },
        ]
    }
  ];

  const leftActions = activeTab === 'inquiry' 
    ? [{ id: 'history-list' as any }, { id: 'history-zip' as any }]
    : [];

  const rightActions = activeTab === 'inquiry'
    ? [
        { id: 'excel' as ActionType, onClick: handleExcelDownload },
        { id: 'search' as ActionType, onClick: handleSearch },
        { id: 'reset' as ActionType, onClick: handleReset }
      ]
    : [
        { id: 'register' as ActionType, onClick: handleRegister },
        { id: 'reset' as ActionType, onClick: handleReset }
      ];

  if (!currentState) return null;

  const rowCount = currentState.tables?.['bondsTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">留ㅺ컖梨꾧텒?쇨큵?깅줉</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>留ㅺ컖梨꾧텒?쇨큵?깅줉</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between">
        <LeftActions actions={leftActions} />
        <RightActions actions={rightActions} />
      </div>

      {/* Tabs Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="inquiry">議고쉶</TabsTrigger>
          <TabsTrigger value="registration">?쇨큵?깅줉</TabsTrigger>
        </TabsList>

        <TabsContent value="inquiry" className="flex flex-col gap-4 mt-0">
            <FilterContainer 
                filterLayout={inquiryFilterLayout}
                values={currentState.filters}
                onChange={handleFilterChange}
            />
            
            <DataTable 
                title="議고쉶?댁슜"
                columns={columns}
                data={currentState.tables?.['bondsTable'] || []}
            />
        </TabsContent>

        <TabsContent value="registration" className="flex flex-col gap-4 mt-0">
            <div className="rounded-lg border px-4 py-4">
              <FilterFileUpload label="?묒??뚯씪" buttons={['browse']} />
            </div>
            
            <DataTable 
                title="議고쉶?댁슜"
                columns={columns}
                data={currentState.tables?.['bondsTable'] || []}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}


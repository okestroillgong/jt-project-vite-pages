

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
  createColumn("customerName", "고객명"),
  createColumn("customerNo", "고객번호"),
  createColumn("accountNo", "계좌번호"),
  createColumn("saleYearMonth", "매각연월"),
  createColumn("searchStartDate", "조회시작일"),
  createColumn("searchEndDate", "조회종료일"),
  createColumn("companyName", "업체명"),
  createColumn("companyContact", "업체연락처"),
  createColumn("companyAddress", "업체주소"),
  createColumn("saleQuarter", "매각분기"),
];

// 3. Mock Data
const mockData: BondsForSaleItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  customerName: `고객${i + 1}`,
  customerNo: `CUST${1000 + i}`,
  accountNo: `123-45-6789${i}`,
  saleYearMonth: "2024-01",
  searchStartDate: "2024-01-01",
  searchEndDate: "2024-01-31",
  companyName: `매각업체${i + 1}`,
  companyContact: "02-1234-5678",
  companyAddress: "서울시 강남구",
  saleQuarter: "1분기",
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

  // // 멀티 엑셀 다운로드 팝업으로 변경 시, 아래 주석 처리된 코드를 사용하세요.
  // const handleExcelDownload = () => {
  //   const width = 360;
  //   const height = 200;
  //   const left = window.screen.width / 2 - width / 2;
  //   const top = window.screen.height / 2 - height / 2;
  //   window.open(
  //     `/popup/multi-excel-download`,
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
      `/popup/excel-download?columns=${encodedColumns}`,
      "ExcelDownload",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // Fix layout for Row 3: "매각분기" should be one conceptual unit. 
  // FilterContainer grid simply flows. 
  // Let's adjust Row 3 to look better.
  const inquiryFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "regDate", type: "date-range", label: "등록일자" },
        { name: "customerNo", type: "search", label: "고객번호" },
        { name: "customerName", type: "text", label: "고객명" },
        
        { name: "saleProcessDate", type: "date-range", label: "매각 처리일" },
        { name: "companyName", type: "text", label: "업체명" },
        { name: "accountNo", type: "text", label: "계좌번호" },
      ]
    },
    {
        type: "grid",
        columns: 4, // Use 4 cols to fit the quarter split better or just standard 3
        filters: [
            { name: "saleYear", type: "text", label: "매각분기(년)" },
            { name: "saleQuarter", type: "select", label: "분기", options: [{value: "1", label: "1분기"}, {value: "2", label: "2분기"}] },
            { name: "pool", type: "text", label: "pool" },
            { name: "generalSpecial", type: "select", label: "일반/특수", options: [{value: "general", label: "일반"}, {value: "special", label: "특수"}] },
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
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">매각채권일괄등록</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>매각채권일괄등록</BreadcrumbPage>
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
          <TabsTrigger value="inquiry">조회</TabsTrigger>
          <TabsTrigger value="registration">일괄등록</TabsTrigger>
        </TabsList>

        <TabsContent value="inquiry" className="flex flex-col gap-4 mt-0">
            <FilterContainer 
                filterLayout={inquiryFilterLayout}
                values={currentState.filters}
                onChange={handleFilterChange}
            />
            
            <DataTable 
                title="조회내용"
                columns={columns}
                data={currentState.tables?.['bondsTable'] || []}
            />
        </TabsContent>

        <TabsContent value="registration" className="flex flex-col gap-4 mt-0">
            <div className="rounded-lg border px-4 py-4">
              <FilterFileUpload label="엑셀파일" buttons={['browse']} />
            </div>
            
            <DataTable 
                title="조회내용"
                columns={columns}
                data={currentState.tables?.['bondsTable'] || []}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}

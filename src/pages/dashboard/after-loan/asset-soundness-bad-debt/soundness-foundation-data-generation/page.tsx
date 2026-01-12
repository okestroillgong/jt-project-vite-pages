

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useState, useEffect } from "react";
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
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// 1. Type Definitions
type SoundnessDataGenerationItem = {
  id: number;
  baseYM: string;
  customerName: string;
  bizRegNo: string;
  realNameNo: string;
  corpRegNo: string;
};

// 2. Column Definitions
const createColumn = (accessorKey: string, header: string): ColumnDef<SoundnessDataGenerationItem> => ({
  accessorKey,
  header,
});

const columns: ColumnDef<SoundnessDataGenerationItem>[] = [
  createColumn("id", "순번"),
  createColumn("baseYM", "기준년월"),
  createColumn("customerName", "고객명"),
  createColumn("bizRegNo", "개인사업자등록번호"),
  createColumn("realNameNo", "실명번호"),
  createColumn("corpRegNo", "법인등록번호"),
];

// 3. Mock Data
const mockData: SoundnessDataGenerationItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  baseYM: "2024-11",
  customerName: `고객${i + 1}`,
  bizRegNo: `123-45-6789${i}`,
  realNameNo: `800101-123456${i}`,
  corpRegNo: `110111-123456${i}`,
}));

export default function SoundnessDataGenerationPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("inquiry");

  // 4. Filter Layout
  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { 
          name: "settlementMonth", 
          type: "select", 
          label: "결산월", 
          options: [
            { value: "2024-11", label: "2024-11" },
            { value: "2024-10", label: "2024-10" },
          ] 
        },
        { 
          name: "reportType", 
          type: "select", 
          label: "보고서 종류", 
          options: [
            { value: "type1", label: "보고서1" },
            { value: "type2", label: "보고서2" },
          ] 
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

  const handleSearch = () => {
    console.log("Searching...");
    updateTableData(tabId, 'soundnessTable', mockData);
  };

  const handleReset = () => {
    clearState(tabId);
  };

  const handleUpload = () => {
    console.log("Uploading...");
  };

  // Dynamic Actions based on Tab
  const leftActions = activeTab === 'inquiry' 
    ? [{ id: 'progressStatus' as any }, { id: 'complete' as any }]
    : [{ id: 'progressStatus' as any }, { id: 'generateData' as any }];

  const rightActions = activeTab === 'inquiry'
    ? [
        { id: 'search' as ActionType, onClick: handleSearch },
        { id: 'reset' as ActionType, onClick: handleReset }
      ]
    : [
        { id: 'excel-upload' as ActionType, onClick: handleUpload }
      ];

  if (!currentState) return null;

  const rowCount = currentState.tables?.['soundnessTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">건전성 기초자료 생성</h2>
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
              <BreadcrumbPage>건전성 기초자료 생성</BreadcrumbPage>
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
          <TabsTrigger value="generation">생성</TabsTrigger>
        </TabsList>

        <TabsContent value="inquiry" className="flex flex-col gap-4 mt-0">
            <FilterContainer 
                filterLayout={filterLayout}
                values={currentState.filters}
                onChange={handleFilterChange}
            />
            
            <DataTable 
                title="조회내용"
                columns={columns}
                data={currentState.tables?.['soundnessTable'] || []}
            />
        </TabsContent>

        <TabsContent value="generation" className="flex flex-col gap-4 mt-0">
            <FilterContainer 
                filterLayout={filterLayout}
                values={currentState.filters}
                onChange={handleFilterChange}
            />
            
            <DataTable 
                title="조회내용"
                columns={columns}
                data={currentState.tables?.['soundnessTable'] || []}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
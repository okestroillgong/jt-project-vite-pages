

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useState, useEffect } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";
import { RightActions, ActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { FilterContainer } from "@/components/filters/FilterContainer";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// 1. Type Definitions
type AssignedManagerItem = {
  id: number;
  managerId: string;
  managerName: string;
  count: number;
  startDate: string;
  accountNo: string;
  customerName: string;
  historyStartDate: string;
  historyEndDate: string;
  historyManagerId: string;
  historyManagerName: string;
};

type UnassignedManagerItem = {
  id: number;
  accountNo: string;
  customerNo: string;
  customerName: string;
  productName: string;
};

// 2. Column Definitions

// 2.1 Assigned Tab (Simplified)
const createColumn = (accessorKey: string, header: string): ColumnDef<AssignedManagerItem> => ({
  accessorKey,
  header,
});

const assignedColumns: ColumnDef<AssignedManagerItem>[] = [
  createColumn("managerId", "?대떦???щ쾲"),
  createColumn("managerName", "?대떦?먮챸"),
  createColumn("count", "嫄댁닔"),
  createColumn("startDate", "?대떦 ?쒖옉??),
  createColumn("accountNo", "怨꾩쥖踰덊샇"),
  createColumn("customerName", "怨좉컼紐?),
  createColumn("historyStartDate", "?대떦 ?쒖옉??),
  createColumn("historyEndDate", "?대떦 醫낅즺??),
  createColumn("historyManagerId", "?대떦???щ쾲"),
  createColumn("historyManagerName", "?대떦?먮챸"),
];

// 2.2 Unassigned Tab (No Checkbox)
const createUnassignedColumn = (accessorKey: string, header: string): ColumnDef<UnassignedManagerItem> => ({
  accessorKey,
  header,
});

const unassignedColumns: ColumnDef<UnassignedManagerItem>[] = [
  createUnassignedColumn("accountNo", "怨꾩쥖踰덊샇"),
  createUnassignedColumn("customerNo", "怨좉컼踰덊샇"),
  createUnassignedColumn("customerName", "怨좉컼紐?),
];

// 3. Mock Data
const mockAssignedData: AssignedManagerItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  managerId: `M${1000 + i}`,
  managerName: `?대떦??{i + 1}`,
  count: 1,
  startDate: "2024-01-01",
  accountNo: `123-45-6789${i}`,
  customerName: `怨좉컼${i + 1}`,
  historyStartDate: "2023-01-01",
  historyEndDate: "2023-12-31",
  historyManagerId: `M${2000 + i}`,
  historyManagerName: `?댁쟾?대떦${i + 1}`,
}));

const mockUnassignedData: UnassignedManagerItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  accountNo: `987-65-4321${i}`,
  customerNo: `CUST${5000 + i}`,
  customerName: `誘몃같?뺢퀬媛?{i + 1}`,
  productName: "?좎슜?異?,
}));

export default function SpecialBondManagerInquiryPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("assigned");

  // Popup Message Listener
  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "user-search") { 
        const user = message.payload;
        updateFilters(tabId, { 
            unassignedManagerCode: { code: user.userId, name: user.userName },
            unassignedManagerName: user.userName
        });
      }
    });
    return cleanup;
  }, [tabId, activeTab, updateFilters]);

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleSearch = () => {
    console.log("Searching...");
    if (activeTab === 'assigned') {
        updateTableData(tabId, 'assignedTable', mockAssignedData);
    } else {
        updateTableData(tabId, 'unassignedTable', mockUnassignedData);
    }
  };

  const handleReset = () => {
    clearState(tabId);
  };

  const handleRegister = () => {
    console.log("Registering assignment...");
  };

  // Filter Layouts
  const unassignedFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { 
            name: "unassignedManagerCode", 
            type: "search", 
            label: "?대떦??肄붾뱶",
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`${import.meta.env.BASE_URL}popup/user-search?openerTabId=${tabId}`, "UserSearch", "width=1600,height=800");
            }
        },
        { name: "unassignedManagerName", type: "text", label: "?대떦?먮챸", readonly: true },
        { name: "unassignedStartDate", type: "date", label: "?대떦?쒖옉?? },
      ],
    },
  ];

  const rightActions = activeTab === 'assigned'
    ? [] // No actions for assigned tab
    : [
        { id: 'register' as ActionType, onClick: handleRegister },
        { id: 'reset' as ActionType, onClick: handleReset }
      ];

  if (!currentState) return null;

  const assignedRowCount = currentState.tables?.['assignedTable']?.length || 0;
  const unassignedRowCount = currentState.tables?.['unassignedTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?뱀닔梨꾧텒 ?대떦?먯“??/h2>
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
              <BreadcrumbPage>?뱀닔梨꾧텒 ?대떦?먯“??/BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Actions */}
      <div className="flex justify-end min-h-[35px]">
        <RightActions actions={rightActions} />
      </div>

      {/* Tabs Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">諛곗젙</TabsTrigger>
          <TabsTrigger value="unassigned">誘몃같??/TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="flex flex-col gap-4 mt-0">
            {/* Result Summary Layout (Mimicking Filter Container) */}
            <div className="flex justify-between items-center px-6 py-8 bg-[#f5f6f9] text-sm border-gray-200 border-1 rounded-lg">
            <div className="flex justify-between items-center gap-12">
                <div className="font-medium">?대떦???뺣낫: </div>
                  <div>
                    <span className="text-[#3da072]">珥?1</span>嫄?                  </div>
                </div>

                <div className="flex justify-between items-center gap-12">
                  <div className="font-medium">?대떦 怨꾩쥖?뺣낫: </div>
                  <div>
                    <span className="text-[#3da072]">珥?1</span>嫄?                  </div>
                </div>

                <div className="flex justify-between items-center gap-12">
                  <div className="font-medium">怨꾩쥖 ?대젰?뺣낫: </div>
                  <div>
                    <span className="text-[#3da072]">珥?3</span>嫄?                  </div>
                </div>
            </div>
            
            <DataTable 
                columns={assignedColumns}
                data={currentState.tables?.['assignedTable'] || []}
            />
        </TabsContent>

        <TabsContent value="unassigned" className="flex flex-col gap-4 mt-0">
            <FilterContainer 
                filterLayout={unassignedFilterLayout}
                values={currentState.filters}
                onChange={handleFilterChange}
            />
            
            <DataTable 
                title="?대떦 誘몃같??怨꾩쥖?뺣낫"
                columns={unassignedColumns}
                data={currentState.tables?.['unassignedTable'] || []}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}

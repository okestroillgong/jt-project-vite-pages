

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
type ManagerManagementItem = {
  id: number;
  managerName: string;
  incorporationDate: string;
  customerNo: string;
  customerName: string;
  accountNo: string;
  productName: string;
};

// 2. Column Definitions
const createColumn = (accessorKey: string, header: string): ColumnDef<ManagerManagementItem> => ({
  accessorKey,
  header,
});

const columns: ColumnDef<ManagerManagementItem>[] = [
  createColumn("id", "?쒕쾲"),
  createColumn("managerName", "?대떦?먮챸"),
  createColumn("incorporationDate", "?몄엯?쇱옄"),
  createColumn("customerNo", "怨좉컼踰덊샇"),
  createColumn("customerName", "怨좉컼紐?),
  createColumn("accountNo", "怨꾩쥖踰덊샇"),
  createColumn("productName", "?곹뭹紐?),
];

// 3. Mock Data
const mockData: ManagerManagementItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  managerName: `?대떦??{i + 1}`,
  incorporationDate: "2024-01-01",
  customerNo: `CUST${1000 + i}`,
  customerName: `怨좉컼${i + 1}`,
  accountNo: `123-45-6789${i}`,
  productName: "?좎슜?異?,
}));

export default function SpecialBondManagerManagementPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("inquiry");

  // Popup Message Listener
  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "branch-management") {
        const branch = message.payload;
        updateFilters(tabId, {
            managementBranch: { code: branch.branchCode, name: branch.branchName }
        });
      } else if (message.source === "user-search") { // Assuming user-search popup for manager
        const user = message.payload;
        // Determine which field to update based on active tab or message context if available
        // For simplicity, updating both or checking current active filter logic (complex without context)
        // Let's assume unique filter names help.
        // inquiry: manager, registration: regManager
        // Ideally pass a context ID to popup.
        // Here simply update 'manager' if in inquiry, 'regManager' if in registration.
        if (activeTab === 'inquiry') {
             updateFilters(tabId, { manager: { code: user.userId, name: user.userName } });
        } else {
             updateFilters(tabId, { 
                 regManager: { code: user.userId, name: user.userName },
                 regManagerName: user.userName 
             });
        }
      } else if (message.source === "customer-search") {
        const customer = message.payload;
        updateFilters(tabId, {
            customerNo: { code: customer.centralCustomerNumber, name: customer.customerName }
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
    updateTableData(tabId, 'managerTable', mockData);
  };

  const handleReset = () => {
    clearState(tabId);
  };

  const handleRegister = () => {
    console.log("Registering...");
  };

  const handleExcelDownload = () => {
    console.log("Downloading Excel...");
  };

  // Filter Layouts
  const inquiryFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "incorporationDate", type: "date-range", label: "?몄엯?쇱옄" },
        { 
            name: "managementBranch", 
            type: "search", 
            label: "愿由щ???,
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`${import.meta.env.BASE_URL}popup/branch-management?openerTabId=${tabId}`, "BranchManagement", "width=1600,height=800");
            }
        },
        { 
            name: "manager", 
            type: "long-search", 
            label: "?대떦??,
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`${import.meta.env.BASE_URL}popup/user-search?openerTabId=${tabId}`, "UserSearch", "width=1600,height=800");
            }
        },
        { 
            name: "customerNo", 
            type: "search", 
            label: "怨좉컼踰덊샇",
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`${import.meta.env.BASE_URL}popup/customer-search?openerTabId=${tabId}`, "CustomerSearch", "width=1600,height=800");
            }
        },
        { name: "accountNo", type: "text", label: "怨꾩쥖踰덊샇" },
        { 
            name: "isManager", 
            type: "select", 
            label: "?대떦?щ?", 
            options: [{ value: "Y", label: "Y" }, { value: "N", label: "N" }] 
        },
      ],
    },
  ];

  const registrationFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { 
            name: "regManager", 
            type: "long-search", 
            label: "?대떦??,
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`${import.meta.env.BASE_URL}popup/user-search?openerTabId=${tabId}`, "UserSearch", "width=1600,height=800");
            }
        },
        { name: "regManagerName", type: "text", label: "?대떦?먮챸", readonly: true },
        { name: "regStartDate", type: "date", label: "?대떦?쒖옉?? },
      ],
    },
  ];

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

  const rowCount = currentState.tables?.['managerTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?뱀닔梨꾧텒 ?대떦?먭?由?/h2>
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
              <BreadcrumbPage>?뱀닔梨꾧텒 ?대떦?먭?由?/BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Actions */}
      <div className="flex justify-end">
        <RightActions actions={rightActions} />
      </div>

      {/* Tabs Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="inquiry">議고쉶</TabsTrigger>
          <TabsTrigger value="registration">?대떦???깅줉</TabsTrigger>
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
                data={currentState.tables?.['managerTable'] || []}
            />
        </TabsContent>

        <TabsContent value="registration" className="flex flex-col gap-4 mt-0">
            <FilterContainer 
                filterLayout={registrationFilterLayout}
                values={currentState.filters}
                onChange={handleFilterChange}
            />
            
            <DataTable 
                title="議고쉶?댁슜"
                columns={columns}
                data={currentState.tables?.['managerTable'] || []} // Using same table for demo
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}

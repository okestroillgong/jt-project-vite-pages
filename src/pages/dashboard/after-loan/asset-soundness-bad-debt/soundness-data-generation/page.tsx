

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib${import.meta.env.BASE_URL}popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";
import { LeftActions } from "@/components/app/LeftActions";
import { RightActions, ActionType as RightActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterFileUpload } from "@/components/filters/FilterFileUpload";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// ?뚯씠釉?1: 議고쉶 ?곗씠?????type InquiryData = {
  id: number;
  soundnessMonth: string;
  subjectName: string;
  customerName: string;
  customerNumber: string;
  accountNumber: string;
  loanAmount: number;
};

// ?뚯씠釉?2: ?섏젙?댁뿭 ?곗씠?????type HistoryData = InquiryData & {
  loanBalance: number;
  loanBySubject: number;
};

// ?뚯씠釉?1 紐⑹뾽 ?곗씠??const mockInquiryData: InquiryData[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  soundnessMonth: "2024-10",
  subjectName: "?쇰컲?먭툑?異?,
  customerName: `怨좉컼${i + 1}`,
  customerNumber: `CUST${1001 + i}`,
  accountNumber: `ACC${2001 + i}`,
  loanAmount: 15000000 * (i + 1),
}));

// ?뚯씠釉?2 紐⑹뾽 ?곗씠??const mockHistoryData: HistoryData[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  soundnessMonth: "2024-09",
  subjectName: "?쒖꽕?먭툑?異?,
  customerName: `?대젰怨좉컼${i + 1}`,
  customerNumber: `HIST${1001 + i}`,
  accountNumber: `HIST_ACC${2001 + i}`,
  loanAmount: 20000000 * (i + 1),
  loanBalance: 18000000 * (i + 1),
  loanBySubject: 5000000 * (i + 1),
}));

// ?뚯씠釉?1 而щ읆 ?뺤쓽
const inquiryColumns: ColumnDef<InquiryData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "soundnessMonth", header: "嫄댁쟾?깅뀈?? },
  { accessorKey: "subjectName", header: "怨쇰ぉ紐? },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "customerNumber", header: "怨좉컼踰덊샇" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "loanAmount", header: "?異쒓툑?? },
];

// ?뚯씠釉?2 而щ읆 ?뺤쓽
const historyColumns: ColumnDef<HistoryData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "soundnessMonth", header: "嫄댁쟾?깅뀈?? },
  { accessorKey: "subjectName", header: "怨쇰ぉ紐? },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "customerNumber", header: "怨좉컼踰덊샇" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "loanAmount", header: "?異쒓툑?? },
  { accessorKey: "loanBalance", header: "?異쒖옍?? },
  { accessorKey: "loanBySubject", header: "怨쇰ぉ蹂꾨?異쒓툑" },
];

const CLOSING_MONTH_OPTIONS = [
  { value: "2024-01", label: "2024-01" },
  { value: "2024-02", label: "2024-02" },
  { value: "2024-03", label: "2024-03" },
  { value: "2024-04", label: "2024-04" },
  { value: "2024-05", label: "2024-05" },
  { value: "2024-06", label: "2024-06" },
  { value: "2024-07", label: "2024-07" },
  { value: "2024-08", label: "2024-08" },
  { value: "2024-09", label: "2024-09" },
  { value: "2024-10", label: "2024-10" },
  { value: "2024-11", label: "2024-11" },
  { value: "2024-12", label: "2024-12" },
];

export default function SoundnessDataGenerationPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("inquiry");
  const [userPermission, setUserPermission] = useState("Q0001");
  const [tableType, setTableType] = useState<'inquiry' | 'history'>('inquiry'); // ?뚯씠釉?????곹깭

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;
      if (message.source === 'customer-search') {
        const customer = message.payload;
        updateFilters(tabId, { 
          customerNumber: customer.centralCustomerNumber,
          accountNumber: customer.accountNumber
        });
      } else if (message.source === 'branch-management') {
        const branch = message.payload;
        updateFilters(tabId, { 
          managementBranch: { 
            code: branch.branchCode,
            name: branch.branchName
          } 
        });
      } else if (message.source === 'user-search') {
        const user = message.payload;
        updateFilters(tabId, {
          modifierEmployeeId: {
            code: user.usrno,
            name: user.usrNm
          }
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const inquiryFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { 
          name: "closingMonth", 
          type: "combobox", 
          label: "寃곗궛??, 
          options: CLOSING_MONTH_OPTIONS 
        },
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "怨좉컼踰덊샇",
          defaultValue: "CUST1001",
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
        { name: "businessScale", type: "select", label: "湲곗뾽洹쒕え", options: [] },
        { name: "accountName", type: "select", label: "怨쇰ぉ紐?, options: [] },
        { name: "industryClassification", type: "select", label: "?낆쥌遺꾨쪟", options: [] },
        { name: "byRegion", type: "text", label: "吏??퀎" },
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
        { name: "detailedProductName", type: "select", label: "?몃? ?곹뭹紐?, options: [] },
        { 
          name: "modifierEmployeeId", 
          type: "search", 
          label: "?섏젙???щ쾲",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const usrno = value?.code || '';
            const usrNm = value?.name || '';
            window.open(`${import.meta.env.BASE_URL}popup/user-search?usrno=${usrno}&usrNm=${usrNm}&openerTabId=${tabId}`, 'UserSearch', 'width=1600,height=800');
          }
        },
        { name: "blank1", type: "blank" },
        { name: "blank2", type: "blank" },
      ],
    },
  ];
  
  const generationFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "baseDate", type: "date", label: "湲곗??쇱옄" },
        { name: "generationCondition", type: "select", label: "?앹꽦議곌굔", options: [] },
        { name: "blank", type: "blank" },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  // "議고쉶" 踰꾪듉 ?몃뱾??  const handleSearch = () => {
    console.log("Search clicked, fetching inquiry data...");
    setTableType('inquiry');
    updateTableData(tabId, "soundnessTable", mockInquiryData);
  };

  // "?섏젙?댁뿭" 踰꾪듉 ?몃뱾??  const handleHistorySearch = () => {
    console.log("History clicked, fetching history data...");
    setTableType('history');
    updateTableData(tabId, "soundnessTable", mockHistoryData);
  };

  const leftActions = useMemo(() => {
    if (activeTab === "inquiry") {
      return [{ id: "confirm" }];
    }
    return [];
  }, [activeTab]);

  const rightActions = useMemo(() => {
    if (activeTab === "inquiry") {
      const baseActions: RightActionType[] = ['progressStatus', 'history', 'search', 'modify'];
      const permissionActions: Record<string, RightActionType[]> = {
        'Q0001': [...baseActions, 'assignConfirm', 'auditOpinion', 'auditConfirm', 'surcharge', 'excel', ],
        'Q0002': [...baseActions, 'assignConfirm', 'excel'],
        'Q0003': [...baseActions, 'auditOpinion', 'auditConfirm', 'excel'],
        'Q0004': [...baseActions, 'auditOpinion', 'auditConfirm', 'excel'],
        'Q0005': [...baseActions, 'auditOpinion', 'surcharge', 'excel'],
        'Q0006': [...baseActions, 'excel'],
      };
      
      const actionsForPermission = permissionActions[userPermission] || [];

      return actionsForPermission.map(id => {
        if (id === 'search') {
          return { id, onClick: handleSearch };
        }
        if (id === 'history') {
          return { id, onClick: handleHistorySearch };
        }
        if (id === 'progressStatus') {
          return {
            id,
            onClick: () => {
              const popupWidth = 1600;
              const popupHeight = 900;
              const left = (window.screen.width / 2) - (popupWidth / 2);
              const top = (window.screen.height / 2) - (popupHeight / 2);
              window.open(
                '${import.meta.env.BASE_URL}popup/asset-soundness-progress',
                'AssetSoundnessProgress',
                `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
              );
            }
          };
        }
        if (id === 'auditOpinion') {
          return {
            id,
            onClick: () => {
              const popupWidth = 1000;
              const popupHeight = 800;
              const left = (window.screen.width / 2) - (popupWidth / 2);
              const top = (window.screen.height / 2) - (popupHeight / 2);
              
              const selectedMonth = currentState?.filters.closingMonth || "";
              const monthOptions = encodeURIComponent(JSON.stringify(CLOSING_MONTH_OPTIONS));

              window.open(
                `${import.meta.env.BASE_URL}popup/soundness-audit-opinion?openerTabId=${tabId}&selectedMonth=${selectedMonth}&monthOptions=${monthOptions}`,
                'SoundnessAuditOpinion',
                `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
              );
            }
          };
        }
        return { id };
      }) as { id: RightActionType; onClick?: () => void }[];
    }
    if (activeTab === "generation") {
      return [{ id: "register" }] as { id: RightActionType; onClick?: () => void }[];
    }
    return [];
  }, [activeTab, userPermission, handleSearch, handleHistorySearch]);

  if (!currentState) return null;

  const currentColumns = tableType === 'inquiry' ? inquiryColumns : historyColumns;
  const amountColumns = tableType === 'inquiry' 
    ? ["loanAmount"] 
    : ["loanAmount", "loanBalance", "loanBySubject"];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">嫄댁쟾???먮즺 ?앹꽦</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?먯궛嫄댁쟾????먯긽媛?/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>嫄댁쟾???먮즺 ?앹꽦</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <LeftActions actions={leftActions} />
        <RightActions actions={rightActions} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inquiry">議고쉶</TabsTrigger>
          <TabsTrigger value="generation">?앹꽦</TabsTrigger>
        </TabsList>
        <TabsContent value="inquiry">
          <FilterContainer
            filterLayout={inquiryFilterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
          />
        </TabsContent>
        <TabsContent value="generation">
          <div className="rounded-lg border px-4 py-4">
            <FilterFileUpload label="?뚯씪 ?좏깮" buttons={['browse']} />
          </div>
        </TabsContent>
      </Tabs>

      <DataTable
        title="議고쉶?댁슜"
        columns={currentColumns}
        data={currentState.tables?.['soundnessTable'] || []}
        amountColumns={amountColumns}
        onRowDoubleClick={(row) => {
          const dummyRrn = "800101-1234567";
          window.open(
            `${import.meta.env.BASE_URL}popup/bond-legal-progress?residentRegistrationNumber=${dummyRrn}`,
            'BondLegalProgress',
            'width=1600,height=800'
          );
        }}
      />
    </div>
  );
}


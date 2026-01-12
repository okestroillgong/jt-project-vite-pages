

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
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
import { LeftActions } from "@/components/app/LeftActions";
import { RightActions, ActionType as RightActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterFileUpload } from "@/components/filters/FilterFileUpload";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// 테이블 1: 조회 데이터 타입
type InquiryData = {
  id: number;
  soundnessMonth: string;
  subjectName: string;
  customerName: string;
  customerNumber: string;
  accountNumber: string;
  loanAmount: number;
};

// 테이블 2: 수정내역 데이터 타입
type HistoryData = InquiryData & {
  loanBalance: number;
  loanBySubject: number;
};

// 테이블 1 목업 데이터
const mockInquiryData: InquiryData[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  soundnessMonth: "2024-10",
  subjectName: "일반자금대출",
  customerName: `고객${i + 1}`,
  customerNumber: `CUST${1001 + i}`,
  accountNumber: `ACC${2001 + i}`,
  loanAmount: 15000000 * (i + 1),
}));

// 테이블 2 목업 데이터
const mockHistoryData: HistoryData[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  soundnessMonth: "2024-09",
  subjectName: "시설자금대출",
  customerName: `이력고객${i + 1}`,
  customerNumber: `HIST${1001 + i}`,
  accountNumber: `HIST_ACC${2001 + i}`,
  loanAmount: 20000000 * (i + 1),
  loanBalance: 18000000 * (i + 1),
  loanBySubject: 5000000 * (i + 1),
}));

// 테이블 1 컬럼 정의
const inquiryColumns: ColumnDef<InquiryData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "soundnessMonth", header: "건전성년월" },
  { accessorKey: "subjectName", header: "과목명" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "loanAmount", header: "대출금액" },
];

// 테이블 2 컬럼 정의
const historyColumns: ColumnDef<HistoryData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "soundnessMonth", header: "건전성년월" },
  { accessorKey: "subjectName", header: "과목명" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "loanAmount", header: "대출금액" },
  { accessorKey: "loanBalance", header: "대출잔액" },
  { accessorKey: "loanBySubject", header: "과목별대출금" },
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
  const [tableType, setTableType] = useState<'inquiry' | 'history'>('inquiry'); // 테이블 타입 상태

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
          label: "결산월", 
          options: CLOSING_MONTH_OPTIONS 
        },
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "고객번호",
          defaultValue: "CUST1001",
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
        { name: "businessScale", type: "select", label: "기업규모", options: [] },
        { name: "accountName", type: "select", label: "과목명", options: [] },
        { name: "industryClassification", type: "select", label: "업종분류", options: [] },
        { name: "byRegion", type: "text", label: "지역별" },
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
        { name: "detailedProductName", type: "select", label: "세부 상품명", options: [] },
        { 
          name: "modifierEmployeeId", 
          type: "search", 
          label: "수정자 사번",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const usrno = value?.code || '';
            const usrNm = value?.name || '';
            window.open(`/popup/user-search?usrno=${usrno}&usrNm=${usrNm}&openerTabId=${tabId}`, 'UserSearch', 'width=1600,height=800');
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
        { name: "baseDate", type: "date", label: "기준일자" },
        { name: "generationCondition", type: "select", label: "생성조건", options: [] },
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

  // "조회" 버튼 핸들러
  const handleSearch = () => {
    console.log("Search clicked, fetching inquiry data...");
    setTableType('inquiry');
    updateTableData(tabId, "soundnessTable", mockInquiryData);
  };

  // "수정내역" 버튼 핸들러
  const handleHistorySearch = () => {
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
                '/popup/asset-soundness-progress',
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
                `/popup/soundness-audit-opinion?openerTabId=${tabId}&selectedMonth=${selectedMonth}&monthOptions=${monthOptions}`,
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
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">건전성 자료 생성</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>자산건전성/대손상각</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>건전성 자료 생성</BreadcrumbPage>
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
          <TabsTrigger value="inquiry">조회</TabsTrigger>
          <TabsTrigger value="generation">생성</TabsTrigger>
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
            <FilterFileUpload label="파일 선택" buttons={['browse']} />
          </div>
        </TabsContent>
      </Tabs>

      <DataTable
        title="조회내용"
        columns={currentColumns}
        data={currentState.tables?.['soundnessTable'] || []}
        amountColumns={amountColumns}
        onRowDoubleClick={(row) => {
          const dummyRrn = "800101-1234567";
          window.open(
            `/popup/bond-legal-progress?residentRegistrationNumber=${dummyRrn}`,
            'BondLegalProgress',
            'width=1600,height=800'
          );
        }}
      />
    </div>
  );
}



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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LegalManagementListItem = {
  seq: number;
  legalType: string;
  customerNo: string;
  customerName: string;
  realNameNo: string;
  competentCourt: string;
  caseNumber: string;
  caseName: string;
  claimAmount: number;
  status: string;
};

type CaseHistoryItem = {
  date: string;
  content: string;
  result: string;
};

const createColumn = (accessorKey: string, header: string): ColumnDef<LegalManagementListItem> => ({
  accessorKey,
  header,
});

const listColumns: ColumnDef<LegalManagementListItem>[] = [
  createColumn("seq", "순번"),
  createColumn("legalType", "법무구분"),
  createColumn("customerNo", "고객번호"),
  createColumn("customerName", "고객명"),
  createColumn("realNameNo", "실명번호"),
  createColumn("competentCourt", "관할법원"),
  createColumn("caseNumber", "사건번호"),
  createColumn("caseName", "사건명"),
  createColumn("claimAmount", "청구금액"),
  createColumn("status", "법무진행"),
];

const historyColumns: ColumnDef<CaseHistoryItem>[] = [
  { accessorKey: "date", header: "일자" },
  { accessorKey: "content", header: "내용" },
  { accessorKey: "result", header: "결과" },
];

const mockListData: LegalManagementListItem[] = Array.from({ length: 5 }, (_, i) => ({
  seq: i + 1,
  legalType: "지급명령",
  customerNo: `CUST${1000 + i}`,
  customerName: `고객${i + 1}`,
  realNameNo: `800101-123456${i}`,
  competentCourt: "서울중앙지방법원",
  caseNumber: `2024차123${i}`,
  caseName: "대여금 반환 청구",
  claimAmount: 15000000,
  status: "접수",
}));

const mockHistoryData: CaseHistoryItem[] = [
  { date: "2024-01-15", content: "지급명령 신청서 접수", result: "접수완료" },
  { date: "2024-01-20", content: "보정명령 등본 송달", result: "도달" },
];

export default function LegalManagementPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeDetailTab, setActiveDetailTab] = useState("payment-order");
  const [showDetailHistory, setShowDetailHistory] = useState(false);

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "customer-search") {
        const customer = message.payload;
        updateFilters(tabId, { 
            customerSearch: { code: customer.customerName, name: customer.centralCustomerNumber },
            detailCustomerNo: { code: customer.customerName, name: customer.centralCustomerNumber } 
        });
      } else if (message.source === "case-inquiry") {
        const caseData = message.payload;
        updateFilters(tabId, { 
            caseNumber: { code: caseData.csNo, name: caseData.csNm },
            detailCaseNo: { code: caseData.csNo, name: caseData.csNm }
        });
      } else if (message.source === "branch-management") {
        const branch = message.payload;
        updateFilters(tabId, {
            detailDept: { code: branch.branchCode, name: branch.branchName }
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const legalInquiryFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { 
          name: "customerSearch", 
          type: "search", 
          label: "고객검색",
          onButtonClick: (val, e) => {
            e?.preventDefault();
            window.open(
              `/popup/customer-search?openerTabId=${tabId}`,
              "CustomerSearch",
              "width=1600,height=800"
            );
          }
        },
        { 
          name: "caseNumber", 
          type: "search", 
          label: "사건번호",
          onButtonClick: (val, e) => {
             e?.preventDefault();
             const caseNumber = val?.code || '';
             window.open(
               `/popup/case-inquiry?caseNumber=${caseNumber}&openerTabId=${tabId}`,
               "CaseInquiry",
               "width=1600,height=800"
             );
          }
        },
      ]
    }
  ];

  const createDetailLayout = (type: string): FilterLayout => {
    const handleCustSearch = (val: any, e: any) => {
        e?.preventDefault();
        window.open(`/popup/customer-search?openerTabId=${tabId}`, "CustomerSearch", "width=1600,height=800");
    };
    const handleCaseSearch = (val: any, e: any) => {
        e?.preventDefault();
        const caseNumber = val?.code || '';
        window.open(`/popup/case-inquiry?caseNumber=${caseNumber}&openerTabId=${tabId}`, "CaseInquiry", "width=1600,height=800");
    };
    const handleDeptSearch = (val: any, e: any) => {
        e?.preventDefault();
        window.open(`/popup/branch-management?openerTabId=${tabId}`, "BranchManagement", "width=1600,height=800");
    };

    let row1_2 = [
        { name: "detailCustomerNo", type: "search", label: "고객번호", onButtonClick: handleCustSearch },
        { name: "detailCustomerName", type: "text", label: "고객명" },
        { name: "detailRealNameNo", type: "text", label: "실명번호" },
        { name: "detailCourt", type: "select", label: "관할법원", options: [] },
        { name: "detailCaseNo", type: "search", label: "사건번호", onButtonClick: handleCaseSearch },
        { name: "detailCaseName", type: "text", label: "사건명" },
    ];

    if (type === 'public-sale') {
        const courtIndex = row1_2.findIndex(f => f.name === "detailCourt");
        if (courtIndex !== -1) row1_2[courtIndex] = { ...row1_2[courtIndex], label: "공매주관사" };
    }

    let row3 = [
        { name: "detailClaimAmount", type: "number", label: "청구금액" },
        { name: "detailCreditor", type: "text", label: "채권자" },
        { name: "detailDebtor", type: "text", label: "채무자" },
    ];

    if (type === 'lawsuit') {
        row3[0] = { ...row3[0], label: "원고소가" };
        row3[1] = { ...row3[1], label: "원고(소송인)" };
        row3[2] = { ...row3[2], label: "피고(피신청인)" };
    }

    let row4 = [
        { name: "detailReceiptDate", type: "date", label: "접수일자" },
        { name: "detailDecisionDate", type: "date", label: "결정일자" },
        { name: "detailCloseDate", type: "date", label: "종결/취하일자" },
    ];

    if (type === 'auction') {
        row4[1] = { ...row4[1], label: "낙찰일자" };
        row4[2] = { ...row4[2], label: "취하일자" };
        row4.splice(2, 0, { name: "detailPaymentDate", type: "date", label: "대금납부일자" } as any);
    } else if (type === 'public-sale') {
        row4[2] = { ...row4[2], label: "취하일자" };
    }

    const row5 = [
        { name: "detailStatus", type: "select", label: "사건상태", options: [] },
        { name: "detailRelCaseNo", type: "text", label: "관련사건번호" },
        { name: "detailResult", type: "text", label: "종국결과" },
    ];

    const row6 = [
        { name: "detailLoanAmount", type: "number", label: "고객별대출금" },
        { name: "detailAccountNo", type: "text", label: "계좌번호" },
        { name: "detailAdvanceAmount", type: "number", label: "고객별가지급금" },
    ];

    const rowLast = [
        { name: "detailDept", type: "search", label: "법무관리부점", onButtonClick: handleDeptSearch },
        { name: "isParentCase", type: "checkbox", label: "모사건" },
        { name: "isBankSued", type: "checkbox", label: "당행피소" },
    ];

    const layout: FilterLayout = [
        { type: "grid", columns: 3, filters: row1_2 as any }, 
        { type: "grid", columns: 3, filters: row3 as any },
        { type: "grid", columns: type === 'auction' ? 4 : 3, filters: row4 as any }, 
        { type: "grid", columns: 3, filters: row5 as any },
        { type: "grid", columns: 3, filters: row6 as any },
        { type: "grid", columns: 3, filters: rowLast as any },
    ];

    return layout;
  };

  const currentDetailLayout = createDetailLayout(activeDetailTab);

  const detailHistoryLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "caseContent", type: "text", label: "사건내용", readonly: true, width: "long" },
        { name: "summary", type: "text", label: "적요", width: "long" }
      ]
    }
  ];

  const legalListRowCount = currentState?.tables?.['legalListTable']?.length || 0;

  const handleActionClick = (action: ActionType) => {
    console.log(`Action: ${action}`);
    if (action === 'search') {
        updateTableData(tabId, 'legalListTable', mockListData);
    }
  };

  const handleRowClick = (row: LegalManagementListItem) => {
    updateFilters(tabId, {
      detailCustomerNo: { code: row.customerNo, name: row.customerNo },
      detailCustomerName: row.customerName,
      detailRealNameNo: row.realNameNo,
      detailCourt: row.competentCourt,
      detailCaseNo: { code: row.caseNumber, name: row.caseNumber },
      detailCaseName: row.caseName,
      detailClaimAmount: row.claimAmount,
      detailStatus: row.status,
    });
  };

  const handleDetailSearch = () => {
    setShowDetailHistory(true);
    updateTableData(tabId, 'historyTable', mockHistoryData);
    updateFilters(tabId, { caseContent: "이곳에 선택된 사건 내용이 표시됩니다." });
  };

  const pageActions = [
    { id: 'file-upload', label: "파일첨부" },
    { id: 'court-search', label: "법원사건조회" },
    { id: 'register', label: "등록" },
    { id: 'edit', label: "수정" },
    { id: 'delete', label: "삭제" },
    { id: 'search', label: "조회", onClick: () => handleActionClick('search') },
    { id: 'reset', label: "초기화" },
  ] as { id: ActionType; label: string; onClick?: () => void }[];

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">법무관리</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>법적조회</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>법무관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions actions={pageActions} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">법무조회</h3>
        <FilterContainer
            filterLayout={legalInquiryFilterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
        />
      </div>

      <DataTable 
          title="법무진행 목록"
          columns={listColumns}
          data={currentState.tables?.['legalListTable'] || []}
          amountColumns={['claimAmount']}
          onRowClick={handleRowClick}
      />

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">법무진행 상세</h3>
        
        <Tabs defaultValue="payment-order" className="w-full" onValueChange={setActiveDetailTab}>
            <TabsList>
                {["지급명령", "보전조치(가압류)", "압류 및 전부추심", "소송", "경매", "공매"].map((tabName, idx) => {
                    const value = ["payment-order", "preservation", "seizure", "lawsuit", "auction", "public-sale"][idx];
                    return (
                        <TabsTrigger key={value} value={value}>
                            {tabName}
                        </TabsTrigger>
                    )
                })}
            </TabsList>
            
            {["payment-order", "preservation", "seizure", "lawsuit", "auction", "public-sale"].map((value) => (
                <TabsContent key={value} value={value} className="flex flex-col gap-4 mt-0">
                    <FilterContainer 
                        filterLayout={currentDetailLayout}
                        values={currentState.filters}
                        onChange={handleFilterChange}
                    />
                    
                    <div className="flex justify-end pt-4">
                        <Button 
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={handleDetailSearch}
                        >
                            상세조회
                        </Button>
                    </div>

                    {showDetailHistory && (
                        <div className="flex flex-col gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                            <div className="overflow-hidden">
                                <DataTable 
                                    columns={historyColumns}
                                    data={currentState.tables?.['historyTable'] || []}
                                />
                            </div>

                            <FilterContainer
                                filterLayout={detailHistoryLayout}
                                values={currentState.filters}
                                onChange={handleFilterChange}
                            />
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
      </div>
    </div>
  );
}
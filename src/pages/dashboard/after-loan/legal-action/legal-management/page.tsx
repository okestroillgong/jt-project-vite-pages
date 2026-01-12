

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
  createColumn("seq", "?쒕쾲"),
  createColumn("legalType", "踰뺣Т援щ텇"),
  createColumn("customerNo", "怨좉컼踰덊샇"),
  createColumn("customerName", "怨좉컼紐?),
  createColumn("realNameNo", "?ㅻ챸踰덊샇"),
  createColumn("competentCourt", "愿?좊쾿??),
  createColumn("caseNumber", "?ш굔踰덊샇"),
  createColumn("caseName", "?ш굔紐?),
  createColumn("claimAmount", "泥?뎄湲덉븸"),
  createColumn("status", "踰뺣Т吏꾪뻾"),
];

const historyColumns: ColumnDef<CaseHistoryItem>[] = [
  { accessorKey: "date", header: "?쇱옄" },
  { accessorKey: "content", header: "?댁슜" },
  { accessorKey: "result", header: "寃곌낵" },
];

const mockListData: LegalManagementListItem[] = Array.from({ length: 5 }, (_, i) => ({
  seq: i + 1,
  legalType: "吏湲됰챸??,
  customerNo: `CUST${1000 + i}`,
  customerName: `怨좉컼${i + 1}`,
  realNameNo: `800101-123456${i}`,
  competentCourt: "?쒖슱以묒븰吏諛⑸쾿??,
  caseNumber: `2024李?23${i}`,
  caseName: "??ш툑 諛섑솚 泥?뎄",
  claimAmount: 15000000,
  status: "?묒닔",
}));

const mockHistoryData: CaseHistoryItem[] = [
  { date: "2024-01-15", content: "吏湲됰챸???좎껌???묒닔", result: "?묒닔?꾨즺" },
  { date: "2024-01-20", content: "蹂댁젙紐낅졊 ?깅낯 ?〓떖", result: "?꾨떖" },
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
          label: "怨좉컼寃??,
          onButtonClick: (val, e) => {
            e?.preventDefault();
            window.open(
              `${import.meta.env.BASE_URL}popup/customer-search?openerTabId=${tabId}`,
              "CustomerSearch",
              "width=1600,height=800"
            );
          }
        },
        { 
          name: "caseNumber", 
          type: "search", 
          label: "?ш굔踰덊샇",
          onButtonClick: (val, e) => {
             e?.preventDefault();
             const caseNumber = val?.code || '';
             window.open(
               `${import.meta.env.BASE_URL}popup/case-inquiry?caseNumber=${caseNumber}&openerTabId=${tabId}`,
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
        window.open(`${import.meta.env.BASE_URL}popup/customer-search?openerTabId=${tabId}`, "CustomerSearch", "width=1600,height=800");
    };
    const handleCaseSearch = (val: any, e: any) => {
        e?.preventDefault();
        const caseNumber = val?.code || '';
        window.open(`${import.meta.env.BASE_URL}popup/case-inquiry?caseNumber=${caseNumber}&openerTabId=${tabId}`, "CaseInquiry", "width=1600,height=800");
    };
    const handleDeptSearch = (val: any, e: any) => {
        e?.preventDefault();
        window.open(`${import.meta.env.BASE_URL}popup/branch-management?openerTabId=${tabId}`, "BranchManagement", "width=1600,height=800");
    };

    let row1_2 = [
        { name: "detailCustomerNo", type: "search", label: "怨좉컼踰덊샇", onButtonClick: handleCustSearch },
        { name: "detailCustomerName", type: "text", label: "怨좉컼紐? },
        { name: "detailRealNameNo", type: "text", label: "?ㅻ챸踰덊샇" },
        { name: "detailCourt", type: "select", label: "愿?좊쾿??, options: [] },
        { name: "detailCaseNo", type: "search", label: "?ш굔踰덊샇", onButtonClick: handleCaseSearch },
        { name: "detailCaseName", type: "text", label: "?ш굔紐? },
    ];

    if (type === 'public-sale') {
        const courtIndex = row1_2.findIndex(f => f.name === "detailCourt");
        if (courtIndex !== -1) row1_2[courtIndex] = { ...row1_2[courtIndex], label: "怨듬ℓ二쇨??? };
    }

    let row3 = [
        { name: "detailClaimAmount", type: "number", label: "泥?뎄湲덉븸" },
        { name: "detailCreditor", type: "text", label: "梨꾧텒?? },
        { name: "detailDebtor", type: "text", label: "梨꾨Т?? },
    ];

    if (type === 'lawsuit') {
        row3[0] = { ...row3[0], label: "?먭퀬?뚭?" };
        row3[1] = { ...row3[1], label: "?먭퀬(?뚯넚??" };
        row3[2] = { ...row3[2], label: "?쇨퀬(?쇱떊泥?씤)" };
    }

    let row4 = [
        { name: "detailReceiptDate", type: "date", label: "?묒닔?쇱옄" },
        { name: "detailDecisionDate", type: "date", label: "寃곗젙?쇱옄" },
        { name: "detailCloseDate", type: "date", label: "醫낃껐/痍⑦븯?쇱옄" },
    ];

    if (type === 'auction') {
        row4[1] = { ...row4[1], label: "?숈같?쇱옄" };
        row4[2] = { ...row4[2], label: "痍⑦븯?쇱옄" };
        row4.splice(2, 0, { name: "detailPaymentDate", type: "date", label: "?湲덈궔遺?쇱옄" } as any);
    } else if (type === 'public-sale') {
        row4[2] = { ...row4[2], label: "痍⑦븯?쇱옄" };
    }

    const row5 = [
        { name: "detailStatus", type: "select", label: "?ш굔?곹깭", options: [] },
        { name: "detailRelCaseNo", type: "text", label: "愿?⑥궗嫄대쾲?? },
        { name: "detailResult", type: "text", label: "醫낃뎅寃곌낵" },
    ];

    const row6 = [
        { name: "detailLoanAmount", type: "number", label: "怨좉컼蹂꾨?異쒓툑" },
        { name: "detailAccountNo", type: "text", label: "怨꾩쥖踰덊샇" },
        { name: "detailAdvanceAmount", type: "number", label: "怨좉컼蹂꾧?吏湲됯툑" },
    ];

    const rowLast = [
        { name: "detailDept", type: "search", label: "踰뺣Т愿由щ???, onButtonClick: handleDeptSearch },
        { name: "isParentCase", type: "checkbox", label: "紐⑥궗嫄? },
        { name: "isBankSued", type: "checkbox", label: "?뱁뻾?쇱냼" },
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
        { name: "caseContent", type: "text", label: "?ш굔?댁슜", readonly: true, width: "long" },
        { name: "summary", type: "text", label: "?곸슂", width: "long" }
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
    updateFilters(tabId, { caseContent: "?닿납???좏깮???ш굔 ?댁슜???쒖떆?⑸땲??" });
  };

  const pageActions = [
    { id: 'file-upload', label: "?뚯씪泥⑤?" },
    { id: 'court-search', label: "踰뺤썝?ш굔議고쉶" },
    { id: 'register', label: "?깅줉" },
    { id: 'edit', label: "?섏젙" },
    { id: 'delete', label: "??젣" },
    { id: 'search', label: "議고쉶", onClick: () => handleActionClick('search') },
    { id: 'reset', label: "珥덇린?? },
  ] as { id: ActionType; label: string; onClick?: () => void }[];

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">踰뺣Т愿由?/h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>踰뺤쟻議고쉶</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>踰뺣Т愿由?/BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions actions={pageActions} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">踰뺣Т議고쉶</h3>
        <FilterContainer
            filterLayout={legalInquiryFilterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
        />
      </div>

      <DataTable 
          title="踰뺣Т吏꾪뻾 紐⑸줉"
          columns={listColumns}
          data={currentState.tables?.['legalListTable'] || []}
          amountColumns={['claimAmount']}
          onRowClick={handleRowClick}
      />

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">踰뺣Т吏꾪뻾 ?곸꽭</h3>
        
        <Tabs defaultValue="payment-order" className="w-full" onValueChange={setActiveDetailTab}>
            <TabsList>
                {["吏湲됰챸??, "蹂댁쟾議곗튂(媛?뺣쪟)", "?뺣쪟 諛??꾨?異붿떖", "?뚯넚", "寃쎈ℓ", "怨듬ℓ"].map((tabName, idx) => {
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
                            ?곸꽭議고쉶
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

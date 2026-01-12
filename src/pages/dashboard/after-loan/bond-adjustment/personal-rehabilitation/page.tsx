

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useState, useEffect, useMemo } from "react";
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
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Data type for the main table
type PersonalRehabilitationData = {
  id: number;
  accountNumber: string;
  applicantName: string;
  accountStatus: string;
  productName: string;
  loanStartDate: string;
  loanEndDate: string;
  loanAmount: number;
  customerNumber: string;
  debtorName: string;
  residentRegistrationNumber: string;
};

// Data type for the Payment History table
type PaymentHistoryData = {
  installmentNumber: number;
  paymentAmount: number;
  actualPaymentAmount: number;
  startDate: string;
};

// Mock data for the main table
const mockTableData: PersonalRehabilitationData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  accountNumber: `ACC100${i}`,
  applicantName: `?좎껌??{i}`,
  accountStatus: i % 2 === 0 ? "?뺤긽" : "?곗껜",
  productName: "?щ쭩濡?,
  loanStartDate: "20230115",
  loanEndDate: "20280114",
  loanAmount: 25000000 * (i + 1),
  customerNumber: `CUST200${i}`,
  debtorName: `梨꾨Т??{i}`,
  residentRegistrationNumber: `900101-123456${i}`,
}));

// Column definitions for the main table
const columns: ColumnDef<PersonalRehabilitationData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "applicantName", header: "?좎껌?몃챸" },
  { accessorKey: "accountStatus", header: "怨꾩쥖?곹깭" },
  { accessorKey: "productName", header: "?곹뭹紐? },
  { accessorKey: "loanStartDate", header: "?異쒖떊洹쒖씪?? },
  { accessorKey: "loanEndDate", header: "?異쒕쭔湲곗씪?? },
  { accessorKey: "loanAmount", header: "?異쒓툑?? },
];

// Column definitions for the Payment History table
const paymentHistoryColumns: ColumnDef<PaymentHistoryData>[] = [
  { accessorKey: "installmentNumber", header: "?⑹엯?뚯감" },
  { accessorKey: "paymentAmount", header: "?⑹엯湲덉븸" },
  { accessorKey: "actualPaymentAmount", header: "?ㅼ젣?⑹엯湲덉븸" },
  { accessorKey: "startDate", header: "湲곗궛?쇱옄" },
];

// DSL for the top filter section
const topFilterLayout: FilterLayout = [
  {
    type: "grid",
    columns: 3,
    filters: [
      { name: "targetCustomerNumber", type: "text", label: "??곸옄怨좉컼踰덊샇", readonly: true },
      { name: "accountNumberSearch", type: "text", label: "怨꾩쥖踰덊샇", readonly: true },
      {
        name: "bondAdjustmentType",
        type: "select",
        label: "梨꾧텒議곗젙援щ텇",
        options: [{ value: "personal-rehabilitation", label: "媛쒖씤?뚯깮" }],
        defaultValue: "personal-rehabilitation",
        readonly: true,
      },
    ],
  },
];

// DSL for the "媛쒖씤?뚯깮 ?먯옣?뺣낫" tab - Moved inside component


export default function PersonalRehabilitationPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeTab, setActiveTab] = useState("ledger-info");

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === 'customer-search') {
        const customer = message.payload;
        if (customer.sourceFilter === 'applicantName') {
          updateFilters(tabId, {
            customerNumber: customer.centralCustomerNumber,
            residentRegistrationNumber: customer.realNameNumber,
            accountNumber: customer.accountNumber,
            applicantName: customer.customerName,
          });
        } else {
          updateFilters(tabId, { customerNumber: customer.centralCustomerNumber });
        }
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  // DSL for the "媛쒖씤?뚯깮 ?먯옣?뺣낫" tab
  const personalRehabilitationFilterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 4,
      filters: [
        // 1??        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "怨좉컼踰덊샇",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            const customerNumber = value || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&openerTabId=${tabId}`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "debtorName", type: "text", label: "梨꾨Т?먮챸", readonly: true },
        { 
          name: "applicantName", 
          type: "long-search", 
          label: "?좎껌?먮챸", 
          readonly: true,
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            const name = value || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerName=${name}&openerTabId=${tabId}&sourceFilter=applicantName`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "residentRegistrationNumber", type: "text", label: "二쇰??깅줉踰덊샇", readonly: true },
        // 2??        { name: "accountNumber", type: "text", label: "怨꾩쥖踰덊샇", readonly: true },
        { name: "virtualAccount", type: "text", label: "媛?곴퀎醫?, readonly: true },
        { name: "loanBalance", type: "number", label: "?異쒖옍??, readonly: true },
        { name: "provisionalPayment", type: "number", label: "媛吏湲됯툑" },
        // 3??        { name: "jurisdictionCourt", type: "select", label: "愿?좊쾿??, options: [] },
        { name: "caseNumber", type: "text", label: "?ш굔踰덊샇" },
        { name: "progressStatus", type: "select", label: "吏꾪뻾?곹깭", options: [] },
        { name: "serviceDate", type: "date", label: "?〓떖?쇱옄" },
        // 4??        { name: "receiptDate", type: "date", label: "?묒닔?쇱옄" },
        { name: "prohibitionOrderDate", type: "date", label: "湲덉?紐낅졊?쇱옄" },
        { name: "suspensionOrderDate", type: "date", label: "以묒?紐낅졊?쇱옄" },
        { name: "commencementDate", type: "date", label: "媛쒖떆?쇱옄" },
        // 5??        { name: "dismissalDate", type: "date", label: "湲곌컖?쇱옄" },
        { name: "withdrawalDate", type: "date", label: "痍⑦븯?쇱옄" },
        { name: "abolitionDate", type: "date", label: "?먯??쇱옄" },
        { name: "authorizationDate", type: "date", label: "?멸??쇱옄" },
        // 6??        { name: "reportedPrincipal", type: "number", label: "?좉퀬?먭툑" },
        { name: "reportedAmount", type: "number", label: "?좉퀬湲덉븸" },
        { name: "confirmedAmount", type: "number", label: "?뺤젙湲덉븸" },
        { name: "reportExclusionDate", type: "date", label: "蹂닿퀬?쒖쇅泥섎━?쇱옄" },
        // 7??        { name: "repaymentSum", type: "number", label: "蹂?쒓툑?⑷퀎" },
        { name: "difference", type: "number", label: "李⑥븸" },
        { name: "bondNumber", type: "text", label: "梨꾧텒踰덊샇" },
        { name: "successionStatus", type: "select", label: "?밴퀎?щ?", options: [] },
        // 8??        { name: "totalPaymentInstallments", type: "number", label: "珥앸궔?낇쉶李? },
        { name: "repaymentStartDate", type: "date", label: "蹂?쒖떆?묒씪", popoverSide: 'top' },
        { name: "repaymentEndDate", type: "date", label: "蹂?쒖쥌猷뚯씪??, popoverSide: 'top' },
        { name: "accountReportStatus", type: "select", label: "怨꾩쥖?좉퀬?쒖쑀臾?, options: [] },
        // 9??        { name: "selfEmployedStatus", type: "select", label: "?먯쁺?낆옄?좊Т", options: [] },
        { name: "workplace", type: "text", label: "洹쇰Т泥? },
        { name: "monthlyAverageIncome", type: "number", label: "?뷀룊洹좎냼?? },
        { name: "judicialDepartment", type: "text", label: "?ы뙋遺", readonly: true },
        // 10??        { name: "paymentRate", type: "number", label: "?⑹엯?? },
        { name: "cumulativeRepayment", type: "number", label: "蹂?쒕늻怨? },
        { name: "repaymentRatio", type: "number", label: "蹂?쒕퉬?? },
        { name: "priorityRepaymentInstallment", type: "number", label: "?곗꽑蹂?쒗쉶李? },
        // 11??        { name: "specialNotes", type: "text", label: "?뱀씠?ы빆", colSpan: 3 },
        { name: "objection", type: "checkbox", label: "?댁쓽?좎껌" },
        // 12??        { 
          name: "unprocessedAmount", 
          type: "input-button", 
          label: "誘몄쿂由ш툑??, 
          buttonText: "泥섎━",
          onButtonClick: (value: any) => {
            const popupWidth = 1000;
            const popupHeight = 800;
            const left = (window.screen.width / 2) - (popupWidth / 2);
            const top = (window.screen.height / 2) - (popupHeight / 2);
            
            const amountParam = value ? `?unprocessedAmount=${value}` : '';

            window.open(
              `${import.meta.env.BASE_URL}popup/unprocessed-amount-processing${amountParam}`,
              'UnprocessedAmountProcessing',
              `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
            );
          }
        },
        { name: "finalProcessingDate", type: "date", label: "理쒖쥌泥섎━?쇱옄", readonly: true },
        { name: "confirmationStatus", type: "select", label: "?뺤젙?щ?", options: [] },
      ],
    },
  ], [tabId]);

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleRowClick = (row: PersonalRehabilitationData) => {
    const mockLedgerData = {
      customerNumber: row.customerNumber,
      debtorName: row.debtorName,
      applicantName: row.applicantName,
      residentRegistrationNumber: row.residentRegistrationNumber,
      accountNumber: row.accountNumber,
      virtualAccount: `V-ACC-${row.accountNumber.slice(-4)}`,
      loanBalance: row.loanAmount,
      provisionalPayment: 120000,
      jurisdictionCourt: "?쒖슱?뚯깮踰뺤썝",
      caseNumber: `2023媛쒗쉶${Math.floor(Math.random() * 90000) + 10000}`,
      progressStatus: "?멸?",
      serviceDate: new Date().toISOString(),
      receiptDate: new Date("2023-01-10").toISOString(),
      prohibitionOrderDate: new Date("2023-01-15").toISOString(),
      suspensionOrderDate: new Date("2023-01-20").toISOString(),
      commencementDate: new Date("2023-02-01").toISOString(),
      dismissalDate: null,
      withdrawalDate: null,
      abolitionDate: null,
      authorizationDate: new Date("2023-08-01").toISOString(),
      reportedPrincipal: row.loanAmount,
      reportedAmount: row.loanAmount + 500000,
      confirmedAmount: row.loanAmount + 450000,
      reportExclusionDate: null,
      repaymentSum: 15000000,
      difference: (row.loanAmount + 450000) - 15000000,
      bondNumber: `BOND-${row.accountNumber.slice(-6)}`,
      successionStatus: "?꾨땲??,
      totalPaymentInstallments: 60,
      repaymentStartDate: new Date("2023-09-01").toISOString(),
      repaymentEndDate: new Date("2028-08-31").toISOString(),
      accountReportStatus: "??,
      selfEmployedStatus: "?꾨땲??,
      workplace: "(二?媛?섎떎??,
      monthlyAverageIncome: 3500000,
      judicialDepartment: "???뚯궛遺",
      paymentRate: 80,
      cumulativeRepayment: 12000000,
      repaymentRatio: 40,
      priorityRepaymentInstallment: 3,
      specialNotes: "?밸퀎???ы빆 ?놁쓬.",
      objection: true,
      unprocessedAmount: 150000,
      finalProcessingDate: new Date().toISOString(),
      confirmationStatus: "??,
    };
    updateFilters(tabId, mockLedgerData);

    const mockPaymentHistory: PaymentHistoryData[] = Array.from({ length: 12 }, (_, i) => ({
      installmentNumber: i + 1,
      paymentAmount: 550000,
      actualPaymentAmount: 550000,
      startDate: `2023-${String(i + 1).padStart(2, '0')}-25`,
    }));
    updateTableData(tabId, 'paymentHistoryTable', mockPaymentHistory);
  };

  const handleSearch = () => {
    console.log("Search button clicked. Fetching data...");
    updateTableData(tabId, 'personalRehabilitationTable', mockTableData);
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">媛쒖씤?뚯깮愿由?/h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>梨꾧텒議곗젙</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>媛쒖씤?뚯깮愿由?/BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-end">
        <RightActions
          actions={[
            { 
              id: "searchDoc",
              onClick: () => {
                const customerNumberFilterValue = currentState?.filters.customerNumber;
                const customerNumberToPass = typeof customerNumberFilterValue === 'object' && customerNumberFilterValue !== null
                  ? customerNumberFilterValue.code 
                  : customerNumberFilterValue;
                  
                console.log("[PersonalRehabilitation] Opening DocumentSearch popup with customerNumber:", customerNumberToPass);

                if (customerNumberToPass) {
                  window.open(`${import.meta.env.BASE_URL}popup/document-search?customerNumber=${customerNumberToPass}&openerTabId=${tabId}`, 'DocumentSearch', 'width=1600,height=800');
                } else {
                  toast.warning("議고쉶??怨좉컼???놁뒿?덈떎.", {
                    description: "癒쇱? 議고쉶寃곌낵 ?뚯씠釉붿뿉???됱쓣 ?좏깮?섍굅???먯옣?뺣낫??怨좉컼踰덊샇瑜??낅젰??二쇱떗?쒖삤.",
                    duration: 3000,
                  });
                }
              }
            },
            { 
              id: "scan",
              onClick: () => {
                const customerNumber = currentState.filters.customerNumber;
                if (customerNumber) {
                  window.open(`${import.meta.env.BASE_URL}popup/document-scan?customerNumber=${customerNumber}`, 'DocumentScan', 'width=1600,height=800');
                } else {
                  toast.warning("議고쉶??怨좉컼???놁뒿?덈떎.", {
                    description: "癒쇱? 議고쉶寃곌낵 ?뚯씠釉붿뿉???됱쓣 ?좏깮?섏뿬 ?먯옣?뺣낫瑜?議고쉶??二쇱떗?쒖삤.",
                    duration: 3000,
                  });
                }
              }
            },
            { id: "new" },
            { id: "register" },
            { id: "search", onClick: handleSearch },
            { id: "data-reset", onClick: () => clearState(tabId) },
            { id: "reset" },
          ]}
        />
      </div>
      <FilterContainer
        filterLayout={topFilterLayout}
        values={currentState.filters}
        onChange={handleFilterChange}
      />
      <DataTable
        title="議고쉶寃곌낵"
        columns={columns}
        data={currentState.tables?.['personalRehabilitationTable'] || []}
        amountColumns={["loanAmount"]}
        dateColumnConfig={{ loanStartDate: "YYYYMMDD", loanEndDate: "YYYYMMDD" }}
        onRowClick={handleRowClick}
      />
      <Tabs
        defaultValue="ledger-info"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList
          rightContent={
            activeTab === "payment-history" && (
              <div className="flex justify-end gap-2">
                <Button variant="secondary" className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300">?됱텛媛</Button>
                <Button 
                  variant="secondary" 
                  className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300"
                  onClick={() => {
                    const { accountNumber, customerNumber } = currentState?.filters || {};
                    if (accountNumber) {
                      window.open(
                        `${import.meta.env.BASE_URL}popup/modification-history?customerNumber=${customerNumber || ''}&accountNumber=${accountNumber}&openerTabId=${tabId}`,
                        'ModificationHistory',
                        'width=1600,height=800'
                      );
                    } else {
                      toast.warning("議고쉶??怨꾩쥖媛 ?놁뒿?덈떎.", {
                        description: "癒쇱? 議고쉶寃곌낵 ?뚯씠釉붿뿉???됱쓣 ?좏깮?섏뿬 二쇱떗?쒖삤.",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  ?섏젙?댁뿭
                </Button>
                <Button variant="secondary" className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300">?곸꽭議고쉶</Button>
                <Button 
                  variant="secondary" 
                  className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300"
                  onClick={() => {
                    const accountNumber = currentState.filters.accountNumber;
                    if (accountNumber) {
                      window.open(`${import.meta.env.BASE_URL}popup/transaction-history?accountNumber=${accountNumber}`, 'TransactionHistory', 'width=1600,height=800');
                    } else {
                      toast.warning("議고쉶??怨꾩쥖媛 ?놁뒿?덈떎.", {
                        description: "癒쇱? 議고쉶寃곌낵 ?뚯씠釉붿뿉???됱쓣 ?좏깮?섏뿬 二쇱떗?쒖삤.",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  嫄곕옒?댁뿭
                </Button>
              </div>
            )
          }
        >
          <TabsTrigger value="ledger-info">媛쒖씤?뚯깮 ?먯옣?뺣낫</TabsTrigger>
          <TabsTrigger value="payment-history">?⑹엯?댁뿭</TabsTrigger>
        </TabsList>
        <TabsContent value="ledger-info">
          <FilterContainer
            filterLayout={personalRehabilitationFilterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
          />
        </TabsContent>
        <TabsContent value="payment-history" className="space-y-4">
          <DataTable
            columns={paymentHistoryColumns}
            data={currentState.tables?.['paymentHistoryTable'] || []}
            amountColumns={["paymentAmount", "actualPaymentAmount"]}
            dateColumnConfig={{ startDate: "YYYYMMDD" }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

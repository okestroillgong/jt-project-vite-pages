

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
  applicantName: `신청인${i}`,
  accountStatus: i % 2 === 0 ? "정상" : "연체",
  productName: "희망론",
  loanStartDate: "20230115",
  loanEndDate: "20280114",
  loanAmount: 25000000 * (i + 1),
  customerNumber: `CUST200${i}`,
  debtorName: `채무자${i}`,
  residentRegistrationNumber: `900101-123456${i}`,
}));

// Column definitions for the main table
const columns: ColumnDef<PersonalRehabilitationData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "applicantName", header: "신청인명" },
  { accessorKey: "accountStatus", header: "계좌상태" },
  { accessorKey: "productName", header: "상품명" },
  { accessorKey: "loanStartDate", header: "대출신규일자" },
  { accessorKey: "loanEndDate", header: "대출만기일자" },
  { accessorKey: "loanAmount", header: "대출금액" },
];

// Column definitions for the Payment History table
const paymentHistoryColumns: ColumnDef<PaymentHistoryData>[] = [
  { accessorKey: "installmentNumber", header: "납입회차" },
  { accessorKey: "paymentAmount", header: "납입금액" },
  { accessorKey: "actualPaymentAmount", header: "실제납입금액" },
  { accessorKey: "startDate", header: "기산일자" },
];

// DSL for the top filter section
const topFilterLayout: FilterLayout = [
  {
    type: "grid",
    columns: 3,
    filters: [
      { name: "targetCustomerNumber", type: "text", label: "대상자고객번호", readonly: true },
      { name: "accountNumberSearch", type: "text", label: "계좌번호", readonly: true },
      {
        name: "bondAdjustmentType",
        type: "select",
        label: "채권조정구분",
        options: [{ value: "personal-rehabilitation", label: "개인회생" }],
        defaultValue: "personal-rehabilitation",
        readonly: true,
      },
    ],
  },
];

// DSL for the "개인회생 원장정보" tab - Moved inside component


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

  // DSL for the "개인회생 원장정보" tab
  const personalRehabilitationFilterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 4,
      filters: [
        // 1행
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "고객번호",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            const customerNumber = value || '';
            window.open(`/popup/customer-search?customerNumber=${customerNumber}&openerTabId=${tabId}`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "debtorName", type: "text", label: "채무자명", readonly: true },
        { 
          name: "applicantName", 
          type: "long-search", 
          label: "신청자명", 
          readonly: true,
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            const name = value || '';
            window.open(`/popup/customer-search?customerName=${name}&openerTabId=${tabId}&sourceFilter=applicantName`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "residentRegistrationNumber", type: "text", label: "주민등록번호", readonly: true },
        // 2행
        { name: "accountNumber", type: "text", label: "계좌번호", readonly: true },
        { name: "virtualAccount", type: "text", label: "가상계좌", readonly: true },
        { name: "loanBalance", type: "number", label: "대출잔액", readonly: true },
        { name: "provisionalPayment", type: "number", label: "가지급금" },
        // 3행
        { name: "jurisdictionCourt", type: "select", label: "관할법원", options: [] },
        { name: "caseNumber", type: "text", label: "사건번호" },
        { name: "progressStatus", type: "select", label: "진행상태", options: [] },
        { name: "serviceDate", type: "date", label: "송달일자" },
        // 4행
        { name: "receiptDate", type: "date", label: "접수일자" },
        { name: "prohibitionOrderDate", type: "date", label: "금지명령일자" },
        { name: "suspensionOrderDate", type: "date", label: "중지명령일자" },
        { name: "commencementDate", type: "date", label: "개시일자" },
        // 5행
        { name: "dismissalDate", type: "date", label: "기각일자" },
        { name: "withdrawalDate", type: "date", label: "취하일자" },
        { name: "abolitionDate", type: "date", label: "폐지일자" },
        { name: "authorizationDate", type: "date", label: "인가일자" },
        // 6행
        { name: "reportedPrincipal", type: "number", label: "신고원금" },
        { name: "reportedAmount", type: "number", label: "신고금액" },
        { name: "confirmedAmount", type: "number", label: "확정금액" },
        { name: "reportExclusionDate", type: "date", label: "보고제외처리일자" },
        // 7행
        { name: "repaymentSum", type: "number", label: "변제금합계" },
        { name: "difference", type: "number", label: "차액" },
        { name: "bondNumber", type: "text", label: "채권번호" },
        { name: "successionStatus", type: "select", label: "승계여부", options: [] },
        // 8행
        { name: "totalPaymentInstallments", type: "number", label: "총납입회차" },
        { name: "repaymentStartDate", type: "date", label: "변제시작일", popoverSide: 'top' },
        { name: "repaymentEndDate", type: "date", label: "변제종료일자", popoverSide: 'top' },
        { name: "accountReportStatus", type: "select", label: "계좌신고서유무", options: [] },
        // 9행
        { name: "selfEmployedStatus", type: "select", label: "자영업자유무", options: [] },
        { name: "workplace", type: "text", label: "근무처" },
        { name: "monthlyAverageIncome", type: "number", label: "월평균소득" },
        { name: "judicialDepartment", type: "text", label: "재판부", readonly: true },
        // 10행
        { name: "paymentRate", type: "number", label: "납입율" },
        { name: "cumulativeRepayment", type: "number", label: "변제누계" },
        { name: "repaymentRatio", type: "number", label: "변제비율" },
        { name: "priorityRepaymentInstallment", type: "number", label: "우선변제회차" },
        // 11행
        { name: "specialNotes", type: "text", label: "특이사항", colSpan: 3 },
        { name: "objection", type: "checkbox", label: "이의신청" },
        // 12행
        { 
          name: "unprocessedAmount", 
          type: "input-button", 
          label: "미처리금액", 
          buttonText: "처리",
          onButtonClick: (value: any) => {
            const popupWidth = 1000;
            const popupHeight = 800;
            const left = (window.screen.width / 2) - (popupWidth / 2);
            const top = (window.screen.height / 2) - (popupHeight / 2);
            
            const amountParam = value ? `?unprocessedAmount=${value}` : '';

            window.open(
              `/popup/unprocessed-amount-processing${amountParam}`,
              'UnprocessedAmountProcessing',
              `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
            );
          }
        },
        { name: "finalProcessingDate", type: "date", label: "최종처리일자", readonly: true },
        { name: "confirmationStatus", type: "select", label: "확정여부", options: [] },
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
      jurisdictionCourt: "서울회생법원",
      caseNumber: `2023개회${Math.floor(Math.random() * 90000) + 10000}`,
      progressStatus: "인가",
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
      successionStatus: "아니오",
      totalPaymentInstallments: 60,
      repaymentStartDate: new Date("2023-09-01").toISOString(),
      repaymentEndDate: new Date("2028-08-31").toISOString(),
      accountReportStatus: "유",
      selfEmployedStatus: "아니오",
      workplace: "(주)가나다라",
      monthlyAverageIncome: 3500000,
      judicialDepartment: "제3파산부",
      paymentRate: 80,
      cumulativeRepayment: 12000000,
      repaymentRatio: 40,
      priorityRepaymentInstallment: 3,
      specialNotes: "특별한 사항 없음.",
      objection: true,
      unprocessedAmount: 150000,
      finalProcessingDate: new Date().toISOString(),
      confirmationStatus: "예",
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
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">개인회생관리</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>채권조정</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>개인회생관리</BreadcrumbPage>
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
                  window.open(`/popup/document-search?customerNumber=${customerNumberToPass}&openerTabId=${tabId}`, 'DocumentSearch', 'width=1600,height=800');
                } else {
                  toast.warning("조회된 고객이 없습니다.", {
                    description: "먼저 조회결과 테이블에서 행을 선택하거나 원장정보에 고객번호를 입력해 주십시오.",
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
                  window.open(`/popup/document-scan?customerNumber=${customerNumber}`, 'DocumentScan', 'width=1600,height=800');
                } else {
                  toast.warning("조회된 고객이 없습니다.", {
                    description: "먼저 조회결과 테이블에서 행을 선택하여 원장정보를 조회해 주십시오.",
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
        title="조회결과"
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
                <Button variant="secondary" className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300">행추가</Button>
                <Button 
                  variant="secondary" 
                  className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300"
                  onClick={() => {
                    const { accountNumber, customerNumber } = currentState?.filters || {};
                    if (accountNumber) {
                      window.open(
                        `/popup/modification-history?customerNumber=${customerNumber || ''}&accountNumber=${accountNumber}&openerTabId=${tabId}`,
                        'ModificationHistory',
                        'width=1600,height=800'
                      );
                    } else {
                      toast.warning("조회된 계좌가 없습니다.", {
                        description: "먼저 조회결과 테이블에서 행을 선택하여 주십시오.",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  수정내역
                </Button>
                <Button variant="secondary" className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300">상세조회</Button>
                <Button 
                  variant="secondary" 
                  className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300"
                  onClick={() => {
                    const accountNumber = currentState.filters.accountNumber;
                    if (accountNumber) {
                      window.open(`/popup/transaction-history?accountNumber=${accountNumber}`, 'TransactionHistory', 'width=1600,height=800');
                    } else {
                      toast.warning("조회된 계좌가 없습니다.", {
                        description: "먼저 조회결과 테이블에서 행을 선택하여 주십시오.",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  거래내역
                </Button>
              </div>
            )
          }
        >
          <TabsTrigger value="ledger-info">개인회생 원장정보</TabsTrigger>
          <TabsTrigger value="payment-history">납입내역</TabsTrigger>
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
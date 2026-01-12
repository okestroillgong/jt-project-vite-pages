

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect } from "react";
import { usePageStore, logToServer } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// Data type for the table
type CreditRecoveryBankData = {
  tbLimCredtRecvyId: number;
  acntNo: string;
  rqsRrn: string;
  prdctNm: string;
  nwDt: string;
  expDt: string;
  loanAmt: number;
  acntSttsCd: string;
  custNo: string;
  custNm: string;
  fdnCustNo: string;
};

// 예시 데이터
const mockData: CreditRecoveryBankData[] = [
  {
    tbLimCredtRecvyId: 4,
    acntNo: "2345665432",
    rqsRrn: "9802151234568",
    prdctNm: "프리미엄론",
    nwDt: "20240215",
    expDt: "20250215",
    loanAmt: 15000000,
    acntSttsCd: "정상",
    custNo: "00054942704",
    custNm: "김OO",
    fdnCustNo: "0680119111",
  },
];

// Column definitions for the table
const columns: ColumnDef<CreditRecoveryBankData>[] = [
  { accessorKey: "tbLimCredtRecvyId", header: "순번" },
  { accessorKey: "custNo", header: "고객번호" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "acntNo", header: "계좌번호" },
  { accessorKey: "prdctNm", header: "상품명" },
  { accessorKey: "acntSttsCd", header: "계좌상태" },
  { accessorKey: "nwDt", header: "대출신규일자" },
  { accessorKey: "expDt", header: "대출만기일자" },
  { accessorKey: "loanAmt", header: "대출금액" },
];

export default function CreditRecoveryPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, clearState } = usePageStore();

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId || message.source !== 'customer-search') return;
      
      const customer = message.payload;
      const sourceFilter = customer.sourceFilter;

      if (sourceFilter === 'birthDate') {
        const rrn = customer.realNameNumber;
        if (rrn && rrn.length >= 6) {
          const birthPart = rrn.substring(0, 6);
          const centuryIndicator = parseInt(rrn.charAt(7), 10);
          const year = parseInt(birthPart.substring(0, 2), 10);
          
          let fullYear;
          if (centuryIndicator === 1 || centuryIndicator === 2) {
            fullYear = 1900 + year;
          } else if (centuryIndicator === 3 || centuryIndicator === 4) {
            fullYear = 2000 + year;
          } else {
            // Fallback for older numbers or unexpected formats
            fullYear = year < 30 ? 2000 + year : 1900 + year;
          }

          const month = birthPart.substring(2, 4);
          const day = birthPart.substring(4, 6);
          const formattedDate = `${fullYear}-${month}-${day}`;
          updateFilters(tabId, { birthDate: formattedDate });
        }
      } else if (sourceFilter === 'customerNumber') {
        updateFilters(tabId, {
          customerNumber: customer.centralCustomerNumber,
          residentRegistrationNumber: customer.realNameNumber,
          debtorName: customer.customerName,
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const topFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { 
          name: "birthDate", 
          type: "long-search", 
          label: "대상자생년월일", 
          readonly: true, 
          defaultValue: "1990-01-01",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const birthDate = value || '';
            window.open(`/popup/customer-search?birthDate=${birthDate}&openerTabId=${tabId}&sourceFilter=birthDate`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        {
          name: "bondAdjustmentType",
          type: "select",
          label: "채권조정구분",
          options: [{ value: "credit-recovery", label: "신용회복" }],
          defaultValue: "credit-recovery",
          readonly: true,
        },
      ],
    },
  ];

  const creditRecoveryFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "debtorName", type: "text", label: "채무자명" },
        { name: "residentRegistrationNumber", type: "text", label: "주민등록번호" },
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "고객번호",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            window.open(`/popup/customer-search?customerNumber=${customerNumber}&openerTabId=${tabId}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "accountNumber", type: "text", label: "계좌번호" },
        { name: "applicantName", type: "long-search", label: "신청자명" },
        { name: "loanBalance", type: "number", label: "대출잔액" },
        { name: "applicantStatus", type: "select", label: "신청인진행상태", options: [] },
        { name: "accountStatusDetails", type: "text", label: "계좌진행상태내용" },
        { name: "applicationType", type: "text", label: "신청구분" },
        { name: "receiptNoticeDate", type: "date", label: "접수통지일자", popoverSide: "top" },
        { name: "confirmationDate", type: "date", label: "확정일", popoverSide: "top" },
        { name: "invalidationDate", type: "date", label: "실효/완제/합의서포기일", popoverSide: "top"},
        { name: "adjustedInterestRate", type: "number", label: "조정후이율" },
        { name: "adjustedPrincipal", type: "number", label: "조정후원금" },
        { name: "adjustedInterest", type: "number", label: "조정후이자" },
        { name: "adjustedOverdueInterest", type: "number", label: "조정후연체이자" },
        { name: "adjustedCosts", type: "number", label: "조정후비용" },
        { name: "adjustedTotal", type: "number", label: "조정후합계" },
        { name: "principalReduction", type: "select", label: "원금감면여부", options: [] },
        { name: "totalRepaymentPeriod", type: "number", label: "총상환기간" },
        { name: "paymentInstallment", type: "number", label: "납입회차" },
        { name: "overduePeriod", type: "number", label: "연체기간" },
        { name: "reductionMethod", type: "text", label: "감면방식" },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleRowClick = (row: CreditRecoveryBankData) => {
    const mockLedgerData = {
      debtorName: row.custNm,
      residentRegistrationNumber: row.rqsRrn,
      customerNumber: row.custNo,
      accountNumber: row.acntNo,
      applicantName: `신청인_${row.custNm}`,
      loanBalance: row.loanAmt,
      applicantStatus: '접수',
      accountStatusDetails: '정상 처리',
      applicationType: '개인회생',
      receiptNoticeDate: '2024-05-01',
      confirmationDate: '2024-05-15',
      invalidationDate: '2029-05-14',
      adjustedInterestRate: 3.5,
      adjustedPrincipal: row.loanAmt * 0.9,
      adjustedInterest: 500000,
      adjustedOverdueInterest: 0,
      adjustedCosts: 100000,
      adjustedTotal: row.loanAmt * 0.9 + 600000,
      principalReduction: 'Y',
      totalRepaymentPeriod: 60,
      paymentInstallment: 1,
      overduePeriod: 0,
      reductionMethod: '원금 일부 감면',
    };
    updateFilters(tabId, mockLedgerData);
  };

  const handleActionClick = (action: string) => () => {
    console.log(`${action} clicked`);
  };

  const totalBankRows = 3;

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">신용회복관리</h2>
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
              <BreadcrumbPage>신용회복관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "register", onClick: handleActionClick("Register") },
            { id: "save", onClick: handleActionClick("Save") },
            { id: "search", onClick: handleActionClick("Search") },
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
        title="당행"
        columns={columns}
        data={mockData}
        amountColumns={["loanAmt"]}
        dateColumnConfig={{ nwDt: "YYYYMMDD", expDt: "YYYYMMDD" }}
        onRowClick={handleRowClick}
      />

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">신용회복 원장정보</h3>
        <FilterContainer 
          filterLayout={creditRecoveryFilterLayout} 
          values={currentState.filters}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

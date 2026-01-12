

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

// ?덉떆 ?곗씠??const mockData: CreditRecoveryBankData[] = [
  {
    tbLimCredtRecvyId: 4,
    acntNo: "2345665432",
    rqsRrn: "9802151234568",
    prdctNm: "?꾨━誘몄뾼濡?,
    nwDt: "20240215",
    expDt: "20250215",
    loanAmt: 15000000,
    acntSttsCd: "?뺤긽",
    custNo: "00054942704",
    custNm: "源OO",
    fdnCustNo: "0680119111",
  },
];

// Column definitions for the table
const columns: ColumnDef<CreditRecoveryBankData>[] = [
  { accessorKey: "tbLimCredtRecvyId", header: "?쒕쾲" },
  { accessorKey: "custNo", header: "怨좉컼踰덊샇" },
  { accessorKey: "custNm", header: "怨좉컼紐? },
  { accessorKey: "acntNo", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "prdctNm", header: "?곹뭹紐? },
  { accessorKey: "acntSttsCd", header: "怨꾩쥖?곹깭" },
  { accessorKey: "nwDt", header: "?異쒖떊洹쒖씪?? },
  { accessorKey: "expDt", header: "?異쒕쭔湲곗씪?? },
  { accessorKey: "loanAmt", header: "?異쒓툑?? },
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
          label: "??곸옄?앸뀈?붿씪", 
          readonly: true, 
          defaultValue: "1990-01-01",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const birthDate = value || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?birthDate=${birthDate}&openerTabId=${tabId}&sourceFilter=birthDate`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        {
          name: "bondAdjustmentType",
          type: "select",
          label: "梨꾧텒議곗젙援щ텇",
          options: [{ value: "credit-recovery", label: "?좎슜?뚮났" }],
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
        { name: "debtorName", type: "text", label: "梨꾨Т?먮챸" },
        { name: "residentRegistrationNumber", type: "text", label: "二쇰??깅줉踰덊샇" },
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "怨좉컼踰덊샇",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&openerTabId=${tabId}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "accountNumber", type: "text", label: "怨꾩쥖踰덊샇" },
        { name: "applicantName", type: "long-search", label: "?좎껌?먮챸" },
        { name: "loanBalance", type: "number", label: "?異쒖옍?? },
        { name: "applicantStatus", type: "select", label: "?좎껌?몄쭊?됱긽??, options: [] },
        { name: "accountStatusDetails", type: "text", label: "怨꾩쥖吏꾪뻾?곹깭?댁슜" },
        { name: "applicationType", type: "text", label: "?좎껌援щ텇" },
        { name: "receiptNoticeDate", type: "date", label: "?묒닔?듭??쇱옄", popoverSide: "top" },
        { name: "confirmationDate", type: "date", label: "?뺤젙??, popoverSide: "top" },
        { name: "invalidationDate", type: "date", label: "?ㅽ슚/?꾩젣/?⑹쓽?쒗룷湲곗씪", popoverSide: "top"},
        { name: "adjustedInterestRate", type: "number", label: "議곗젙?꾩씠?? },
        { name: "adjustedPrincipal", type: "number", label: "議곗젙?꾩썝湲? },
        { name: "adjustedInterest", type: "number", label: "議곗젙?꾩씠?? },
        { name: "adjustedOverdueInterest", type: "number", label: "議곗젙?꾩뿰泥댁씠?? },
        { name: "adjustedCosts", type: "number", label: "議곗젙?꾨퉬?? },
        { name: "adjustedTotal", type: "number", label: "議곗젙?꾪빀怨? },
        { name: "principalReduction", type: "select", label: "?먭툑媛먮㈃?щ?", options: [] },
        { name: "totalRepaymentPeriod", type: "number", label: "珥앹긽?섍린媛? },
        { name: "paymentInstallment", type: "number", label: "?⑹엯?뚯감" },
        { name: "overduePeriod", type: "number", label: "?곗껜湲곌컙" },
        { name: "reductionMethod", type: "text", label: "媛먮㈃諛⑹떇" },
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
      applicantName: `?좎껌??${row.custNm}`,
      loanBalance: row.loanAmt,
      applicantStatus: '?묒닔',
      accountStatusDetails: '?뺤긽 泥섎━',
      applicationType: '媛쒖씤?뚯깮',
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
      reductionMethod: '?먭툑 ?쇰? 媛먮㈃',
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?좎슜?뚮났愿由?/h2>
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
              <BreadcrumbPage>?좎슜?뚮났愿由?/BreadcrumbPage>
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
        title="?뱁뻾"
        columns={columns}
        data={mockData}
        amountColumns={["loanAmt"]}
        dateColumnConfig={{ nwDt: "YYYYMMDD", expDt: "YYYYMMDD" }}
        onRowClick={handleRowClick}
      />

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">?좎슜?뚮났 ?먯옣?뺣낫</h3>
        <FilterContainer 
          filterLayout={creditRecoveryFilterLayout} 
          values={currentState.filters}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}


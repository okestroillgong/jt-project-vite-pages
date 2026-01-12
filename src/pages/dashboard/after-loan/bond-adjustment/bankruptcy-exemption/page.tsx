

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib${import.meta.env.BASE_URL}popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LeftActions } from "@/components/app/LeftActions";
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type BankruptcyBankData = {
  id: number;
  acntNo: string;
  applicantNm: string;
  acntSttsCd: string;
  prdctNm: string;
  nwDt: string;
  expDt: string;
  loanAmt: number;
};

// ?덉떆 ?곗씠??const mockData: BankruptcyBankData[] = [
  {
    id: 1,
    acntNo: "123-456-7890",
    applicantNm: "?띻만??,
    acntSttsCd: "?뺤긽",
    prdctNm: "?좎슜?異?,
    nwDt: "20230101",
    expDt: "20240101",
    loanAmt: 10000000,
  },
  {
    id: 2,
    acntNo: "987-654-3210",
    applicantNm: "源泥좎닔",
    acntSttsCd: "?곗껜",
    prdctNm: "?대낫?異?,
    nwDt: "20220515",
    expDt: "20250515",
    loanAmt: 50000000,
  },
];

// Column definitions for the table
const columns: ColumnDef<BankruptcyBankData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "acntNo", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "applicantNm", header: "?좎껌?몃챸" },
  { accessorKey: "acntSttsCd", header: "怨꾩쥖?곹깭" },
  { accessorKey: "prdctNm", header: "?곹뭹紐? },
  { accessorKey: "nwDt", header: "?異쒖떊洹쒖씪?? },
  { accessorKey: "expDt", header: "?異쒕쭔湲곗씪?? },
  { accessorKey: "loanAmt", header: "?異쒓툑?? },
];

export default function BankruptcyExemptionPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, clearState } = usePageStore();

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;
      
      if (message.source === 'customer-search') {
        const customer = message.payload;
        const sourceFilter = customer.sourceFilter;

        // Handle customer search results
        if (sourceFilter === 'customerNumber') {
          updateFilters(tabId, { customerNumber: customer.centralCustomerNumber });
        } else if (sourceFilter === 'applicantName') {
          // Assuming applicant search returns similar structure or we map it
          updateFilters(tabId, { applicantName: customer.customerName }); 
        }
      } else if (message.source === 'modification-history') {
        const historyData = message.payload;
        updateFilters(tabId, {
          topAccountNumber: historyData.accountNumber,
          topCustomerNumber: historyData.customerNumber,
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  // Top filter layout (Read-only info + Type select)
  const topFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3, // Adjust columns as needed for layout
      filters: [
        {
          name: "topCustomerNumber",
          type: "text",
          label: "怨좉컼踰덊샇",
          readonly: true,
        },
        {
          name: "topAccountNumber",
          type: "text",
          label: "怨꾩쥖踰덊샇",
          readonly: true,
        },
        {
          name: "bondAdjustmentType",
          type: "select",
          label: "梨꾧텒議곗젙援щ텇",
          options: [{ value: "bankruptcy-exemption", label: "?뚯궛/硫댁콉" }],
          defaultValue: "bankruptcy-exemption",
          readonly: true,
        },
      ],
    },
  ];

  // Detailed filter layout for "Bankruptcy/Exemption Ledger Info"
  const bankruptcyFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { 
          name: "customerNumber", 
          type: "long-search", 
          label: "怨좉컼踰덊샇",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            // openerTabId removed to prevent data feedback (double click disabled in popup context effectively)
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
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
            e?.stopPropagation();
            const name = value || '';
             // openerTabId removed
            window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerName=${name}&sourceFilter=applicantName`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "residentRegistrationNumber", type: "text", label: "二쇰??깅줉踰덊샇", readonly: true },
        
        { name: "accountNumber", type: "text", label: "怨꾩쥖踰덊샇", readonly: true },
        { name: "loanBalance", type: "number", label: "?異쒖옍??, readonly: true },
        { name: "handlingBank", type: "text", label: "痍④툒??? },
        { name: "blank_1", type: "blank" },

        { name: "balanceStandardMonth", type: "date", label: "?붿븸湲곗??꾩썡" },
        { name: "standardBalanceAmount", type: "number", label: "湲곗??붿븸湲덉븸" },
        { name: "blank_2", type: "blank" },
        { name: "blank_3", type: "blank" },

        { 
          name: "competentCourt", 
          type: "select", 
          label: "愿?좊쾿??,
          options: [{ value: "gapyeong", label: "[26] 媛?됯뎔踰뺤썝" }, { value: "seoul", label: "[01] ?쒖슱以묒븰吏踰? }] 
        },
        { 
          name: "progressStatus", 
          type: "select", 
          label: "吏꾪뻾?곹깭",
          options: [{ value: "receipt", label: "?묒닔" }, { value: "ongoing", label: "吏꾪뻾以? }, { value: "completed", label: "?꾨즺" }]
        },
        { name: "caseNumberBottom", type: "text", label: "?ш굔踰덊샇(?섎떒)" },
        { name: "caseNumberScreen", type: "text", label: "?ш굔踰덊샇(?붾㈃)" },

        { name: "receiptDate", type: "date", label: "?묒닔?쇱옄" },
        { name: "sentencingDate", type: "date", label: "?좉퀬?쇱옄" },
        { name: "exemptionDate", type: "date", label: "硫댁콉?? },
        { name: "revocationDate", type: "date", label: "?먯??쇱옄" },

        { name: "notes", type: "text", label: "?뱀씠?ы빆", colSpan: 4 },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleRowClick = (row: BankruptcyBankData) => {
    // Mock population of detail fields on row click
    const mockDetailData = {
      customerNumber: "00012345678",
      debtorName: row.applicantNm,
      applicantName: row.applicantNm,
      residentRegistrationNumber: "800101-1234567",
      accountNumber: row.acntNo,
      loanBalance: row.loanAmt,
      handlingBank: "移쒖븷?異뺤???,
      balanceStandardMonth: "2024-01-01",
      standardBalanceAmount: row.loanAmt,
      competentCourt: "seoul",
      progressStatus: "ongoing",
      caseNumberBottom: "2023媛쒗쉶12345",
      caseNumberScreen: "2023-12345",
      receiptDate: "2023-05-01",
      sentencingDate: "2023-06-01",
      exemptionDate: "2024-05-01",
      revocationDate: "",
      notes: "?뱀씠?ы빆 ?놁쓬",
      // Also update top read-only fields
      topCustomerNumber: "00012345678",
      topAccountNumber: row.acntNo,
    };
    updateFilters(tabId, mockDetailData);
  };

  const handleActionClick = (action: string) => () => {
    console.log(`${action} clicked`);
  };

  // Assuming LeftActions handles 'modification-history' internally if logic is simple, or we pass handler
  const handleLeftActionClick = () => {
    const { customerNumber, accountNumber } = currentState?.filters || {};

    window.open(
      `${import.meta.env.BASE_URL}popup/modification-history?customerNumber=${customerNumber || ''}&accountNumber=${accountNumber || ''}&openerTabId=${tabId}`,
      'ModificationHistory',
      'width=1600,height=800'
    );
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?뚯궛硫댁콉愿由?/h2>
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
              <BreadcrumbPage>?뚯궛硫댁콉愿由?/BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <LeftActions 
          actions={[
            { id: "modification-history", onClick: handleLeftActionClick }
          ]} 
        />
        <RightActions
          actions={[
            { id: "searchDoc" },
            { id: "scan" },
            { id: "new" },
            { id: "register" },
            { id: "search" },
            { id: "data-reset", onClick: () => clearState(tabId) },
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
        <h3 className="font-semibold">?뚯궛硫댁콉 ?먯옣?뺣낫</h3>
        <FilterContainer 
          filterLayout={bankruptcyFilterLayout} 
          values={currentState.filters}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}




import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";
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

// 예시 데이터
const mockData: BankruptcyBankData[] = [
  {
    id: 1,
    acntNo: "123-456-7890",
    applicantNm: "홍길동",
    acntSttsCd: "정상",
    prdctNm: "신용대출",
    nwDt: "20230101",
    expDt: "20240101",
    loanAmt: 10000000,
  },
  {
    id: 2,
    acntNo: "987-654-3210",
    applicantNm: "김철수",
    acntSttsCd: "연체",
    prdctNm: "담보대출",
    nwDt: "20220515",
    expDt: "20250515",
    loanAmt: 50000000,
  },
];

// Column definitions for the table
const columns: ColumnDef<BankruptcyBankData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "acntNo", header: "계좌번호" },
  { accessorKey: "applicantNm", header: "신청인명" },
  { accessorKey: "acntSttsCd", header: "계좌상태" },
  { accessorKey: "prdctNm", header: "상품명" },
  { accessorKey: "nwDt", header: "대출신규일자" },
  { accessorKey: "expDt", header: "대출만기일자" },
  { accessorKey: "loanAmt", header: "대출금액" },
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
          label: "고객번호",
          readonly: true,
        },
        {
          name: "topAccountNumber",
          type: "text",
          label: "계좌번호",
          readonly: true,
        },
        {
          name: "bondAdjustmentType",
          type: "select",
          label: "채권조정구분",
          options: [{ value: "bankruptcy-exemption", label: "파산/면책" }],
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
          label: "고객번호",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNumber = value || '';
            // openerTabId removed to prevent data feedback (double click disabled in popup context effectively)
            window.open(`/popup/customer-search?customerNumber=${customerNumber}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
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
            e?.stopPropagation();
            const name = value || '';
             // openerTabId removed
            window.open(`/popup/customer-search?customerName=${name}&sourceFilter=applicantName`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
        { name: "residentRegistrationNumber", type: "text", label: "주민등록번호", readonly: true },
        
        { name: "accountNumber", type: "text", label: "계좌번호", readonly: true },
        { name: "loanBalance", type: "number", label: "대출잔액", readonly: true },
        { name: "handlingBank", type: "text", label: "취급은행" },
        { name: "blank_1", type: "blank" },

        { name: "balanceStandardMonth", type: "date", label: "잔액기준년월" },
        { name: "standardBalanceAmount", type: "number", label: "기준잔액금액" },
        { name: "blank_2", type: "blank" },
        { name: "blank_3", type: "blank" },

        { 
          name: "competentCourt", 
          type: "select", 
          label: "관할법원",
          options: [{ value: "gapyeong", label: "[26] 가평군법원" }, { value: "seoul", label: "[01] 서울중앙지법" }] 
        },
        { 
          name: "progressStatus", 
          type: "select", 
          label: "진행상태",
          options: [{ value: "receipt", label: "접수" }, { value: "ongoing", label: "진행중" }, { value: "completed", label: "완료" }]
        },
        { name: "caseNumberBottom", type: "text", label: "사건번호(하단)" },
        { name: "caseNumberScreen", type: "text", label: "사건번호(화면)" },

        { name: "receiptDate", type: "date", label: "접수일자" },
        { name: "sentencingDate", type: "date", label: "선고일자" },
        { name: "exemptionDate", type: "date", label: "면책일" },
        { name: "revocationDate", type: "date", label: "폐지일자" },

        { name: "notes", type: "text", label: "특이사항", colSpan: 4 },
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
      handlingBank: "친애저축은행",
      balanceStandardMonth: "2024-01-01",
      standardBalanceAmount: row.loanAmt,
      competentCourt: "seoul",
      progressStatus: "ongoing",
      caseNumberBottom: "2023개회12345",
      caseNumberScreen: "2023-12345",
      receiptDate: "2023-05-01",
      sentencingDate: "2023-06-01",
      exemptionDate: "2024-05-01",
      revocationDate: "",
      notes: "특이사항 없음",
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
      `/popup/modification-history?customerNumber=${customerNumber || ''}&accountNumber=${accountNumber || ''}&openerTabId=${tabId}`,
      'ModificationHistory',
      'width=1600,height=800'
    );
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">파산면책관리</h2>
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
              <BreadcrumbPage>파산면책관리</BreadcrumbPage>
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
        title="당행"
        columns={columns}
        data={mockData}
        amountColumns={["loanAmt"]}
        dateColumnConfig={{ nwDt: "YYYYMMDD", expDt: "YYYYMMDD" }}
        onRowClick={handleRowClick}
      />

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">파산면책 원장정보</h3>
        <FilterContainer 
          filterLayout={bankruptcyFilterLayout} 
          values={currentState.filters}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

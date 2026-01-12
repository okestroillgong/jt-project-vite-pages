

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
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Data type for the main grid
type DebtAdjustmentData = {
  id: number;
  accountNo: string;
  applicantName: string;
  bondAmount: number;
  productName: string;
  loanNewDate: string;
  loanMaturityDate: string;
  loanAmount: number;
};

// Mock Data for Main Grid
const mockMainData: DebtAdjustmentData[] = [
  {
    id: 1,
    accountNo: "123-456-7890",
    applicantName: "홍길동",
    bondAmount: 50000000,
    productName: "신용대출",
    loanNewDate: "20230101",
    loanMaturityDate: "20250101",
    loanAmount: 50000000,
  },
  {
    id: 2,
    accountNo: "987-654-3210",
    applicantName: "이순신",
    bondAmount: 30000000,
    productName: "주택담보대출",
    loanNewDate: "20220515",
    loanMaturityDate: "20320515",
    loanAmount: 150000000,
  },
];

// Column definitions for the main grid
const mainColumns: ColumnDef<DebtAdjustmentData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "accountNo", header: "계좌번호" },
  { accessorKey: "applicantName", header: "신청인명" },
  { accessorKey: "bondAmount", header: "채권금액" },
  { accessorKey: "productName", header: "상품명" },
  { accessorKey: "loanNewDate", header: "대출신규일자" },
  { accessorKey: "loanMaturityDate", header: "대출만기일자" },
  { accessorKey: "loanAmount", header: "대출금액" },
];

// Data type for the payment history grid
type PaymentHistoryData = {
  paymentRound: number;
  paymentAmount: number;
  actualPaymentAmount: number;
  transactionDate: string;
};

// Mock Data for Payment History Grid
const mockPaymentData: PaymentHistoryData[] = [
  {
    paymentRound: 1,
    paymentAmount: 500000,
    actualPaymentAmount: 500000,
    transactionDate: "20240115",
  },
  {
    paymentRound: 2,
    paymentAmount: 500000,
    actualPaymentAmount: 500000,
    transactionDate: "20240215",
  },
];

// Column definitions for the payment history grid
const paymentColumns: ColumnDef<PaymentHistoryData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "paymentRound", header: "납입회차" },
  { accessorKey: "paymentAmount", header: "납입금액" },
  { accessorKey: "actualPaymentAmount", header: "실제납입금액" },
  { accessorKey: "transactionDate", header: "거래일자" },
];

export default function DebtAdjustmentManagementPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, clearState } = usePageStore();
  const [selectedRow, setSelectedRow] = useState<DebtAdjustmentData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryData[]>([]);

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId || message.source !== 'customer-search') return;
      
      const customer = message.payload;
      const sourceFilter = customer.sourceFilter;

      if (sourceFilter === 'customerNumber') {
        updateFilters(tabId, {
          customerNumber: customer.centralCustomerNumber,
          rrn: customer.realNameNumber,
          debtorName: customer.customerName,
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  // Top Filter Layout
  const topFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "targetCustomerNumber",
          type: "text",
          label: "대상자고객번호",
          placeholder: "06800____",
        },
        {
          name: "accountNumber",
          type: "text",
          label: "계좌번호",
        },
        {
          name: "bondAdjustmentType",
          type: "select",
          label: "채권조정구분",
          options: [{ value: "debt-adjustment", label: "채무조정" }, { value: "other", label: "기타" }],
          defaultValue: "debt-adjustment",
        },
      ],
    },
  ];

  // Ledger Info Form Layout (4 Columns)
  const ledgerFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        // Row 1
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
          { name: "debtorName", type: "text", label: "채무자명", readonly: true },
          { 
            name: "applicantName_ledger", 
            type: "long-search", 
            label: "신청자명",
            readonly: true,
             onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
                 e?.preventDefault();
                 console.log("Applicant Search Clicked");
             }
          },
          { name: "rrn", type: "text", label: "주민등록번호", readonly: true },
  
          // Row 2
          { name: "accountNo_ledger", type: "text", label: "계좌번호", readonly: true },
          { name: "loanBalance", type: "number", label: "대출잔액", readonly: true },
          { name: "spacer_2_1", type: "spacer" },
          { name: "spacer_2_2", type: "spacer" },
  
          // Row 3
          { name: "repaymentCapabilityScore", type: "text", label: "상환능력평가점수" },
          { name: "debtAdjustmentType_ledger", type: "text", label: "채무조정유형" },
          { name: "debtAdjExecutionDate", type: "date", label: "채무조정실행일자", popoverSide: "top" },
          { name: "spacer_3_1", type: "spacer" },
  
          // Row 4
          { name: "basicReductionRate", type: "text", label: "기본 감면율" },
          { name: "specialReductionRate", type: "text", label: "특별 감면율" },
          { name: "sincereRepaymentReductionRate", type: "text", label: "성실상환 감면율" },
          { name: "finalReductionRate", type: "text", label: "최종 감면율" },
  
          // Row 5
          { name: "monthlyPaymentDate", type: "text", label: "월 납입일자" },
          { name: "repaymentPeriodMonths", type: "number", label: "상환기간(월)" },
          { name: "initialPaymentAmount", type: "number", label: "최초 불입금액" },
          { name: "monthlyPaymentAmount", type: "number", label: "월 불입금액" },
  
          // Row 6
          { name: "repaymentStartDate", type: "date", label: "변제시작일", popoverSide: "top" },
          { name: "repaymentEndDate", type: "date", label: "변제종료일", popoverSide: "top" },
          { name: "cancellationDate", type: "date", label: "취소일자", popoverSide: "top" },
          { name: "nextPaymentDate", type: "date", label: "차기납입일", popoverSide: "top" },
  
          // Row 7
          { name: "receivingBank", type: "text", label: "수납은행" },
          { name: "receivingAccount", type: "text", label: "수납계좌" },
          { name: "paymentRate", type: "text", label: "납입율" },
          { name: "paymentTotal", type: "number", label: "납입합계" },
  
          // Row 8
          { name: "specialNotes", type: "text", label: "특이사항", colSpan: 3 },
          { name: "spacer_8_1", type: "spacer" },
        ],
      },
    ];
  
    const handleFilterChange = useCallback(
      (name: string, value: any) => {
        updateFilters(tabId, { [name]: value });
      },
      [tabId, updateFilters]
    );
  
    const handleRowClick = (row: DebtAdjustmentData) => {
      setSelectedRow(row);
    };
    
    const handleRowDoubleClick = (row: DebtAdjustmentData) => {
      // Populate form with mock details based on selection
      const mockLedgerData = {
          customerNumber: "0680012345",
          debtorName: row.applicantName, // Using applicant name as debtor name for demo
          applicantName_ledger: row.applicantName,
          rrn: "900101-1234567",
          accountNo_ledger: row.accountNo,
          loanBalance: row.loanAmount, // Using loan amount as balance for demo
          repaymentCapabilityScore: "850",
          debtAdjustmentType_ledger: "개인회생",
          debtAdjExecutionDate: "2024-03-15",
          basicReductionRate: "30%",
          specialReductionRate: "10%",
          sincereRepaymentReductionRate: "5%",
          finalReductionRate: "45%",
          monthlyPaymentDate: "매월 15일",
          repaymentPeriodMonths: 60,
          initialPaymentAmount: 500000,
          monthlyPaymentAmount: 450000,
          repaymentStartDate: "2024-04-15",
          repaymentEndDate: "2029-03-15",
          cancellationDate: "",
          nextPaymentDate: "2024-05-15",
          receivingBank: "신한은행",
          receivingAccount: "110-123-456789",
          paymentRate: "98%",
          paymentTotal: 27000000,
          specialNotes: "성실 상환 중",
      };
      updateFilters(tabId, mockLedgerData);
  
      // Populate payment history grid
      setPaymentHistory([
          {
              paymentRound: 1,
              paymentAmount: 450000,
              actualPaymentAmount: 450000,
              transactionDate: "20240415",
          },
          {
              paymentRound: 2,
              paymentAmount: 450000,
              actualPaymentAmount: 450000,
              transactionDate: "20240515",
          },
      ]);
    };
  
    const handleActionClick = (action: string) => () => {
      console.log(`${action} clicked`);
    };
  
    if (!currentState) return null;
  
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
            <h2 className="text-lg font-semibold">채무조정관리</h2>
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
                <BreadcrumbPage>채무조정관리</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
  
        {/* Top Actions */}
        <div className="flex justify-end">
          <RightActions
            actions={[
              { id: "doc-reception", onClick: handleActionClick("DocReception") },
              { id: "doc-search", onClick: handleActionClick("DocSearch") },
              { id: "doc-scan", onClick: handleActionClick("DocScan") },
              { id: "register", onClick: handleActionClick("Register") },
              { id: "save", onClick: handleActionClick("Save") },
              { id: "search", onClick: handleActionClick("Search") },
              { id: "data-reset", onClick: () => clearState(tabId) },
            ]}          
          />
        </div>
  
        {/* Top Search Filter */}
        <FilterContainer 
          filterLayout={topFilterLayout} 
          values={currentState.filters}
          onChange={handleFilterChange}
        />
  
        {/* Main Grid */}
        <DataTable
          title="당행"
          columns={mainColumns}
          data={mockMainData}
          amountColumns={["bondAmount", "loanAmount"]}
          dateColumnConfig={{ loanNewDate: "YYYYMMDD", loanMaturityDate: "YYYYMMDD" }}
          onRowClick={handleRowClick}
          onRowDoubleClick={handleRowDoubleClick}
        />
  
        {/* Ledger Info Form */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">채무조정 원장정보</h3>
          <FilterContainer 
            filterLayout={ledgerFilterLayout} 
            values={currentState.filters}
            onChange={handleFilterChange}
          />
        </div>
  
        {/* Payment History Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
               <div/>
               <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={handleActionClick("AddRow")}>행추가</Button>
                   <Button variant="outline" size="sm" onClick={handleActionClick("ModificationHistory")}>수정내역</Button>
                   <Button variant="outline" size="sm" onClick={handleActionClick("TransactionHistory")}>거래내역</Button>
               </div>
          </div>
          <DataTable
              title="납입내역"
              columns={paymentColumns}
              data={paymentHistory}
              amountColumns={["paymentAmount", "actualPaymentAmount"]}
              dateColumnConfig={{ transactionDate: "YYYYMMDD" }}
          />
        </div>
      </div>
    );
  }

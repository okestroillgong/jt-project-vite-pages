

import { useState, useCallback, Suspense } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

// Data type for the main table
type TransactionData = {
  id: number;
  txSerial: string;
  txDate: string;
  txTime: string;
  loanTxStatus: string;
  loanTxType: string;
  startDate: string;
  exchangeRate: number;
  txPrincipal: number;
  balanceAfterTx: number;
  interest: number;
  overdueInterest: number;
  lateFee: number;
  prepaymentFee: number;
  suspensePayment: number;
  suspenseReceipt: number;
  col15: string;
  col16: string;
  col17: string;
  col18: string;
  col19: string;
  col20: string;
  col21: string;
  col22: string;
  col23: string;
  col24: string;
  col25: string;
  col26: string;
  col27: string;
  col28: string;
  col29: string;
  col30: string;
  col31: string;
  col32: string;
  col33: string;
  col34: string;
  col35: string;
  col36: string;
  col37: string;
  col38: string;
  col39: string;
};

// Mock data for the table
const mockData: TransactionData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  txSerial: `TXS${2000 + i}`,
  txDate: `2025-12-${String(10 + (i % 20)).padStart(2, "0")}`,
  txTime: `14:3${i % 10}:00`,
  loanTxStatus: "정상",
  loanTxType: "원리금",
  startDate: `2025-11-${String(10 + (i % 20)).padStart(2, "0")}`,
  exchangeRate: 1300 + (i * 2),
  txPrincipal: 150000 * (i + 1),
  balanceAfterTx: 10000000 - (150000 * (i + 1)),
  interest: 5000,
  overdueInterest: 0,
  lateFee: 0,
  prepaymentFee: 0,
  suspensePayment: 0,
  suspenseReceipt: 0,
  col15: "-",
  col16: "-",
  col17: "-",
  col18: "-",
  col19: "-",
  col20: "-",
  col21: "-",
  col22: "-",
  col23: "-",
  col24: "-",
  col25: "-",
  col26: "-",
  col27: "-",
  col28: "-",
  col29: "-",
  col30: "-",
  col31: "-",
  col32: "-",
  col33: "-",
  col34: "-",
  col35: "-",
  col36: "-",
  col37: "-",
  col38: "-",
  col39: "-",
}));

// Column definitions for the table
const columns: ColumnDef<TransactionData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "txSerial", header: "거래일련번호" },
  { accessorKey: "txDate", header: "거래일자" },
  { accessorKey: "txTime", header: "거래시각" },
  { accessorKey: "loanTxStatus", header: "여신거래상태" },
  { accessorKey: "loanTxType", header: "여신거래구분" },
  { accessorKey: "startDate", header: "기산일자" },
  { accessorKey: "exchangeRate", header: "환율" },
  { accessorKey: "txPrincipal", header: "거래원금" },
  { accessorKey: "balanceAfterTx", header: "거래후잔액" },
  { accessorKey: "interest", header: "이자" },
  { accessorKey: "overdueInterest", header: "연체이자" },
  { accessorKey: "lateFee", header: "연체료" },
  { accessorKey: "prepaymentFee", header: "중도상환수수료" },
  { accessorKey: "suspensePayment", header: "가지급금" },
  { accessorKey: "suspenseReceipt", header: "가수금" },
  { accessorKey: "col15", header: "비고1" },
  { accessorKey: "col16", header: "비고2" },
  { accessorKey: "col17", header: "비고3" },
  { accessorKey: "col18", header: "비고4" },
  { accessorKey: "col19", header: "비고5" },
  { accessorKey: "col20", header: "비고6" },
  { accessorKey: "col21", header: "비고7" },
  { accessorKey: "col22", header: "비고8" },
  { accessorKey: "col23", header: "비고9" },
  { accessorKey: "col24", header: "비고10" },
  { accessorKey: "col25", header: "비고11" },
  { accessorKey: "col26", header: "비고12" },
  { accessorKey: "col27", header: "비고13" },
  { accessorKey: "col28", header: "비고14" },
  { accessorKey: "col29", header: "비고15" },
  { accessorKey: "col30", header: "비고16" },
  { accessorKey: "col31", header: "비고17" },
  { accessorKey: "col32", header: "비고18" },
  { accessorKey: "col33", header: "비고19" },
  { accessorKey: "col34", header: "비고20" },
  { accessorKey: "col35", header: "비고21" },
  { accessorKey: "col36", header: "비고22" },
  { accessorKey: "col37", header: "비고23" },
  { accessorKey: "col38", header: "비고24" },
  { accessorKey: "col39", header: "비고25" },
];

function TransactionHistoryPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    status: "all",
    inquiryPeriod: { start: "2025-12-17", end: "2025-12-17" }
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);
  
  const handleReset = () => {
    setFilters({
        status: "all",
        inquiryPeriod: { start: "2025-12-17", end: "2025-12-17" }
    });
  }

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "reset", text: "재입력", onClick: handleReset },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  // 1. Top Filters
  const topFilterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "accountNumber", type: "text", label: "계좌번호" },
        { 
          name: "status", 
          type: "select", 
          label: "상태", // Representing the radio buttons as select
          options: [
            { value: "normal", label: "정상" },
            { value: "paid", label: "완제(해지)" },
            { value: "all", label: "전체" },
          ],
        },
        { name: "inquiryPeriod", type: "date-range", label: "조회기간", popoverSide: "bottom" },
      ],
    },
  ];

  // 2. Ledger Info
  const ledgerInfoLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { name: "customerInfo", type: "search", label: "고객번호", readonly: true, colSpan: 2 },
        { name: "productInfo", type: "search", label: "상품코드", readonly: true, colSpan: 2 },
        
        { name: "loanAmount", type: "text", label: "대출금액", readonly: true },
        { name: "loanDate", type: "date", label: "대출일자", readonly: true },
        { name: "offsetDate", type: "date", label: "상계일자", readonly: true },
        { name: "accountStatus", type: "text", label: "계좌상태", readonly: true },
        
        { name: "loanBalance", type: "text", label: "대출잔액", readonly: true },
        { name: "maturityDate", type: "date", label: "만기일자", readonly: true },
        { name: "gracePeriod", type: "text", label: "거치기간", readonly: true },
        { name: "lossExpectedDate", type: "date", label: "상실예정일", readonly: true },
        
        { name: "normalInterestRate", type: "text", label: "정상이율", readonly: true },
        { name: "overdueInterestRate", type: "text", label: "연체이율", readonly: true },
        { name: "installmentAmount", type: "text", label: "매회분할금", readonly: true },
        { name: "finalPaymentDate", type: "date", label: "최종이수일", readonly: true },
        
        { name: "suspenseReceipts", type: "text", label: "가수금", readonly: true },
        { name: "suspensePayments", type: "text", label: "가지급금", readonly: true },
        { name: "savingsBalance", type: "text", label: "보통예금잔액", readonly: true },
        { name: "finalInstallment", type: "text", label: "최종분할금", readonly: true },
        
        { name: "paymentDueDate", type: "text", label: "납입응당일", readonly: true }, // Placed at the end
      ],
    },
  ];

  // 3. Summary Layout
  const summaryLayout: FilterLayout = [
    {
        type: "grid",
        columns: 4,
        filters: [
            { name: "totalTxAmount", type: "text", label: "거래금액합계", readonly: true },
            { name: "totalPrincipal", type: "text", label: "거래원금합계", readonly: true },
            { name: "totalNormalInterest", type: "text", label: "정상이자합계", readonly: true },
            { name: "totalOverdueInterest", type: "text", label: "연체이자합계", readonly: true },
            
            { name: "totalLateFees", type: "text", label: "연체료합계", readonly: true },
            { name: "totalPrepaymentFees", type: "text", label: "조기상환수수료합계", readonly: true },
            { name: "totalInterestRefund", type: "text", label: "환출이자합계", readonly: true },
            { name: "empty2", type: "spacer" }, 
        ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">거래내역</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Top Filter */}
        <div>
            <FilterContainer
            filterLayout={topFilterLayout}
            values={filters}
            onChange={handleFilterChange}
            />
            <div className="flex justify-end mt-2">
                <Button variant="secondary" className="h-[35px] w-24 cursor-pointer rounded-2xl">출력</Button>
            </div>
        </div>

        {/* Ledger Info */}
        <div>
            <h3 className="font-semibold mb-2">원장정보조회</h3>
            <FilterContainer
            filterLayout={ledgerInfoLayout}
            values={filters}
            onChange={() => {}}
            />
        </div>

        {/* Main Table */}
        <div>
            <DataTable 
                title="조회결과" 
                columns={columns} 
                data={mockData} 
                minWidth="3000px" // Ensure horizontal scroll
                amountColumns={['exchangeRate', 'txPrincipal', 'balanceAfterTx', 'interest']}
                dateColumnConfig={{ txDate: 'YYYYMMDD', startDate: 'YYYYMMDD' }}
            />
        </div>

        {/* Summary */}
        <div>
            <FilterContainer
            filterLayout={summaryLayout}
            values={filters}
            onChange={() => {}}
            />
        </div>
      </div>
    </div>
  );
}

export default function TransactionHistoryPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionHistoryPopupContent />
    </Suspense>
  );
}
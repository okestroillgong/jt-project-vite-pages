

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
    applicantName: "?띻만??,
    bondAmount: 50000000,
    productName: "?좎슜?異?,
    loanNewDate: "20230101",
    loanMaturityDate: "20250101",
    loanAmount: 50000000,
  },
  {
    id: 2,
    accountNo: "987-654-3210",
    applicantName: "?댁닚??,
    bondAmount: 30000000,
    productName: "二쇳깮?대낫?異?,
    loanNewDate: "20220515",
    loanMaturityDate: "20320515",
    loanAmount: 150000000,
  },
];

// Column definitions for the main grid
const mainColumns: ColumnDef<DebtAdjustmentData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "accountNo", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "applicantName", header: "?좎껌?몃챸" },
  { accessorKey: "bondAmount", header: "梨꾧텒湲덉븸" },
  { accessorKey: "productName", header: "?곹뭹紐? },
  { accessorKey: "loanNewDate", header: "?異쒖떊洹쒖씪?? },
  { accessorKey: "loanMaturityDate", header: "?異쒕쭔湲곗씪?? },
  { accessorKey: "loanAmount", header: "?異쒓툑?? },
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
  { accessorKey: "paymentRound", header: "?⑹엯?뚯감" },
  { accessorKey: "paymentAmount", header: "?⑹엯湲덉븸" },
  { accessorKey: "actualPaymentAmount", header: "?ㅼ젣?⑹엯湲덉븸" },
  { accessorKey: "transactionDate", header: "嫄곕옒?쇱옄" },
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
          label: "??곸옄怨좉컼踰덊샇",
          placeholder: "06800____",
        },
        {
          name: "accountNumber",
          type: "text",
          label: "怨꾩쥖踰덊샇",
        },
        {
          name: "bondAdjustmentType",
          type: "select",
          label: "梨꾧텒議곗젙援щ텇",
          options: [{ value: "debt-adjustment", label: "梨꾨Т議곗젙" }, { value: "other", label: "湲고?" }],
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
          label: "怨좉컼踰덊샇",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
             e?.preventDefault();
             e?.stopPropagation();
             const customerNumber = value || '';
             window.open(`${import.meta.env.BASE_URL}popup/customer-search?customerNumber=${customerNumber}&openerTabId=${tabId}&sourceFilter=customerNumber`, 'CustomerSearch', 'width=1600,height=800');
          }
        },
          { name: "debtorName", type: "text", label: "梨꾨Т?먮챸", readonly: true },
          { 
            name: "applicantName_ledger", 
            type: "long-search", 
            label: "?좎껌?먮챸",
            readonly: true,
             onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
                 e?.preventDefault();
                 console.log("Applicant Search Clicked");
             }
          },
          { name: "rrn", type: "text", label: "二쇰??깅줉踰덊샇", readonly: true },
  
          // Row 2
          { name: "accountNo_ledger", type: "text", label: "怨꾩쥖踰덊샇", readonly: true },
          { name: "loanBalance", type: "number", label: "?異쒖옍??, readonly: true },
          { name: "spacer_2_1", type: "spacer" },
          { name: "spacer_2_2", type: "spacer" },
  
          // Row 3
          { name: "repaymentCapabilityScore", type: "text", label: "?곹솚?λ젰?됯??먯닔" },
          { name: "debtAdjustmentType_ledger", type: "text", label: "梨꾨Т議곗젙?좏삎" },
          { name: "debtAdjExecutionDate", type: "date", label: "梨꾨Т議곗젙?ㅽ뻾?쇱옄", popoverSide: "top" },
          { name: "spacer_3_1", type: "spacer" },
  
          // Row 4
          { name: "basicReductionRate", type: "text", label: "湲곕낯 媛먮㈃?? },
          { name: "specialReductionRate", type: "text", label: "?밸퀎 媛먮㈃?? },
          { name: "sincereRepaymentReductionRate", type: "text", label: "?깆떎?곹솚 媛먮㈃?? },
          { name: "finalReductionRate", type: "text", label: "理쒖쥌 媛먮㈃?? },
  
          // Row 5
          { name: "monthlyPaymentDate", type: "text", label: "???⑹엯?쇱옄" },
          { name: "repaymentPeriodMonths", type: "number", label: "?곹솚湲곌컙(??" },
          { name: "initialPaymentAmount", type: "number", label: "理쒖큹 遺덉엯湲덉븸" },
          { name: "monthlyPaymentAmount", type: "number", label: "??遺덉엯湲덉븸" },
  
          // Row 6
          { name: "repaymentStartDate", type: "date", label: "蹂?쒖떆?묒씪", popoverSide: "top" },
          { name: "repaymentEndDate", type: "date", label: "蹂?쒖쥌猷뚯씪", popoverSide: "top" },
          { name: "cancellationDate", type: "date", label: "痍⑥냼?쇱옄", popoverSide: "top" },
          { name: "nextPaymentDate", type: "date", label: "李④린?⑹엯??, popoverSide: "top" },
  
          // Row 7
          { name: "receivingBank", type: "text", label: "?섎궔??? },
          { name: "receivingAccount", type: "text", label: "?섎궔怨꾩쥖" },
          { name: "paymentRate", type: "text", label: "?⑹엯?? },
          { name: "paymentTotal", type: "number", label: "?⑹엯?⑷퀎" },
  
          // Row 8
          { name: "specialNotes", type: "text", label: "?뱀씠?ы빆", colSpan: 3 },
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
          debtAdjustmentType_ledger: "媛쒖씤?뚯깮",
          debtAdjExecutionDate: "2024-03-15",
          basicReductionRate: "30%",
          specialReductionRate: "10%",
          sincereRepaymentReductionRate: "5%",
          finalReductionRate: "45%",
          monthlyPaymentDate: "留ㅼ썡 15??,
          repaymentPeriodMonths: 60,
          initialPaymentAmount: 500000,
          monthlyPaymentAmount: 450000,
          repaymentStartDate: "2024-04-15",
          repaymentEndDate: "2029-03-15",
          cancellationDate: "",
          nextPaymentDate: "2024-05-15",
          receivingBank: "?좏븳???,
          receivingAccount: "110-123-456789",
          paymentRate: "98%",
          paymentTotal: 27000000,
          specialNotes: "?깆떎 ?곹솚 以?,
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
            <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
            <h2 className="text-lg font-semibold">梨꾨Т議곗젙愿由?/h2>
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
                <BreadcrumbPage>梨꾨Т議곗젙愿由?/BreadcrumbPage>
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
          title="?뱁뻾"
          columns={mainColumns}
          data={mockMainData}
          amountColumns={["bondAmount", "loanAmount"]}
          dateColumnConfig={{ loanNewDate: "YYYYMMDD", loanMaturityDate: "YYYYMMDD" }}
          onRowClick={handleRowClick}
          onRowDoubleClick={handleRowDoubleClick}
        />
  
        {/* Ledger Info Form */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">梨꾨Т議곗젙 ?먯옣?뺣낫</h3>
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
                   <Button variant="outline" size="sm" onClick={handleActionClick("AddRow")}>?됱텛媛</Button>
                   <Button variant="outline" size="sm" onClick={handleActionClick("ModificationHistory")}>?섏젙?댁뿭</Button>
                   <Button variant="outline" size="sm" onClick={handleActionClick("TransactionHistory")}>嫄곕옒?댁뿭</Button>
               </div>
          </div>
          <DataTable
              title="?⑹엯?댁뿭"
              columns={paymentColumns}
              data={paymentHistory}
              amountColumns={["paymentAmount", "actualPaymentAmount"]}
              dateColumnConfig={{ transactionDate: "YYYYMMDD" }}
          />
        </div>
      </div>
    );
  }


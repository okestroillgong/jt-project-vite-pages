

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { RightActions } from "@/components/app/RightActions";
import type { FilterLayout } from "@/components/filters/types";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";

// --- Types ---

interface SpecialBondSubscriptionData {
  id: number; // 순번 (implicit)
  usrNm: string; // 담당자명
  incrprDt: string; // 편입일자
  custNo: string; // 고객번호
  custNm: string; // 고객명
  acntNo: string; // 계좌번호
  accCd: string; // 상품명
  loanDt: string; // 대출일자
  expDt: string; // 만기일자
  loanAmt: number; // 대출금액
  incrprAmt: number; // 편입금액
  incrprNrmlIntr: number; // 편입정상이자
  incrprArrs: number; // 편입연체료
  incrprArrintr: number; // 편입연체이자
  incrprSpnpyt: number; // 편입가지급금
  loanBlce: number; // 대출잔액
  acitrc: number; // 미수이자
  ouArrs: number; // 미수연체료
  ouArrIntr: number; // 미수연체이자
  ouSpnpyt: number; // 미수가지급금
}

// --- Mock Data ---
const mockData: SpecialBondSubscriptionData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  usrNm: `담당자${i + 1}`,
  incrprDt: "2024-11-01",
  custNo: `CUST${1000 + i}`,
  custNm: `고객${i + 1}`,
  acntNo: `100-200-${300000 + i}`,
  accCd: "신용대출",
  loanDt: "2023-01-01",
  expDt: "2025-01-01",
  loanAmt: 10000000 * (i + 1),
  incrprAmt: 9000000 * (i + 1),
  incrprNrmlIntr: 100000,
  incrprArrs: 50000,
  incrprArrintr: 20000,
  incrprSpnpyt: 10000,
  loanBlce: 8500000 * (i + 1),
  acitrc: 5000,
  ouArrs: 2000,
  ouArrIntr: 1000,
  ouSpnpyt: 0,
}));

// --- Columns ---
const columns: ColumnDef<SpecialBondSubscriptionData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "usrNm", header: "담당자명" },
  { accessorKey: "incrprDt", header: "편입일자" },
  { accessorKey: "custNo", header: "고객번호" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "acntNo", header: "계좌번호" },
  { accessorKey: "accCd", header: "상품명" },
  { accessorKey: "loanDt", header: "대출일자" },
  { accessorKey: "expDt", header: "만기일자" },
  { accessorKey: "loanAmt", header: "대출금액" },
  { accessorKey: "incrprAmt", header: "편입금액" },
  { accessorKey: "incrprNrmlIntr", header: "편입정상이자" },
  { accessorKey: "incrprArrs", header: "편입연체료" },
  { accessorKey: "incrprArrintr", header: "편입연체이자" },
  { accessorKey: "incrprSpnpyt", header: "편입가지급금" },
  { accessorKey: "loanBlce", header: "대출잔액" },
  { accessorKey: "acitrc", header: "미수이자" },
  { accessorKey: "ouArrs", header: "미수연체료" },
  { accessorKey: "ouArrIntr", header: "미수연체이자" },
  { accessorKey: "ouSpnpyt", header: "미수가지급금" },
];

export default function SpecialBondSubscriptionInquiryPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData, clearState } = usePageStore();
  const [filters, setFilters] = useState<Record<string, any>>(currentState?.filters || {});

  const tableData = useMemo(() => 
    currentState?.tables?.['subscriptionInquiryTable'] || [], 
    [currentState?.tables]
  );

  useEffect(() => {
    if (!currentState?.tables?.['subscriptionInquiryTable']) {
      updateTableData(tabId, 'subscriptionInquiryTable', mockData);
    }
  }, [tabId, currentState?.tables, updateTableData]);

  useEffect(() => {
    loadState(tabId);
  }, [tabId, loadState]);

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "customer-search") {
        const customer = message.payload;
        handleFilterChange("customer", customer.customerName);
      } else if (message.source === "branch-management") {
        const branch = message.payload;
        handleFilterChange("managementBranch", { code: branch.branchCode, name: branch.branchName });
      }
    });
    return cleanup;
  }, [tabId]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      return newFilters;
    });
  }, []);

  useEffect(() => {
    updateFilters(tabId, filters);
  }, [tabId, filters, updateFilters]);

  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "incorporationDate",
          type: "date-range",
          label: "편입일자",
        },
        {
          name: "managementBranch",
          type: "search",
          label: "관리부점",
          readonly: true,
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `/popup/branch-management?openerTabId=${tabId}`,
              "BranchManagement",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "customer",
          type: "long-search",
          label: "고객번호",
          readonly: true,
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `/popup/customer-search?openerTabId=${tabId}`,
              "CustomerSearch",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "accountNumber",
          type: "text",
          label: "계좌번호",
        },
      ],
    },
  ], [tabId]);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    updateTableData(tabId, 'subscriptionInquiryTable', mockData);
  };

  const handleExcelDownload = () => {
    alert("엑셀 다운로드 실행");
  };

  const handleReset = () => {
    setFilters({});
    clearState(tabId);
  };

  if (!currentState) return null;

  const amountColumns = [
    "loanAmt", "incrprAmt", "incrprNrmlIntr", "incrprArrs", "incrprArrintr", 
    "incrprSpnpyt", "loanBlce", "acitrc", "ouArrs", "ouArrIntr", "ouSpnpyt"
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">특수채권 편입조회</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>특수채권</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>특수채권 편입조회</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "search", onClick: handleSearch },
            { id: "excel", onClick: handleExcelDownload },
            { id: "data-reset", onClick: handleReset },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">검색 조건</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="특수채권 편입내역"
        columns={columns}
        data={tableData}
        amountColumns={amountColumns}
        minWidth="1820px"
      />
    </div>
  );
}

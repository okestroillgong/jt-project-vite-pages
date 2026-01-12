

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
  id: number; // ?쒕쾲 (implicit)
  usrNm: string; // ?대떦?먮챸
  incrprDt: string; // ?몄엯?쇱옄
  custNo: string; // 怨좉컼踰덊샇
  custNm: string; // 怨좉컼紐?  acntNo: string; // 怨꾩쥖踰덊샇
  accCd: string; // ?곹뭹紐?  loanDt: string; // ?異쒖씪??  expDt: string; // 留뚭린?쇱옄
  loanAmt: number; // ?異쒓툑??  incrprAmt: number; // ?몄엯湲덉븸
  incrprNrmlIntr: number; // ?몄엯?뺤긽?댁옄
  incrprArrs: number; // ?몄엯?곗껜猷?  incrprArrintr: number; // ?몄엯?곗껜?댁옄
  incrprSpnpyt: number; // ?몄엯媛吏湲됯툑
  loanBlce: number; // ?異쒖옍??  acitrc: number; // 誘몄닔?댁옄
  ouArrs: number; // 誘몄닔?곗껜猷?  ouArrIntr: number; // 誘몄닔?곗껜?댁옄
  ouSpnpyt: number; // 誘몄닔媛吏湲됯툑
}

// --- Mock Data ---
const mockData: SpecialBondSubscriptionData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  usrNm: `?대떦??{i + 1}`,
  incrprDt: "2024-11-01",
  custNo: `CUST${1000 + i}`,
  custNm: `怨좉컼${i + 1}`,
  acntNo: `100-200-${300000 + i}`,
  accCd: "?좎슜?異?,
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
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "usrNm", header: "?대떦?먮챸" },
  { accessorKey: "incrprDt", header: "?몄엯?쇱옄" },
  { accessorKey: "custNo", header: "怨좉컼踰덊샇" },
  { accessorKey: "custNm", header: "怨좉컼紐? },
  { accessorKey: "acntNo", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "accCd", header: "?곹뭹紐? },
  { accessorKey: "loanDt", header: "?異쒖씪?? },
  { accessorKey: "expDt", header: "留뚭린?쇱옄" },
  { accessorKey: "loanAmt", header: "?異쒓툑?? },
  { accessorKey: "incrprAmt", header: "?몄엯湲덉븸" },
  { accessorKey: "incrprNrmlIntr", header: "?몄엯?뺤긽?댁옄" },
  { accessorKey: "incrprArrs", header: "?몄엯?곗껜猷? },
  { accessorKey: "incrprArrintr", header: "?몄엯?곗껜?댁옄" },
  { accessorKey: "incrprSpnpyt", header: "?몄엯媛吏湲됯툑" },
  { accessorKey: "loanBlce", header: "?異쒖옍?? },
  { accessorKey: "acitrc", header: "誘몄닔?댁옄" },
  { accessorKey: "ouArrs", header: "誘몄닔?곗껜猷? },
  { accessorKey: "ouArrIntr", header: "誘몄닔?곗껜?댁옄" },
  { accessorKey: "ouSpnpyt", header: "誘몄닔媛吏湲됯툑" },
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
          label: "?몄엯?쇱옄",
        },
        {
          name: "managementBranch",
          type: "search",
          label: "愿由щ???,
          readonly: true,
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `${import.meta.env.BASE_URL}popup/branch-management?openerTabId=${tabId}`,
              "BranchManagement",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "customer",
          type: "long-search",
          label: "怨좉컼踰덊샇",
          readonly: true,
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `${import.meta.env.BASE_URL}popup/customer-search?openerTabId=${tabId}`,
              "CustomerSearch",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "accountNumber",
          type: "text",
          label: "怨꾩쥖踰덊샇",
        },
      ],
    },
  ], [tabId]);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    updateTableData(tabId, 'subscriptionInquiryTable', mockData);
  };

  const handleExcelDownload = () => {
    alert("?묒? ?ㅼ슫濡쒕뱶 ?ㅽ뻾");
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?뱀닔梨꾧텒 ?몄엯議고쉶</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?뱀닔梨꾧텒</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>?뱀닔梨꾧텒 ?몄엯議고쉶</BreadcrumbPage>
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
        <h3 className="font-semibold">寃??議곌굔</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="?뱀닔梨꾧텒 ?몄엯?댁뿭"
        columns={columns}
        data={tableData}
        amountColumns={amountColumns}
        minWidth="1820px"
      />
    </div>
  );
}


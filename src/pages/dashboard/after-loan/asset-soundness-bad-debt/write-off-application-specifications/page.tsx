

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useState } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RightActions, ActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { FilterContainer } from "@/components/filters/FilterContainer";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type OverviewData = {
  id: number;
  bondNm: string;
  itmsNm: string;
  countItms: number;
  summBlce: number;
  dprDivide: string;
};

type DetailData = {
  id: number;
  dprYm: string;
  custNo: string;
  custNm: string;
  acntNo: string;
  itmsNm: string;
  loanDt: string;
  assdGrdCd: string;
  loanBlce: number;
  cmtRgstrnDvNm: string;
  hbrNm: string;
  dprDivide: string;
};

const mockOverviewData: OverviewData[] = [
  { id: 1, bondNm: "일반자금대출", itmsNm: "기업운전", countItms: 15, summBlce: 1500000000, dprDivide: "일반상각" },
  { id: 2, bondNm: "종합통장대출", itmsNm: "가계일반", countItms: 8, summBlce: 500000000, dprDivide: "특수채권" },
  { id: 3, bondNm: "주택담보대출", itmsNm: "가계주택", countItms: 5, summBlce: 2500000000, dprDivide: "일반상각" },
];

const mockDetailData: DetailData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  dprYm: `MGMT${20240000 + i}`,
  custNo: `CUST${1000 + i}`,
  custNm: `홍길동${i + 1}`,
  acntNo: `123-456-7890${i}`,
  itmsNm: "기업운전",
  loanDt: "2023-01-01",
  assdGrdCd: "고정",
  loanBlce: 100000000,
  cmtRgstrnDvNm: i % 2 === 0 ? "등록" : "미등록",
  hbrNm: "본점",
  dprDivide: "-",
}));

const overviewColumns: ColumnDef<OverviewData>[] = [
  {
    header: "구분",
    columns: [
      { accessorKey: "bondNm", header: "채권명" },
      { accessorKey: "itmsNm", header: "과목명" },
    ],
  },
  {
    accessorKey: "countItms",
    header: "건수",
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  {
    accessorKey: "summBlce",
    header: "금액",
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  { accessorKey: "dprDivide", header: "비고" },
];

const detailColumns: ColumnDef<DetailData>[] = [
  { accessorKey: "dprYm", header: "관리번호" },
  { accessorKey: "custNo", header: "고객번호" },
  { accessorKey: "custNm", header: "채무자명" },
  { accessorKey: "acntNo", header: "계좌번호" },
  { accessorKey: "itmsNm", header: "계정과목" },
  { accessorKey: "loanDt", header: "취급일자" },
  { accessorKey: "assdGrdCd", header: "건전성분류" },
  { 
    accessorKey: "loanBlce", 
    header: "금액",
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  { accessorKey: "cmtRgstrnDvNm", header: "신용관리대상자 등록여부" },
  { accessorKey: "hbrNm", header: "관리점" },
  { accessorKey: "dprDivide", header: "비고" },
];

export default function WriteOffApplicationSpecificationsPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleSearch = () => {
    console.log("Searching...");
    updateTableData(tabId, "overviewTable", mockOverviewData);
    updateTableData(tabId, "detailTable", []); 
  };

  const handleReset = () => {
    clearState(tabId);
  };

  const handleOverviewRowClick = (row: OverviewData) => {
    console.log("Overview Row Clicked:", row);
    updateTableData(tabId, "detailTable", mockDetailData);
  };

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { 
            name: "quarter", 
            type: "select", 
            label: "분기",
            options: [
              { value: "2024Q4", label: "2024년 4분기" },
              { value: "2025Q1", label: "2025년 1분기" },
              { value: "2025Q2", label: "2025년 2분기" },
              { value: "2025Q3", label: "2025년 3분기" },
              { value: "2025Q4", label: "2025년 4분기" },
            ]
        },
        { 
            name: "writeOffType", 
            type: "select", 
            label: "상각구분",
            options: [
              { value: "all", label: "전체" },
              { value: "general", label: "일반상각" },
              { value: "special", label: "특수채권" },
            ]
        },
      ],
    },
  ];

  const rightActions: { id: ActionType; onClick?: () => void }[] = [
    { id: "search", onClick: handleSearch },
    { id: "reset", onClick: handleReset },
  ];

  if (!currentState) return null;

  const overviewRowCount = currentState.tables?.['overviewTable']?.length || 0;
  const detailRowCount = currentState.tables?.['detailTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">대손신청채권명세</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>재산건전성/대손상각</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>대손신청채권명세</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end min-h-[35px]">
        <RightActions actions={rightActions} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">대손신청채권 조회 조건</h3>
        <FilterContainer
            filterLayout={filterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <DataTable
            title="1. 개요"
            columns={overviewColumns}
            data={currentState.tables?.['overviewTable'] || []}
            onRowClick={handleOverviewRowClick}
        />
        <div className="flex justify-end">
            <Button 
                variant="outline" 
                size="sm"
                className="rounded-md bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                onClick={() => console.log("Overview Excel Download")}>
                엑셀다운로드
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <DataTable
            title="2. 대손인정신청채권 명세"
            columns={detailColumns}
            data={currentState.tables?.['detailTable'] || []}
        />
        <div className="flex justify-end">
            <Button 
                variant="outline" 
                size="sm"
                className="rounded-md bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                onClick={() => console.log("Detail Excel Download")}>
                엑셀다운로드
            </Button>
        </div>
      </div>
    </div>
  );
}

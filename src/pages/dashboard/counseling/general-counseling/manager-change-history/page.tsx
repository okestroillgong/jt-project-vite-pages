

import { useMemo } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { RightActions } from "@/components/app/RightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { DataTable } from "@/components/app/DataTable";
import { usePageStore } from "@/lib/store/pageStore";
import type { FilterLayout } from "@/components/filters/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";

// 데이터 테이블의 타입 정의
type ManagerHistoryItem = {
  id: number;
  customerName: string;
  customerNumber: string;
  accountNumber: string;
  assignmentEndDate: string;
  changeTimestamp: string;
  previousManager: string;
  newManager: string;
  changedByManager: string;
};

// DataTable 컬럼 정의
const columns: ColumnDef<ManagerHistoryItem>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "assignmentEndDate", header: "배정종료일자" },
  { accessorKey: "changeTimestamp", header: "담당자변경일시" },
  { accessorKey: "previousManager", header: "변경 전 담당자" },
  { accessorKey: "newManager", header: "변경 후 담당자" },
  { accessorKey: "changedByManager", header: "변경한 담당자" },
];

export default function ManagerChangeHistoryPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData } = usePageStore();
  const pageState = currentState;

  // 필터 레이아웃 정의
  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 12,
      filters: [
        { type: "select", label: "센터", name: "center", colSpan: 3, options: [{value: "C01", label: "강남센터"}] },
        { type: "select", label: "팀", name: "team", colSpan: 3, options: [{value: "T01", label: "1팀"}] },
        { type: "select", label: "그룹", name: "group", colSpan: 3, options: [{value: "G01", label: "그룹A"}] },
        { type: "select", label: "상담원", name: "counselor", colSpan: 3, options: [{value: "CS01", label: "상담원1"}] },
      ],
    },
    {
        type: "grid",
        columns: 12,
        filters: [
          { type: "text", label: "고객번호", name: "customerNumber", colSpan: 4 },
          { type: "text", label: "고객명", name: "customerName", colSpan: 4 },
          { type: "text", label: "계좌번호", name: "accountNumber", colSpan: 4 },
        ],
    },
    {
        type: "grid",
        columns: 12,
        filters: [
          { type: "checkbox", label: "배정대상자", name: "isAssignmentTarget", colSpan: 4 },
          { type: "date-range", label: "변경일자", name: "changeDate", colSpan: 4 },
          { type: "date-range", label: "배정종료일자", name: "assignmentEndDate", colSpan: 4 },
        ],
    },
  ], []);
  
  const handleSearch = () => {
    // 임시 데이터 생성
    const dummyData: ManagerHistoryItem[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      customerName: `고객${i + 1}`,
      customerNumber: `CUST500${i}`,
      accountNumber: `ACCT600${i}`,
      assignmentEndDate: "2025-11-30",
      changeTimestamp: "2024-10-31 15:30:00",
      previousManager: "김담당",
      newManager: "박담당",
      changedByManager: "최시스템",
    }));
    updateTableData(tabId, 'managerHistoryTable', dummyData);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
            <h1 className="text-lg font-semibold">담당자변경이력</h1>
        </div>
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink>상담관리</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink>일반상담</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>담당자변경이력</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "search", onClick: handleSearch },
            { id: "excel" },
          ]}
        />
      </div>

      <FilterContainer
        filterLayout={filterLayout}
        values={pageState?.filters || {}}
        onChange={(name: string, value: any) => {
          const newFilters = { ...pageState?.filters, [name]: value };
          updateFilters(tabId, newFilters);
        }}
      />

      <DataTable
        title="조회 내용"
        columns={columns}
        data={currentState?.tables?.['managerHistoryTable'] || []}
      />
    </div>
  );
}



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
type CmsDueDateItem = {
  accountNumber: string;
  customerNumber: string;
  customerName: string;
  productName: string;
  cmsAccountNumber: string;
  managingBranchCode: string;
  managingBranchName: string;
  dueDate: number;
  maturityDate: string;
  cmsRequest: string;
  actionType: string;
};

// DataTable 컬럼 정의
const columns: ColumnDef<CmsDueDateItem>[] = [
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "productName", header: "상품명" },
  { accessorKey: "cmsAccountNumber", header: "CMS 계좌번호" },
  { accessorKey: "managingBranchCode", header: "관리부점" },
  { accessorKey: "managingBranchName", header: "관리부점명" },
  { accessorKey: "dueDate", header: "응당일" },
  { accessorKey: "maturityDate", header: "만기일" },
  { accessorKey: "cmsRequest", header: "CMS의뢰" },
  { accessorKey: "actionType", header: "행동유형" },
];

export default function CmsDueDatePage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData } = usePageStore();
  const pageState = currentState;

  // 필터 레이아웃 정의
  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 12,
      filters: [
        { 
          type: "select", 
          label: "응당일", 
          name: "dueDate", 
          colSpan: 4, 
          activator: true, // 체크박스 활성화
          options: Array.from({ length: 31 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `${i + 1}일`,
          }))
        },
        { type: "date", label: "만기일 시작", name: "maturityStartDate", colSpan: 4 },
        { type: "date", label: "종료일", name: "maturityEndDate", colSpan: 4 },
      ],
    },
  ], []);
  
  const handleSearch = () => {
    // 임시 데이터 생성
    const dummyData: CmsDueDateItem[] = Array.from({ length: 5 }, (_, i) => ({
      accountNumber: `ACCT${3000 + i}`,
      customerNumber: `CUST${4000 + i}`,
      customerName: `고객명${i + 1}`,
      productName: "개인신용대출",
      cmsAccountNumber: `CMS-ACC-${9000 + i}`,
      managingBranchCode: "B01",
      managingBranchName: "강남센터",
      dueDate: 15,
      maturityDate: "2025-12-31",
      cmsRequest: i % 2 === 0 ? "Y" : "N",
      actionType: i % 2 === 0 ? "정상" : "연체",
    }));
    updateTableData(tabId, 'cmsDueDateTable', dummyData);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
            <h1 className="text-lg font-semibold">CMS응당일조회</h1>
        </div>
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink>상담관리</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink>일반상담</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>CMS응당일조회</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "search", onClick: handleSearch },
            { id: "data-reset" },
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
        title="응당일 CMS 리스트"
        columns={columns}
        data={currentState?.tables?.['cmsDueDateTable'] || []}
      />
    </div>
  );
}

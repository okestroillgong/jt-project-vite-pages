

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

// 임시 데이터 타입 정의
type SaleWriteOffItem = {
  id: number;
  bondType: string;
  type: string;
  isWrittenOff: string;
  customerNumber: string;
  accountNumber: string;
  productName: string;
  writeOffDate: string;
  loanDate: string;
};

// DataTable 컬럼 정의
const columns: ColumnDef<SaleWriteOffItem>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "bondType", header: "채권구분" },
  { accessorKey: "type", header: "구분" },
  { accessorKey: "isWrittenOff", header: "상각여부" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "productName", header: "상품명" },
  { accessorKey: "writeOffDate", header: "상각일" },
  { accessorKey: "loanDate", header: "대출취급일" },
];

export default function SaleWriteOffListPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData } = usePageStore();
  const pageState = currentState;

  // 필터 레이아웃 정의
  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 12,
      filters: [
        { type: "date", label: "등록일자", name: "registrationDate", colSpan: 4 },
        { type: "select", label: "구분", name: "type", colSpan: 4, options: [{value: "1", label: "매각"}, {value: "2", label: "상각"}] },
        { type: "select", label: "센터", name: "center", colSpan: 4, options: [{value: "C01", label: "강남센터"}, {value: "C02", label: "강북센터"}] },
      ],
    },
    {
        type: "grid",
        columns: 12,
        filters: [
          { type: "select", label: "팀", name: "team", colSpan: 4, options: [{value: "T01", label: "1팀"}, {value: "T02", label: "2팀"}] },
          { type: "select", label: "그룹", name: "group", colSpan: 4, options: [{value: "G01", label: "그룹A"}, {value: "G02", label: "그룹B"}] },
          { type: "select", label: "담당", name: "manager", colSpan: 4, options: [{value: "M01", label: "김담당"}, {value: "M02", label: "박담당"}] },
        ],
      },
  ], []);
  
  const handleSearch = () => {
    // 임시 데이터 생성
    const dummyData: SaleWriteOffItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        bondType: "일반",
        type: i % 2 === 0 ? "매각" : "상각",
        isWrittenOff: i % 2 === 0 ? "Y" : "N",
        customerNumber: `CUST${1000 + i}`,
        accountNumber: `ACCT${2000 + i}`,
        productName: "개인신용대출",
        writeOffDate: "2024-10-28",
        loanDate: "2022-01-15",
    }));
    updateTableData(tabId, 'saleWriteOffTable', dummyData);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
            <h1 className="text-lg font-semibold">매각/상각 리스트</h1>
        </div>
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink>상담관리</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink>일반상담</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>매각/상각 리스트</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "attach" },
            { id: "excel-upload" },
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
        columns={columns}
        data={currentState?.tables?.['saleWriteOffTable'] || []}
      />
    </div>
  );
}

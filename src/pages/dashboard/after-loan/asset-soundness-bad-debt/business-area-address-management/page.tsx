

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
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the grid
type BusinessAreaAddressData = {
  id: number;
  accountNo: string;
  borrowerAddress: string;
  workplaceAddress: string;
  addressTypeName: string;
  workplaceAddressTypeName: string;
  areaBranchTypeName: string;
  areaTypeName: string;
};

// Mock Data
const mockData: BusinessAreaAddressData[] = [
  {
    id: 1,
    accountNo: "123-456-7890",
    borrowerAddress: "서울시 강남구 테헤란로 123",
    workplaceAddress: "서울시 서초구 서초대로 456",
    addressTypeName: "자택",
    workplaceAddressTypeName: "직장",
    areaBranchTypeName: "강남점",
    areaTypeName: "서울지역",
  },
  {
    id: 2,
    accountNo: "987-654-3210",
    borrowerAddress: "경기도 성남시 분당구 판교로 789",
    workplaceAddress: "경기도 용인시 수지구 포은대로 101",
    addressTypeName: "자택",
    workplaceAddressTypeName: "본사",
    areaBranchTypeName: "분당점",
    areaTypeName: "경기지역",
  },
];

// Column definitions
const columns: ColumnDef<BusinessAreaAddressData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "accountNo", header: "계좌번호" },
  { accessorKey: "borrowerAddress", header: "차주주소" },
  { accessorKey: "workplaceAddress", header: "직장주소" },
  { accessorKey: "addressTypeName", header: "주소지구분명" },
  { accessorKey: "workplaceAddressTypeName", header: "직장주소구분명" },
  { accessorKey: "areaBranchTypeName", header: "지역점포구분명" },
  { accessorKey: "areaTypeName", header: "지역구분명" },
];

export default function BusinessAreaAddressManagementPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, clearState } = usePageStore();

  // Filter Layout
  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "baseDate",
          type: "date",
          label: "기준일자",
        },
        // 총대상건수는 필터 영역 우측에 표시하기 위해 별도로 처리하거나
        // Readonly 필드로 추가할 수 있습니다. 여기서는 필터 레이아웃에 포함시킵니다.
        // 다만 우측 정렬을 위해 spacer를 사용하거나 커스텀 렌더링을 고려할 수 있으나,
        // 단순하게 필드로 배치합니다.
        {
          name: "totalCount",
          type: "text",
          label: "총대상건수",
          readonly: true,
          defaultValue: "0",
        },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleActionClick = (action: string) => () => {
    console.log(`${action} clicked`);
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">영업구역 주소관리</h2>
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
              <BreadcrumbPage>영업구역 주소관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Top Actions */}
      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "attach", onClick: handleActionClick("Attach") },
            { id: "file-upload", onClick: handleActionClick("Upload") },
            { id: "loss-confirmation", onClick: handleActionClick("LossConfirm") },
            { id: "search", onClick: handleActionClick("Search") },
            { id: "data-reset", onClick: () => clearState(tabId) },
            { id: "excel", onClick: handleActionClick("ExcelDownload") },
          ]}
        />
      </div>

      {/* Filter Area */}
      <FilterContainer 
        filterLayout={filterLayout} 
        values={currentState.filters}
        onChange={handleFilterChange}
      />

      {/* Main Grid */}
      <DataTable
        title="전체리스트"
        columns={columns}
        data={mockData}
      />
    </div>
  );
}

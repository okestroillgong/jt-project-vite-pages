

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, usePathname } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { postPopupMessage, listenForPopupMessages } from "@/lib/popup-bus";

// Data type for the table
type UserData = {
  id: number;
  usrNm: string; // 사용자명
  usrno: string; // 사용자번호
  hbrNm: string; // 부점명
  hbrCd: string; // 부점코드
  usrDstcd: string; // 사용자구분
  usrRgstrnSttsCd: string; // 사용자등록
  usrRsppDstcd: string; // 책임자여부
  jobClsnSttsCd: string; // 업무마감상태
  usrLginYn: string; // 사용자로그인여부
  lastLginDt: string; // 최종로그인일자
  mthrRcppymYn: string; // 모출납여부
  dybfLginYn: string; // 천일로그인여부
  ctiUseYn: string; // CTI사용여부
  extno: string; // 내선전화번호
  grpExtno: string; // 그룹내선전화번호
  chngDt: string; // 변경일자
  lastPsswdChngDt: string; // 최종비밀번호변경일자
  rgstrnDt: string; // 등록일자
  empno: string; // 직원번호
};

// Mock data for the table
const mockData: UserData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  usrNm: `사용자${i + 1}`,
  usrno: `USER${1000 + i}`,
  hbrNm: i % 2 === 0 ? "강남지점" : "본점",
  hbrCd: i % 2 === 0 ? "B001" : "H001",
  usrDstcd: "일반",
  usrRgstrnSttsCd: "등록",
  usrRsppDstcd: i % 5 === 0 ? "Y" : "N",
  jobClsnSttsCd: "마감",
  usrLginYn: "Y",
  lastLginDt: "2024-11-20",
  mthrRcppymYn: "N",
  dybfLginYn: "Y",
  ctiUseYn: "Y",
  extno: `123${i}`,
  grpExtno: `900${i}`,
  chngDt: "2024-10-01",
  lastPsswdChngDt: "2024-09-01",
  rgstrnDt: "2023-01-01",
  empno: `EMP${2000 + i}`,
}));

// Column definitions for the table
const columns: ColumnDef<UserData>[] = [
  { accessorKey: "usrNm", header: "사용자명" },
  { accessorKey: "usrno", header: "사용자번호" },
  { accessorKey: "hbrNm", header: "부점명" },
  { accessorKey: "hbrCd", header: "부점코드" },
  { accessorKey: "usrDstcd", header: "사용자구분" },
  { accessorKey: "usrRgstrnSttsCd", header: "사용자등록" },
  { accessorKey: "usrRsppDstcd", header: "책임자여부" },
  { accessorKey: "jobClsnSttsCd", header: "업무마감상태" },
  { accessorKey: "usrLginYn", header: "사용자로그인여부" },
  { accessorKey: "lastLginDt", header: "최종로그인일자" },
  { accessorKey: "mthrRcppymYn", header: "모출납여부" },
  { accessorKey: "dybfLginYn", header: "천일로그인여부" },
  { accessorKey: "ctiUseYn", header: "CTI사용여부" },
  { accessorKey: "extno", header: "내선전화번호" },
  { accessorKey: "grpExtno", header: "그룹내선전화번호" },
  { accessorKey: "chngDt", header: "변경일자" },
  { accessorKey: "lastPsswdChngDt", header: "최종비밀번호변경일자" },
  { accessorKey: "rgstrnDt", header: "등록일자" },
  { accessorKey: "empno", header: "직원번호" },
];

function UserSearchPopupContent() {
  const searchParams = useSearchParams();
  const tabId = usePathname();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<UserData[]>([]);
  const openerTabId = searchParams.get("openerTabId");

  // Initialize filters from URL search params (Data from Parent -> Popup)
  useEffect(() => {
    const newFilters: Record<string, any> = {};
    const usrNm = searchParams.get("usrNm");
    const usrno = searchParams.get("usrno");
    const hbrNm = searchParams.get("hbrNm");
    const hbrCd = searchParams.get("hbrCd");

    if (usrNm) newFilters.usrNm = usrNm;
    if (usrno) newFilters.usrno = usrno;
    if (hbrNm) newFilters.hbrNm = { name: hbrNm, code: hbrCd || '' };
    else if (hbrCd) newFilters.hbrNm = { name: '', code: hbrCd };

    setFilters(newFilters);
    // Optionally auto-search if params are provided
    if (Object.keys(newFilters).length > 0) {
       setTableData(mockData); // Mock search
    }
  }, [searchParams]);

  // Listen for popup messages (from child popups like branch-management)
  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === 'branch-management') {
        const branch = message.payload;
        handleFilterChange('hbrNm', { code: branch.branchCode, name: branch.branchName });
      }
    });
    return cleanup;
  }, [tabId]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // DSL for the filter section
  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "usrNm", type: "text", label: "사용자명" },
        { name: "usrno", type: "text", label: "사용자번호" },
        { 
          name: "hbrNm", 
          type: "search", 
          label: "부점명",
          onButtonClick: (value: any, e: any) => {
             e?.preventDefault();
             const branchName = value?.name || '';
             const branchCode = value?.code || '';
             window.open(`/popup/branch-management?branchName=${branchName}&branchCode=${branchCode}&openerTabId=${tabId}`, 'BranchManagement', 'width=1600,height=800');
          }
        },
        {
          name: "usrRsppDstcd",
          type: "select",
          label: "책임자여부",
          options: [
            { value: "all", label: "전체" },
            { value: "Y", label: "책임자" },
            { value: "N", label: "비책임자" },
          ],
        },
      ],
    },
  ], [tabId]);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    setTableData(mockData);
  };

  const handleReset = () => {
    setFilters({});
    setTableData([]);
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회", onClick: handleSearch },
    { id: "reset", text: "초기화", onClick: handleReset },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  // Handle Row Double Click (Data from Popup -> Parent)
  const handleRowDoubleClick = (row: UserData) => {
    if (openerTabId) {
      postPopupMessage({
        targetTabId: openerTabId,
        source: 'user-search',
        payload: row,
      });
      window.close();
    } else {
      console.error("Opener Tab ID is missing, cannot send data.");
      // Optional: Alert user that opener context is missing
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">사용자 검색</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="border-t pt-4">
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="flex-grow">
        <DataTable 
          title="사용자 목록"
          columns={columns} 
          data={tableData} 
          onRowDoubleClick={handleRowDoubleClick}
          minWidth="1800px"
        />
      </div>
    </div>
  );
}

export default function UserSearchPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserSearchPopupContent />
    </Suspense>
  );
}

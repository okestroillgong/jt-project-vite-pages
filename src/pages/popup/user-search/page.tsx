

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
  usrNm: string; // ?ъ슜?먮챸
  usrno: string; // ?ъ슜?먮쾲??  hbrNm: string; // 遺?먮챸
  hbrCd: string; // 遺?먯퐫??  usrDstcd: string; // ?ъ슜?먭뎄遺?  usrRgstrnSttsCd: string; // ?ъ슜?먮벑濡?  usrRsppDstcd: string; // 梨낆엫?먯뿬遺
  jobClsnSttsCd: string; // ?낅Т留덇컧?곹깭
  usrLginYn: string; // ?ъ슜?먮줈洹몄씤?щ?
  lastLginDt: string; // 理쒖쥌濡쒓렇?몄씪??  mthrRcppymYn: string; // 紐⑥텧?⑹뿬遺
  dybfLginYn: string; // 泥쒖씪濡쒓렇?몄뿬遺
  ctiUseYn: string; // CTI?ъ슜?щ?
  extno: string; // ?댁꽑?꾪솕踰덊샇
  grpExtno: string; // 洹몃９?댁꽑?꾪솕踰덊샇
  chngDt: string; // 蹂寃쎌씪??  lastPsswdChngDt: string; // 理쒖쥌鍮꾨?踰덊샇蹂寃쎌씪??  rgstrnDt: string; // ?깅줉?쇱옄
  empno: string; // 吏곸썝踰덊샇
};

// Mock data for the table
const mockData: UserData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  usrNm: `?ъ슜??{i + 1}`,
  usrno: `USER${1000 + i}`,
  hbrNm: i % 2 === 0 ? "媛뺣궓吏?? : "蹂몄젏",
  hbrCd: i % 2 === 0 ? "B001" : "H001",
  usrDstcd: "?쇰컲",
  usrRgstrnSttsCd: "?깅줉",
  usrRsppDstcd: i % 5 === 0 ? "Y" : "N",
  jobClsnSttsCd: "留덇컧",
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
  { accessorKey: "usrNm", header: "?ъ슜?먮챸" },
  { accessorKey: "usrno", header: "?ъ슜?먮쾲?? },
  { accessorKey: "hbrNm", header: "遺?먮챸" },
  { accessorKey: "hbrCd", header: "遺?먯퐫?? },
  { accessorKey: "usrDstcd", header: "?ъ슜?먭뎄遺? },
  { accessorKey: "usrRgstrnSttsCd", header: "?ъ슜?먮벑濡? },
  { accessorKey: "usrRsppDstcd", header: "梨낆엫?먯뿬遺" },
  { accessorKey: "jobClsnSttsCd", header: "?낅Т留덇컧?곹깭" },
  { accessorKey: "usrLginYn", header: "?ъ슜?먮줈洹몄씤?щ?" },
  { accessorKey: "lastLginDt", header: "理쒖쥌濡쒓렇?몄씪?? },
  { accessorKey: "mthrRcppymYn", header: "紐⑥텧?⑹뿬遺" },
  { accessorKey: "dybfLginYn", header: "泥쒖씪濡쒓렇?몄뿬遺" },
  { accessorKey: "ctiUseYn", header: "CTI?ъ슜?щ?" },
  { accessorKey: "extno", header: "?댁꽑?꾪솕踰덊샇" },
  { accessorKey: "grpExtno", header: "洹몃９?댁꽑?꾪솕踰덊샇" },
  { accessorKey: "chngDt", header: "蹂寃쎌씪?? },
  { accessorKey: "lastPsswdChngDt", header: "理쒖쥌鍮꾨?踰덊샇蹂寃쎌씪?? },
  { accessorKey: "rgstrnDt", header: "?깅줉?쇱옄" },
  { accessorKey: "empno", header: "吏곸썝踰덊샇" },
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
        { name: "usrNm", type: "text", label: "?ъ슜?먮챸" },
        { name: "usrno", type: "text", label: "?ъ슜?먮쾲?? },
        { 
          name: "hbrNm", 
          type: "search", 
          label: "遺?먮챸",
          onButtonClick: (value: any, e: any) => {
             e?.preventDefault();
             const branchName = value?.name || '';
             const branchCode = value?.code || '';
             window.open(`${import.meta.env.BASE_URL}popup/branch-management?branchName=${branchName}&branchCode=${branchCode}&openerTabId=${tabId}`, 'BranchManagement', 'width=1600,height=800');
          }
        },
        {
          name: "usrRsppDstcd",
          type: "select",
          label: "梨낆엫?먯뿬遺",
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "Y", label: "梨낆엫?? },
            { value: "N", label: "鍮꾩콉?꾩옄" },
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
    { id: "search", text: "議고쉶", onClick: handleSearch },
    { id: "reset", text: "珥덇린??, onClick: handleReset },
    { id: "close", text: "?リ린", onClick: () => window.close() },
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
        <h2 className="text-xl font-bold">?ъ슜??寃??/h2>
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
          title="?ъ슜??紐⑸줉"
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


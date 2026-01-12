

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { ColumnDef } from "@tanstack/react-table";
import { postPopupMessage } from "@/lib/popup-bus";

// Data type for the table
type HistoryData = {
  id: number;
  accountNumber: string;
  customerNumber: string;
  customerName: string;
  changeItem: string;
  beforeChange: string;
  afterChange: string;
  modifier: string;
  changeDate: string;
  changeTime: string;
};

// Mock data for the table
const mockData: HistoryData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  accountNumber: "123-456-7890",
  customerNumber: "CUST001",
  customerName: "홍길동",
  changeItem: i % 2 === 0 ? "주소" : "전화번호",
  beforeChange: i % 2 === 0 ? "서울시 강남구" : "010-1111-2222",
  afterChange: i % 2 === 0 ? "서울시 서초구" : "010-3333-4444",
  modifier: "관리자",
  changeDate: "2024-01-01",
  changeTime: "12:00:00",
}));

// Column definitions for the table
const columns: ColumnDef<HistoryData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "customerNumber", header: "신청고객번호" },
  { accessorKey: "customerName", header: "신청인명" },
  { accessorKey: "changeItem", header: "변경항목" },
  { accessorKey: "beforeChange", header: "변경이전내용" },
  { accessorKey: "afterChange", header: "변경이후내용" },
  { accessorKey: "modifier", header: "변경 사용자" },
  { accessorKey: "changeDate", header: "변경일자" },
  { accessorKey: "changeTime", header: "변경시각" },
];

function ModificationHistoryPopupContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<HistoryData[]>([]);
  const openerTabId = searchParams.get("openerTabId");

  useEffect(() => {
    const customerNumber = searchParams.get("customerNumber");
    const accountNumber = searchParams.get("accountNumber");

    // In a real application, you would fetch data here using these parameters
    // For now, we just use the mock data
    if (customerNumber || accountNumber) {
        setData(mockData);
    }
  }, [searchParams]);

  const handleSearch = () => {
     // Reload or fetch data logic would go here
     setData(mockData);
  };

  const handleRowDoubleClick = (row: HistoryData) => {
    if (openerTabId) {
      postPopupMessage({
        targetTabId: openerTabId,
        source: 'modification-history',
        payload: row,
      });
      window.close();
    }
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회", onClick: handleSearch },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">수정내역</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-grow">
        <DataTable columns={columns} data={data} onRowDoubleClick={handleRowDoubleClick} />
      </div>
    </div>
  );
}

export default function ModificationHistoryPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModificationHistoryPopupContent />
    </Suspense>
  );
}
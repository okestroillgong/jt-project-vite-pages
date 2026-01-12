

import { useState, Suspense } from "react";
import { DataTable } from "@/components/app/DataTable";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { ColumnDef } from "@tanstack/react-table";

// Type definition
type CorrectionData = {
  id: number;
  changeDate: string;
  changeTime: string;
  changeItemName: string;
  beforeChange: string;
  afterChange: string;
};

// Mock Data
const mockData: CorrectionData[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  changeDate: "2025-12-17",
  changeTime: "14:30:00",
  changeItemName: i % 2 === 0 ? "주소" : "연락처",
  beforeChange: i % 2 === 0 ? "서울시 강남구" : "010-1111-2222",
  afterChange: i % 2 === 0 ? "서울시 서초구" : "010-3333-4444",
}));

// Columns
const columns: ColumnDef<CorrectionData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "changeDate", header: "변경일자" },
  { accessorKey: "changeTime", header: "변경시각" },
  { accessorKey: "changeItemName", header: "고객정보변경항목명" },
  { accessorKey: "beforeChange", header: "변경이전내용" },
  { accessorKey: "afterChange", header: "변경이후내용" },
];

function CorrectionHistoryPopupContent() {
  const popupActions: PopupAction[] = [
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">수정정보</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Result Section */}
        <div>
            <DataTable 
                title="고객정보 수정이력조회" 
                columns={columns} 
                data={mockData} 
                minWidth="1000px"
                dateColumnConfig={{ changeDate: 'YYYYMMDD' }}
            />
        </div>
      </div>
    </div>
  );
}

export default function CorrectionHistoryPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CorrectionHistoryPopupContent />
    </Suspense>
  );
}

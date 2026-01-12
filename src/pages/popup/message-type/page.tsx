

import { useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type MessageTypeData = {
  id: string;
  name: string;
  type: string;
  messageType: string;
  content: string;
};

// Mock data for the table
const mockData: MessageTypeData[] = Array.from({ length: 15 }, (_, i) => ({
  id: `CODE${i + 1}`,
  name: `안내 메시지 ${i + 1}`,
  type: i % 2 === 0 ? "SMS" : "알림톡",
  messageType: "안내",
  content: `고객님, ${i + 1}차 안내입니다.`,
}));

export default function MessageTypePopup() {
  const [filters, setFilters] = useState<Record<string, any>>({
    messageCode: { select: "all", input: "" },
    messageName: "",
    messageContent: "",
  });
  const [tableData, setTableData] = useState<MessageTypeData[]>([]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

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

  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        { 
          name: "messageCode", 
          type: "select-and-input", 
          label: "알림톡/SMS메시지코드",
          options: [
            { value: "all", label: "전체" },
            { value: "sms", label: "SMS" },
            { value: "alimtalk", label: "알림톡" },
          ]
        },
        { 
          name: "messageName", 
          type: "text", 
          label: "알림톡/SMS메시지명"
        },
      ],
    },
    {
        type: "grid",
        columns: 1,
        filters: [
            {
                name: "messageContent",
                type: "text",
                label: "알림톡/SMS메시지내용"
            }
        ]
    }
  ], []);

  const columns: ColumnDef<MessageTypeData>[] = useMemo(() => [
    { accessorKey: "id", header: "코드" },
    { accessorKey: "name", header: "알림톡/SMS메시지명" },
    { accessorKey: "type", header: "유형" },
    { accessorKey: "messageType", header: "메시지유형" },
    { accessorKey: "content", header: "알림톡/SMS메세지 내용" },
  ], []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h1 className="text-xl font-bold">메세지유형</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        <div>
          <h3 className="font-semibold mb-2">검색조건</h3>
          <FilterContainer
            filterLayout={filterLayout}
            values={filters}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex-grow">
          <DataTable 
            title="검색결과"
            columns={columns} 
            data={tableData} 
          />
        </div>
      </div>
    </div>
  );
}

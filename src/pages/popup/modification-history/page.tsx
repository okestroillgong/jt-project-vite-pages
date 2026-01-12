

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { ColumnDef } from "@tanstack/react-table";
import { postPopupMessage } from "@/lib${import.meta.env.BASE_URL}popup-bus";

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
  customerName: "?띻만??,
  changeItem: i % 2 === 0 ? "二쇱냼" : "?꾪솕踰덊샇",
  beforeChange: i % 2 === 0 ? "?쒖슱??媛뺣궓援? : "010-1111-2222",
  afterChange: i % 2 === 0 ? "?쒖슱???쒖큹援? : "010-3333-4444",
  modifier: "愿由ъ옄",
  changeDate: "2024-01-01",
  changeTime: "12:00:00",
}));

// Column definitions for the table
const columns: ColumnDef<HistoryData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "customerNumber", header: "?좎껌怨좉컼踰덊샇" },
  { accessorKey: "customerName", header: "?좎껌?몃챸" },
  { accessorKey: "changeItem", header: "蹂寃쏀빆紐? },
  { accessorKey: "beforeChange", header: "蹂寃쎌씠?꾨궡?? },
  { accessorKey: "afterChange", header: "蹂寃쎌씠?꾨궡?? },
  { accessorKey: "modifier", header: "蹂寃??ъ슜?? },
  { accessorKey: "changeDate", header: "蹂寃쎌씪?? },
  { accessorKey: "changeTime", header: "蹂寃쎌떆媛? },
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
    { id: "search", text: "議고쉶", onClick: handleSearch },
    { id: "close", text: "?リ린", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">?섏젙?댁뿭</h2>
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

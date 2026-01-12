

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { DataTable } from "@/components/app/DataTable";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type ProgressData = {
  id: number;
  division: string;
  customerNumber: string;
  residentRegistrationNumber: string;
  customerName: string;
  content: string;
};

// Mock data for the table
const mockData: ProgressData[] = [
  {
    id: 1,
    division: "신용회복",
    customerNumber: "CUST1001",
    residentRegistrationNumber: "800101-1******",
    customerName: "홍길동",
    content: "신용회복 신청 접수 완료",
  },
  {
    id: 2,
    division: "개인회생",
    customerNumber: "CUST1002",
    residentRegistrationNumber: "900505-1******",
    customerName: "김철수",
    content: "개시결정 통지 수신",
  },
  {
    id: 3,
    division: "법적조치",
    customerNumber: "CUST1003",
    residentRegistrationNumber: "751212-2******",
    customerName: "이영희",
    content: "지급명령 신청",
  },
  {
    id: 4,
    division: "파산면책",
    customerNumber: "CUST1004",
    residentRegistrationNumber: "880808-1******",
    customerName: "박민수",
    content: "면책결정 확정",
  },
  {
    id: 5,
    division: "신용회복",
    customerNumber: "CUST1005",
    residentRegistrationNumber: "950303-2******",
    customerName: "최지은",
    content: "변제금 미납 안내 발송",
  },
];

// Column definitions for the table
const columns: ColumnDef<ProgressData>[] = [
  { accessorKey: "division", header: "채권조정법무진행구분" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "residentRegistrationNumber", header: "주민번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "content", header: "내용" },
];

function BondLegalProgressPopupContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ProgressData[]>([]);

  useEffect(() => {
    const rrn = searchParams.get("residentRegistrationNumber");

    // In a real application, fetch data using the residentRegistrationNumber
    if (rrn) {
      console.log("Fetching data for RRN:", rrn);
      // For now, load mock data
      setData(mockData);
    } else {
        // If no RRN, maybe show empty or all? Showing mock data for demo.
        setData(mockData);
    }
  }, [searchParams]);

  const popupActions: PopupAction[] = [
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">채권조정 및 법무진행 조회</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-grow">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default function BondLegalProgressPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BondLegalProgressPopupContent />
    </Suspense>
  );
}

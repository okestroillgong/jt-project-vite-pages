

import { useState, useMemo } from "react";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type SpecificInfoData = {
  id: number;
  registrationDate: string;
  registrationTime: string;
  customerCharacteristic: string;
  registrationCenter: string;
  registrationTeam: string;
  registrationGroup: string;
  registrant: string;
};

// Mock data for the table
const mockData: SpecificInfoData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  registrationDate: "2025-12-17",
  registrationTime: `15:4${i}:00`,
  customerCharacteristic: `특성 ${i + 1}`,
  registrationCenter: "강남센터",
  registrationTeam: "1팀",
  registrationGroup: "A그룹",
  registrant: `사용자${i + 1}`,
}));

export default function SpecificInfoInquiryPopup() {
  const columns: ColumnDef<SpecificInfoData>[] = useMemo(() => [
    { accessorKey: "id", header: "순번" },
    { accessorKey: "registrationDate", header: "등록일자" },
    { accessorKey: "registrationTime", header: "등록시간" },
    { accessorKey: "customerCharacteristic", header: "고객특성" },
    { accessorKey: "registrationCenter", header: "등록센터" },
    { accessorKey: "registrationTeam", header: "등록팀" },
    { accessorKey: "registrationGroup", header: "등록그룹" },
    { accessorKey: "registrant", header: "등록사용자" },
  ], []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h1 className="text-xl font-bold">특정정보조회</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        <DataTable 
          title="조회내용"
          columns={columns} 
          data={mockData} 
          pageSize={10}
        />
      </div>
    </div>
  );
}

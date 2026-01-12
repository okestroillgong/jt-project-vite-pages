

import { useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type AddressVerificationResult = {
  id: number;
  isNewAddress: string;
  zipCode: string;
  sequence: string;
  fullAddress: string;
};

// Mock data for the table
const mockData: AddressVerificationResult[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  isNewAddress: "Y",
  zipCode: `123-45${i}`,
  sequence: `00${i + 1}`,
  fullAddress: `서울특별시 강남구 테헤란로 ${i+1}길`,
}));

export default function AddressVerificationPopup() {
  const [filters, setFilters] = useState<Record<string, any>>({
    addressType: "old"
  });
  const [tableData, setTableData] = useState<AddressVerificationResult[]>([]);
  const [responseMessage, setResponseMessage] = useState("");

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);
  
  const handleVerify = () => {
    console.log("Verifying address with filters:", filters);
    setTableData(mockData);
    setResponseMessage("정상적으로 조회되었습니다.");
  };

  const handleReset = () => {
    setFilters({ addressType: "old" });
    setTableData([]);
    setResponseMessage("");
  };
  
  const handleClose = () => {
    window.close();
  };

  const popupActions: PopupAction[] = [
    { id: "verify", text: "검증", onClick: handleVerify },
    { id: "reset", text: "재입력", onClick: handleReset },
    { id: "close", text: "닫기", onClick: handleClose },
  ];
  
  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 4,
      filters: [
        { 
          name: "zipCode", 
          type: "text", 
          label: "우편번호"
        },
        { 
          name: "addressType", 
          type: "select", 
          options: [
            { value: "old", label: "구지번주소" },
            { value: "new", label: "도로명주소" }
          ]
        },
        { 
          name: "baseAddress", 
          type: "text", 
          label: "기본주소",
          colSpan: 2,
        },
        { 
          name: "serialNumber", 
          type: "text", 
          label: "일련번호"
        },
        { 
          name: "detailAddress", 
          type: "text", 
          label: "우편번호외주소",
          colSpan: 3,
        },
      ],
    },
  ], []);

  const resultLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "responseMessage",
          type: "text",
          label: "응답메세지",
          readonly: true,
        }
      ]
    }
  ], []);
  
  const columns: ColumnDef<AddressVerificationResult>[] = useMemo(() => [
    { accessorKey: "id", header: "순번" },
    { accessorKey: "isNewAddress", header: "신주소여부" },
    { accessorKey: "zipCode", header: "우편번호" },
    { accessorKey: "sequence", header: "일련번호" },
    { accessorKey: "fullAddress", header: "우편번호주소" },
  ], []);


  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h1 className="text-xl font-bold">주소검증</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">검증할 주소</h3>
          <FilterContainer
            filterLayout={filterLayout}
            values={filters}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="flex flex-col gap-2 flex-grow">
          <h3 className="font-semibold">주소검증결과</h3>
          <FilterContainer
            filterLayout={resultLayout}
            values={{ responseMessage }}
            onChange={() => {}}
          />
          <div className="flex-grow">
              <DataTable 
              columns={columns} 
              data={tableData} 
              />
          </div>
        </div>
      </div>
    </div>
  );
}

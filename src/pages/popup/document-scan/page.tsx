

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { Button } from "@/components/ui/button";

// DSL for the filter section
const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 3,
        filters: [
            { name: "registrationDate", type: "date", label: "등록일자", readonly: true },
            { name: "customerNumber", type: "text", label: "고객번호", readonly: true },
            { name: "loanApplicationNumber", type: "text", label: "대출신청번호", readonly: true },
        ],
    },
];

function DocumentScanPopupContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const newFilters: Record<string, any> = {};
    const customerNumber = searchParams.get("customerNumber");
    
    if (customerNumber) newFilters.customerNumber = customerNumber;
    // TODO: Fetch initial data based on customerNumber
    
    setFilters(newFilters);
  }, [searchParams]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const popupActions: PopupAction[] = [
    { id: "scan", text: "스캔" },
    { id: "import", text: "불러오기" },
    { id: "format", text: "서식지정" },
    { id: "delete", text: "삭제" },
    { id: "validate", text: "오류검증" },
    { id: "send", text: "전송" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen h-screen">
      {/* 1. Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-bold">문서스캔</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      {/* 2. Filters */}
      <div className="border-t pt-4 flex-shrink-0">
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>
      
      {/* 3. Edit Button */}
      <div className="flex justify-end flex-shrink-0">
        <Button>수정</Button>
      </div>

      {/* 4. Document List and Viewer */}
      <div className="flex-grow flex flex-row gap-4 min-h-0">
        {/* Document List */}
        <div className="flex-1 border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-2">문서 목록</h3>
          <div className="text-center text-gray-500 pt-10">
            (문서 목록 영역)
          </div>
        </div>
        {/* Document Viewer */}
        <div className="flex-[2] border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-2">문서 뷰어</h3>
          <div className="text-center text-gray-500 pt-10">
            (문서 뷰어 영역)
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentScanPopupPage() {
  return <DocumentScanPopupContent />;
}

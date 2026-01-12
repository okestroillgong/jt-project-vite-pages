

import { Suspense, useState, useCallback, useMemo } from "react";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { PopupRightActions } from "@/components/app/PopupRightActions";

function MultiExcelDownloadContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    includeHeader: true,
    treeStyle: false,
    addSheet: false,
    closeWindow: true, 
    openExcel: false,  
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Filter Layout for Save Options
  const saveOptionsLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "includeHeader", type: "checkbox", label: "수평헤더 제목포함" },
        { name: "treeStyle", type: "checkbox", label: "트리스타일 저장" },
        { name: "addSheet", type: "checkbox", label: "기존 파일에 시트 추가" },
      ],
    },
  ], []);

  // Filter Layout for After Save Options (Re-added)
  const afterSaveOptionsLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "closeWindow", type: "checkbox", label: "창닫기" },
        { name: "openExcel", type: "checkbox", label: "엑셀 열기" },
      ],
    },
  ], []);

  const handleSave = () => {
    console.log("Saving with options:", filters);
    alert("저장이 완료되었습니다. (콘솔 확인)");
    
    if (filters.closeWindow) {
        window.close();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">멀티 엑셀 다운로드</h2>
      </div>

      <div className="border-t pt-4">
        {/* Filter Layout 1: Save Options */}
        <div className="flex flex-col gap-2 mb-4">
            <h3 className="font-semibold mb-2">저장시</h3>
            <FilterContainer
                filterLayout={saveOptionsLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Filter Layout 2: After Save Options */}
        <div className="flex flex-col gap-2 mb-4">
            <h3 className="font-semibold mb-2">저장완료 후</h3>
            <FilterContainer
                filterLayout={afterSaveOptionsLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-2 pt-4 pb-4">
         <PopupRightActions 
            actions={[
                { id: "save", text: "저장", onClick: handleSave },
                { id: "close", text: "닫기", onClick: () => window.close() }
            ]} 
         />
      </div>
    </div>
  );
}

export default function MultiExcelDownloadPage() {
  return (
    <Suspense>
      <MultiExcelDownloadContent />
    </Suspense>
  );
}


import { useState, useCallback, Suspense } from "react";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";

function DebtCollectionRestrictionPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    nonFaceTime: { start: "09", end: "18" }, // Default time
    visitHomeTime: { start: "09", end: "18" },
    visitWorkTime: { start: "09", end: "18" },
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = () => {
    setFilters({});
  };

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "save", text: "저장" },
    { id: "reset", text: "초기화", onClick: handleReset },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const contactRestrictionLayout: FilterLayout = [
    {
        type: "grid",
        columns: 3,
        filters: [
            { name: "sms", type: "checkbox", label: "SMS" },
            { name: "tmHome", type: "checkbox", label: "TM-자택" },
            { name: "tmWork", type: "checkbox", label: "TM-회사" },
            
            { name: "tmMobile", type: "checkbox", label: "TM-핸드폰" },
            { name: "restrictionPeriod", type: "date-range", label: "기간설정" },
            { name: "restrictionTime", type: "hour-range", label: "시간설정" },

            { name: "restrictionDays", type: "days-of-week", label: "요일설정", colSpan: 3 },
        ]
    }
  ];

  const visitRestrictionLayout: FilterLayout = [
    {
        type: "grid",
        columns: 3,
        filters: [
            { name: "visitHome", type: "checkbox", label: "방문-자택" },
            { name: "visitHomePeriod", type: "date-range", label: "기간설정" },
            { name: "visitHomeTime", type: "hour-range", label: "시간설정" },

            { name: "visitWork", type: "checkbox", label: "방문-회사" },
            { name: "visitWorkPeriod", type: "date-range", label: "기간설정" },
            { name: "visitWorkTime", type: "hour-range", label: "시간설정" },
        ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">추심연락제한</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Section 1: Contact Restrictions */}
        <div>
            <h3 className="font-semibold mb-2">연락제한 설정 (전화/문자)</h3>
            <FilterContainer
                filterLayout={contactRestrictionLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Section 2: Visit Restrictions */}
        <div>
            <h3 className="font-semibold mb-2">방문제한 설정</h3>
            <FilterContainer
                filterLayout={visitRestrictionLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>
      </div>
    </div>
  );
}

export default function DebtCollectionRestrictionPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DebtCollectionRestrictionPopupContent />
    </Suspense>
  );
}

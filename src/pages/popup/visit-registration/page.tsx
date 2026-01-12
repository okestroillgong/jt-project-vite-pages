

import { useState, Suspense } from "react";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterWrapper from "@/components/filters/FilterWrapper";

function VisitRegistrationPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    visitDate: new Date().toISOString(),
    visitHour: "09",
    visitMinute: "00",
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const popupActions: PopupAction[] = [
    { id: "register", text: "등록" },
    { id: "cancel", text: "취소", onClick: () => window.close() },
  ];

  const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 2,
        filters: [
            { name: "visitDate", type: "date", label: "방문요청일시" },
            { 
                name: "visitHour", 
                type: "select", 
                label: "시", 
                options: Array.from({ length: 24 }, (_, i) => ({
                    value: String(i).padStart(2, '0'),
                    label: String(i).padStart(2, '0')
                }))
            },
            { 
                name: "visitMinute", 
                type: "select", 
                label: "분", 
                options: ["00", "10", "20", "30", "40", "50"].map((m) => ({
                    value: m,
                    label: m
                }))
            }
        ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">방문등록</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        <div>
            <h3 className="font-semibold mb-2">고객방문등록</h3>
            <FilterContainer
                filterLayout={filterLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>
      </div>
    </div>
  );
}

export default function VisitRegistrationPopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitRegistrationPopupContent />
    </Suspense>
  );
}

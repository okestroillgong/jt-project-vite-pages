

import { useState, useCallback, useMemo } from "react";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import type { FilterLayout } from "@/components/filters/types";
import { Textarea } from "@/components/ui/textarea";

export default function CounselingRegistrationPopup() {
  const [filters, setFilters] = useState<Record<string, any>>({
    callStartTime: "2025-12-17 15:45:43",
    contactTarget: "self",
    contactType: "not_entered",
    guidanceType: "dunning",
    customerInvolvement: "Y",
    leakage: "Y",
    compensation: "N",
    callResult: { select1: "", select2: "" },
    taskClassification: { select1: "", select2: "" },
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);
  
  const handleRegister = () => {
    console.log("Registering counseling session:", filters);
    alert("상담내역이 등록되었습니다.");
  };

  const handleClose = () => {
    window.close();
  };

  const popupActions: PopupAction[] = [
    { id: "register", text: "등록", onClick: handleRegister },
    { id: "close", text: "닫기", onClick: handleClose },
  ];
  
  const mainInfoLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "callStartTime", type: "text", label: "통화시작일시", readonly: true },
        { name: "residentNumber", type: "text", label: "주민번호" },
        { name: "customerName", type: "text", label: "고객명" },

        { 
          name: "contactTarget", 
          type: "select", 
          label: "컨택대상", 
          options: [{ value: "self", label: "본인" }, { value: "other", label: "기타" }] 
        },
        { 
          name: "callResult", 
          type: "double-select", 
          label: "통화결과", 
          options1: [{ value: "call_success", label: "통화성공" }, { value: "call_fail", label: "부재" }],
          options2: [{ value: "sub_1", label: "상세1" }, { value: "sub_2", label: "상세2" }]
        },
        { name: "phoneNumber", type: "text", label: "전화번호" },

        { 
          name: "contactType", 
          type: "select", 
          label: "연락처유형", 
          options: [{ value: "not_entered", label: "미입력" }, { value: "mobile", label: "휴대폰" }] 
        },
        { 
          name: "taskClassification", 
          type: "double-select", 
          label: "업무구분",
          options1: [{ value: "inquiry", label: "문의" }, { value: "complaint", label: "불만" }],
          options2: [{ value: "sub_A", label: "상세A" }, { value: "sub_B", label: "상세B" }]
        },
        { 
          name: "guidanceType", 
          type: "select", 
          label: "안내유형", 
          options: [{ value: "dunning", label: "독촉" }, { value: "info", label: "안내" }] 
        },
      ],
    },
  ], []);
  
  const promiseLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "promiseDate", type: "date", label: "약속일자" },
        { name: "promiseAmount", type: "number", label: "약속금액" },
        { name: "importantMemo", type: "checkbox", label: "중요메모체크" },
      ]
    },
  ], []);

  const memoLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 1,
              filters: [
                  { 
                      name: "memo", 
                      type: "textarea", 
                      placeholder: "메모를 입력하세요...",
                  },
              ]    }
  ], []);

  const additionalInfoLayout: FilterLayout = useMemo(() => [
    {
        type: "grid",
        columns: 3,
        filters: [
            { 
                name: "customerInvolvement", 
                type: "radio-group", 
                label: "고객여부", 
                options: [
                    { value: "Y", label: "Y" },
                    { value: "N", label: "N" }
                ] 
            },
            { 
                name: "leakage", 
                type: "radio-group", 
                label: "유출여부", 
                options: [
                    { value: "Y", label: "Y" },
                    { value: "N", label: "N" }
                ] 
            },
            { 
                name: "compensation", 
                type: "radio-group", 
                label: "보상여부", 
                options: [
                    { value: "Y", label: "Y" },
                    { value: "N", label: "N" }
                ] 
            },
        ]
    }
  ], []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h1 className="text-xl font-bold">상담등록</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">상담내역</h3>
            <div className="flex flex-col gap-3">
                <FilterContainer
                    filterLayout={mainInfoLayout}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <FilterContainer
                    filterLayout={promiseLayout}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">메모</h3>
                    <FilterContainer
                        filterLayout={memoLayout}
                        values={filters}
                        onChange={handleFilterChange}
                    />
                </div>           
            </div>
        </div>
        
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold">개인정보민원 추가정보</h3>
            <FilterContainer
                filterLayout={additionalInfoLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>
      </div>
    </div>
  );
}



import { useState, Suspense, useCallback } from "react";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { Button } from "@/components/ui/button";

function SendDmPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({
    inquiryType: "paid",
    repaymentType: { select: "term", input: "" },
    baseDate: new Date().toISOString(),
    calculationDate: new Date().toISOString(),
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "accountNumber", type: "text", label: "계좌번호" },
        { name: "customerNumber", type: "text", label: "고객번호" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { 
            name: "inquiryType", 
            type: "select", 
            label: "조회구분",
            options: [
                { value: "paid", label: "완제" },
                { value: "partial", label: "일부상환" },
            ]
        },
        { name: "repaymentAmount", type: "text", label: "상환금액" }, // text or number
        { 
            name: "repaymentType", 
            type: "select-search", 
            label: "상환구분",
            options: [
                { value: "term", label: "기간", subValue: "" }, // Example subValue
                { value: "type2", label: "유형2", subValue: "T02" },
            ]
        },
      ],
    },
    {
        type: "grid",
        columns: 3,
        filters: [
            { name: "managementNumber", type: "text", label: "관리번호" },
            { name: "baseDate", type: "date", label: "기준일자", popoverSide: "top" },
            { name: "calculationDate", type: "date", label: "기산일자", popoverSide: "top" },
        ]
    }
  ];

  const outputButtons = [
    "기한의 이익상실 예정 통지서", "기한의 이익상실 통지서", "고객 상담 내역서",
    "납입증명서", "대출안내문", "대출금 만기도래 안내",
    "대출금 상환 최고장", "독촉장", "방문부재 통보서",
    "방문독촉 예정 통지서", "법적절차착수 예정 통지서", "부채증명서",
    "신용관리대상 등록 예정 통보서", "신용관리대상 등록 통보서", "안내장",
    "완납증명서", "위임장", "청구서",
    "채무조정(인수) 계약서", "채무조정계약 통지서", "채무조정계약 확인서",
    "대출금 만기 안내(3사채권)", "연체 정보 등록 예정 통보서", "독촉장(개인회생)",
    "독촉장(채무조정지원제도 안내)", "채권 채무 조회서", "환급안내장",
    "기한의 이익상실 예정 통지서(추가약정)", "주택경매예정통지서", "장기채권 독촉장"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">DM발송</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Filters Section */}
        <div>
            <FilterContainer
                filterLayout={filterLayout}
                values={filters}
                onChange={handleFilterChange}
            />
        </div>

        {/* Output Buttons Section */}
        <div>
            <h3 className="font-semibold mb-2">출력버튼</h3>
            <div className="grid grid-cols-3 gap-2">
                {outputButtons.map((btnLabel, index) => (
                    <Button 
                        key={index} 
                        variant="secondary" 
                        className="h-[35px] cursor-pointer rounded-2xl w-full"
                    >
                        {btnLabel}
                    </Button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default function SendDmPopupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SendDmPopupContent />
        </Suspense>
    )
}

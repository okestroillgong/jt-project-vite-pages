

import { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";

// --- Data Structures for Checkbox Matrix ---
const codeCategories = [
  { title: "고객", items: ["약속파기", "계약서미비", "연락처 無", "휴대폰 명의 변경", "착신정지", "채무부존재", "민원주의(대외민원)", "약속", "상환불능", "구치소수감", "3자 동의", "변제 순서 변경", "변제 순서 재변경"] },
  { title: "심사", items: ["예외) 대부업 채무건수 과다", "감액승인", "정밀승인", "타행대환 조건(증명서첨부)", "fb 관리부서 정밀심사건", "사기의심 판단", "APP즉시대출 금지", "재대출,추가대출 금지", "상위결재자 관리지시", "고객희망감액", "금리인하-고객요구", "금리인하-중도방어", "익일 재승인건"] },
  { title: "금지", items: ["DM 금지", "전화금지", "자택전화금지", "회사전화금지", "E-mail 금지", "특수민원", "성향불량", "SMS금지", "방문금지", "사전안내 금지"] },
  { title: "채무조정", items: ["프리워크아웃 신청", "프리워크아웃 실효", "개인회생 중지", "원금감면일시 상환", "원금감면분할 상환", "원금감면분할 상환 실", "원금감면분할 상환 품", "추심연락유예", "추심연락제한신청", "당행대환접수", "당행대환완료", "당행대환거부"] },
  { title: "법조치", items: ["압류및추심/종결", "경매/진행", "경매/결정", "경매/종결", "공매/진행", "공매/결정", "공매/종결", "명의대여", "사기", "형사상개입", "사적개입", "공적개입"] },
  { title: "PR", items: ["PR가능", "마케팅동의서 無", "소득증빙 불가", "대출금지", "채무과다"] },
  { title: "제증명서", items: ["부채잔액증명서(개인회생)", "부채잔액증명서(신용회복)", "부채잔액증명서(파산/면책)", "대출완납증명서"] },
  { title: "기타", items: ["국민행복기금금지", "국민행복기금접수", "타사법적조치", "당사법적조치", "생활보호", "대위변제(완납)", "대위변제(진행)", "채무부인", "JTSB매각대상", "JTSB양도보류동의", "JTSB주소보정완료", "새출발기금"] },
  { title: "취급제한", items: ["매각", "상각", "비적격", "외부채무조정", "명의", "소송", "기타"] },
];

type ManagementCodeData = {
    customer: string;
    review: string;
    ban: string;
    debtAdjustment: string;
    legalAction: string;
    pr: string;
    certificate: string;
    etc: string;
    restriction: string;
}

// Mock data
const mockManagementCodeData: ManagementCodeData[] = [{
    customer: "약속파기",
    review: "감액승인",
    ban: "DM 금지",
    debtAdjustment: "개인회생 인가, 파산/면책 취소",
    legalAction: "압류및추심/종결",
    pr: "PR가능",
    certificate: "부채잔액증명서(개인회생)",
    etc: "국민행복기금금지",
    restriction: "매각",
}];

// Columns
const managementCodeColumns: ColumnDef<ManagementCodeData>[] = [
    { accessorKey: "customer", header: "고객" },
    { accessorKey: "review", header: "심사" },
    { accessorKey: "ban", header: "금지" },
    { accessorKey: "debtAdjustment", header: "채무조정" },
    { accessorKey: "legalAction", header: "법조치" },
    { accessorKey: "pr", header: "PR" },
    { accessorKey: "certificate", header: "제증명서" },
    { accessorKey: "etc", header: "기타" },
    { accessorKey: "restriction", header: "취급제한" },
];

// Data type for the history table
type HistoryData = {
  id: number;
  status: string;
  category: string;
  detail: string;
  registrationReason: string;
  registrant: string;
  registrationDateTime: string;
  deregistrationReason: string;
  deregistrant: string;
  deregistrationDateTime: string;
};


export default function CustomerManagementCodePopup() {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [filters, setFilters] = useState<Record<string, any>>({
        registrationReason: "",
        deregistrationReason: "",
    });

    const handleFilterChange = useCallback((name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const registrationReasonLayout: FilterLayout = useMemo(() => [
        {
            type: "grid",
            columns: 1,
            filters: [
                { name: "registrationReason", type: "text", label: "등록사유 및 근거", placeholder: "등록 사유 및 근거를 입력하세요." },
                { name: "deregistrationReason", type: "text", label: "해지사유 및 근거", placeholder: "해지 사유 및 근거를 입력하세요." },
            ],
        },
    ], []);

    // Mock data for the history table
    const mockHistoryData: HistoryData[] = useMemo(() => [
        { id: 3, status: "등록", category: "채무조정코드", detail: "개인회생 인가", registrationReason: "제주지방법원 2013개회10998 인가", registrant: "등록자A", registrationDateTime: "2025-11-06 18:42", deregistrationReason: "", deregistrant: "", deregistrationDateTime: "" },
        { id: 2, status: "등록", category: "채무조정코드", detail: "파산/면책 취소", registrationReason: "서울회생법원 하단 : 하단 하단 : 20251105 기각", registrant: "등록자B", registrationDateTime: "2025-11-05 13:47", deregistrationReason: "서울회생법원 하단 : 하단 하단 : 20251105 기각", deregistrant: "해제자A", deregistrationDateTime: "2025-11-05 13:47:21" },
        { id: 1, status: "해제", category: "채무조정코드", detail: "파산면책 접수", registrationReason: "서울회생법원 하단 : 하단 하단 : 20251105 접수", registrant: "등록자C", registrationDateTime: "2025-11-05 13:42", deregistrationReason: "", deregistrant: "", deregistrationDateTime: "" },
    ], []);

    // History table columns
    const historyColumns: ColumnDef<HistoryData>[] = useMemo(() => [
        { accessorKey: "id", header: "순번" },
        { accessorKey: "status", header: "상태" },
        { accessorKey: "category", header: "구분" },
        { accessorKey: "detail", header: "세부사항" },
        { accessorKey: "registrationReason", header: "등록사유" },
        { accessorKey: "registrant", header: "등록처리자" },
        { accessorKey: "registrationDateTime", header: "등록일시" },
        { accessorKey: "deregistrationReason", header: "해제사유" },
        { accessorKey: "deregistrant", header: "해제처리자" },
        { accessorKey: "deregistrationDateTime", header: "해제일시" },
    ], []);

    const handleCheckboxChange = (item: string) => {
        setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
    };

    const handleSelectAllInCategory = (categoryTitle: string, checked: boolean) => {
        const category = codeCategories.find(c => c.title === categoryTitle);
        if (!category) return;

        const newCheckedItems = { ...checkedItems };
        category.items.forEach(item => {
            newCheckedItems[item] = checked;
        });
        setCheckedItems(newCheckedItems);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-sm">
            <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
                <h1 className="text-xl font-bold">고객관리코드</h1>
                <PopupRightActions actions={[{ id: "close", text: "닫기", onClick: () => window.close() }]} />
            </div>

            <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                
                {/* Top Table Section */}
                <div>
                    <DataTable 
                        title="고객관리코드"
                        columns={managementCodeColumns}
                        data={mockManagementCodeData}
                        hidePagination
                    />
                </div>

                {/* Checkbox Matrix Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <h3 className="font-semibold">고객관리코드</h3>
                        <div className="flex items-center gap-2">
                        <Button variant="secondary" className="h-[35px] w-24 cursor-pointer rounded-2xl">등록해지</Button>
                        <Button variant="secondary" className="h-[35px] w-24 cursor-pointer rounded-2xl">저장</Button>
                        </div>
                    </div>
                    <div className="border rounded-md bg-white">
                        {/* Header Row */}
                        <div className="flex bg-gray-100 border-b">
                            {codeCategories.map(cat => {
                                const allInCategoryChecked = cat.items.every(item => !!checkedItems[item]);
                                const someInCategoryChecked = cat.items.some(item => !!checkedItems[item]);

                                return (
                                    <div key={cat.title} className="flex-1 p-2 text-left font-bold border-r last:border-r-0 flex items-center gap-2">
                                        <Checkbox
                                            id={`select-all-${cat.title}`}
                                            checked={allInCategoryChecked}
                                            onCheckedChange={(checked) => handleSelectAllInCategory(cat.title, !!checked)}
                                        />
                                        <Label htmlFor={`select-all-${cat.title}`} className="cursor-pointer">{cat.title}</Label>
                                    </div>
                                )
                            })}
                        </div>
                        {/* Checkbox List Area */}
                        <div className="flex h-64">
                            {codeCategories.map(cat => (
                                <div key={cat.title} className="flex-1 p-2 border-r last:border-r-0 overflow-y-auto custom-scrollbar">
                                    <ul className="flex flex-col gap-2">
                                        {cat.items.map(item => (
                                            <li key={item} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`${cat.title}-${item}`}
                                                    checked={!!checkedItems[item]}
                                                    onCheckedChange={() => handleCheckboxChange(item)}
                                                />
                                                <Label htmlFor={`${cat.title}-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reason Input Section */}
                <div className="flex flex-col gap-4">
                    <FilterContainer
                        filterLayout={registrationReasonLayout}
                        values={filters}
                        onChange={handleFilterChange}
                    />
                </div>

                {/* History Table Section */}
                <div className="flex-grow">
                    <DataTable 
                        title="고객관리코드 이력"
                        columns={historyColumns} 
                        data={mockHistoryData}
                    />
                </div>
            </div>
        </div>
    );
}

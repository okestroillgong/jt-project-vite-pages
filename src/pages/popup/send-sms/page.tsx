

import { useState, Suspense, useCallback } from "react";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Type definitions
type SmsTemplate = {
  id: number;
  code: string;
  name: string;
  content: string;
  value: string;
};

// Mock Data
const mockTemplates: SmsTemplate[] = [
  { id: 1, code: "SMS001", name: "채무조정안내", content: "고객님의 채무조정이 승인되었습니다.", value: "내용값1" },
  { id: 2, code: "SMS002", name: "상환예정안내", content: "금월 상환 예정일은 25일입니다.", value: "내용값2" },
  { id: 3, code: "SMS003", name: "미납안내", content: "현재 미납된 금액이 있습니다.", value: "내용값3" },
  { id: 4, code: "SMS004", name: "서류제출요청", content: "필요 서류를 제출해주시기 바랍니다.", value: "내용값4" },
  { id: 5, code: "SMS005", name: "완납안내", content: "대출금이 전액 상환되었습니다.", value: "내용값5" },
];

const columns: ColumnDef<SmsTemplate>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "code", header: "코드" },
  { accessorKey: "name", header: "메시지명" },
  { accessorKey: "content", header: "알림톡/SMS메시지내용" },
  { accessorKey: "value", header: "내용값" },
];

function SendSmsPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const popupActions: PopupAction[] = [
    { id: "confirm", text: "확인" },
    { id: "reset", text: "초기화", onClick: () => window.location.reload() },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const filterLayout: FilterLayout = [
    {
        type: "grid",
        columns: 2,
        filters: [
            { name: "receiverName", type: "text", label: "수신자명" },
            { name: "senderName", type: "text", label: "발신자명" },
            { name: "receiverNumber", type: "phone-number", label: "수신번호" },
            { name: "senderNumber", type: "phone-number", label: "발신번호" },
            { 
                name: "template", 
                type: "long-search", 
                label: "템플릿", 
                onButtonClick: () => console.log("Template search clicked") 
            },
            { name: "rejectMsg", type: "checkbox", label: "수신거부문자 포함" }
        ]
    },
    [
        {
            name: "messageContent",
            type: "custom",
            className: "w-full",
            render: () => <Textarea className="h-40 bg-white resize-none w-full" placeholder="내용을 입력하세요" />
        }
    ],
    {
        type: "grid",
        columns: 2,
        filters: [
            {
                name: "noticeType",
                type: "select",
                label: "안내유형",
                options: [
                    { value: "dokchok", label: "독촉" },
                    { value: "info", label: "안내" }
                ]
            },
            {
                name: "sendReason",
                type: "select",
                label: "발송사유",
                options: [
                    { value: "select", label: "선택" },
                    { value: "reason1", label: "사유1" }
                ]
            },
            { name: "reserveDate", type: "date", label: "예약일시", popoverSide: "top" },
            {
                name: "reserveOption",
                type: "custom",
                render: () => (
                     <div className="flex items-center gap-2 w-full">
                        <Input className="h-9 bg-white w-32" disabled />
                        <div className="flex items-center gap-1 ml-2">
                            <Checkbox id="reserve" className="bg-white" />
                            <Label htmlFor="reserve" className="text-gray-600 cursor-pointer font-normal whitespace-nowrap">예약</Label>
                        </div>
                    </div>
                )
            }
        ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">알림톡/SMS</h2>
        <PopupRightActions actions={popupActions} />
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {/* Instruction */}
        <div className="shrink-0">
            <p className="text-sm text-gray-600">템플릿 선택 후 확인 누르면 알림톡/SMS가 완성됩니다</p>
        </div>

        {/* Main Content Split */}
        <div className="flex gap-4 h-[400px] shrink-0">
            {/* Left Column: Preview & Actions */}
            <div className="w-[300px] flex flex-col gap-2">
            {/* 통합된 입력 영역 */}
            <div className="flex-1 flex flex-col border rounded-md bg-white overflow-hidden">
                <Textarea 
                    className="flex-1 w-full resize-none border-none focus-visible:ring-0 text-sm p-3 bg-white" 
                    placeholder="메시지 내용이 여기에 표시됩니다."
                />
                <div className="h-10 flex items-center gap-2 px-3 border-t bg-gray-50/50">
                    <span className="text-sm text-right min-w-[40px]">0</span>
                    <span className="text-sm text-gray-500">byte</span>
                    <div className="flex-1 text-right font-bold text-sm text-gray-700">SMS</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" className="h-[35px] cursor-pointer rounded-2xl">
                    알림톡/SMS전송
                </Button>
                <Button variant="secondary" className="h-[35px] cursor-pointer rounded-2xl">
                    재입력
                </Button>
            </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 overflow-y-auto">
                <FilterContainer
                    filterLayout={filterLayout}
                    values={filters}
                    onChange={handleFilterChange}
                />
            </div>
        </div>
        
        {/* Bottom Table */}
        <div className="flex-1 overflow-auto">
            <DataTable
                columns={columns}
                data={mockTemplates}
                hidePagination
                hideToolbar
            />
        </div>
      </div>
    </div>
  );
}

export default function SendSmsPopupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SendSmsPopupContent />
        </Suspense>
    )
}

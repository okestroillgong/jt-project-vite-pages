

import { usePathname, useSearchParams } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect, useState } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages, postPopupMessage } from "@/lib/popup-bus";
import { Button } from "@/components/ui/button";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SimplifiedTable } from "./_components/AdjustmentDetailTable";

// --- Types ---
type DebtAdjustmentData = {
  id: number;
  sequence: number;
  applicationType: string;
  progressStatus: string;
  accountNo: string;
  loanName: string;
  completionDate: string;
};

// --- Mock Data ---
const mockData: DebtAdjustmentData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  sequence: i + 1,
  applicationType: i % 2 === 0 ? "개인회생" : "신용회복",
  progressStatus: "접수",
  accountNo: `123-456-7890${i}`,
  loanName: "일반자금대출",
  completionDate: "2024-01-01",
}));

export default function DebtAdjustmentManagementPopup() {
  const tabId = usePathname(); // Using pathname as a pseudo-ID for this popup instance context
  const searchParams = useSearchParams();
  const openerTabId = searchParams.get("openerTabId");

  // State
  const [tableData, setTableData] = useState<DebtAdjustmentData[]>(mockData);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<DebtAdjustmentData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return newSet;
    });
  }, []);

  const toggleAll = useCallback((checked: boolean) => {
    if (checked) {
        setSelectedIds(new Set(tableData.map(d => d.id)));
    } else {
        setSelectedIds(new Set());
    }
  }, [tableData]);

  // Filter Values
  const [formValues, setFormValues] = useState<Record<string, any>>({
    // 변제계획 필드
    repaymentGraceYn: "N",
    gracePeriodMonths: "0",
    graceInterest: "",
    repaymentPeriodStart: "",
    repaymentPeriodEnd: "",
    repaymentPeriodMonths: "0",
    monthlyPaymentDay: "",
    gracePeriodEndDate: "",
    repaymentMethod: "principal",
    repaymentMethodOtherEnabled: false,
    repaymentMethodOther: "",
    paymentStartDate: "",
    monthlyPaymentAmount: "",
  });

  const handleFilterChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // --- Columns ---
  const columns: ColumnDef<DebtAdjustmentData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={tableData.length > 0 && selectedIds.size === tableData.length}
          onCheckedChange={(value) => toggleAll(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.has(row.original.id)}
          onCheckedChange={() => toggleSelection(row.original.id)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()} // Prevent row click
        />
      ),
    },
    { accessorKey: "sequence", header: "순번" },
    { accessorKey: "applicationType", header: "신청구분" },
    { accessorKey: "progressStatus", header: "진행상태" },
    { accessorKey: "accountNo", header: "계좌번호" },
    { accessorKey: "loanName", header: "대출명" },
    { accessorKey: "completionDate", header: "채무조정완료일자" },
  ];

  // --- Layouts ---
  const formLayout1: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "progressStatus", type: "select", label: "진행상태", options: [{ value: "receipt", label: "접수" }] },
        { name: "accountNo", type: "text", label: "계좌번호", readonly: true },
        { name: "loanName", type: "text", label: "대출명", readonly: true },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "loanAmount", type: "number", label: "대출금액" },
        { name: "completionDate", type: "date", label: "채무조정완료일자", readonly: true },
        { name: "applicationType", type: "select", label: "신청구분", options: [] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "address", type: "text", label: "거주지 주소", colSpan: 2, readonly: true },
        { name: "virtualAccount", type: "text", label: "가상계좌", readonly: true },
      ],
    },
  ];

  const formLayout2: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "internalAdjustmentType", type: "select", label: "자체채무조정구분", options: [] },
        { name: "requestReason", type: "select-with-input", label: "채무조정 요청사유", options: [], colSpan: 2 }, 
      ],
    },

    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "baseDate", type: "date", label: "기준일" },
        { name: "completionDate2", type: "date", label: "채무조정완료일자" }, // Duplicate label name, using different key
        { name: "agreementCancellationDate", type: "date", label: "합의해제일자" },
      ],
    },
  ];

  const detailFormLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "defermentPrincipal", type: "checkbox", label: "상환유예(원금)" },
        { name: "defermentPrincipalInterest", type: "checkbox", label: "상환유예(원리금)" },
        { name: "reductionPrincipalLump", type: "checkbox", label: "원금 감면(일시납)" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "reductionPrincipalInstallment", type: "checkbox", label: "원금 감면(분납)" },
        { name: "reductionInterest", type: "checkbox", label: "이자 감면(이자)" },
        { name: "reductionOverdue", type: "checkbox", label: "이자 감면(연체이자)" },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "maturityExtension", type: "checkbox", label: "만기연장" },
        { name: "others", type: "input-button", label: "기타", activator: true, buttonText: "", onButtonClick: () => {} }, // Using input-button as placeholder for Checkbox+Input
        // Note: FilterWrapper "input-button" is basically Input + Button. 
        // For "Checkbox + Input", "FilterInput" with activator is the correct one.
        // Let's swap to FilterInput with activator.
      ],
    },
  ];
  
  // Fix the last row of detailFormLayout
  const detailFormLayoutCorrected: FilterLayout = [
      ...detailFormLayout.slice(0, 2),
      {
        type: "grid",
        columns: 2, // 3 items in row 1, 2, but row 3 has 2 items?
        // "Maturity Extension" and "Others".
        filters: [
          { name: "maturityExtension", type: "checkbox", label: "만기연장" },
          { name: "others", type: "text", label: "기타", activator: true }, // activator provides the checkbox
        ]
      }
  ];

  // 변제계획 - 왼쪽 컬럼
  const repaymentPlanLeftLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "repaymentGraceYn",
          type: "select",
          label: "상환 유예",
          options: [
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ],
        },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "gracePeriodMonths", type: "text", label: "유예기간 (개월)" },
        { name: "graceInterest", type: "text", label: "유예이자 (월)" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "repaymentPeriod", type: "date-range", label: "상환기간" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "monthlyPaymentDay", type: "text", label: "매월 납입일 (일)" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "gracePeriodEndDate", type: "text", label: "거치기간종료일" },
      ],
    },
  ];

  // 변제계획 - 오른쪽 컬럼
  const repaymentPlanRightLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "repaymentMethod",
          type: "select",
          label: "상환방법",
          options: [
            { value: "principal", label: "원금" },
            { value: "equal", label: "원리금균등" },
            { value: "maturity", label: "만기일시" },
          ],
        },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "repaymentMethodOther", type: "text", label: "기타", activator: true },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "paymentStartDate", type: "date", label: "납입 시작일" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "monthlyPaymentAmount", type: "text", label: "월납입액" },
      ],
    },
  ];

  const handleRowClick = (row: DebtAdjustmentData) => {
    setSelectedRowId(row.id);
    setSelectedRowData(row);
    
    // Fill form with mock data based on row
    setFormValues({
        progressStatus: "receipt",
        accountNo: row.accountNo,
        loanName: row.loanName,
        completionDate: row.completionDate,
        applicationType: row.applicationType === "개인회생" ? "1" : "2",
        address: "서울시 강남구 테헤란로 123",
        virtualAccount: "999-999-999999",
        baseDate: "2024-01-01",
    });
  };

  const popupActions: PopupAction[] = [
    { id: "add", text: "행추가" }, // Need to ensure 'add' is a valid ID or mapped
    { id: "delete", text: "행삭제" },
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
        {/* 1. Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
            <h1 className="text-xl font-bold">채무조정관리</h1>
            <PopupRightActions actions={popupActions} />
        </div>

        <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
            {/* 2. Master Table */}
            <div className="h-auto">
                <DataTable
                    title="채무조정내역"
                    columns={columns}
                    data={tableData}
                    onRowClick={handleRowClick}
                />
            </div>

            {/* 3. Middle Actions */}
            <div className="flex justify-end gap-2">
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                >
                    알림톡/SMS
                </Button>
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                >
                    저장
                </Button>
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                    onClick={() => {
                        const popupWidth = 1600;
                        const popupHeight = 800;
                        window.open(
                            `/popup/debt-adjustment-e-signature?openerTabId=${openerTabId}`,
                            'DebtAdjustmentESignature',
                            `width=${popupWidth},height=${popupHeight}`
                        );
                    }}
                >
                    전자서명내역
                </Button>
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                    onClick={() => {
                        const popupWidth = 1600;
                        const popupHeight = 800;
                        window.open(
                            `/popup/abstract-and-payment?openerTabId=${openerTabId}`,
                            'AbstractAndPaymentPopup',
                            `width=${popupWidth},height=${popupHeight}`
                        );
                    }}
                >
                    초본 및 납부
                </Button>
            </div>

            {/* 4. First Filter Layout */}
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-base">채무조정</h3>
                
                {/* Rows 1-3 */}
                <FilterContainer 
                    filterLayout={formLayout1}
                    values={formValues}
                    onChange={handleFilterChange}
                />

                {/* Row 4: Simplified Table */}
                <div className="py-2">
                    <SimplifiedTable />
                </div>

                {/* Rows 5-6 */}
                <FilterContainer 
                    filterLayout={formLayout2}
                    values={formValues}
                    onChange={handleFilterChange}
                />
            </div>

            {/* 5. Second Filter Layout */}
            <div className="flex flex-col gap-2">
                 <h3 className="font-semibold text-base">채무조정 사항</h3>
                 <FilterContainer
                    filterLayout={detailFormLayoutCorrected}
                    values={formValues}
                    onChange={handleFilterChange}
                />
            </div>

            {/* 6. 변제계획 Layout */}
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-base">변제계획</h3>
                <div className="bg-white rounded-lg">
                    <table className="w-full border-collapse">
                        <tbody>
                            {/* Row 1: 상환 유예 & 상환방법 */}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm w-32 align-middle">
                                    상환 유예
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    {
                                                        name: "repaymentGraceYn",
                                                        type: "select",
                                                        label: "(Y/N)",
                                                        options: [
                                                            { value: "Y", label: "Y" },
                                                            { value: "N", label: "N" },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: "grid",
                                                columns: 2,
                                                filters: [
                                                    { name: "gracePeriodMonths", type: "text", label: "유예기간 (개월)" },
                                                    { name: "graceInterest", type: "text", label: "유예이자 (월)" },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm w-32 align-middle">
                                    상환방법
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    {
                                                        name: "repaymentMethod",
                                                        type: "select",
                                                        label: "",
                                                        options: [
                                                            { value: "principal", label: "원금" },
                                                            { value: "equal", label: "원리금균등" },
                                                            { value: "maturity", label: "만기일시" },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "repaymentMethodOther", type: "text", label: "기타", activator: true },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                            </tr>
                            {/* Row 2: 상환기간 & 납입 시작일 */}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    상환기간
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "repaymentPeriod", type: "date-range", label: "" },
                                                ],
                                            },
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "repaymentPeriodMonths", type: "text", label: "개월" },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    납입 시작일
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "paymentStartDate", type: "date", label: "" },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                            </tr>
                            {/* Row 3: 매월 납입일 & 월납입액 */}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    매월 납입일
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "monthlyPaymentDay", type: "text", label: "일" },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    월납입액
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "monthlyPaymentAmount", type: "text", label: "" },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                            </tr>
                            {/* Row 4: 거치기간종료일 */}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    거치기간종료일
                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle" colSpan={3}>
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "gracePeriodEndDate", type: "text", label: "" },
                                                ],
                                            },
                                        ]}
                                        values={formValues}
                                        onChange={handleFilterChange}
                                        labelAlign="left"
                                        noBorder={true}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
}



import { usePathname, useSearchParams } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect, useState } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages, postPopupMessage } from "@/lib${import.meta.env.BASE_URL}popup-bus";
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
  applicationType: i % 2 === 0 ? "媛쒖씤?뚯깮" : "?좎슜?뚮났",
  progressStatus: "?묒닔",
  accountNo: `123-456-7890${i}`,
  loanName: "?쇰컲?먭툑?異?,
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
    // 蹂?쒓퀎???꾨뱶
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
    { accessorKey: "sequence", header: "?쒕쾲" },
    { accessorKey: "applicationType", header: "?좎껌援щ텇" },
    { accessorKey: "progressStatus", header: "吏꾪뻾?곹깭" },
    { accessorKey: "accountNo", header: "怨꾩쥖踰덊샇" },
    { accessorKey: "loanName", header: "?異쒕챸" },
    { accessorKey: "completionDate", header: "梨꾨Т議곗젙?꾨즺?쇱옄" },
  ];

  // --- Layouts ---
  const formLayout1: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "progressStatus", type: "select", label: "吏꾪뻾?곹깭", options: [{ value: "receipt", label: "?묒닔" }] },
        { name: "accountNo", type: "text", label: "怨꾩쥖踰덊샇", readonly: true },
        { name: "loanName", type: "text", label: "?異쒕챸", readonly: true },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "loanAmount", type: "number", label: "?異쒓툑?? },
        { name: "completionDate", type: "date", label: "梨꾨Т議곗젙?꾨즺?쇱옄", readonly: true },
        { name: "applicationType", type: "select", label: "?좎껌援щ텇", options: [] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "address", type: "text", label: "嫄곗＜吏 二쇱냼", colSpan: 2, readonly: true },
        { name: "virtualAccount", type: "text", label: "媛?곴퀎醫?, readonly: true },
      ],
    },
  ];

  const formLayout2: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "internalAdjustmentType", type: "select", label: "?먯껜梨꾨Т議곗젙援щ텇", options: [] },
        { name: "requestReason", type: "select-with-input", label: "梨꾨Т議곗젙 ?붿껌?ъ쑀", options: [], colSpan: 2 }, 
      ],
    },

    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "baseDate", type: "date", label: "湲곗??? },
        { name: "completionDate2", type: "date", label: "梨꾨Т議곗젙?꾨즺?쇱옄" }, // Duplicate label name, using different key
        { name: "agreementCancellationDate", type: "date", label: "?⑹쓽?댁젣?쇱옄" },
      ],
    },
  ];

  const detailFormLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "defermentPrincipal", type: "checkbox", label: "?곹솚?좎삁(?먭툑)" },
        { name: "defermentPrincipalInterest", type: "checkbox", label: "?곹솚?좎삁(?먮━湲?" },
        { name: "reductionPrincipalLump", type: "checkbox", label: "?먭툑 媛먮㈃(?쇱떆??" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "reductionPrincipalInstallment", type: "checkbox", label: "?먭툑 媛먮㈃(遺꾨궔)" },
        { name: "reductionInterest", type: "checkbox", label: "?댁옄 媛먮㈃(?댁옄)" },
        { name: "reductionOverdue", type: "checkbox", label: "?댁옄 媛먮㈃(?곗껜?댁옄)" },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "maturityExtension", type: "checkbox", label: "留뚭린?곗옣" },
        { name: "others", type: "input-button", label: "湲고?", activator: true, buttonText: "", onButtonClick: () => {} }, // Using input-button as placeholder for Checkbox+Input
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
          { name: "maturityExtension", type: "checkbox", label: "留뚭린?곗옣" },
          { name: "others", type: "text", label: "湲고?", activator: true }, // activator provides the checkbox
        ]
      }
  ];

  // 蹂?쒓퀎??- ?쇱そ 而щ읆
  const repaymentPlanLeftLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "repaymentGraceYn",
          type: "select",
          label: "?곹솚 ?좎삁",
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
        { name: "gracePeriodMonths", type: "text", label: "?좎삁湲곌컙 (媛쒖썡)" },
        { name: "graceInterest", type: "text", label: "?좎삁?댁옄 (??" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "repaymentPeriod", type: "date-range", label: "?곹솚湲곌컙" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "monthlyPaymentDay", type: "text", label: "留ㅼ썡 ?⑹엯??(??" },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "gracePeriodEndDate", type: "text", label: "嫄곗튂湲곌컙醫낅즺?? },
      ],
    },
  ];

  // 蹂?쒓퀎??- ?ㅻⅨ履?而щ읆
  const repaymentPlanRightLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "repaymentMethod",
          type: "select",
          label: "?곹솚諛⑸쾿",
          options: [
            { value: "principal", label: "?먭툑" },
            { value: "equal", label: "?먮━湲덇퇏?? },
            { value: "maturity", label: "留뚭린?쇱떆" },
          ],
        },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "repaymentMethodOther", type: "text", label: "湲고?", activator: true },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "paymentStartDate", type: "date", label: "?⑹엯 ?쒖옉?? },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "monthlyPaymentAmount", type: "text", label: "?붾궔?낆븸" },
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
        applicationType: row.applicationType === "媛쒖씤?뚯깮" ? "1" : "2",
        address: "?쒖슱??媛뺣궓援??뚰뿤?濡?123",
        virtualAccount: "999-999-999999",
        baseDate: "2024-01-01",
    });
  };

  const popupActions: PopupAction[] = [
    { id: "add", text: "?됱텛媛" }, // Need to ensure 'add' is a valid ID or mapped
    { id: "delete", text: "?됱궘?? },
    { id: "close", text: "?リ린", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
        {/* 1. Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
            <h1 className="text-xl font-bold">梨꾨Т議곗젙愿由?/h1>
            <PopupRightActions actions={popupActions} />
        </div>

        <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
            {/* 2. Master Table */}
            <div className="h-auto">
                <DataTable
                    title="梨꾨Т議곗젙?댁뿭"
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
                    ?뚮┝??SMS
                </Button>
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                >
                    ???                </Button>
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                    onClick={() => {
                        const popupWidth = 1600;
                        const popupHeight = 800;
                        window.open(
                            `${import.meta.env.BASE_URL}popup/debt-adjustment-e-signature?openerTabId=${openerTabId}`,
                            'DebtAdjustmentESignature',
                            `width=${popupWidth},height=${popupHeight}`
                        );
                    }}
                >
                    ?꾩옄?쒕챸?댁뿭
                </Button>
                <Button
                    variant="secondary"
                    className="h-[35px] w-24 cursor-pointer rounded-2xl"
                    onClick={() => {
                        const popupWidth = 1600;
                        const popupHeight = 800;
                        window.open(
                            `${import.meta.env.BASE_URL}popup/abstract-and-payment?openerTabId=${openerTabId}`,
                            'AbstractAndPaymentPopup',
                            `width=${popupWidth},height=${popupHeight}`
                        );
                    }}
                >
                    珥덈낯 諛??⑸?
                </Button>
            </div>

            {/* 4. First Filter Layout */}
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-base">梨꾨Т議곗젙</h3>
                
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
                 <h3 className="font-semibold text-base">梨꾨Т議곗젙 ?ы빆</h3>
                 <FilterContainer
                    filterLayout={detailFormLayoutCorrected}
                    values={formValues}
                    onChange={handleFilterChange}
                />
            </div>

            {/* 6. 蹂?쒓퀎??Layout */}
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-base">蹂?쒓퀎??/h3>
                <div className="bg-white rounded-lg">
                    <table className="w-full border-collapse">
                        <tbody>
                            {/* Row 1: ?곹솚 ?좎삁 & ?곹솚諛⑸쾿 */}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm w-32 align-middle">
                                    ?곹솚 ?좎삁
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
                                                    { name: "gracePeriodMonths", type: "text", label: "?좎삁湲곌컙 (媛쒖썡)" },
                                                    { name: "graceInterest", type: "text", label: "?좎삁?댁옄 (??" },
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
                                    ?곹솚諛⑸쾿
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
                                                            { value: "principal", label: "?먭툑" },
                                                            { value: "equal", label: "?먮━湲덇퇏?? },
                                                            { value: "maturity", label: "留뚭린?쇱떆" },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "repaymentMethodOther", type: "text", label: "湲고?", activator: true },
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
                            {/* Row 2: ?곹솚湲곌컙 & ?⑹엯 ?쒖옉??*/}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    ?곹솚湲곌컙
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
                                                    { name: "repaymentPeriodMonths", type: "text", label: "媛쒖썡" },
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
                                    ?⑹엯 ?쒖옉??                                </td>
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
                            {/* Row 3: 留ㅼ썡 ?⑹엯??& ?붾궔?낆븸 */}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    留ㅼ썡 ?⑹엯??                                </td>
                                <td className="border border-gray-300 px-3 py-2 align-middle">
                                    <FilterContainer
                                        filterLayout={[
                                            {
                                                type: "grid",
                                                columns: 1,
                                                filters: [
                                                    { name: "monthlyPaymentDay", type: "text", label: "?? },
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
                                    ?붾궔?낆븸
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
                            {/* Row 4: 嫄곗튂湲곌컙醫낅즺??*/}
                            <tr>
                                <td className="border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-sm align-middle">
                                    嫄곗튂湲곌컙醫낅즺??                                </td>
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




import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useState, useEffect } from "react";
import React from 'react';
import { usePageStore } from "@/lib/store/pageStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LeftActions, ActionType as LeftActionType } from "@/components/app/LeftActions";
import { RightActions, ActionType as RightActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// 1. Data Type Definitions

// 1.1 Integrated Excel Upload Table Data Type
type UploadData = {
  curRow: number;
  fdnCustNo: string;
  custNm: string;
  bondMgGrd: string;
};

// 1.2 Error List Table Data Type
type ErrorData = {
  curRow: number;
  prcsStts: string;
  fdnCustNo: string;
  custNm: string;
  bondMgGrd: string;
};

// 2. Mock Data (Ideally empty initially, populated after upload)
const mockUploadData: UploadData[] = Array.from({ length: 5 }, (_, i) => ({
  curRow: i + 1,
  fdnCustNo: `INITIAL_CUST${100 + i}`,
  custNm: `초기고객${i + 1}`,
  bondMgGrd: `INITIAL_GRADE_${String.fromCharCode(65 + i)}`,
}));
const mockErrorData: ErrorData[] = [];

// 3. Column Definitions

// 3.1 Integrated Excel Upload Columns
const uploadColumns: ColumnDef<UploadData>[] = [
  { accessorKey: "curRow", header: "순번" },
  { accessorKey: "fdnCustNo", header: "고객번호" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "bondMgGrd", header: "코드" },
];

// 3.2 Error List Columns
const errorColumns: ColumnDef<ErrorData>[] = [
  { accessorKey: "curRow", header: "순번" },
  { accessorKey: "prcsStts", header: "처리상태" },
  { accessorKey: "fdnCustNo", header: "고객번호" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "bondMgGrd", header: "코드" },
];

export default function CreditRatingExcelUploadPage() {
  const tabId = usePathname();
  const { currentState, updateTableData } = usePageStore();

  // Initialize uploadTable with mockUploadData on component mount
  React.useEffect(() => {
    updateTableData(tabId, "uploadTable", mockUploadData);
    updateTableData(tabId, "errorTable", []); // Ensure error table is empty initially
  }, [tabId, updateTableData]);

  const handleFileUpload = () => {
    console.log("File Upload Clicked");
    // Simulate file upload and processing
    // In a real scenario, this would parse the file and update both tables based on validation results.
    
    const simulatedErrorData: ErrorData[] = Array.from({ length: 2 }, (_, i) => ({
      curRow: i + 1,
      prcsStts: "오류",
      fdnCustNo: `ERROR_CUST${300 + i}`,
      custNm: `오류고객${i + 1}`,
      bondMgGrd: "INVALID",
    }));

    updateTableData(tabId, "errorTable", simulatedErrorData);
  };

  const handleSave = () => {
    console.log("Save Clicked");
  };

  const leftActions: { id: LeftActionType; onClick?: () => void }[] = [
    { id: "category" as LeftActionType }, // The dropdown logic is handled in LeftActions component based on 'category' ID
  ];

  const rightActions: { id: RightActionType; onClick?: () => void }[] = [
    { id: "file-upload", onClick: handleFileUpload },
    { id: "save", onClick: handleSave },
  ];

  if (!currentState) return null;

  const uploadRowCount = currentState.tables?.['uploadTable']?.length || 0;
  const errorRowCount = currentState.tables?.['errorTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">채권관리등급 엑셀 업로드</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>채권관리등급 엑셀 업로드</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between min-h-[35px]">
        <LeftActions actions={leftActions} />
        <RightActions actions={rightActions} />
      </div>

      {/* Integrated Excel Upload Table */}
      <DataTable
          title="통합 엑셀 업로드"
          columns={uploadColumns}
          data={currentState.tables?.['uploadTable'] || []}
      />

      {/* Error List Table */}
      {errorRowCount > 0 && (
        <DataTable
            title="오류 리스트"
            columns={errorColumns}
            data={currentState.tables?.['errorTable'] || []}
        />
      )}
    </div>
  );
}

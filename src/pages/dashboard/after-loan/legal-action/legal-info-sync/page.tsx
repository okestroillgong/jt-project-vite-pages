

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/app/DataTable";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { RightActions } from "@/components/app/RightActions";
import { LeftActions } from "@/components/app/LeftActions";
import type { FilterLayout } from "@/components/filters/types";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages, postPopupMessage } from "@/lib/popup-bus"; // Assuming popup-bus is used for consistency

// --- Types for Data and Filters ---

// Data type for the legal information table
interface LegalInfoData {
  id: number; // 순번
  accountNumber: string; // 계좌번호
  applicantName: string; // 신청인명
  caseNumber: string; // 사건번호
  status: string; // 상태
  courtName: string; // 법원명
  receiptDate: string; // 접수일자
  startDate: string; // 개시일자
  approvalDate: string; // 인가일자
  withdrawalDate: string; // 취하일자
  customerNumber: string; // 고객번호 (for popup)
  residentNumber: string; // 주민번호 (for popup)
  legalManagementNumber: string; // 법무관리번호 (for popup)
  legalManagementClassificationCode: string; // 법무관리구분코드 (for popup)
}

// --- Mock Data (for demonstration) ---
const mockData: LegalInfoData[] = [
  {
    id: 1,
    accountNumber: "1234567890",
    applicantName: "김법무",
    caseNumber: "2023가단12345",
    status: "접수",
    courtName: "서울중앙지방법원",
    receiptDate: "2023-01-15",
    startDate: "2023-02-01",
    approvalDate: "2023-03-01",
    withdrawalDate: "",
    customerNumber: "CUST001",
    residentNumber: "800101-1234567",
    legalManagementNumber: "LGL001",
    legalManagementClassificationCode: "A",
  },
  {
    id: 2,
    accountNumber: "0987654321",
    applicantName: "이법무",
    caseNumber: "2023나23456",
    status: "진행중",
    courtName: "수원지방법원",
    receiptDate: "2023-02-20",
    startDate: "2023-03-10",
    approvalDate: "",
    withdrawalDate: "",
    customerNumber: "CUST002",
    residentNumber: "900202-2345678",
    legalManagementNumber: "LGL002",
    legalManagementClassificationCode: "B",
  },
  {
    id: 3,
    accountNumber: "1122334455",
    applicantName: "박법무",
    caseNumber: "2023다34567",
    status: "인가",
    courtName: "부산지방법원",
    receiptDate: "2023-03-01",
    startDate: "2023-04-01",
    approvalDate: "2023-05-01",
    withdrawalDate: "",
    customerNumber: "CUST003",
    residentNumber: "850303-1345678",
    legalManagementNumber: "LGL003",
    legalManagementClassificationCode: "A",
  },
  {
    id: 4,
    accountNumber: "5566778899",
    applicantName: "최법무",
    caseNumber: "2023라45678",
    status: "취하",
    courtName: "대구지방법원",
    receiptDate: "2023-04-05",
    startDate: "2023-05-01",
    approvalDate: "",
    withdrawalDate: "2023-06-01",
    customerNumber: "CUST004",
    residentNumber: "750404-1456789",
    legalManagementNumber: "LGL004",
    legalManagementClassificationCode: "C",
  },
];

// --- Column Definitions for DataTable ---
const columns: ColumnDef<LegalInfoData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "applicantName", header: "신청인명" },
  { accessorKey: "caseNumber", header: "사건번호" },
  { accessorKey: "status", header: "상태" },
  { accessorKey: "courtName", header: "법원명" },
  { accessorKey: "receiptDate", header: "접수일자" },
  { accessorKey: "startDate", header: "개시일자" },
  { accessorKey: "approvalDate", header: "인가일자" },
  { accessorKey: "withdrawalDate", header: "취하일자" },
];

export default function LegalInfoSyncPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData } = usePageStore();

  const [filters, setFilters] = useState<Record<string, any>>(currentState?.filters || {});
  const [tableData, setTableData] = useState<LegalInfoData[]>(currentState?.tables?.legalInfoTable || []);

  useEffect(() => {
    loadState(tabId);
  }, [tabId, loadState]);


  const filterLayout: FilterLayout = useMemo(() => ([
    {
      type: "grid",
      columns: 4,
      filters: [
        {
          name: "bondType",
          type: "select",
          label: "채권종류",
          options: [
            { value: "all", label: "전체" },
            { value: "general", label: "일반채권" },
            { value: "special", label: "특수채권" },
          ],
          defaultValue: "all",
        },
        {
          name: "webcashInquiry",
          type: "select",
          label: "웹캐시조회",
          options: [
            { value: "all", label: "전체" },
            { value: "yes", label: "예" },
            { value: "no", label: "아니오" },
          ],
          defaultValue: "all",
        },
        { name: "customerNumber", type: "text", label: "고객번호" },
        { name: "caseNumber", type: "text", label: "사건번호" },
      ],
    },
  ]), []);

  useEffect(() => {
    updateFilters(tabId, filters);
  }, [tabId, filters, updateFilters]);

  useEffect(() => {
    updateTableData(tabId, "legalInfoTable", tableData);
  }, [tabId, tableData, updateTableData]);

  useEffect(() => {
    const handlePopupMessage = (message: any) => {
      if (message.targetTabId !== tabId) return;
      console.log("Received message from popup:", message);
    };

    const cleanup = listenForPopupMessages(handlePopupMessage);
    return cleanup;
  }, [tabId]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    setTableData(mockData);
  };

  const handleFirstRequest = () => {
    alert("1차 요청 자료 기능 실행");
  };

  const handleSecondRequest = () => {
    alert("2차 요청 자료 기능 실행");
  };

  const handleSync = () => {
    alert("동기화 기능 실행");
  };

  const handleExcelDownload = () => {
    alert("엑셀 다운로드 기능 실행");
  };

  const handleRowDoubleClick = (row: LegalInfoData) => {
    const popupWidth = 1600;
    const popupHeight = 800;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);

    const popupUrl = `/popup/legal-management?openerTabId=${tabId}` +
                     `&customerNumber=${row.customerNumber}` +
                     `&residentNumber=${row.residentNumber}` +
                     `&legalManagementNumber=${row.legalManagementNumber}` +
                     `&legalManagementClassificationCode=${row.legalManagementClassificationCode}`;

    window.open(
      popupUrl,
      "LegalManagementPopup",
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
    );
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">법무정보 동기화</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>법적조치</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>법무정보 동기화</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <LeftActions
          actions={[
            { id: "first-request", onClick: handleFirstRequest },
            { id: "second-request", onClick: handleSecondRequest },
            { id: "sync", onClick: handleSync },
          ]}
        />
        <RightActions
          actions={[
            { id: "excel", onClick: handleExcelDownload },
            { id: "search", onClick: handleSearch },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">법무정보 동기화</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="조회 내용"
        columns={columns}
        data={tableData}
        onRowDoubleClick={handleRowDoubleClick}
      />
    </div>
  );
}



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
  id: number; // ?쒕쾲
  accountNumber: string; // 怨꾩쥖踰덊샇
  applicantName: string; // ?좎껌?몃챸
  caseNumber: string; // ?ш굔踰덊샇
  status: string; // ?곹깭
  courtName: string; // 踰뺤썝紐?  receiptDate: string; // ?묒닔?쇱옄
  startDate: string; // 媛쒖떆?쇱옄
  approvalDate: string; // ?멸??쇱옄
  withdrawalDate: string; // 痍⑦븯?쇱옄
  customerNumber: string; // 怨좉컼踰덊샇 (for popup)
  residentNumber: string; // 二쇰?踰덊샇 (for popup)
  legalManagementNumber: string; // 踰뺣Т愿由щ쾲??(for popup)
  legalManagementClassificationCode: string; // 踰뺣Т愿由ш뎄遺꾩퐫??(for popup)
}

// --- Mock Data (for demonstration) ---
const mockData: LegalInfoData[] = [
  {
    id: 1,
    accountNumber: "1234567890",
    applicantName: "源踰뺣Т",
    caseNumber: "2023媛??2345",
    status: "?묒닔",
    courtName: "?쒖슱以묒븰吏諛⑸쾿??,
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
    applicantName: "?대쾿臾?,
    caseNumber: "2023??3456",
    status: "吏꾪뻾以?,
    courtName: "?섏썝吏諛⑸쾿??,
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
    applicantName: "諛뺣쾿臾?,
    caseNumber: "2023??4567",
    status: "?멸?",
    courtName: "遺?곗?諛⑸쾿??,
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
    applicantName: "理쒕쾿臾?,
    caseNumber: "2023??5678",
    status: "痍⑦븯",
    courtName: "?援ъ?諛⑸쾿??,
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
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "applicantName", header: "?좎껌?몃챸" },
  { accessorKey: "caseNumber", header: "?ш굔踰덊샇" },
  { accessorKey: "status", header: "?곹깭" },
  { accessorKey: "courtName", header: "踰뺤썝紐? },
  { accessorKey: "receiptDate", header: "?묒닔?쇱옄" },
  { accessorKey: "startDate", header: "媛쒖떆?쇱옄" },
  { accessorKey: "approvalDate", header: "?멸??쇱옄" },
  { accessorKey: "withdrawalDate", header: "痍⑦븯?쇱옄" },
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
          label: "梨꾧텒醫낅쪟",
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "general", label: "?쇰컲梨꾧텒" },
            { value: "special", label: "?뱀닔梨꾧텒" },
          ],
          defaultValue: "all",
        },
        {
          name: "webcashInquiry",
          type: "select",
          label: "?뱀틦?쒖“??,
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "yes", label: "?? },
            { value: "no", label: "?꾨땲?? },
          ],
          defaultValue: "all",
        },
        { name: "customerNumber", type: "text", label: "怨좉컼踰덊샇" },
        { name: "caseNumber", type: "text", label: "?ш굔踰덊샇" },
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
    alert("1李??붿껌 ?먮즺 湲곕뒫 ?ㅽ뻾");
  };

  const handleSecondRequest = () => {
    alert("2李??붿껌 ?먮즺 湲곕뒫 ?ㅽ뻾");
  };

  const handleSync = () => {
    alert("?숆린??湲곕뒫 ?ㅽ뻾");
  };

  const handleExcelDownload = () => {
    alert("?묒? ?ㅼ슫濡쒕뱶 湲곕뒫 ?ㅽ뻾");
  };

  const handleRowDoubleClick = (row: LegalInfoData) => {
    const popupWidth = 1600;
    const popupHeight = 800;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);

    const popupUrl = `${import.meta.env.BASE_URL}popup/legal-management?openerTabId=${tabId}` +
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">踰뺣Т?뺣낫 ?숆린??/h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>踰뺤쟻議곗튂</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>踰뺣Т?뺣낫 ?숆린??/BreadcrumbPage>
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
        <h3 className="font-semibold">踰뺣Т?뺣낫 ?숆린??/h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="議고쉶 ?댁슜"
        columns={columns}
        data={tableData}
        onRowDoubleClick={handleRowDoubleClick}
      />
    </div>
  );
}


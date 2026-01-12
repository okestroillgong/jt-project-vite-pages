

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
import type { FilterLayout } from "@/components/filters/types";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";

// --- Types ---

interface LegalProceedingsData {
  id: number;
  IfaffManageDstnm: string; // 踰뺣Т愿由ш뎄遺꾩퐫??  custNo: string; // 怨좉컼踰덊샇
  custNm: string; // 怨좉컼紐?  rnmNo: string; // ?ㅻ챸踰덊샇
  acntNo: string; // 怨꾩쥖踰덊샇
  spnpyt: number; // 媛吏湲됯툑
  loanAmt: number; // ?異쒖옍??  pltfNm: string; // ?먭퀬紐?  dfdntNm: string; // ?쇨퀬紐?  ingrrNm: string; // 議고쉶?먮챸
  cortCd: string; // 踰뺤썝肄붾뱶
  csYy: string; // ?ш굔踰덊샇1
  csKind: string; // ?ш굔踰덊샇2
  csNoSeq: string; // ?ш굔踰덊샇3
  csNm: string; // ?ш굔紐?  blgAmt: number; // 泥?뎄湲덉븸
  IfaffPrgsDstnm: string; // 踰뺣Т吏꾪뻾援щ텇肄붾뱶
  rceptDt: string; // ?묒닔?쇱옄
  dcsDt: string; // 寃곗젙?쇱옄
  edDt: string; // 醫낃껐?쇱옄
  updateDt: string; // ?낅뜲?댄듃?쇱옄
  csCtns: string; // ?ш굔?댁슜
  sumry: string; // ?곸슂
  hbrcd: string; // 遺?먯퐫??  rltdCsNo: string; // 愿?⑥궗嫄대쾲??  mthrCsYn: string; // 紐⑥궗嫄댁뿬遺
  thbkBeacYn: string; // ?뱁뻾?쇱냼?щ?
  slddt: string; // ?숈같?쇱옄
  chgPymtDt: string; // ?湲덈궔遺?쇱옄
  syncYn: string; // ?숆린?붿뿬遺
}

// --- Mock Data ---

const mockData: LegalProceedingsData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  IfaffManageDstnm: i % 2 === 0 ? "LG001" : "LG002",
  custNo: `CUST${1000 + i}`,
  custNm: `怨좉컼${i + 1}`,
  rnmNo: `800101-123456${i % 10}`,
  acntNo: `100-200-${300000 + i}`,
  spnpyt: 100000 * (i + 1),
  loanAmt: 5000000 * (i + 1),
  pltfNm: "移쒖븷?異뺤???,
  dfdntNm: `?쇨퀬${i + 1}`,
  ingrrNm: `?대떦??{i + 1}`,
  cortCd: "C001",
  csYy: "2024",
  csKind: "媛??,
  csNoSeq: `${10000 + i}`,
  csNm: `??ш툑 諛섑솚 泥?뎄????${i + 1}`,
  blgAmt: 5500000 * (i + 1),
  IfaffPrgsDstnm: i % 3 === 0 ? "?묒닔" : i % 3 === 1 ? "吏꾪뻾" : "醫낃껐",
  rceptDt: "2024-01-15",
  dcsDt: "2024-03-20",
  edDt: i % 3 === 2 ? "2024-06-10" : "",
  updateDt: "2024-11-20",
  csCtns: "?댁슜 ?놁쓬",
  sumry: "?곸슂 ?ы빆",
  hbrcd: "B100",
  rltdCsNo: "",
  mthrCsYn: "N",
  thbkBeacYn: "N",
  slddt: "",
  chgPymtDt: "",
  syncYn: "Y",
}));

// --- Columns ---

const columns: ColumnDef<LegalProceedingsData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "IfaffManageDstnm", header: "踰뺣Т愿由ш뎄遺꾩퐫?? },
  { accessorKey: "custNo", header: "怨좉컼踰덊샇" },
  { accessorKey: "custNm", header: "怨좉컼紐? },
  { accessorKey: "rnmNo", header: "?ㅻ챸踰덊샇" },
  { accessorKey: "acntNo", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "spnpyt", header: "媛吏湲됯툑" },
  { accessorKey: "loanAmt", header: "?異쒖옍?? },
  { accessorKey: "pltfNm", header: "?먭퀬紐? },
  { accessorKey: "dfdntNm", header: "?쇨퀬紐? },
  { accessorKey: "ingrrNm", header: "議고쉶?먮챸" },
  { accessorKey: "cortCd", header: "踰뺤썝肄붾뱶" },
  { accessorKey: "csYy", header: "?ш굔踰덊샇1" },
  { accessorKey: "csKind", header: "?ш굔踰덊샇2" },
  { accessorKey: "csNoSeq", header: "?ш굔踰덊샇3" },
  { accessorKey: "csNm", header: "?ш굔紐? },
  { accessorKey: "blgAmt", header: "泥?뎄湲덉븸" },
  { accessorKey: "IfaffPrgsDstnm", header: "踰뺣Т吏꾪뻾援щ텇肄붾뱶" },
  { accessorKey: "rceptDt", header: "?묒닔?쇱옄" },
  { accessorKey: "dcsDt", header: "寃곗젙?쇱옄" },
  { accessorKey: "edDt", header: "醫낃껐?쇱옄" },
  { accessorKey: "updateDt", header: "?낅뜲?댄듃?쇱옄" },
  { accessorKey: "csCtns", header: "?ш굔?댁슜" },
  { accessorKey: "sumry", header: "?곸슂" },
  { accessorKey: "hbrcd", header: "遺?먯퐫?? },
  { accessorKey: "rltdCsNo", header: "愿?⑥궗嫄대쾲?? },
  { accessorKey: "mthrCsYn", header: "紐⑥궗嫄댁뿬遺" },
  { accessorKey: "thbkBeacYn", header: "?뱁뻾?쇱냼?щ?" },
  { accessorKey: "slddt", header: "?숈같?쇱옄" },
  { accessorKey: "chgPymtDt", header: "?湲덈궔遺?쇱옄" },
  { accessorKey: "syncYn", header: "?숆린?붿뿬遺" },
];

export default function InquiryLegalProceedingsPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData, clearState } = usePageStore();

  const [filters, setFilters] = useState<Record<string, any>>(currentState?.filters || {});
  
  // 濡쒖뺄 ?곹깭濡??뚯씠釉??곗씠?곕? 愿由ы븯嫄곕굹 store???곗씠?곕? ?ъ슜
  const tableData = useMemo(() => 
    currentState?.tables?.['legalProceedingsTable'] || [], 
    [currentState?.tables]
  );

  // 珥덇린 濡쒕뱶 ??紐⑹뾽 ?곗씠???ㅼ젙 (?ㅼ젣濡쒕뒗 API ?몄텧)
  useEffect(() => {
    if (!currentState?.tables?.['legalProceedingsTable']) {
      updateTableData(tabId, 'legalProceedingsTable', mockData);
    }
  }, [tabId, currentState?.tables, updateTableData]);

  useEffect(() => {
    loadState(tabId);
  }, [tabId, loadState]);

  // ?앹뾽 硫붿떆吏 由ъ뒪??  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "customer-search") {
        const customer = message.payload;
        handleFilterChange("customer", customer.customerName); // 怨좉컼紐??쒖떆
        // ?꾩슂??怨좉컼踰덊샇 ??異붽? 泥섎━: handleFilterChange("custNo", customer.centralCustomerNumber);
      } else if (message.source === "branch-management") {
        const branch = message.payload;
        handleFilterChange("managementBranch", { code: branch.branchCode, name: branch.branchName });
      } else if (message.source === "case-inquiry") {
        const caseData = message.payload;
        // Assuming 'caseNumber' filter displays the case number as code and maybe name?
        // Or just the number. Let's set it as an object for the search component.
        handleFilterChange("caseNumber", { code: caseData.csNo, name: caseData.csNm });
      }
    });
    return cleanup;
  }, [tabId]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      // ?ㅽ넗???낅뜲?댄듃???붾컮?댁뒪 泥섎━?섍굅???꾩슂 ?쒖젏???섑뻾???섎룄 ?덉쓬
      // ?ш린?쒕뒗 利됱떆 濡쒖뺄 ?곹깭 諛섏쁺 諛??ㅽ넗???숆린?붾? ?꾪빐 useEffect?먯꽌 泥섎━
      return newFilters;
    });
  }, []);

  // ?꾪꽣 蹂寃????ㅽ넗???낅뜲?댄듃
  useEffect(() => {
    updateFilters(tabId, filters);
  }, [tabId, filters, updateFilters]);

  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3, // row 1: ?묒닔?쇱옄, 踰뺣Т援щ텇, 踰뺣Т吏꾪뻾援щ텇
      filters: [
        {
          name: "receiptDate",
          type: "date-range",
          label: "?묒닔?쇱옄",
        },
        {
          name: "legalClassification",
          type: "select",
          label: "踰뺣Т援щ텇",
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "type1", label: "援щ텇1" },
            { value: "type2", label: "援щ텇2" },
          ],
        },
        {
          name: "legalProgressClassification",
          type: "select",
          label: "踰뺣Т吏꾪뻾援щ텇",
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "receipt", label: "?묒닔" },
            { value: "progress", label: "吏꾪뻾" },
            { value: "end", label: "醫낃껐" },
          ],
        },
      ],
    },
    {
      type: "grid",
      columns: 3, // row 2: 怨좉컼寃?? ?ш굔踰덊샇, 愿由щ???      filters: [
        {
          name: "customer",
          type: "long-search",
          label: "怨좉컼寃??,
          readonly: true,
          defaultValue: { code: "CUST1000", name: "怨좉컼1" }, // 湲곕낯媛??ㅼ젙
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `${import.meta.env.BASE_URL}popup/customer-search?openerTabId=${tabId}`,
              "CustomerSearch",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "caseNumber",
          type: "search",
          label: "?ш굔踰덊샇",
          onButtonClick: (value, e) => {
            e?.preventDefault();
            const caseNumber = value?.code || '';
            window.open(
              `${import.meta.env.BASE_URL}popup/case-inquiry?caseNumber=${caseNumber}&openerTabId=${tabId}`,
              "CaseInquiry",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "managementBranch",
          type: "search",
          label: "愿由щ???,
          readonly: true,
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `${import.meta.env.BASE_URL}popup/branch-management?openerTabId=${tabId}`,
              "BranchManagement",
              "width=1600,height=800"
            );
          },
        },
      ],
    },
  ], [tabId]);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    // API ?몄텧 濡쒖쭅 ?泥?    updateTableData(tabId, 'legalProceedingsTable', mockData);
  };

  const handleReset = () => {
    setFilters({});
    // ?ㅽ넗??珥덇린?붾뒗 clearState瑜??ъ슜?섍굅???꾪꽣留?珥덇린??    // clearState(tabId); // ?꾩껜 珥덇린????  };

  const handleExcelDownload = () => {
    alert("?묒? ?ㅼ슫濡쒕뱶 ?ㅽ뻾");
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">踰뺣Т吏꾪뻾 議고쉶</h2>
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
              <BreadcrumbPage>踰뺣Т吏꾪뻾 議고쉶</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "excel", onClick: handleExcelDownload },
            { id: "search", onClick: handleSearch },
            { id: "reset", onClick: handleReset },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">踰뺣Т吏꾪뻾 議고쉶 議곌굔</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="踰뺣Т吏꾪뻾 ?댁뿭"
        columns={columns}
        data={tableData}
        amountColumns={["spnpyt", "loanAmt", "blgAmt"]}
        minWidth="1820px"
      />
    </div>
  );
}


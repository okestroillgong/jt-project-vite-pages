

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
  IfaffManageDstnm: string; // 법무관리구분코드
  custNo: string; // 고객번호
  custNm: string; // 고객명
  rnmNo: string; // 실명번호
  acntNo: string; // 계좌번호
  spnpyt: number; // 가지급금
  loanAmt: number; // 대출잔액
  pltfNm: string; // 원고명
  dfdntNm: string; // 피고명
  ingrrNm: string; // 조회자명
  cortCd: string; // 법원코드
  csYy: string; // 사건번호1
  csKind: string; // 사건번호2
  csNoSeq: string; // 사건번호3
  csNm: string; // 사건명
  blgAmt: number; // 청구금액
  IfaffPrgsDstnm: string; // 법무진행구분코드
  rceptDt: string; // 접수일자
  dcsDt: string; // 결정일자
  edDt: string; // 종결일자
  updateDt: string; // 업데이트일자
  csCtns: string; // 사건내용
  sumry: string; // 적요
  hbrcd: string; // 부점코드
  rltdCsNo: string; // 관련사건번호
  mthrCsYn: string; // 모사건여부
  thbkBeacYn: string; // 당행피소여부
  slddt: string; // 낙찰일자
  chgPymtDt: string; // 대금납부일자
  syncYn: string; // 동기화여부
}

// --- Mock Data ---

const mockData: LegalProceedingsData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  IfaffManageDstnm: i % 2 === 0 ? "LG001" : "LG002",
  custNo: `CUST${1000 + i}`,
  custNm: `고객${i + 1}`,
  rnmNo: `800101-123456${i % 10}`,
  acntNo: `100-200-${300000 + i}`,
  spnpyt: 100000 * (i + 1),
  loanAmt: 5000000 * (i + 1),
  pltfNm: "친애저축은행",
  dfdntNm: `피고${i + 1}`,
  ingrrNm: `담당자${i + 1}`,
  cortCd: "C001",
  csYy: "2024",
  csKind: "가단",
  csNoSeq: `${10000 + i}`,
  csNm: `대여금 반환 청구의 소 ${i + 1}`,
  blgAmt: 5500000 * (i + 1),
  IfaffPrgsDstnm: i % 3 === 0 ? "접수" : i % 3 === 1 ? "진행" : "종결",
  rceptDt: "2024-01-15",
  dcsDt: "2024-03-20",
  edDt: i % 3 === 2 ? "2024-06-10" : "",
  updateDt: "2024-11-20",
  csCtns: "내용 없음",
  sumry: "적요 사항",
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
  { accessorKey: "id", header: "순번" },
  { accessorKey: "IfaffManageDstnm", header: "법무관리구분코드" },
  { accessorKey: "custNo", header: "고객번호" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "rnmNo", header: "실명번호" },
  { accessorKey: "acntNo", header: "계좌번호" },
  { accessorKey: "spnpyt", header: "가지급금" },
  { accessorKey: "loanAmt", header: "대출잔액" },
  { accessorKey: "pltfNm", header: "원고명" },
  { accessorKey: "dfdntNm", header: "피고명" },
  { accessorKey: "ingrrNm", header: "조회자명" },
  { accessorKey: "cortCd", header: "법원코드" },
  { accessorKey: "csYy", header: "사건번호1" },
  { accessorKey: "csKind", header: "사건번호2" },
  { accessorKey: "csNoSeq", header: "사건번호3" },
  { accessorKey: "csNm", header: "사건명" },
  { accessorKey: "blgAmt", header: "청구금액" },
  { accessorKey: "IfaffPrgsDstnm", header: "법무진행구분코드" },
  { accessorKey: "rceptDt", header: "접수일자" },
  { accessorKey: "dcsDt", header: "결정일자" },
  { accessorKey: "edDt", header: "종결일자" },
  { accessorKey: "updateDt", header: "업데이트일자" },
  { accessorKey: "csCtns", header: "사건내용" },
  { accessorKey: "sumry", header: "적요" },
  { accessorKey: "hbrcd", header: "부점코드" },
  { accessorKey: "rltdCsNo", header: "관련사건번호" },
  { accessorKey: "mthrCsYn", header: "모사건여부" },
  { accessorKey: "thbkBeacYn", header: "당행피소여부" },
  { accessorKey: "slddt", header: "낙찰일자" },
  { accessorKey: "chgPymtDt", header: "대금납부일자" },
  { accessorKey: "syncYn", header: "동기화여부" },
];

export default function InquiryLegalProceedingsPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData, clearState } = usePageStore();

  const [filters, setFilters] = useState<Record<string, any>>(currentState?.filters || {});
  
  // 로컬 상태로 테이블 데이터를 관리하거나 store의 데이터를 사용
  const tableData = useMemo(() => 
    currentState?.tables?.['legalProceedingsTable'] || [], 
    [currentState?.tables]
  );

  // 초기 로드 시 목업 데이터 설정 (실제로는 API 호출)
  useEffect(() => {
    if (!currentState?.tables?.['legalProceedingsTable']) {
      updateTableData(tabId, 'legalProceedingsTable', mockData);
    }
  }, [tabId, currentState?.tables, updateTableData]);

  useEffect(() => {
    loadState(tabId);
  }, [tabId, loadState]);

  // 팝업 메시지 리스너
  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "customer-search") {
        const customer = message.payload;
        handleFilterChange("customer", customer.customerName); // 고객명 표시
        // 필요시 고객번호 등 추가 처리: handleFilterChange("custNo", customer.centralCustomerNumber);
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
      // 스토어 업데이트는 디바운스 처리하거나 필요 시점에 수행할 수도 있음
      // 여기서는 즉시 로컬 상태 반영 및 스토어 동기화를 위해 useEffect에서 처리
      return newFilters;
    });
  }, []);

  // 필터 변경 시 스토어 업데이트
  useEffect(() => {
    updateFilters(tabId, filters);
  }, [tabId, filters, updateFilters]);

  const filterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3, // row 1: 접수일자, 법무구분, 법무진행구분
      filters: [
        {
          name: "receiptDate",
          type: "date-range",
          label: "접수일자",
        },
        {
          name: "legalClassification",
          type: "select",
          label: "법무구분",
          options: [
            { value: "all", label: "전체" },
            { value: "type1", label: "구분1" },
            { value: "type2", label: "구분2" },
          ],
        },
        {
          name: "legalProgressClassification",
          type: "select",
          label: "법무진행구분",
          options: [
            { value: "all", label: "전체" },
            { value: "receipt", label: "접수" },
            { value: "progress", label: "진행" },
            { value: "end", label: "종결" },
          ],
        },
      ],
    },
    {
      type: "grid",
      columns: 3, // row 2: 고객검색, 사건번호, 관리부점
      filters: [
        {
          name: "customer",
          type: "long-search",
          label: "고객검색",
          readonly: true,
          defaultValue: { code: "CUST1000", name: "고객1" }, // 기본값 설정
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `/popup/customer-search?openerTabId=${tabId}`,
              "CustomerSearch",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "caseNumber",
          type: "search",
          label: "사건번호",
          onButtonClick: (value, e) => {
            e?.preventDefault();
            const caseNumber = value?.code || '';
            window.open(
              `/popup/case-inquiry?caseNumber=${caseNumber}&openerTabId=${tabId}`,
              "CaseInquiry",
              "width=1600,height=800"
            );
          },
        },
        {
          name: "managementBranch",
          type: "search",
          label: "관리부점",
          readonly: true,
          onButtonClick: (value, e) => {
            e?.preventDefault();
            window.open(
              `/popup/branch-management?openerTabId=${tabId}`,
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
    // API 호출 로직 대체
    updateTableData(tabId, 'legalProceedingsTable', mockData);
  };

  const handleReset = () => {
    setFilters({});
    // 스토어 초기화는 clearState를 사용하거나 필터만 초기화
    // clearState(tabId); // 전체 초기화 시
  };

  const handleExcelDownload = () => {
    alert("엑셀 다운로드 실행");
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">법무진행 조회</h2>
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
              <BreadcrumbPage>법무진행 조회</BreadcrumbPage>
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
        <h3 className="font-semibold">법무진행 조회 조건</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="법무진행 내역"
        columns={columns}
        data={tableData}
        amountColumns={["spnpyt", "loanAmt", "blgAmt"]}
        minWidth="1820px"
      />
    </div>
  );
}

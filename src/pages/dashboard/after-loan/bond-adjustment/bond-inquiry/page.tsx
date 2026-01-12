

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect, useState } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomTabs as Tabs, CustomTabsContent as TabsContent, CustomTabsList as TabsList, CustomTabsTrigger as TabsTrigger } from "@/components/app/CustomTabs";
import { LeftActions } from "@/components/app/LeftActions";
import { RightActions, ActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterFileUpload } from "@/components/filters/FilterFileUpload";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { FilterInput } from "@/components/filters/FilterInput";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type GenericColumnType = string | number | boolean | Date | null | undefined;
type BondInquiryData = Record<string, GenericColumnType>;

const createColumn = (accessorKey: string, header: string): ColumnDef<BondInquiryData> => ({
  accessorKey,
  header,
});

const bondAdjustmentColumns: { [key: string]: ColumnDef<BondInquiryData>[] } = {
  전체: [
    createColumn("curRow", "순번"),
    createColumn("fdnCustNo", "고객번호"),
    createColumn("rnmNo", "고객주민번호"),
    createColumn("custNm", "고객명"),
    createColumn("acntNo", "계좌번호"),
    createColumn("rqsCustNo", "신청인고객번호"),
    createColumn("perlSttsNm", "개인회생상태"),
    createColumn("rqsPrgsSttsNm", "신용회복신청인진행상태"),
    createColumn("bkrpXmptSttsNm", "파산면책진행상태"),
  ],
  개인회생: [
    createColumn("curRow", "순번"),
    createColumn("custNo", "고객번호"),
    createColumn("rnmNo", "고객주민번호"),
    createColumn("unqsCtns", "특이사항내용"),
    createColumn("custNm", "고객명"),
    createColumn("acntNo", "계좌번호"),
    createColumn("vacctNo", "가상계좌번호"),
    createColumn("rqsCustNo", "신청인고객번호"),
    createColumn("rqsCustNm", "신청인명"),
    createColumn("blce", "대출잔액"),
    createColumn("abolRqsYn", "폐지신청여부"),
    createColumn("rprtngPrnc", "신고원금"),
    createColumn("rprtngAmt", "신고금액"),
    createColumn("fxdAmt", "확정금액"),
    createColumn("dffAmt", "차액금액"),
    createColumn("cortNm", "법원명"),
    createColumn("telNo", "전화번호"),
    createColumn("csNo", "사건번호"),
    createColumn("rceptDt", "접수일"),
    createColumn("perlSttsNm", "개인회생상태"),
    createColumn("prhbtCmdDt", "금지명령일자"),
    createColumn("dlvDt", "송달일자"),
    createColumn("stodrDt", "중지명령일자"),
    createColumn("rptXpnPrcsDt", "보고제외처리일자"),
    createColumn("strtDt", "개시일자"),
    createColumn("ofpmsDt", "인가일자"),
    createColumn("wdrwDt", "취하일자"),
    createColumn("ovrdDt", "기각일자"),
    createColumn("abolDt", "폐지일자"),
    createColumn("slfempEn", "자영업자유무"),
    createColumn("workwrplNm", "근무처"),
    createColumn("mmAvrIncmAmt", "월평균소득"),
    createColumn("rpymtStrDt", "변제시작일자"),
    createColumn("rptmrEndDt", "변제종료일자"),
    createColumn("rpymtrAcmtlAmt", "변제누계"),
    createColumn("pytRto", "납입률"),
    createColumn("bondRqsNo", "채권번호"),
    createColumn("sucYn", "승계유무"),
    createColumn("acntDclrtYn", "계좌신고서유무"),
    createColumn("objnRqsYn", "이의신청여부"),
    createColumn("spnpyt", "가지급금"),
    createColumn("rpymtRto", "변제율"),
    createColumn("prdctNm", "상품명"),
    createColumn("caseCourt", "재판부"),
    createColumn("frsRgstrnUsrNm", "입력담당자"),
    createColumn("frsRgstrnDt", "등록일시"),
    createColumn("prrtyRpymtRn", "우선변제회차"),
    createColumn("totPytRn", "총납입회차"),
    createColumn("stdPrgsRn", "진행회차"),
    createColumn("stdPytRn", "실납입회차"),
    createColumn("stdArrRn", "연체회차"),
    createColumn("cortReqstTrgetYn", "법원요청대상여부"),
    createColumn("fxdYn", "확정여부"),
    createColumn("pytAmt1", "납입금액1회차"),
    createColumn("pytAmt2", "납입금액2회차"),
    createColumn("pytAmt3", "납입금액3회차"),
    createColumn("pytAmt4", "납입금액4회차"),
    createColumn("pytAmt5", "납입금액5회차"),
    createColumn("pytAmt6", "납입금액6회차"),
    createColumn("pytAmt7", "납입금액7회차"),
    createColumn("pytAmt8", "납입금액8회차"),
    createColumn("pytAmt9", "납입금액9회차"),
    createColumn("pytAmt10", "납입금액10회차"),
    createColumn("pytAmt11", "납입금액11회차"),
    createColumn("pytAmt12", "납입금액12회차"),
    createColumn("pytAmt13", "납입금액13회차"),
    createColumn("pytAmt14", "납입금액14회차"),
    createColumn("pytAmt15", "납입금액15회차"),
    createColumn("pytAmt16", "납입금액16회차"),
    createColumn("pytAmt17", "납입금액17회차"),
    createColumn("pytAmt18", "납입금액18회차"),
    createColumn("pytAmt19", "납입금액19회차"),
    createColumn("pytAmt20", "납입금액20회차"),
    createColumn("pytAmt21", "납입금액21회차"),
    createColumn("pytAmt22", "납입금액22회차"),
    createColumn("pytAmt23", "납입금액23회차"),
    createColumn("pytAmt24", "납입금액24회차"),
    createColumn("pytAmt25", "납입금액25회차"),
    createColumn("pytAmt26", "납입금액26회차"),
    createColumn("pytAmt27", "납입금액27회차"),
    createColumn("pytAmt28", "납입금액28회차"),
    createColumn("pytAmt29", "납입금액29회차"),
    createColumn("pytAmt30", "납입금액30회차"),
    createColumn("pytAmt31", "납입금액31회차"),
    createColumn("pytAmt32", "납입금액32회차"),
    createColumn("pytAmt33", "납입금액33회차"),
    createColumn("pytAmt34", "납입금액34회차"),
    createColumn("pytAmt35", "납입금액35회차"),
    createColumn("pytAmt36", "납입금액36회차"),
    createColumn("pytAmt37", "납입금액37회차"),
    createColumn("pytAmt38", "납입금액38회차"),
    createColumn("pytAmt39", "납입금액39회차"),
    createColumn("pytAmt40", "납입금액40회차"),
    createColumn("pytAmt41", "납입금액41회차"),
    createColumn("pytAmt42", "납입금액42회차"),
    createColumn("pytAmt43", "납입금액43회차"),
    createColumn("pytAmt44", "납입금액44회차"),
    createColumn("pytAmt45", "납입금액45회차"),
    createColumn("pytAmt46", "납입금액46회차"),
    createColumn("pytAmt47", "납입금액47회차"),
    createColumn("pytAmt48", "납입금액48회차"),
    createColumn("pytAmt49", "납입금액49회차"),
    createColumn("pytAmt50", "납입금액50회차"),
    createColumn("pytAmt51", "납입금액51회차"),
    createColumn("pytAmt52", "납입금액52회차"),
    createColumn("pytAmt53", "납입금액53회차"),
    createColumn("pytAmt54", "납입금액54회차"),
    createColumn("pytAmt55", "납입금액55회차"),
    createColumn("pytAmt56", "납입금액56회차"),
    createColumn("pytAmt57", "납입금액57회차"),
    createColumn("pytAmt58", "납입금액58회차"),
    createColumn("pytAmt59", "납입금액59회차"),
    createColumn("pytAmt60", "납입금액60회차"),
    createColumn("aclPytAmt1", "실납입금액1회차"),
    createColumn("aclPytAmt2", "실납입금액2회차"),
    createColumn("aclPytAmt3", "실납입금액3회차"),
    createColumn("aclPytAmt4", "실납입금액4회차"),
    createColumn("aclPytAmt5", "실납입금액5회차"),
    createColumn("aclPytAmt6", "실납입금액6회차"),
    createColumn("aclPytAmt7", "실납입금액7회차"),
    createColumn("aclPytAmt8", "실납입금액8회차"),
    createColumn("aclPytAmt9", "실납입금액9회차"),
    createColumn("aclPytAmt10", "실납입금액10회차"),
    createColumn("aclPytAmt11", "실납입금액11회차"),
    createColumn("aclPytAmt12", "실납입금액12회차"),
    createColumn("aclPytAmt13", "실납입금액13회차"),
    createColumn("aclPytAmt14", "실납입금액14회차"),
    createColumn("aclPytAmt15", "실납입금액15회차"),
    createColumn("aclPytAmt16", "실납입금액16회차"),
    createColumn("aclPytAmt17", "실납입금액17회차"),
    createColumn("aclPytAmt18", "실납입금액18회차"),
    createColumn("aclPytAmt19", "실납입금액19회차"),
    createColumn("aclPytAmt20", "실납입금액20회차"),
    createColumn("aclPytAmt21", "실납입금액21회차"),
    createColumn("aclPytAmt22", "실납입금액22회차"),
    createColumn("aclPytAmt23", "실납입금액23회차"),
    createColumn("aclPytAmt24", "실납입금액24회차"),
    createColumn("aclPytAmt25", "실납입금액25회차"),
    createColumn("aclPytAmt26", "실납입금액26회차"),
    createColumn("aclPytAmt27", "실납입금액27회차"),
    createColumn("aclPytAmt28", "실납입금액28회차"),
    createColumn("aclPytAmt29", "실납입금액29회차"),
    createColumn("aclPytAmt30", "실납입금액30회차"),
    createColumn("aclPytAmt31", "실납입금액31회차"),
    createColumn("aclPytAmt32", "실납입금액32회차"),
    createColumn("aclPytAmt33", "실납입금액33회차"),
    createColumn("aclPytAmt34", "실납입금액34회차"),
    createColumn("aclPytAmt35", "실납입금액35회차"),
    createColumn("aclPytAmt36", "실납입금액36회차"),
    createColumn("aclPytAmt37", "실납입금액37회차"),
    createColumn("aclPytAmt38", "실납입금액38회차"),
    createColumn("aclPytAmt39", "실납입금액39회차"),
    createColumn("aclPytAmt40", "실납입금액40회차"),
    createColumn("aclPytAmt41", "실납입금액41회차"),
    createColumn("aclPytAmt42", "실납입금액42회차"),
    createColumn("aclPytAmt43", "실납입금액43회차"),
    createColumn("aclPytAmt44", "실납입금액44회차"),
    createColumn("aclPytAmt45", "실납입금액45회차"),
    createColumn("aclPytAmt46", "실납입금액46회차"),
    createColumn("aclPytAmt47", "실납입금액47회차"),
    createColumn("aclPytAmt48", "실납입금액48회차"),
    createColumn("aclPytAmt49", "실납입금액49회차"),
    createColumn("aclPytAmt50", "실납입금액50회차"),
    createColumn("aclPytAmt51", "실납입금액51회차"),
    createColumn("aclPytAmt52", "실납입금액52회차"),
    createColumn("aclPytAmt53", "실납입금액53회차"),
    createColumn("aclPytAmt54", "실납입금액54회차"),
    createColumn("aclPytAmt55", "실납입금액55회차"),
    createColumn("aclPytAmt56", "실납입금액56회차"),
    createColumn("aclPytAmt57", "실납입금액57회차"),
    createColumn("aclPytAmt58", "실납입금액58회차"),
    createColumn("aclPytAmt59", "실납입금액59회차"),
    createColumn("aclPytAmt60", "실납입금액60회차"),
  ],
  신용회복: [
    createColumn("curRow", "순번"),
    createColumn("custNo", "고객번호"),
    createColumn("custNm", "고객명"),
    createColumn("rqsRrn", "신청주민등록번호"),
    createColumn("rqsCustNm", "신청인명"),
    createColumn("acntNo", "계좌번호"),
    createColumn("rqsPrgsSttsNm", "신청진행상태"),
    createColumn("acntPrgsSttsCtns", "계좌진행상태내용"),
    createColumn("abandnDt", "실효/완제/합의서 포기일자"),
    createColumn("rceptNticDt", "접수통지일자"),
    createColumn("fxdDt", "확정일자"),
    createColumn("mdatAfIrt", "조정후이율"),
    createColumn("mdatAfPrncAmt", "조정후원금"),
    createColumn("mdatAfIntrAmt", "조정후이자"),
    createColumn("mdatAfArrIntrAmt", "조정후연체이자"),
    createColumn("mdatAfCstAmt", "조정후비용"),
    createColumn("mdatAfSumAmt", "조정후합계"),
    createColumn("rqsDvCtns", "신청구분"),
    createColumn("prdctNm", "상품명"),
  ],
  파산면책: [
    createColumn("curRow", "순번"),
    createColumn("custNo", "고객번호"),
    createColumn("custNm", "고객명"),
    createColumn("rqsCustNo", "신청인고객번호"),
    createColumn("rqsCustNm", "신청인명"),
    createColumn("acntNo", "계좌번호"),
    createColumn("blceStdrYm", "잔액기준년월"),
    createColumn("stdrBlceAmt", "기준잔액금액"),
    createColumn("unqnCtns", "특이사항"),
    createColumn("rceptDt", "접수일자"),
    createColumn("bkrpXmptSttsNm", "파산면책상태"),
    createColumn("sntcDt", "선고일자"),
    createColumn("xmptDt", "면책일자"),
    createColumn("abolDt", "폐지일자"),
    createColumn("cortNm", "법원"),
    createColumn("bkrpCsNo", "사건번호(하단)"),
    createColumn("xmptCsNo", "사건번호(하면)"),
    createColumn("prdctNm", "상품명"),
    createColumn("hndlBnkNm", "취급은행명"),
    createColumn("rnmNo", "고객주민번호"),
  ],
  채무조정: [
    createColumn("curRow", "순번"),
    createColumn("custNo", "고객번호"),
    createColumn("acntNo", "계좌번호"),
    createColumn("custNm", "고객명"),
    createColumn("fnoblMdatRqsDstcd", "신청구분"),
    createColumn("fnoblMdatComptDt", "채무조정완료일자"),
    createColumn("bfFnoblMdatComptDt", "이전채무조정완료일자"),
    createColumn("blce", "대출잔액"),
    createColumn("bfPrnc", "조정전원금"),
    createColumn("afPrnc", "조정후원금"),
    createColumn("agrtCnclnDt", "합의해제일자"),
    createColumn("dfrPrdEndDt", "거치기간종료일자"),
    createColumn("trmnatDt", "해지일자"),
    createColumn("rpayPstpTn", "상환유예여부"),
    createColumn("rpayPstpPrd", "유예기간"),
    createColumn("rpayPstpPrncYn", "채무조정사항1(상환유예(원금))"),
    createColumn("rpayPstpPrinstYn", "채무조정사항2(상환유예(원리금))"),
    createColumn("prncRdcxptDtmPymtYn", "채무조정사항3(원금감면(일시납))"),
    createColumn("prncRdcxptInstPymtYn", "채무조정사항4(원금감면(분납))"),
    createColumn("intrRdcxptIntrYn", "채무조정사항5(이자감면(이자))"),
    createColumn("intrRdcxptArrIntrYn", "채무조정사항6(이자감면(연체이자))"),
    createColumn("expXtnsYn", "채무조정사항7(만기연장)"),
    createColumn("fnoblMdatDtlsEtcCtns", "채무조정사항8(기타)"),
    createColumn("rpayPrd", "상환기간"),
    createColumn("rpayStrDt", "상환시작일자"),
    createColumn("rpayEndDt", "상환종료일자"),
    createColumn("pytDd", "매월납입일"),
  ],
};

const mockData: BondInquiryData[] = Array.from({ length: 23 }, (_, i) => ({
  curRow: i + 1,
  fdnCustNo: `F${1001 + i}`,
  rnmNo: `R${2001 + i}`,
  custNm: `고객${i + 1}`,
  acntNo: `ACC${3001 + i}`,
  rqsCustNo: `RQ${4001 + i}`,
  perlSttsNm: i % 2 === 0 ? "정상" : "부실",
  rqsPrgsSttsNm: i % 3 === 0 ? "진행중" : "완료",
  bkrpXmptSttsNm: i % 4 === 0 ? "신청" : "면책",
}));

// Data type for the Excel Upload table (can be the same if structure matches)
type ExcelUploadData = BondInquiryData;

// Mock data for the Excel Upload table
const excelMockData: ExcelUploadData[] = Array.from({ length: 12 }, (_, i) => ({
    curRow: i + 1,
    fdnCustNo: `EXF${1001 + i}`,
    rnmNo: `EXR${2001 + i}`,
    custNm: `엑셀고객${i + 1}`,
    acntNo: `EXACC${3001 + i}`,
    rqsCustNo: `EXRQ${4001 + i}`,
    perlSttsNm: i % 2 === 0 ? "정상" : "부실",
    rqsPrgsSttsNm: i % 3 === 0 ? "진행중" : "완료",
    bkrpXmptSttsNm: i % 4 === 0 ? "신청" : "면책",
}));

// Column definitions for the Excel Upload table
const excelColumns: ColumnDef<ExcelUploadData>[] = bondAdjustmentColumns["전체"];

export default function BondInquiryPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeBondAdjustmentType, setActiveBondAdjustmentType] = useState<string>("전체");

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId || message.source !== 'customer-search') return;
      
      const customer = message.payload;
      console.log("Received from popup:", customer);
      updateFilters(tabId, { 
        customerName: { 
          code: customer.customerName, 
          name: customer.centralCustomerNumber 
        } 
      });
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { 
          name: "bondAdjustmentType", 
          type: "select", 
          label: "채권조정구분", 
          options: [
            { value: "전체", label: "전체" },
            { value: "개인회생", label: "개인회생" },
            { value: "신용회복", label: "신용회복" },
            { value: "파산면책", label: "파산/면책" },
            { value: "채무조정", label: "채무조정" },
          ],
        },
        { 
          name: "customerName", 
          type: "search", 
          label: "성명",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNameForSearch = value?.code || '';
            window.open(
              `/popup/customer-search?customerName=${customerNameForSearch}&openerTabId=${tabId}`,
              'CustomerSearch',
              'width=1600,height=800'
            );
          }
        },
        { name: "blank1", type: "blank" },
        { 
          name: "progressStatus", 
          type: "multi-select", 
          label: "진행 상태", 
          activator: false, // Component handles activator internally
          options: Array.from({ length: 100 }, (_, i) => ({
            value: `status-${i + 1}`,
            label: `진행상태 ${i + 1}`,
          })), 
        },
        { name: "registrar", type: "search", label: "신규등록자" },
        { name: "modifier", type: "search", label: "최종수정자" },
        { name: "paymentRate", type: "number-range", label: "납입률" },
        { name: "accountStatus", type: "select", label: "계좌진행상태", options: [] },
        { name: "registrationDate", type: "date-range", label: "신규등록일자" },
        { name: "modificationDate", type: "date-range", label: "최종수정일자" },
        { name: "courtName", type: "select", label: "법원명", options: [], activator: true },
        { name: "caseNumber", type: "text", label: "사건번호" },
        { name: "progressRound", type: "number-range", label: "진행회차" },
        { name: "actualPaymentRound", type: "number-range", label: "실납입회차" },
        { name: "overdueRound", type: "number-range", label: "연체회차" },
        { name: "cancellationRequest", type: "checkbox", label: "폐지신청(Y)" },
        { name: "virtualAccountDate", type: "date-range", label: "가상계좌부여일자" },
        { name: "baseDate", type: "date-range", label: "기준일" },
        { name: "debtAdjustmentCompleteDate", type: "date-range", label: "채무조정완료일" },
      ],
    },
  ];

  const currentColumns = bondAdjustmentColumns[activeBondAdjustmentType] || bondAdjustmentColumns["전체"];

  const amountColumnsMap: { [key: string]: string[] } = {
    전체: [],
    개인회생: ["blce", "rprtngPrnc", "rprtngAmt", "fxdAmt", "dffAmt", "mmAvrIncmAmt", "rpymtrAcmtlAmt", "pytRto", "spnpyt", "rpymtRto",
    "pytAmt1", "pytAmt2", "pytAmt3", "pytAmt4", "pytAmt5", "pytAmt6", "pytAmt7", "pytAmt8", "pytAmt9", "pytAmt10",
    "pytAmt11", "pytAmt12", "pytAmt13", "pytAmt14", "pytAmt15", "pytAmt16", "pytAmt17", "pytAmt18", "pytAmt19", "pytAmt20",
    "pytAmt21", "pytAmt22", "pytAmt23", "pytAmt24", "pytAmt25", "pytAmt26", "pytAmt27", "pytAmt28", "pytAmt29", "pytAmt30",
    "pytAmt31", "pytAmt32", "pytAmt33", "pytAmt34", "pytAmt35", "pytAmt36", "pytAmt37", "pytAmt38", "pytAmt39", "pytAmt40",
    "pytAmt41", "pytAmt42", "pytAmt43", "pytAmt44", "pytAmt45", "pytAmt46", "pytAmt47", "pytAmt48", "pytAmt49", "pytAmt50",
    "pytAmt51", "pytAmt52", "pytAmt53", "pytAmt54", "pytAmt55", "pytAmt56", "pytAmt57", "pytAmt58", "pytAmt59", "pytAmt60",
    "aclPytAmt1", "aclPytAmt2", "aclPytAmt3", "aclPytAmt4", "aclPytAmt5", "aclPytAmt6", "aclPytAmt7", "aclPytAmt8", "aclPytAmt9", "aclPytAmt10",
    "aclPytAmt11", "aclPytAmt12", "aclPytAmt13", "aclPytAmt14", "aclPytAmt15", "aclPytAmt16", "aclPytAmt17", "aclPytAmt18", "aclPytAmt19", "aclPytAmt20",
    "aclPytAmt21", "aclPytAmt22", "aclPytAmt23", "aclPytAmt24", "aclPytAmt25", "aclPytAmt26", "aclPytAmt27", "aclPytAmt28", "aclPytAmt29", "aclPytAmt30",
    "aclPytAmt31", "aclPytAmt32", "aclPytAmt33", "aclPytAmt34", "aclPytAmt35", "aclPytAmt36", "aclPytAmt37", "aclPytAmt38", "aclPytAmt39", "aclPytAmt40",
    "aclPytAmt41", "aclPytAmt42", "aclPytAmt43", "aclPytAmt44", "aclPytAmt45", "aclPytAmt46", "aclPytAmt47", "aclPytAmt48", "aclPytAmt49", "aclPytAmt50",
    "aclPytAmt51", "aclPytAmt52", "aclPytAmt53", "aclPytAmt54", "aclPytAmt55", "aclPytAmt56", "aclPytAmt57", "aclPytAmt58", "aclPytAmt59", "aclPytAmt60"],
    신용회복: ["mdatAfIrt", "mdatAfPrncAmt", "mdatAfIntrAmt", "mdatAfArrIntrAmt", "mdatAfCstAmt", "mdatAfSumAmt"],
    파산면책: ["stdrBlceAmt"],
    채무조정: ["blce", "bfPrnc", "afPrnc"],
  };

  const currentAmountColumns = amountColumnsMap[activeBondAdjustmentType] || [];

  const bondInquiryRowCount = currentState?.tables?.['bondInquiryTable']?.length || 0; 
  const excelUploadRowCount = currentState?.tables?.['excelUploadTable']?.length || 0;

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleActionClick = (action: ActionType) => {
    if (!currentState) return;
    if (action === 'search') {
      const filterValue = currentState.filters.bondAdjustmentType;
      // Handle both object { value, label } and direct value if any
      const selectedType = (typeof filterValue === 'object' && filterValue !== null) 
        ? (filterValue as any).value 
        : filterValue;
      
      console.log("Simulating data fetch with bond adjustment type:", selectedType);
      
      setActiveBondAdjustmentType(selectedType || "전체");
      updateTableData(tabId, 'bondInquiryTable', mockData);
      updateTableData(tabId, 'excelUploadTable', excelMockData);
    } else {
      console.log(`'${action}' button clicked!`);
    }
  };

  const pageActions = [
    { id: 'excel', onClick: () => handleActionClick('excel') },
    { id: 'delete', onClick: () => handleActionClick('delete') },
    { id: 'search', onClick: () => handleActionClick('search') },
    { id: 'data-reset', onClick: () => clearState(tabId) },
    { id: 'reset' },
  ] as { id: ActionType; onClick?: () => void; }[];

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">채권조회</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span>홈</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>여신사후</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>채권조정</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>채권조회</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        {activeBondAdjustmentType === "개인회생" ? (
          <LeftActions actions={[{ id: 'batch-register' }, { id: 'cancel' }, { id: 'dm' }]} />
        ) : (
          <div></div>
        )}
        <RightActions actions={pageActions} />
      </div>

      <Tabs defaultValue="debt-inquiry">
        <TabsList>
          <TabsTrigger value="debt-inquiry">채무관련 조회</TabsTrigger>
          <TabsTrigger value="excel-save">엑셀파일 저장</TabsTrigger>
        </TabsList>
        <TabsContent value="debt-inquiry" className="flex flex-col gap-3">
          <FilterContainer
            filterLayout={filterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
          />
          
          <DataTable 
            title="조회내용"
            columns={currentColumns} 
            data={currentState.tables?.['bondInquiryTable'] || []} 
            amountColumns={currentAmountColumns} 
          />
        </TabsContent>
        <TabsContent value="excel-save" className="flex flex-col gap-3">
          <div className="rounded-lg border px-4 py-4">
            <div className="flex flex-col gap-4">
              <FilterFileUpload label="첨부파일" />
              <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-4">
                <FilterSelect 
                  name="excelProgressStatus" 
                  label="진행상태구분" 
                  options={[]} 
                  value={currentState.filters.excelProgressStatus}
                  onChange={handleFilterChange}
                />
                <FilterInput 
                  name="excelProgressState" 
                  type="text" 
                  label="진행상태" 
                  width="short" 
                  value={currentState.filters.excelProgressState}
                  onChange={handleFilterChange}
                />
                <FilterInput 
                  name="excelProgressCount" 
                  type="number" 
                  label="진행건수" 
                  value={currentState.filters.excelProgressCount}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
          <DataTable 
            title="업로드 내용"
            columns={excelColumns} 
            data={currentState.tables?.['excelUploadTable'] || []} 
            amountColumns={currentAmountColumns} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
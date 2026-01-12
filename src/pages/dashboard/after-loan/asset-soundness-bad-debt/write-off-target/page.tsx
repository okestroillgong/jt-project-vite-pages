

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback, useEffect } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib/popup-bus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RightActions, ActionType } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import type { FilterLayout } from "@/components/filters/types";
import { FilterContainer } from "@/components/filters/FilterContainer";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// 1. Data Type Definition (All columns from requirements)
type WriteOffTargetData = {
  no: number;
  dprDvNm: string;
  dprTrgetChcDt: string;
  itmsNm: string;
  custNm: string;
  custNo: string;
  acntNo: string;
  loanAmt: number;
  loanBlce: number;
  itdiLoanMny: number;
  itdiAcntCnt: number;
  custLoanMny: number;
  custAcntCnt: number;
  loanPrdMncnt: number;
  loanPrdDycnt: number;
  loanDt: string;
  expDt: string;
  expDdArrMncnt: number;
  rpayMthNm: string;
  dycntDvNm: string;
  irt: number;
  arrIrt: number;
  stffDvNm: string;
  stffDt: string;
  manageTrnsferDt: string;
  lotbDvNm: string;
  lotbDt: string;
  bntmArrMncnt: number;
  manageCrdlAcntDvNm: string;
  lastTrDt: string;
  n1MrtgDvNm: string;
  n2MrtgDvNm: string;
  n1LastCptnDt: string;
  lastCptnDtArrRn: number;
  arrRn: number;
  pytNtrDt: string;
  n1IntrArrRn: number;
  mmAcitrc: number;
  ddAcitrc: number;
  acitrc: number;
  rvsDvNm: string;
  rvsIntr: number;
  n1Arrlntr: number;
  frstlntr: number;
  nxttrmPrncPytDt: string;
  n1PrncArrRn: number;
  n2PrncArrRn: number;
  n1NxttrmlntrPytDt: string;
  n2lntrArrRn: number;
  lotblntrArrRn: number;
  prncArrAmt: number;
  nrmlIntr: number;
  arrs: number;
  n2ArrIntr: number;
  mngrNm: string;
  dpstAcntNo: string;
  n1StgupAmt: number;
  teamNm: string;
  detailPrdctNm: string;
  detailFndOgnlNm: string;
  n2NxttrmlntrPytDt: string;
  n1TpindClsNm: string;
  n2TpindClsNm: string;
  eprzDvNm: string;
  eprzSclNm: string;
  brchNm: string;
  notytBilnNrmlIntr: number;
  notytBilnArrs: number;
  notytBilnArrIntr: number;
  psnIBsrno: string;
  psnlBzplNm: string;
  rbrno: string;
  rnmNo: string;
  icctno: string;
  bsrpNo: string;
  arrMncnt: number;
  rptArrMncnt: number;
  n1NrmlAmt: number;
  n1AttenAmt: number;
  n1FxnAmt: number;
  n1DtclAmt: number;
  n1EslssAmt: number;
  dpslsvMrtgBlce: number;
  mainMrtgKndNm: string;
  n2StgupAmt: number;
  apsdAmt: number;
  n1UnsbdBondAmt: number;
  n1ClctExpectAmt: number;
  n2UnsbdBondAmt: number;
  n2ClctExpectAmt: number;
  cmtRgstrnDvNm: string;
  afbd: number;
  apsdOrgnzNm: string;
  apsdDt: string;
  brchDvNm: string;
  borwAddr: string;
  wrplAddr: string;
  addrPlcDvNm: string;
  wrplAddrDvNm: string;
  areaApplcDvNm: string;
  areaDvNm: string;
  hndlBnkNm: string;
  rptMrtgDvNm: string;
  n3MrtgDvNm: string;
  n1MrtgKndNm: string;
  loanMrtgPscndDvNm: string;
  n2MrtgKndNm: string;
  cltLctPlcNm: string;
  usdvNm: string;
  mrtgEvlAmt: number;
  dcRto: number;
  dcRtApplcMrtgEvlAmt: number;
  unsbdStqupAmt: number;
  etcUnsbdAmt: number;
  thbkStgupAmt: number;
  validMrtgAmt: number;
  clctExpectAmt: number;
  bfSndnRto: number;
  IsmthLoanBlce: number;
  IsmthAprpAmt: number;
  IsmthAprpRto: number;
  lastArrRn: number;
  arrSndnDstcd: string;
  arrDvNm: string;
  spnpytLfmSndnAmt: number;
  spnpytDvNm: string;
  IfmDvNm: string;
  sslSubrgtSndnDstcd: string;
  sslSubrgtDvNm: string;
  ifisSndnDstcd: string;
  slmDvNm: string;
  kdnkRgstrnSndnDstcd: string;
  kdnkLnovPrd: string;
  kdnkArrRastrnAmt: number;
  credtRecvySndnDstcd: string;
  dbtrDvNm: string;
  rdcxptModDvNm: string;
  aplcSttsDvNm: string;
  acntPrgsSttsNm: string;
  prncRdcxptYn: string;
  totRpayPrd: number;
  pytRn: number;
  arrPrd: number;
  realArrPrd: number;
  perlSndnDstcd: string;
  perlAplcDvNm: string;
  sttsDvNm: string;
  rhbRprtngAmt: number;
  rhbFxdAmt: number;
  rpymtAmt: number;
  rhbExemptAmt: number;
  cobSndnDstcd: string;
  cobDvNm: string;
  pjDvNm: string;
  wkPmnSndnDstcd: string;
  autOpnnRjctnDvNm: string;
  dfcDvNm: string;
  imcapDvNm: string;
  brwmnyXcsDvNm: string;
  bkrpSndnDstcd: string;
  bkrpDbtrDvNm: string;
  bkrpSttsDvNm: string;
  dedSndnDstcd: string;
  dedDvNm: string;
  etcSndnDstcd: string;
  etcClsNm: string;
  clctN1TeoSndnDstcd: string;
  n1TeoDtclAmt: number;
  snanClsDvNm: string;
  credtRecvySndnClsDvNm: string;
  perlOfpmsDcsDvNm: string;
  chngSndnClsDvNm: string;
  sprsMinSndnDstco: string;
  lastAplySndnDstcd: string;
  n2NrmlAmt: number;
  n2NrmlAprpRto: number;
  n2NrmlAprpAmt: number;
  n2AttenAmt: number;
  n2AttenAprpRto: number;
  n2AttenAprpAmt: number;
  n2FxnAmt: number;
  n2FxnAprpRto: number;
  n2FxnAprpAmt: number;
  n2DtclAmt: number;
  n2DtclAprpRto: number;
  n2DtclAprpAmt: number;
  n2EslssAmt: number;
  n2EslssAprpRto: number;
  n2EslssAprpAmt: number;
  loanMnySum: number;
  aprpMny: number;
  thmmAprpMnyRto: number;
  IsmthAprpMnyChngRto: number;
  IsmthLoanMnyChngAmt: number;
  lsmthAprpMnyChngAmt: number;
};

// 2. Mock Data
const mockData: WriteOffTargetData[] = Array.from({ length: 5 }, (_, i) => ({
  no: i + 1,
  dprDvNm: "일반상각",
  dprTrgetChcDt: "2024-11-20",
  itmsNm: "신용대출",
  custNm: `홍길동${i + 1}`,
  custNo: `CUST${1000 + i}`,
  acntNo: `123-456-7890${i}`,
  loanAmt: 50000000,
  loanBlce: 45000000,
  itdiLoanMny: 50000000,
  itdiAcntCnt: 1,
  custLoanMny: 50000000,
  custAcntCnt: 1,
  loanPrdMncnt: 24,
  loanPrdDycnt: 730,
  loanDt: "2022-01-01",
  expDt: "2024-01-01",
  expDdArrMncnt: 5,
  rpayMthNm: "원리금균등",
  dycntDvNm: "365일",
  irt: 5.5,
  arrIrt: 12.0,
  stffDvNm: "미상계",
  stffDt: "-",
  manageTrnsferDt: "2024-06-01",
  lotbDvNm: "해당없음",
  lotbDt: "-",
  bntmArrMncnt: 0,
  manageCrdlAcntDvNm: "정상",
  lastTrDt: "2024-10-01",
  n1MrtgDvNm: "신용",
  n2MrtgDvNm: "-",
  n1LastCptnDt: "2024-10-01",
  lastCptnDtArrRn: 1,
  arrRn: 2,
  pytNtrDt: "2024-11-01",
  n1IntrArrRn: 1,
  mmAcitrc: 150000,
  ddAcitrc: 5000,
  acitrc: 155000,
  rvsDvNm: "정상",
  rvsIntr: 0,
  n1Arrlntr: 25000,
  frstlntr: 0,
  nxttrmPrncPytDt: "2024-12-01",
  n1PrncArrRn: 1,
  n2PrncArrRn: 0,
  n1NxttrmlntrPytDt: "2024-12-01",
  n2lntrArrRn: 0,
  lotblntrArrRn: 0,
  prncArrAmt: 1000000,
  nrmlIntr: 50000,
  arrs: 5000,
  n2ArrIntr: 0,
  mngrNm: `김철수${i + 1}`,
  dpstAcntNo: "-",
  n1StgupAmt: 0,
  teamNm: "채권관리팀",
  detailPrdctNm: "직장인신용대출",
  detailFndOgnlNm: "자체자금",
  n2NxttrmlntrPytDt: "-",
  n1TpindClsNm: "가계",
  n2TpindClsNm: "-",
  eprzDvNm: "개인",
  eprzSclNm: "-",
  brchNm: "본점",
  notytBilnNrmlIntr: 0,
  notytBilnArrs: 0,
  notytBilnArrIntr: 0,
  psnIBsrno: "-",
  psnlBzplNm: "-",
  rbrno: "800101-1******",
  rnmNo: "800101-1******",
  icctno: "-",
  bsrpNo: "-",
  arrMncnt: 2,
  rptArrMncnt: 2,
  n1NrmlAmt: 0,
  n1AttenAmt: 45000000,
  n1FxnAmt: 0,
  n1DtclAmt: 0,
  n1EslssAmt: 0,
  dpslsvMrtgBlce: 0,
  mainMrtgKndNm: "신용",
  n2StgupAmt: 0,
  apsdAmt: 0,
  n1UnsbdBondAmt: 0,
  n1ClctExpectAmt: 0,
  n2UnsbdBondAmt: 0,
  n2ClctExpectAmt: 0,
  cmtRgstrnDvNm: "등록",
  afbd: 500000,
  apsdOrgnzNm: "-",
  apsdDt: "-",
  brchDvNm: "본점",
  borwAddr: "서울시 강남구",
  wrplAddr: "서울시 서초구",
  addrPlcDvNm: "자가",
  wrplAddrDvNm: "-",
  areaApplcDvNm: "서울",
  areaDvNm: "수도권",
  hndlBnkNm: "친애저축은행",
  rptMrtgDvNm: "신용",
  n3MrtgDvNm: "-",
  n1MrtgKndNm: "신용",
  loanMrtgPscndDvNm: "-",
  n2MrtgKndNm: "-",
  cltLctPlcNm: "-",
  usdvNm: "가계자금",
  mrtgEvlAmt: 0,
  dcRto: 0,
  dcRtApplcMrtgEvlAmt: 0,
  unsbdStqupAmt: 0,
  etcUnsbdAmt: 0,
  thbkStgupAmt: 0,
  validMrtgAmt: 0,
  clctExpectAmt: 0,
  bfSndnRto: 0,
  IsmthLoanBlce: 45500000,
  IsmthAprpAmt: 450000,
  IsmthAprpRto: 1,
  lastArrRn: 1,
  arrSndnDstcd: "요주의",
  arrDvNm: "단기연체",
  spnpytLfmSndnAmt: 0,
  spnpytDvNm: "-",
  IfmDvNm: "-",
  sslSubrgtSndnDstcd: "-",
  sslSubrgtDvNm: "-",
  ifisSndnDstcd: "-",
  slmDvNm: "-",
  kdnkRgstrnSndnDstcd: "-",
  kdnkLnovPrd: "-",
  kdnkArrRastrnAmt: 0,
  credtRecvySndnDstcd: "-",
  dbtrDvNm: "주채무자",
  rdcxptModDvNm: "-",
  aplcSttsDvNm: "-",
  acntPrgsSttsNm: "정상",
  prncRdcxptYn: "N",
  totRpayPrd: 24,
  pytRn: 12,
  arrPrd: 60,
  realArrPrd: 60,
  perlSndnDstcd: "-",
  perlAplcDvNm: "-",
  sttsDvNm: "-",
  rhbRprtngAmt: 0,
  rhbFxdAmt: 0,
  rpymtAmt: 0,
  rhbExemptAmt: 0,
  cobSndnDstcd: "-",
  cobDvNm: "-",
  pjDvNm: "-",
  wkPmnSndnDstcd: "-",
  autOpnnRjctnDvNm: "-",
  dfcDvNm: "-",
  imcapDvNm: "-",
  brwmnyXcsDvNm: "-",
  bkrpSndnDstcd: "-",
  bkrpDbtrDvNm: "-",
  bkrpSttsDvNm: "-",
  dedSndnDstcd: "-",
  dedDvNm: "-",
  etcSndnDstcd: "-",
  etcClsNm: "-",
  clctN1TeoSndnDstcd: "-",
  n1TeoDtclAmt: 0,
  snanClsDvNm: "요주의",
  credtRecvySndnClsDvNm: "-",
  perlOfpmsDcsDvNm: "-",
  chngSndnClsDvNm: "-",
  sprsMinSndnDstco: "-",
  lastAplySndnDstcd: "요주의",
  n2NrmlAmt: 0,
  n2NrmlAprpRto: 0,
  n2NrmlAprpAmt: 0,
  n2AttenAmt: 45000000,
  n2AttenAprpRto: 1,
  n2AttenAprpAmt: 450000,
  n2FxnAmt: 0,
  n2FxnAprpRto: 0,
  n2FxnAprpAmt: 0,
  n2DtclAmt: 0,
  n2DtclAprpRto: 0,
  n2DtclAprpAmt: 0,
  n2EslssAmt: 0,
  n2EslssAprpRto: 0,
  n2EslssAprpAmt: 0,
  loanMnySum: 45000000,
  aprpMny: 450000,
  thmmAprpMnyRto: 1,
  IsmthAprpMnyChngRto: 0,
  IsmthLoanMnyChngAmt: -500000,
  lsmthAprpMnyChngAmt: 0,
}));

// 3. Column Definitions
const createColumn = (accessorKey: keyof WriteOffTargetData, header: string): ColumnDef<WriteOffTargetData> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => {
    const value = getValue();
    if (typeof value === 'number' && !header.includes('순번') && !header.includes('회차') && !header.includes('기간') && !header.includes('개월') && !header.includes('일수')) {
        return value.toLocaleString();
    }
    return value;
  }
});

const columns: ColumnDef<WriteOffTargetData>[] = [
  createColumn("no", "순번"),
  createColumn("dprDvNm", "상각구분"),
  createColumn("dprTrgetChcDt", "선정일자"),
  createColumn("itmsNm", "과목명"),
  createColumn("custNm", "고객명"),
  createColumn("custNo", "고객번호"),
  createColumn("acntNo", "여신계좌"),
  createColumn("loanAmt", "대출금액"),
  createColumn("loanBlce", "대출잔액"),
  createColumn("itdiLoanMny", "과목별대출금"),
  createColumn("itdiAcntCnt", "과목별계좌수"),
  createColumn("custLoanMny", "고객대출금"),
  createColumn("custAcntCnt", "고객계좌수"),
  createColumn("loanPrdMncnt", "대출기간(월)"),
  createColumn("loanPrdDycnt", "대출기간(일)"),
  createColumn("loanDt", "대출일자"),
  createColumn("expDt", "만기일자"),
  createColumn("expDdArrMncnt", "만기일연체"),
  createColumn("rpayMthNm", "상환방법"),
  createColumn("dycntDvNm", "일수구분"),
  createColumn("irt", "이율"),
  createColumn("arrIrt", "연체이율"),
  createColumn("stffDvNm", "상계구분"),
  createColumn("stffDt", "상계일자"),
  createColumn("manageTrnsferDt", "관리이관일자"),
  createColumn("lotbDvNm", "기한이익상실구분"),
  createColumn("lotbDt", "기한이익상실일자"),
  createColumn("bntmArrMncnt", "기한이익연체"),
  createColumn("manageCrdlAcntDvNm", "관리여신계좌"),
  createColumn("lastTrDt", "최종거래일자"),
  createColumn("n1MrtgDvNm", "담보구분"),
  createColumn("n2MrtgDvNm", "담보구분"),
  createColumn("n1LastCptnDt", "최종이수일자"),
  createColumn("lastCptnDtArrRn", "최종이수일자연체회차"),
  createColumn("arrRn", "연체회차"),
  createColumn("pytNtrDt", "납입응당일자"),
  createColumn("n1IntrArrRn", "이자연체회차"),
  createColumn("mmAcitrc", "월미수이자"),
  createColumn("ddAcitrc", "일미수이자"),
  createColumn("acitrc", "미수이지"),
  createColumn("rvsDvNm", "보정구분"),
  createColumn("rvsIntr", "보정이자"),
  createColumn("n1Arrlntr", "연체이자"),
  createColumn("frstlntr", "선수이자"),
  createColumn("nxttrmPrncPytDt", "차기원금납입일"),
  createColumn("n1PrncArrRn", "원금연체회차"),
  createColumn("n2PrncArrRn", "원금연체회차2"),
  createColumn("n1NxttrmlntrPytDt", "차기이자납입일"),
  createColumn("n2lntrArrRn", "2이자연체회차"),
  createColumn("lotblntrArrRn", "기간이익상실"),
  createColumn("prncArrAmt", "원금연체금액"),
  createColumn("nrmlIntr", "정상이자"),
  createColumn("arrs", "연체료"),
  createColumn("n2ArrIntr", "연체이자"),
  createColumn("mngrNm", "관리자"),
  createColumn("dpstAcntNo", "수신계좌번호"),
  createColumn("n1StgupAmt", "설정금액"),
  createColumn("teamNm", "팀명"),
  createColumn("detailPrdctNm", "세부상품명"),
  createColumn("detailFndOgnlNm", "세부자금원"),
  createColumn("n2NxttrmlntrPytDt", "차기이자납입일자"),
  createColumn("n1TpindClsNm", "업종분류"),
  createColumn("n2TpindClsNm", "업종분류2"),
  createColumn("eprzDvNm", "기업구분"),
  createColumn("eprzSclNm", "기업규모"),
  createColumn("brchNm", "지점명"),
  createColumn("notytBilnNrmlIntr", "미징구정상이자"),
  createColumn("notytBilnArrs", "미징구연체료"),
  createColumn("notytBilnArrIntr", "미징구연체이자"),
  createColumn("psnIBsrno", "개인사업자등록번호"),
  createColumn("psnlBzplNm", "개인사업장명"),
  createColumn("rbrno", "주민등록/사업자번호"),
  createColumn("rnmNo", "실명번호"),
  createColumn("icctno", "법인등록번호"),
  createColumn("bsrpNo", "사업자번호"),
  createColumn("arrMncnt", "연체월수"),
  createColumn("rptArrMncnt", "보고연체퀄수"),
  createColumn("n1NrmlAmt", "정상"),
  createColumn("n1AttenAmt", "요주의"),
  createColumn("n1FxnAmt", "고정"),
  createColumn("n1DtclAmt", "회수의문"),
  createColumn("n1EslssAmt", "추정손실"),
  createColumn("dpslsvMrtgBlce", "예금적금담보잔액"),
  createColumn("mainMrtgKndNm", "주담보종류"),
  createColumn("n2StgupAmt", "설정액"),
  createColumn("apsdAmt", "감정가"),
  createColumn("n1UnsbdBondAmt", "선순위채권1"),
  createColumn("n1ClctExpectAmt", "회수예상가"),
  createColumn("n2UnsbdBondAmt", "선순위채권2"),
  createColumn("n2ClctExpectAmt", "회수예상가2"),
  createColumn("cmtRgstrnDvNm", "신용관리대상"),
  createColumn("afbd", "대손충당금"),
  createColumn("apsdOrgnzNm", "감정기관"),
  createColumn("apsdDt", "감정일자"),
  createColumn("brchDvNm", "점포구분"),
  createColumn("borwAddr", "차주주소지"),
  createColumn("wrplAddr", "직장주소지"),
  createColumn("addrPlcDvNm", "주소지구분"),
  createColumn("wrplAddrDvNm", "직장주소구부"),
  createColumn("areaApplcDvNm", "지역적용"),
  createColumn("areaDvNm", "지역구분"),
  createColumn("hndlBnkNm", "취급은행"),
  createColumn("rptMrtgDvNm", "보고담보구분"),
  createColumn("n3MrtgDvNm", "담보구분"),
  createColumn("n1MrtgKndNm", "담보종류"),
  createColumn("loanMrtgPscndDvNm", "대출담보현황"),
  createColumn("n2MrtgKndNm", "담보종류"),
  createColumn("cltLctPlcNm", "담보물소재지"),
  createColumn("usdvNm", "용도"),
  createColumn("mrtgEvlAmt", "담보평가액"),
  createColumn("dcRto", "할인율"),
  createColumn("dcRtApplcMrtgEvlAmt", "할인율적용후담보평가액"),
  createColumn("unsbdStqupAmt", "선순위설정금액"),
  createColumn("etcUnsbdAmt", "기타선순위"),
  createColumn("thbkStgupAmt", "당행설정금액"),
  createColumn("validMrtgAmt", "유효담보가액"),
  createColumn("clctExpectAmt", "회수예상가"),
  createColumn("bfSndnRto", "인수건전성"),
  createColumn("IsmthLoanBlce", "전퀄대출잔액"),
  createColumn("IsmthAprpAmt", "전월충당금"),
  createColumn("IsmthAprpRto", "전뭘충당비율"),
  createColumn("lastArrRn", "최종연체회차"),
  createColumn("arrSndnDstcd", "연체건전성"),
  createColumn("arrDvNm", "연체구분"),
  createColumn("spnpytLfmSndnAmt", "가지급법수속건전성"),
  createColumn("spnpytDvNm", "가지급금"),
  createColumn("IfmDvNm", "법수속"),
  createColumn("sslSubrgtSndnDstcd", "햇살론대위변제건전성"),
  createColumn("sslSubrgtDvNm", "햇살론대위변제"),
  createColumn("ifisSndnDstcd", "IFIS건전성"),
  createColumn("slmDvNm", "솔로몬pw"),
  createColumn("kdnkRgstrnSndnDstcd", "은행연합회등록건전성"),
  createColumn("kdnkLnovPrd", "은행연합회최장연체기간"),
  createColumn("kdnkArrRastrnAmt", "은행연합회연체등록금액"),
  createColumn("credtRecvySndnDstcd", "신용회복건전성"),
  createColumn("dbtrDvNm", "채무자구분"),
  createColumn("rdcxptModDvNm", "감면방식"),
  createColumn("aplcSttsDvNm", "신청자상태"),
  createColumn("acntPrgsSttsNm", "계좌진행상태내용"),
  createColumn("prncRdcxptYn", "원금감면여부"),
  createColumn("totRpayPrd", "총상환기간"),
  createColumn("pytRn", "납입회채"),
  createColumn("arrPrd", "연체기간"),
  createColumn("realArrPrd", "실제연체"),
  createColumn("perlSndnDstcd", "개인회생건전성"),
  createColumn("perlAplcDvNm", "개인회생신청자구분"),
  createColumn("sttsDvNm", "상태"),
  createColumn("rhbRprtngAmt", "회생신고금액"),
  createColumn("rhbFxdAmt", "회생확정금액"),
  createColumn("rpymtAmt", "변제금액"),
  createColumn("rhbExemptAmt", "회생면제금액"),
  createColumn("cobSndnDstcd", "폐업건전성"),
  createColumn("cobDvNm", "폐업"),
  createColumn("pjDvNm", "프로젝트"),
  createColumn("wkPmnSndnDstcd", "부실징후건전성분류"),
  createColumn("autOpnnRjctnDvNm", "감사의견거점"),
  createColumn("dfcDvNm", "결손"),
  createColumn("imcapDvNm", "자본잠식"),
  createColumn("brwmnyXcsDvNm", "차입금과다"),
  createColumn("bkrpSndnDstcd", "파산건전성"),
  createColumn("bkrpDbtrDvNm", "파산채무자구분"),
  createColumn("bkrpSttsDvNm", "파산상태"),
  createColumn("dedSndnDstcd", "사망자건전성"),
  createColumn("dedDvNm", "사망자"),
  createColumn("etcSndnDstcd", "기타건전성"),
  createColumn("etcClsNm", "기타분류"),
  createColumn("clctN1TeoSndnDstcd", "회수1년이상건전성"),
  createColumn("n1TeoDtclAmt", "1년이상회수의문"),
  createColumn("snanClsDvNm", "건전성분류"),
  createColumn("credtRecvySndnClsDvNm", "신용회복건전성분류"),
  createColumn("perlOfpmsDcsDvNm", "개인회생인가결정"),
  createColumn("chngSndnClsDvNm", "건전성분류(신복,회생반영)"),
  createColumn("sprsMinSndnDstco", "동일인최하건전성"),
  createColumn("lastAplySndnDstcd", "최종반영건전성"),
  createColumn("n2NrmlAmt", "정상"),
  createColumn("n2NrmlAprpRto", "충당비율"),
  createColumn("n2NrmlAprpAmt", "충당금"),
  createColumn("n2AttenAmt", "요주의"),
  createColumn("n2AttenAprpRto", "충당비율"),
  createColumn("n2AttenAprpAmt", "충당금"),
  createColumn("n2FxnAmt", "고정"),
  createColumn("n2FxnAprpRto", "충당비율"),
  createColumn("n2FxnAprpAmt", "충당금"),
  createColumn("n2DtclAmt", "회수의문"),
  createColumn("n2DtclAprpRto", "충당비율"),
  createColumn("n2DtclAprpAmt", "충당금"),
  createColumn("n2EslssAmt", "추정손실"),
  createColumn("n2EslssAprpRto", "충당비율"),
  createColumn("n2EslssAprpAmt", "충당금"),
  createColumn("loanMnySum", "대출금합계"),
  createColumn("aprpMny", "충당금"),
  createColumn("thmmAprpMnyRto", "당월충당금비율"),
  createColumn("IsmthAprpMnyChngRto", "전월대비충당금변동율"),
  createColumn("IsmthLoanMnyChngAmt", "전월대비대출금변동액"),
  createColumn("lsmthAprpMnyChngAmt", "전월대비충당금변동액"),
];

export default function WriteOffTargetPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();

  // Popup Message Listener
  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "branch-management") {
        const branch = message.payload;
        updateFilters(tabId, {
          branch: { code: branch.branchCode, name: branch.branchName },
        });
      }
    });
    return cleanup;
  }, [tabId, updateFilters]);

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  const handleSearch = () => {
    console.log("Searching...");
    updateTableData(tabId, "writeOffTargetTable", mockData);
  };

  const handleReset = () => {
    clearState(tabId);
  };

  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { 
            name: "quarter", 
            type: "select", 
            label: "분기",
            options: [
              { value: "2024Q4", label: "2024년 4분기" },
              { value: "2025Q1", label: "2025년 1분기" },
              { value: "2025Q2", label: "2025년 2분기" },
              { value: "2025Q3", label: "2025년 3분기" },
              { value: "2025Q4", label: "2025년 4분기" },
            ]
        },
        { 
            name: "branch", 
            type: "search", 
            label: "관리부점",
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`/popup/branch-management?openerTabId=${tabId}`, "BranchManagement", "width=1600,height=800");
            }
        },
        { 
            name: "writeOffType", 
            type: "select", 
            label: "상각구분",
            options: [
              { value: "all", label: "전체" },
              { value: "general", label: "일반상각" },
              { value: "special", label: "특수채권" },
            ]
        },
      ],
    },
  ];

  const rightActions: { id: ActionType; onClick?: () => void }[] = [
    { id: "search", onClick: handleSearch },
    { id: "excel", onClick: () => console.log("Excel download") },
    { id: "reset", onClick: handleReset },
  ];

  if (!currentState) return null;

  const rowCount = currentState.tables?.['writeOffTargetTable']?.length || 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">대손상각대상 조회</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>재산건전성/대손상각</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>대손상각대상 조회</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Actions */}
      <div className="flex justify-end min-h-[35px]">
        <RightActions actions={rightActions} />
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">대손상각대상 채권 조회 조건</h3>
        <FilterContainer
            filterLayout={filterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <DataTable
          title="대손상각대상 채권"
          columns={columns}
          data={currentState.tables?.['writeOffTargetTable'] || []}
      />
    </div>
  );
}

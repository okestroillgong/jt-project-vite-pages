

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

interface AssetSoundnessVerificationData {
  id: number; // 순번
  sndnYm: string; // 건전성년월
  itmsNm: string; // 과목명
  custNm: string; // 고객명
  custNo: string; // 고객번호
  acntNo: string; // 계좌번호
  loanAmt: number; // 대출금액
  loanBlce: number; // 대출잔액
  itdiLoanMny: number; // 과목별대출금
  itdiAcntCnt: number; // 과목별계좌수
  custLoanMny: number; // 고객대출금
  custAcntCnt: number; // 고객계좌수
  loanPrdMncnt: number; // 대출기간월수
  loanPrdDycnt: number; // 대출기간일수
  loanDt: string; // 대출일자
  expDt: string; // 만기일자
  expDdArrMncnt: number; // 만기일연체
  lastIntrPytDt: string; // 최종이자납입일
  rpayMthNm: string; // 상환방법
  dycntDvNm: string; // 일수구분
  irt: number; // 이율
  arrIrt: number; // 연체이율
  stffDvNm: string; // 상계구분
  stffDt: string; // 상계일자
  manageTrnsferDt: string; // 관리이관일자
  lotbDvNm: string; // 기한이익상실구분
  lotbDt: string; // 기한이익상실일
  bntmArrMncnt: number; // 기한이익연체
  manageCrdlAcntDvNm: string; // 관리여신계좌구분
  lastTrDt: string; // 최종거래일자
  n1MrtgDvNm: string; // 1담보구분
  n2MrtgDvNm: string; // 2담보구분
  lastCptnDt: string; // 최종이수일자
  lastCptnDtArrRn: number; // 최종이수일자연체회차
  arrRn: number; // 연체회차
  pytNtrDt: string; // 납입응당일
  n1lntrArrRn: number; // 1이자연체회차
  mmAcitrc: number; // 월미수이자
  ddAcitrc: number; // 일미수이자
  acitrc: number; // 미수이자
  rvsDvNm: string; // 보정구분
  rvslntr: number; // 보정이자
  n1ArrIntr: number; // 1연체이자
  frstlntr: number; // 서수이자
  nxttrmPrncPytDt: string; // 차기원금납입일
  prncArrRn: number; // 원금연체회차
  n1NxttrmlntrPytDt: string; // 1차기이자납입일
  n2lntrArrRn: number; // 2이자연체회차
  prncArrAmt: number; // 원금연체금액
  nrmllntr: number; // 정상이자
  arrs: number; // 연체료
  n2Arrlntr: number; // 2연체이자
  mngrNm: string; // 관리자
  rptArrAmt: number; // 보고연체금액
  dpstAcntNo: string; // 수신계좌번호
  n1StgupAmt: number; // 1설정금액
  teamNm: string; // 팀명
  detailPrdctNm: string; // 세부상품명
  detailFndOgnlNm: string; // 세부자금원
  n2NxttrmlntrPytDt: string; // 2차기이자납입일
  n1TpindClsNm: string; // 1업종분류
  n2TpindClsNm: string; // 2업종분류
  eprzDvNm: string; // 기업구분
  eprzScINm: string; // 기업규모
  brchNm: string; // 지점명
  notytBilnNrmllntr: number; // 미징구정상이자
  notytBilnArrs: number; // 미징구연체료
  notytBilnArrIntr: number; // 미징구연체이자
  psnlBsrno: string; // 개인사업자등록번호
  psnlBzplNm: string; // 개인사업장명
  rbrno: string; // 주민등록/사업자번호
  rnmNo: string; // 실명번호
  icctno: string; // 법인등록번호
  bsrpNo: string; // 사업자번호
  arrMncnt: number; // 연체월수
  rptArrMncnt: number; // 보고연체월수
  rptArrRn: number; // 보고연체회차
  cndPtApprArrRn: number; // 조건부연체
  n1NrmlAmt: number; // 1정상금액
  n1AttenAmt: number; // 1요주의금액
  n1FxnAmt: number; // 1고정금액
  n1DtclAmt: number; // 1회수의문금액
  n1EsissAmt: number; // 1추정손실금액
  dpslsvMrtqBlce: number; // 예금적금담보잔액
  mainMrtgKndNm: string; // 주담보종류
  n2StgupAmt: number; // 2설정금액
  apsdAmt: number; // 감정금액
  n1UnsbdBondAmt: number; // 1선순위채권금액
  n1ClctExpectAmt: number; // 1회수예상금액
  n2UnsbdBondAmt: number; // 2선순위채권금액
  n2ClctExpectAmt: number; // 2회수예상금액
  cmtRgstrnDvNm: string; // 신용관리대상등록여부
  afbd: number; // 대손충당금
  apsdOrgnzNm: string; // 감정기관
  apsdDt: string; // 감정일자
  brchDvNm: string; // 지점구분
  borwAddr: string; // 차주주소지
  wrplAddr: string; // 직장주소지
  addrPlcDvNm: string; // 주소지구분
  wrplAddrDvNm: string; // 직장주소구분
  areaApplcDvNm: string; // 지역적용
  areaDvNm: string; // 지역구분
  hndlBnkNm: string; // 취급은행
  rptMrtgDvNm: string; // 보고담보구분
  n3MrtgDvNm: string; // 3담보구분
  n1MrtgKndNm: string; // 1담보종류
  loanMrtgPscndDvNm: string; // 대출담보현황구분
  n2MrtgKndNm: string; // 2담보종류
  cltLctPlcNm: string; // 담보물소재지
  usdvNm: string; // 용도
  mrtgEvlAmt: number; // 담보평가금액
  dcRto: number; // 할인비율
  dcRtApplcMrtgEvlAmt: number; // 할인율적용담보평가금액
  unsbdStgupAmt: number; // 선순위설정금액
  etcUnsbdAmt: number; // 기타선순위금액
  thbkStqupAmt: number; // 당행설정금액
  validMrtgAmt: number; // 유효담보금액
  clctExpectAmt: number; // 회수예상금액
  bfSndnRto: number; // 인수건전성비율
  lsmthLoanBlce: number; // 전월대출잔액
  IsmthAprpAmt: number; // 전월충당금액
  lsmthAprpRto: number; // 전월충당비율
  lastArrRn: number; // 최종연체회차
  arrSndnDstcd: string; // 연체건전성
  arrDvNm: string; // 연체구분
  spnpytLfmSndn: string; // 가지급금법수속건전성
  spnpytDvNm: string; // 가지급금
  IfmDvNm: string; // 법수속
  IfmNml: string; // 법수속정상화
  sslSubrgtSndnDstcd: string; // 햇살론대위변제건전성
  sslSubrgtDvNm: string; // 햇살론대위변제
  ifisSndnDstcd: string; // IFIS건전성
  slmDvNm: string; // 슬로몬 PW
  kdnkRgstrnSndnDstcd: string; // 은행연합회등록건전성
  kdnkLnovPrd: string; // 은행연합회최장연체기간
  kdnkArrRgstrnAmt: number; // 으행연합회연체등록금액
  chngSndnClsDvNm: string; // 신용회복 건전성
  dbtrDvNm: string; // 채무자구분
  rdcxptModDvNm: string; // 감면방식
  aplcSttsDvNm: string; // 신청인상태
  acntPrgsSttsNm: string; // 계좌진행상태내용
  prncRdcxptYn: string; // 원금감면여부
  totRpayPrd: string; // 총상환기간
  pytRn: number; // 납일회차
  arrPrd: string; // 연체기간
  realArrPrd: string; // 실제연체기간
  credtRecvyXmptAmt: number; // 신용회복면책금액
  perlSndnDstcd: string; // 개인회생건전성
  perlAplcDvNm: string; // 개인회생신청인구분
  sttsDvNm: string; // 상태
  rhbRprtngAmt: number; // 회생신고금액
  rhbFxdAmt: number; // 회생확정금액
  rpymtAmt: number; // 변제누계
  pytRto: number; // 납입비율
  rhbExemptAmt: number; // 회생면제금액
  perlArrYn: string; // 개인회생연체여부
  cobSndnDstcd: string; // 폐업건전성
  cobDvNm: string; // 폐업
  pjDvNm: string; // 프로젝트
  wkPmnSndnDstcd: string; // 부실징후건전성
  autOpnnRjctnDvNm: string; // 감사의견거절
  dfcDvNm: string; // 결손
  imcapDvNm: string; // 자본잠식
  brwmnyXcsDvNm: string; // 차입금조과
  bkrpSndnDstcd: string; // 파산건전성
  bkrpDbtrDvNm: string; // 파산채무자구분
  bkrpSttsDvNm: string; // 파산상태
  dedSndnDstcd: string; // 사망자건전성
  dedDvNm: string; // 사망자
  rghinfrSndn: string; // 권리침해건전성
  rghInfr: string; // 권리침해
  etcSndnDstcd: string; // 기타건전성
  etcClsNm: string; // 기타분류
  bfYyFxnEgblw: string; // 전년도고정이하
  brnchExmnt: string; // 영업점검토
  sndnClsDvNm: string; // 건전성분류
  credtRecvySndnClsDvNm: string; // 신용회복건전성분류
  perlOfpmsDcsDvNm: string; // 개인회생인가결정
  credtRecvyPerlSndnCls: string; // 신용회복개인회생건전성분류
  sprsMinSndnDstcd: string; // 동일인최소건전성
  lastAplySndnDstcd: string; // 최종반영건전성
  bfYyFxnEqblwSndn: string; // 전년도고정이하반영건전성
  brnchChngBrkdn: string; // 영업점변경내역
  n2NrmlAmt: number; // 2정상금액
  n2NrmlAprpRto: number; // 2정상충당비율
  n2NrmlAprpAmt: number; // 2정상충당금액
  n2AttenAmt: number; // 2요주의금액
  n2AttenAprpRto: number; // 2요주의충당비율
  n2AttenAprpAmt: number; // 2요주의충당금액
  n2FxnAmt: number; // 2고정금액
  n2FxnAprpRto: number; // 2고정충당비율
  n2FxnAprpAmt: number; // 2고정충당금액
  n2DtclAmt: number; // 2회수의문금액
  n2DtclAprpRto: number; // 2회수의문충당비율
  n2DtclAprpAmt: number; // 2회수의문충당금액
  n2EslssAmt: number; // 2추정손실금액
  n2EsissAprpRto: number; // 2추정손실충당비을
  n2EsissAprpAmt: number; // 2추정손실충당금액
  loanMnySum: number; // 대출금합계
  aprpMny: number; // 충당금
  thmmAprpMnyRto: number; // 당월충당금비율
  IsmthAprpMnyChngRto: number; // 전퀄충당금변경비율
  IsmthLoanMnyChngAmt: number; // 전월대출금변경금액
  IsmthAprpMnyChngAmt: number; // 전월충당금변경금액
  prmumNrmlAmt: number; // 할증정상금액
  prmumNrmlAprpRto: number; // 할증정상충당비율
  prmumNrmlAprpAmt: number; // 할증정상충망금액
  prmumAttenAmt: number; // 할증요주의금액
  prmumAttenAprpRto: number; // 할증요주의충당비율
  prmumAttenAprpAmt: number; // 할증요주의충당금액
  prmumFxnAmt: number; // 할증고정금액
  prmumFxnAprpRto: number; // 할증고정충당비율
  prmumFxnAprpAmt: number; // 할증고정충당금액
  prmumDtclAmt: number; // 할증회수의문금액
  prmumDtclAprpRto: number; // 할증회수의문충당비율
  prmumDtclAprpAmt: number; // 할증회수의문충당금액
  prmumEsissAmt: number; // 할증추정손실금액
  prmumEsissAprpRto: number; // 할증추정손실충당비율
  prmumEsissAprpAmt: number; // 할증추정손실충당금액
  prmumAmt: number; // 할증금액
  prmumAprpAmt: number; // 할증충당금액
  delYn: string; // 삭제여부
  frsRgstrnUsrno: string; // 최조등록사용자번호
  frsRgstrnDtm: string; // 최조등록일시
  lastChngUsrno: string; // 최종변경사용자번호
  lastChngDtm: string; // 최종변경일시
  usrNm: string; // 사용자이름
  hbrNm: string; // 사용자지점
}

// --- Mock Data ---
const mockData: AssetSoundnessVerificationData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  sndnYm: "2024-11",
  itmsNm: "일반자금대출",
  custNm: `고객${i + 1}`,
  custNo: `CUST${1000 + i}`,
  acntNo: `100-200-${300000 + i}`,
  loanAmt: 10000000 * (i + 1),
  loanBlce: 9000000 * (i + 1),
  itdiLoanMny: 5000000 * (i + 1),
  itdiAcntCnt: 2,
  custLoanMny: 15000000 * (i + 1),
  custAcntCnt: 3,
  loanPrdMncnt: 24,
  loanPrdDycnt: 730,
  loanDt: "2023-01-01",
  expDt: "2025-01-01",
  expDdArrMncnt: 0,
  lastIntrPytDt: "2024-10-01",
  rpayMthNm: "원리금균등",
  dycntDvNm: "365",
  irt: 5.5,
  arrIrt: 12.0,
  stffDvNm: "미상계",
  stffDt: "",
  manageTrnsferDt: "",
  lotbDvNm: "",
  lotbDt: "",
  bntmArrMncnt: 0,
  manageCrdlAcntDvNm: "정상",
  lastTrDt: "2024-11-01",
  n1MrtgDvNm: "부동산",
  n2MrtgDvNm: "보증서",
  lastCptnDt: "2024-10-01",
  lastCptnDtArrRn: 0,
  arrRn: 0,
  pytNtrDt: "2024-11-01",
  n1lntrArrRn: 0,
  mmAcitrc: 0,
  ddAcitrc: 0,
  acitrc: 0,
  rvsDvNm: "",
  rvslntr: 0,
  n1ArrIntr: 0,
  frstlntr: 0,
  nxttrmPrncPytDt: "2024-12-01",
  prncArrRn: 0,
  n1NxttrmlntrPytDt: "2024-12-01",
  n2lntrArrRn: 0,
  prncArrAmt: 0,
  nrmllntr: 100000,
  arrs: 0,
  n2Arrlntr: 0,
  mngrNm: "관리자A",
  rptArrAmt: 0,
  dpstAcntNo: "",
  n1StgupAmt: 12000000,
  teamNm: "영업1팀",
  detailPrdctNm: "직장인신용대출",
  detailFndOgnlNm: "자체자금",
  n2NxttrmlntrPytDt: "",
  n1TpindClsNm: "제조업",
  n2TpindClsNm: "전자부품",
  eprzDvNm: "중소기업",
  eprzScINm: "소기업",
  brchNm: "강남지점",
  notytBilnNrmllntr: 0,
  notytBilnArrs: 0,
  notytBilnArrIntr: 0,
  psnlBsrno: "123-45-67890",
  psnlBzplNm: "행복상사",
  rbrno: "800101-1234567",
  rnmNo: "800101-1234567",
  icctno: "",
  bsrpNo: "123-45-67890",
  arrMncnt: 0,
  rptArrMncnt: 0,
  rptArrRn: 0,
  cndPtApprArrRn: 0,
  n1NrmlAmt: 9000000,
  n1AttenAmt: 0,
  n1FxnAmt: 0,
  n1DtclAmt: 0,
  n1EsissAmt: 0,
  dpslsvMrtqBlce: 0,
  mainMrtgKndNm: "아파트",
  n2StgupAmt: 0,
  apsdAmt: 20000000,
  n1UnsbdBondAmt: 0,
  n1ClctExpectAmt: 9000000,
  n2UnsbdBondAmt: 0,
  n2ClctExpectAmt: 0,
  cmtRgstrnDvNm: "미등록",
  afbd: 90000,
  apsdOrgnzNm: "한국감정원",
  apsdDt: "2022-12-01",
  brchDvNm: "본점",
  borwAddr: "서울시 강남구",
  wrplAddr: "서울시 서초구",
  addrPlcDvNm: "자가",
  wrplAddrDvNm: "본사",
  areaApplcDvNm: "서울",
  areaDvNm: "서울",
  hndlBnkNm: "친애저축은행",
  rptMrtgDvNm: "부동산",
  n3MrtgDvNm: "",
  n1MrtgKndNm: "아파트",
  loanMrtgPscndDvNm: "1순위",
  n2MrtgKndNm: "",
  cltLctPlcNm: "서울시 강남구",
  usdvNm: "운전자금",
  mrtgEvlAmt: 18000000,
  dcRto: 0,
  dcRtApplcMrtgEvlAmt: 18000000,
  unsbdStgupAmt: 0,
  etcUnsbdAmt: 0,
  thbkStqupAmt: 12000000,
  validMrtgAmt: 12000000,
  clctExpectAmt: 9000000,
  bfSndnRto: 100,
  lsmthLoanBlce: 9100000,
  IsmthAprpAmt: 91000,
  lsmthAprpRto: 1,
  lastArrRn: 0,
  arrSndnDstcd: "정상",
  arrDvNm: "정상",
  spnpytLfmSndn: "",
  spnpytDvNm: "",
  IfmDvNm: "",
  IfmNml: "",
  sslSubrgtSndnDstcd: "",
  sslSubrgtDvNm: "",
  ifisSndnDstcd: "",
  slmDvNm: "",
  kdnkRgstrnSndnDstcd: "",
  kdnkLnovPrd: "",
  kdnkArrRgstrnAmt: 0,
  chngSndnClsDvNm: "",
  dbtrDvNm: "주채무자",
  rdcxptModDvNm: "",
  aplcSttsDvNm: "",
  acntPrgsSttsNm: "정상",
  prncRdcxptYn: "N",
  totRpayPrd: "24개월",
  pytRn: 10,
  arrPrd: "",
  realArrPrd: "",
  credtRecvyXmptAmt: 0,
  perlSndnDstcd: "",
  perlAplcDvNm: "",
  sttsDvNm: "활동",
  rhbRprtngAmt: 0,
  rhbFxdAmt: 0,
  rpymtAmt: 0,
  pytRto: 0,
  rhbExemptAmt: 0,
  perlArrYn: "N",
  cobSndnDstcd: "",
  cobDvNm: "",
  pjDvNm: "",
  wkPmnSndnDstcd: "",
  autOpnnRjctnDvNm: "",
  dfcDvNm: "",
  imcapDvNm: "",
  brwmnyXcsDvNm: "",
  bkrpSndnDstcd: "",
  bkrpDbtrDvNm: "",
  bkrpSttsDvNm: "",
  dedSndnDstcd: "",
  dedDvNm: "",
  rghinfrSndn: "",
  rghInfr: "",
  etcSndnDstcd: "",
  etcClsNm: "",
  bfYyFxnEgblw: "",
  brnchExmnt: "",
  sndnClsDvNm: "정상",
  credtRecvySndnClsDvNm: "",
  perlOfpmsDcsDvNm: "",
  credtRecvyPerlSndnCls: "",
  sprsMinSndnDstcd: "",
  lastAplySndnDstcd: "정상",
  bfYyFxnEqblwSndn: "",
  brnchChngBrkdn: "",
  n2NrmlAmt: 0,
  n2NrmlAprpRto: 0,
  n2NrmlAprpAmt: 0,
  n2AttenAmt: 0,
  n2AttenAprpRto: 0,
  n2AttenAprpAmt: 0,
  n2FxnAmt: 0,
  n2FxnAprpRto: 0,
  n2FxnAprpAmt: 0,
  n2DtclAmt: 0,
  n2DtclAprpRto: 0,
  n2DtclAprpAmt: 0,
  n2EslssAmt: 0,
  n2EsissAprpRto: 0,
  n2EsissAprpAmt: 0,
  loanMnySum: 9000000 * (i + 1),
  aprpMny: 90000,
  thmmAprpMnyRto: 1,
  IsmthAprpMnyChngRto: 0,
  IsmthLoanMnyChngAmt: -100000,
  IsmthAprpMnyChngAmt: -1000,
  prmumNrmlAmt: 0,
  prmumNrmlAprpRto: 0,
  prmumNrmlAprpAmt: 0,
  prmumAttenAmt: 0,
  prmumAttenAprpRto: 0,
  prmumAttenAprpAmt: 0,
  prmumFxnAmt: 0,
  prmumFxnAprpRto: 0,
  prmumFxnAprpAmt: 0,
  prmumDtclAmt: 0,
  prmumDtclAprpRto: 0,
  prmumDtclAprpAmt: 0,
  prmumEsissAmt: 0,
  prmumEsissAprpRto: 0,
  prmumEsissAprpAmt: 0,
  prmumAmt: 0,
  prmumAprpAmt: 0,
  delYn: "N",
  frsRgstrnUsrno: "ADMIN",
  frsRgstrnDtm: "2024-11-20 10:00:00",
  lastChngUsrno: "ADMIN",
  lastChngDtm: "2024-11-20 10:00:00",
  usrNm: "관리자",
  hbrNm: "전산팀",
}));

// --- Columns ---
const columns: ColumnDef<AssetSoundnessVerificationData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "sndnYm", header: "건전성년월" },
  { accessorKey: "itmsNm", header: "과목명" },
  { accessorKey: "custNm", header: "고객명" },
  { accessorKey: "custNo", header: "고객번호" },
  { accessorKey: "acntNo", header: "계좌번호" },
  { accessorKey: "loanAmt", header: "대출금액" },
  { accessorKey: "loanBlce", header: "대출잔액" },
  { accessorKey: "itdiLoanMny", header: "과목별대출금" },
  { accessorKey: "itdiAcntCnt", header: "과목별계좌수" },
  { accessorKey: "custLoanMny", header: "고객대출금" },
  { accessorKey: "custAcntCnt", header: "고객계좌수" },
  { accessorKey: "loanPrdMncnt", header: "대출기간월수" },
  { accessorKey: "loanPrdDycnt", header: "대출기간일수" },
  { accessorKey: "loanDt", header: "대출일자" },
  { accessorKey: "expDt", header: "만기일자" },
  { accessorKey: "expDdArrMncnt", header: "만기일연체" },
  { accessorKey: "lastIntrPytDt", header: "최종이자납입일" },
  { accessorKey: "rpayMthNm", header: "상환방법" },
  { accessorKey: "dycntDvNm", header: "일수구분" },
  { accessorKey: "irt", header: "이율" },
  { accessorKey: "arrIrt", header: "연체이율" },
  { accessorKey: "stffDvNm", header: "상계구분" },
  { accessorKey: "stffDt", header: "상계일자" },
  { accessorKey: "manageTrnsferDt", header: "관리이관일자" },
  { accessorKey: "lotbDvNm", header: "기한이익상실구분" },
  { accessorKey: "lotbDt", header: "기한이익상실일" },
  { accessorKey: "bntmArrMncnt", header: "기한이익연체" },
  { accessorKey: "manageCrdlAcntDvNm", header: "관리여신계좌구분" },
  { accessorKey: "lastTrDt", header: "최종거래일자" },
  { accessorKey: "n1MrtgDvNm", header: "1담보구분" },
  { accessorKey: "n2MrtgDvNm", header: "2담보구분" },
  { accessorKey: "lastCptnDt", header: "최종이수일자" },
  { accessorKey: "lastCptnDtArrRn", header: "최종이수일자연체회차" },
  { accessorKey: "arrRn", header: "연체회차" },
  { accessorKey: "pytNtrDt", header: "납입응당일" },
  { accessorKey: "n1lntrArrRn", header: "1이자연체회차" },
  { accessorKey: "mmAcitrc", header: "월미수이자" },
  { accessorKey: "ddAcitrc", header: "일미수이자" },
  { accessorKey: "acitrc", header: "미수이자" },
  { accessorKey: "rvsDvNm", header: "보정구분" },
  { accessorKey: "rvslntr", header: "보정이자" },
  { accessorKey: "n1ArrIntr", header: "1연체이자" },
  { accessorKey: "frstlntr", header: "서수이자" },
  { accessorKey: "nxttrmPrncPytDt", header: "차기원금납입일" },
  { accessorKey: "prncArrRn", header: "원금연체회차" },
  { accessorKey: "n1NxttrmlntrPytDt", header: "1차기이자납입일" },
  { accessorKey: "n2lntrArrRn", header: "2이자연체회차" },
  { accessorKey: "prncArrAmt", header: "원금연체금액" },
  { accessorKey: "nrmllntr", header: "정상이자" },
  { accessorKey: "arrs", header: "연체료" },
  { accessorKey: "n2Arrlntr", header: "2연체이자" },
  { accessorKey: "mngrNm", header: "관리자" },
  { accessorKey: "rptArrAmt", header: "보고연체금액" },
  { accessorKey: "dpstAcntNo", header: "수신계좌번호" },
  { accessorKey: "n1StgupAmt", header: "1설정금액" },
  { accessorKey: "teamNm", header: "팀명" },
  { accessorKey: "detailPrdctNm", header: "세부상품명" },
  { accessorKey: "detailFndOgnlNm", header: "세부자금원" },
  { accessorKey: "n2NxttrmlntrPytDt", header: "2차기이자납입일" },
  { accessorKey: "n1TpindClsNm", header: "1업종분류" },
  { accessorKey: "n2TpindClsNm", header: "2업종분류" },
  { accessorKey: "eprzDvNm", header: "기업구분" },
  { accessorKey: "eprzScINm", header: "기업규모" },
  { accessorKey: "brchNm", header: "지점명" },
  { accessorKey: "notytBilnNrmllntr", header: "미징구정상이자" },
  { accessorKey: "notytBilnArrs", header: "미징구연체료" },
  { accessorKey: "notytBilnArrIntr", header: "미징구연체이자" },
  { accessorKey: "psnlBsrno", header: "개인사업자등록번호" },
  { accessorKey: "psnlBzplNm", header: "개인사업장명" },
  { accessorKey: "rbrno", header: "주민등록/사업자번호" },
  { accessorKey: "rnmNo", header: "실명번호" },
  { accessorKey: "icctno", header: "법인등록번호" },
  { accessorKey: "bsrpNo", header: "사업자번호" },
  { accessorKey: "arrMncnt", header: "연체월수" },
  { accessorKey: "rptArrMncnt", header: "보고연체월수" },
  { accessorKey: "rptArrRn", header: "보고연체회차" },
  { accessorKey: "cndPtApprArrRn", header: "조건부연체" },
  { accessorKey: "n1NrmlAmt", header: "1정상금액" },
  { accessorKey: "n1AttenAmt", header: "1요주의금액" },
  { accessorKey: "n1FxnAmt", header: "1고정금액" },
  { accessorKey: "n1DtclAmt", header: "1회수의문금액" },
  { accessorKey: "n1EsissAmt", header: "1추정손실금액" },
  { accessorKey: "dpslsvMrtqBlce", header: "예금적금담보잔액" },
  { accessorKey: "mainMrtgKndNm", header: "주담보종류" },
  { accessorKey: "n2StgupAmt", header: "2설정금액" },
  { accessorKey: "apsdAmt", header: "감정금액" },
  { accessorKey: "n1UnsbdBondAmt", header: "1선순위채권금액" },
  { accessorKey: "n1ClctExpectAmt", header: "1회수예상금액" },
  { accessorKey: "n2UnsbdBondAmt", header: "2선순위채권금액" },
  { accessorKey: "n2ClctExpectAmt", header: "2회수예상금액" },
  { accessorKey: "cmtRgstrnDvNm", header: "신용관리대상등록여부" },
  { accessorKey: "afbd", header: "대손충당금" },
  { accessorKey: "apsdOrgnzNm", header: "감정기관" },
  { accessorKey: "apsdDt", header: "감정일자" },
  { accessorKey: "brchDvNm", header: "지점구분" },
  { accessorKey: "borwAddr", header: "차주주소지" },
  { accessorKey: "wrplAddr", header: "직장주소지" },
  { accessorKey: "addrPlcDvNm", header: "주소지구분" },
  { accessorKey: "wrplAddrDvNm", header: "직장주소구분" },
  { accessorKey: "areaApplcDvNm", header: "지역적용" },
  { accessorKey: "areaDvNm", header: "지역구분" },
  { accessorKey: "hndlBnkNm", header: "취급은행" },
  { accessorKey: "rptMrtgDvNm", header: "보고담보구분" },
  { accessorKey: "n3MrtgDvNm", header: "3담보구분" },
  { accessorKey: "n1MrtgKndNm", header: "1담보종류" },
  { accessorKey: "loanMrtgPscndDvNm", header: "대출담보현황구분" },
  { accessorKey: "n2MrtgKndNm", header: "2담보종류" },
  { accessorKey: "cltLctPlcNm", header: "담보물소재지" },
  { accessorKey: "usdvNm", header: "용도" },
  { accessorKey: "mrtgEvlAmt", header: "담보평가금액" },
  { accessorKey: "dcRto", header: "할인비율" },
  { accessorKey: "dcRtApplcMrtgEvlAmt", header: "할인율적용담보평가금액" },
  { accessorKey: "unsbdStgupAmt", header: "선순위설정금액" },
  { accessorKey: "etcUnsbdAmt", header: "기타선순위금액" },
  { accessorKey: "thbkStqupAmt", header: "당행설정금액" },
  { accessorKey: "validMrtgAmt", header: "유효담보금액" },
  { accessorKey: "clctExpectAmt", header: "회수예상금액" },
  { accessorKey: "bfSndnRto", header: "인수건전성비율" },
  { accessorKey: "lsmthLoanBlce", header: "전월대출잔액" },
  { accessorKey: "IsmthAprpAmt", header: "전월충당금액" },
  { accessorKey: "lsmthAprpRto", header: "전월충당비율" },
  { accessorKey: "lastArrRn", header: "최종연체회차" },
  { accessorKey: "arrSndnDstcd", header: "연체건전성" },
  { accessorKey: "arrDvNm", header: "연체구분" },
  { accessorKey: "spnpytLfmSndn", header: "가지급금법수속건전성" },
  { accessorKey: "spnpytDvNm", header: "가지급금" },
  { accessorKey: "IfmDvNm", header: "법수속" },
  { accessorKey: "IfmNml", header: "법수속정상화" },
  { accessorKey: "sslSubrgtSndnDstcd", header: "햇살론대위변제건전성" },
  { accessorKey: "sslSubrgtDvNm", header: "햇살론대위변제" },
  { accessorKey: "ifisSndnDstcd", header: "IFIS건전성" },
  { accessorKey: "slmDvNm", header: "슬로몬 PW" },
  { accessorKey: "kdnkRgstrnSndnDstcd", header: "은행연합회등록건전성" },
  { accessorKey: "kdnkLnovPrd", header: "은행연합회최장연체기간" },
  { accessorKey: "kdnkArrRgstrnAmt", header: "으행연합회연체등록금액" },
  { accessorKey: "chngSndnClsDvNm", header: "신용회복 건전성" },
  { accessorKey: "dbtrDvNm", header: "채무자구분" },
  { accessorKey: "rdcxptModDvNm", header: "감면방식" },
  { accessorKey: "aplcSttsDvNm", header: "신청인상태" },
  { accessorKey: "acntPrgsSttsNm", header: "계좌진행상태내용" },
  { accessorKey: "prncRdcxptYn", header: "원금감면여부" },
  { accessorKey: "totRpayPrd", header: "총상환기간" },
  { accessorKey: "pytRn", header: "납일회차" },
  { accessorKey: "arrPrd", header: "연체기간" },
  { accessorKey: "realArrPrd", header: "실제연체기간" },
  { accessorKey: "credtRecvyXmptAmt", header: "신용회복면책금액" },
  { accessorKey: "perlSndnDstcd", header: "개인회생건전성" },
  { accessorKey: "perlAplcDvNm", header: "개인회생신청인구분" },
  { accessorKey: "sttsDvNm", header: "상태" },
  { accessorKey: "rhbRprtngAmt", header: "회생신고금액" },
  { accessorKey: "rhbFxdAmt", header: "회생확정금액" },
  { accessorKey: "rpymtAmt", header: "변제누계" },
  { accessorKey: "pytRto", header: "납입비율" },
  { accessorKey: "rhbExemptAmt", header: "회생면제금액" },
  { accessorKey: "perlArrYn", header: "개인회생연체여부" },
  { accessorKey: "cobSndnDstcd", header: "폐업건전성" },
  { accessorKey: "cobDvNm", header: "폐업" },
  { accessorKey: "pjDvNm", header: "프로젝트" },
  { accessorKey: "wkPmnSndnDstcd", header: "부실징후건전성" },
  { accessorKey: "autOpnnRjctnDvNm", header: "감사의견거절" },
  { accessorKey: "dfcDvNm", header: "결손" },
  { accessorKey: "imcapDvNm", header: "자본잠식" },
  { accessorKey: "brwmnyXcsDvNm", header: "차입금조과" },
  { accessorKey: "bkrpSndnDstcd", header: "파산건전성" },
  { accessorKey: "bkrpDbtrDvNm", header: "파산채무자구분" },
  { accessorKey: "bkrpSttsDvNm", header: "파산상태" },
  { accessorKey: "dedSndnDstcd", header: "사망자건전성" },
  { accessorKey: "dedDvNm", header: "사망자" },
  { accessorKey: "rghinfrSndn", header: "권리침해건전성" },
  { accessorKey: "rghInfr", header: "권리침해" },
  { accessorKey: "etcSndnDstcd", header: "기타건전성" },
  { accessorKey: "etcClsNm", header: "기타분류" },
  { accessorKey: "bfYyFxnEgblw", header: "전년도고정이하" },
  { accessorKey: "brnchExmnt", header: "영업점검토" },
  { accessorKey: "sndnClsDvNm", header: "건전성분류" },
  { accessorKey: "credtRecvySndnClsDvNm", header: "신용회복건전성분류" },
  { accessorKey: "perlOfpmsDcsDvNm", header: "개인회생인가결정" },
  { accessorKey: "credtRecvyPerlSndnCls", header: "신용회복개인회생건전성분류" },
  { accessorKey: "sprsMinSndnDstcd", header: "동일인최소건전성" },
  { accessorKey: "lastAplySndnDstcd", header: "최종반영건전성" },
  { accessorKey: "bfYyFxnEqblwSndn", header: "전년도고정이하반영건전성" },
  { accessorKey: "brnchChngBrkdn", header: "영업점변경내역" },
  { accessorKey: "n2NrmlAmt", header: "2정상금액" },
  { accessorKey: "n2NrmlAprpRto", header: "2정상충당비율" },
  { accessorKey: "n2NrmlAprpAmt", header: "2정상충당금액" },
  { accessorKey: "n2AttenAmt", header: "2요주의금액" },
  { accessorKey: "n2AttenAprpRto", header: "2요주의충당비율" },
  { accessorKey: "n2AttenAprpAmt", header: "2요주의충당금액" },
  { accessorKey: "n2FxnAmt", header: "2고정금액" },
  { accessorKey: "n2FxnAprpRto", header: "2고정충당비율" },
  { accessorKey: "n2FxnAprpAmt", header: "2고정충당금액" },
  { accessorKey: "n2DtclAmt", header: "2회수의문금액" },
  { accessorKey: "n2DtclAprpRto", header: "2회수의문충당비율" },
  { accessorKey: "n2DtclAprpAmt", header: "2회수의문충당금액" },
  { accessorKey: "n2EslssAmt", header: "2추정손실금액" },
  { accessorKey: "n2EsissAprpRto", header: "2추정손실충당비을" },
  { accessorKey: "n2EsissAprpAmt", header: "2추정손실충당금액" },
  { accessorKey: "loanMnySum", header: "대출금합계" },
  { accessorKey: "aprpMny", header: "충당금" },
  { accessorKey: "thmmAprpMnyRto", header: "당월충당금비율" },
  { accessorKey: "IsmthAprpMnyChngRto", header: "전퀄충당금변경비율" },
  { accessorKey: "IsmthLoanMnyChngAmt", header: "전월대출금변경금액" },
  { accessorKey: "IsmthAprpMnyChngAmt", header: "전월충당금변경금액" },
  { accessorKey: "prmumNrmlAmt", header: "할증정상금액" },
  { accessorKey: "prmumNrmlAprpRto", header: "할증정상충당비율" },
  { accessorKey: "prmumNrmlAprpAmt", header: "할증정상충망금액" },
  { accessorKey: "prmumAttenAmt", header: "할증요주의금액" },
  { accessorKey: "prmumAttenAprpRto", header: "할증요주의충당비율" },
  { accessorKey: "prmumAttenAprpAmt", header: "할증요주의충당금액" },
  { accessorKey: "prmumFxnAmt", header: "할증고정금액" },
  { accessorKey: "prmumFxnAprpRto", header: "할증고정충당비율" },
  { accessorKey: "prmumFxnAprpAmt", header: "할증고정충당금액" },
  { accessorKey: "prmumDtclAmt", header: "할증회수의문금액" },
  { accessorKey: "prmumDtclAprpRto", header: "할증회수의문충당비율" },
  { accessorKey: "prmumDtclAprpAmt", header: "할증회수의문충당금액" },
  { accessorKey: "prmumEsissAmt", header: "할증추정손실금액" },
  { accessorKey: "prmumEsissAprpRto", header: "할증추정손실충당비율" },
  { accessorKey: "prmumEsissAprpAmt", header: "할증추정손실충당금액" },
  { accessorKey: "prmumAmt", header: "할증금액" },
  { accessorKey: "prmumAprpAmt", header: "할증충당금액" },
  { accessorKey: "delYn", header: "삭제여부" },
  { accessorKey: "frsRgstrnUsrno", header: "최조등록사용자번호" },
  { accessorKey: "frsRgstrnDtm", header: "최조등록일시" },
  { accessorKey: "lastChngUsrno", header: "최종변경사용자번호" },
  { accessorKey: "lastChngDtm", header: "최종변경일시" },
  { accessorKey: "usrNm", header: "사용자이름" },
  { accessorKey: "hbrNm", header: "사용자지점" },
];

export default function AssetSoundnessVerificationPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData } = usePageStore();
  const [filters, setFilters] = useState<Record<string, any>>(currentState?.filters || {});

  // 로컬 상태로 테이블 데이터를 관리하거나 store의 데이터를 사용
  const tableData = useMemo(() => 
    currentState?.tables?.['soundnessVerificationTable'] || [], 
    [currentState?.tables]
  );

  // 초기 로드 시 목업 데이터 설정 (실제로는 API 호출)
  useEffect(() => {
    if (!currentState?.tables?.['soundnessVerificationTable']) {
      updateTableData(tabId, 'soundnessVerificationTable', mockData);
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
        handleFilterChange("customer", customer.customerName);
        // handleFilterChange("custNo", customer.centralCustomerNumber); // 필요한 경우
      }
    });
    return cleanup;
  }, [tabId]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
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
      columns: 2,
      filters: [
        {
          name: "soundnessMonth",
          type: "select",
          label: "분류년월",
          options: [
            { value: "202411", label: "2024-11" },
            { value: "202410", label: "2024-10" },
          ],
        },
        {
          name: "customer",
          type: "long-search",
          label: "고객번호",
          readonly: true,
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
          name: "subject",
          type: "select",
          label: "과목명",
          options: [
            { value: "all", label: "전체" },
            { value: "general", label: "일반자금대출" },
            { value: "facility", label: "시설자금대출" },
          ],
        },
        {
          name: "accountNumber",
          type: "text",
          label: "계좌번호",
        },
      ],
    },
  ], [tabId]);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    updateTableData(tabId, 'soundnessVerificationTable', mockData);
  };

  const handleExcelDownload = () => {
    alert("엑셀 다운로드 실행");
  };

  if (!currentState) return null;

  // 금액 포맷팅이 필요한 컬럼 리스트
  const amountColumns = [
    "loanAmt", "loanBlce", "itdiLoanMny", "custLoanMny", "mmAcitrc", "ddAcitrc", "acitrc", "rvslntr", 
    "n1ArrIntr", "frstlntr", "prncArrAmt", "nrmllntr", "arrs", "n2Arrlntr", "rptArrAmt", "n1StgupAmt", 
    "notytBilnNrmllntr", "notytBilnArrs", "notytBilnArrIntr", "n1NrmlAmt", "n1AttenAmt", "n1FxnAmt", 
    "n1DtclAmt", "n1EsissAmt", "dpslsvMrtqBlce", "n2StgupAmt", "apsdAmt", "n1UnsbdBondAmt", "n1ClctExpectAmt", 
    "n2UnsbdBondAmt", "n2ClctExpectAmt", "afbd", "mrtgEvlAmt", "dcRtApplcMrtgEvlAmt", "unsbdStgupAmt", 
    "etcUnsbdAmt", "thbkStqupAmt", "validMrtgAmt", "clctExpectAmt", "lsmthLoanBlce", "IsmthAprpAmt", 
    "kdnkArrRgstrnAmt", "credtRecvyXmptAmt", "rhbRprtngAmt", "rhbFxdAmt", "rpymtAmt", "rhbExemptAmt", 
    "n2NrmlAmt", "n2NrmlAprpAmt", "n2AttenAmt", "n2AttenAprpAmt", "n2FxnAmt", "n2FxnAprpAmt", "n2DtclAmt", 
    "n2DtclAprpAmt", "n2EslssAmt", "n2EsissAprpAmt", "loanMnySum", "aprpMny", "IsmthLoanMnyChngAmt", 
    "IsmthAprpMnyChngAmt", "prmumNrmlAmt", "prmumNrmlAprpAmt", "prmumAttenAmt", "prmumAttenAprpAmt", 
    "prmumFxnAmt", "prmumFxnAprpAmt", "prmumDtclAmt", "prmumDtclAprpAmt", "prmumEsissAmt", "prmumEsissAprpAmt", 
    "prmumAmt", "prmumAprpAmt"
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">자산건전성 검증</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>자산건전성/대손상각</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>자산건전성 검증</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "search", onClick: handleSearch },
            { id: "excel", onClick: handleExcelDownload },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">검색 조건</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="조회 내역"
        columns={columns}
        data={tableData}
        amountColumns={amountColumns}
        minWidth="1820px"
      />
    </div>
  );
}

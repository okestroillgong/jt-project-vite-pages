

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
  id: number; // ?쒕쾲
  sndnYm: string; // 嫄댁쟾?깅뀈??  itmsNm: string; // 怨쇰ぉ紐?  custNm: string; // 怨좉컼紐?  custNo: string; // 怨좉컼踰덊샇
  acntNo: string; // 怨꾩쥖踰덊샇
  loanAmt: number; // ?異쒓툑??  loanBlce: number; // ?異쒖옍??  itdiLoanMny: number; // 怨쇰ぉ蹂꾨?異쒓툑
  itdiAcntCnt: number; // 怨쇰ぉ蹂꾧퀎醫뚯닔
  custLoanMny: number; // 怨좉컼?異쒓툑
  custAcntCnt: number; // 怨좉컼怨꾩쥖??  loanPrdMncnt: number; // ?異쒓린媛꾩썡??  loanPrdDycnt: number; // ?異쒓린媛꾩씪??  loanDt: string; // ?異쒖씪??  expDt: string; // 留뚭린?쇱옄
  expDdArrMncnt: number; // 留뚭린?쇱뿰泥?  lastIntrPytDt: string; // 理쒖쥌?댁옄?⑹엯??  rpayMthNm: string; // ?곹솚諛⑸쾿
  dycntDvNm: string; // ?쇱닔援щ텇
  irt: number; // ?댁쑉
  arrIrt: number; // ?곗껜?댁쑉
  stffDvNm: string; // ?곴퀎援щ텇
  stffDt: string; // ?곴퀎?쇱옄
  manageTrnsferDt: string; // 愿由ъ씠愿?쇱옄
  lotbDvNm: string; // 湲고븳?댁씡?곸떎援щ텇
  lotbDt: string; // 湲고븳?댁씡?곸떎??  bntmArrMncnt: number; // 湲고븳?댁씡?곗껜
  manageCrdlAcntDvNm: string; // 愿由ъ뿬?좉퀎醫뚭뎄遺?  lastTrDt: string; // 理쒖쥌嫄곕옒?쇱옄
  n1MrtgDvNm: string; // 1?대낫援щ텇
  n2MrtgDvNm: string; // 2?대낫援щ텇
  lastCptnDt: string; // 理쒖쥌?댁닔?쇱옄
  lastCptnDtArrRn: number; // 理쒖쥌?댁닔?쇱옄?곗껜?뚯감
  arrRn: number; // ?곗껜?뚯감
  pytNtrDt: string; // ?⑹엯?묐떦??  n1lntrArrRn: number; // 1?댁옄?곗껜?뚯감
  mmAcitrc: number; // ?붾??섏씠??  ddAcitrc: number; // ?쇰??섏씠??  acitrc: number; // 誘몄닔?댁옄
  rvsDvNm: string; // 蹂댁젙援щ텇
  rvslntr: number; // 蹂댁젙?댁옄
  n1ArrIntr: number; // 1?곗껜?댁옄
  frstlntr: number; // ?쒖닔?댁옄
  nxttrmPrncPytDt: string; // 李④린?먭툑?⑹엯??  prncArrRn: number; // ?먭툑?곗껜?뚯감
  n1NxttrmlntrPytDt: string; // 1李④린?댁옄?⑹엯??  n2lntrArrRn: number; // 2?댁옄?곗껜?뚯감
  prncArrAmt: number; // ?먭툑?곗껜湲덉븸
  nrmllntr: number; // ?뺤긽?댁옄
  arrs: number; // ?곗껜猷?  n2Arrlntr: number; // 2?곗껜?댁옄
  mngrNm: string; // 愿由ъ옄
  rptArrAmt: number; // 蹂닿퀬?곗껜湲덉븸
  dpstAcntNo: string; // ?섏떊怨꾩쥖踰덊샇
  n1StgupAmt: number; // 1?ㅼ젙湲덉븸
  teamNm: string; // ?紐?  detailPrdctNm: string; // ?몃??곹뭹紐?  detailFndOgnlNm: string; // ?몃??먭툑??  n2NxttrmlntrPytDt: string; // 2李④린?댁옄?⑹엯??  n1TpindClsNm: string; // 1?낆쥌遺꾨쪟
  n2TpindClsNm: string; // 2?낆쥌遺꾨쪟
  eprzDvNm: string; // 湲곗뾽援щ텇
  eprzScINm: string; // 湲곗뾽洹쒕え
  brchNm: string; // 吏?먮챸
  notytBilnNrmllntr: number; // 誘몄쭠援ъ젙?곸씠??  notytBilnArrs: number; // 誘몄쭠援ъ뿰泥대즺
  notytBilnArrIntr: number; // 誘몄쭠援ъ뿰泥댁씠??  psnlBsrno: string; // 媛쒖씤?ъ뾽?먮벑濡앸쾲??  psnlBzplNm: string; // 媛쒖씤?ъ뾽?λ챸
  rbrno: string; // 二쇰??깅줉/?ъ뾽?먮쾲??  rnmNo: string; // ?ㅻ챸踰덊샇
  icctno: string; // 踰뺤씤?깅줉踰덊샇
  bsrpNo: string; // ?ъ뾽?먮쾲??  arrMncnt: number; // ?곗껜?붿닔
  rptArrMncnt: number; // 蹂닿퀬?곗껜?붿닔
  rptArrRn: number; // 蹂닿퀬?곗껜?뚯감
  cndPtApprArrRn: number; // 議곌굔遺?곗껜
  n1NrmlAmt: number; // 1?뺤긽湲덉븸
  n1AttenAmt: number; // 1?붿＜?섍툑??  n1FxnAmt: number; // 1怨좎젙湲덉븸
  n1DtclAmt: number; // 1?뚯닔?섎Ц湲덉븸
  n1EsissAmt: number; // 1異붿젙?먯떎湲덉븸
  dpslsvMrtqBlce: number; // ?덇툑?곴툑?대낫?붿븸
  mainMrtgKndNm: string; // 二쇰떞蹂댁쥌瑜?  n2StgupAmt: number; // 2?ㅼ젙湲덉븸
  apsdAmt: number; // 媛먯젙湲덉븸
  n1UnsbdBondAmt: number; // 1?좎닚?꾩콈沅뚭툑??  n1ClctExpectAmt: number; // 1?뚯닔?덉긽湲덉븸
  n2UnsbdBondAmt: number; // 2?좎닚?꾩콈沅뚭툑??  n2ClctExpectAmt: number; // 2?뚯닔?덉긽湲덉븸
  cmtRgstrnDvNm: string; // ?좎슜愿由щ??곷벑濡앹뿬遺
  afbd: number; // ??먯땐?밴툑
  apsdOrgnzNm: string; // 媛먯젙湲곌?
  apsdDt: string; // 媛먯젙?쇱옄
  brchDvNm: string; // 吏?먭뎄遺?  borwAddr: string; // 李⑥＜二쇱냼吏
  wrplAddr: string; // 吏곸옣二쇱냼吏
  addrPlcDvNm: string; // 二쇱냼吏援щ텇
  wrplAddrDvNm: string; // 吏곸옣二쇱냼援щ텇
  areaApplcDvNm: string; // 吏??쟻??  areaDvNm: string; // 吏??뎄遺?  hndlBnkNm: string; // 痍④툒???  rptMrtgDvNm: string; // 蹂닿퀬?대낫援щ텇
  n3MrtgDvNm: string; // 3?대낫援щ텇
  n1MrtgKndNm: string; // 1?대낫醫낅쪟
  loanMrtgPscndDvNm: string; // ?異쒕떞蹂댄쁽?⑷뎄遺?  n2MrtgKndNm: string; // 2?대낫醫낅쪟
  cltLctPlcNm: string; // ?대낫臾쇱냼?ъ?
  usdvNm: string; // ?⑸룄
  mrtgEvlAmt: number; // ?대낫?됯?湲덉븸
  dcRto: number; // ?좎씤鍮꾩쑉
  dcRtApplcMrtgEvlAmt: number; // ?좎씤?⑥쟻?⑸떞蹂댄룊媛湲덉븸
  unsbdStgupAmt: number; // ?좎닚?꾩꽕?뺢툑??  etcUnsbdAmt: number; // 湲고??좎닚?꾧툑??  thbkStqupAmt: number; // ?뱁뻾?ㅼ젙湲덉븸
  validMrtgAmt: number; // ?좏슚?대낫湲덉븸
  clctExpectAmt: number; // ?뚯닔?덉긽湲덉븸
  bfSndnRto: number; // ?몄닔嫄댁쟾?깅퉬??  lsmthLoanBlce: number; // ?꾩썡?異쒖옍??  IsmthAprpAmt: number; // ?꾩썡異⑸떦湲덉븸
  lsmthAprpRto: number; // ?꾩썡異⑸떦鍮꾩쑉
  lastArrRn: number; // 理쒖쥌?곗껜?뚯감
  arrSndnDstcd: string; // ?곗껜嫄댁쟾??  arrDvNm: string; // ?곗껜援щ텇
  spnpytLfmSndn: string; // 媛吏湲됯툑踰뺤닔?띻굔?꾩꽦
  spnpytDvNm: string; // 媛吏湲됯툑
  IfmDvNm: string; // 踰뺤닔??  IfmNml: string; // 踰뺤닔?띿젙?곹솕
  sslSubrgtSndnDstcd: string; // ?뉗궡濡좊??꾨??쒓굔?꾩꽦
  sslSubrgtDvNm: string; // ?뉗궡濡좊??꾨???  ifisSndnDstcd: string; // IFIS嫄댁쟾??  slmDvNm: string; // ?щ줈紐?PW
  kdnkRgstrnSndnDstcd: string; // ??됱뿰?⑺쉶?깅줉嫄댁쟾??  kdnkLnovPrd: string; // ??됱뿰?⑺쉶理쒖옣?곗껜湲곌컙
  kdnkArrRgstrnAmt: number; // ?쇳뻾?고빀?뚯뿰泥대벑濡앷툑??  chngSndnClsDvNm: string; // ?좎슜?뚮났 嫄댁쟾??  dbtrDvNm: string; // 梨꾨Т?먭뎄遺?  rdcxptModDvNm: string; // 媛먮㈃諛⑹떇
  aplcSttsDvNm: string; // ?좎껌?몄긽??  acntPrgsSttsNm: string; // 怨꾩쥖吏꾪뻾?곹깭?댁슜
  prncRdcxptYn: string; // ?먭툑媛먮㈃?щ?
  totRpayPrd: string; // 珥앹긽?섍린媛?  pytRn: number; // ?⑹씪?뚯감
  arrPrd: string; // ?곗껜湲곌컙
  realArrPrd: string; // ?ㅼ젣?곗껜湲곌컙
  credtRecvyXmptAmt: number; // ?좎슜?뚮났硫댁콉湲덉븸
  perlSndnDstcd: string; // 媛쒖씤?뚯깮嫄댁쟾??  perlAplcDvNm: string; // 媛쒖씤?뚯깮?좎껌?멸뎄遺?  sttsDvNm: string; // ?곹깭
  rhbRprtngAmt: number; // ?뚯깮?좉퀬湲덉븸
  rhbFxdAmt: number; // ?뚯깮?뺤젙湲덉븸
  rpymtAmt: number; // 蹂?쒕늻怨?  pytRto: number; // ?⑹엯鍮꾩쑉
  rhbExemptAmt: number; // ?뚯깮硫댁젣湲덉븸
  perlArrYn: string; // 媛쒖씤?뚯깮?곗껜?щ?
  cobSndnDstcd: string; // ?먯뾽嫄댁쟾??  cobDvNm: string; // ?먯뾽
  pjDvNm: string; // ?꾨줈?앺듃
  wkPmnSndnDstcd: string; // 遺?ㅼ쭠?꾧굔?꾩꽦
  autOpnnRjctnDvNm: string; // 媛먯궗?섍껄嫄곗젅
  dfcDvNm: string; // 寃곗넀
  imcapDvNm: string; // ?먮낯?좎떇
  brwmnyXcsDvNm: string; // 李⑥엯湲덉“怨?  bkrpSndnDstcd: string; // ?뚯궛嫄댁쟾??  bkrpDbtrDvNm: string; // ?뚯궛梨꾨Т?먭뎄遺?  bkrpSttsDvNm: string; // ?뚯궛?곹깭
  dedSndnDstcd: string; // ?щ쭩?먭굔?꾩꽦
  dedDvNm: string; // ?щ쭩??  rghinfrSndn: string; // 沅뚮━移⑦빐嫄댁쟾??  rghInfr: string; // 沅뚮━移⑦빐
  etcSndnDstcd: string; // 湲고?嫄댁쟾??  etcClsNm: string; // 湲고?遺꾨쪟
  bfYyFxnEgblw: string; // ?꾨뀈?꾧퀬?뺤씠??  brnchExmnt: string; // ?곸뾽?먭???  sndnClsDvNm: string; // 嫄댁쟾?깅텇瑜?  credtRecvySndnClsDvNm: string; // ?좎슜?뚮났嫄댁쟾?깅텇瑜?  perlOfpmsDcsDvNm: string; // 媛쒖씤?뚯깮?멸?寃곗젙
  credtRecvyPerlSndnCls: string; // ?좎슜?뚮났媛쒖씤?뚯깮嫄댁쟾?깅텇瑜?  sprsMinSndnDstcd: string; // ?숈씪?몄턀?뚭굔?꾩꽦
  lastAplySndnDstcd: string; // 理쒖쥌諛섏쁺嫄댁쟾??  bfYyFxnEqblwSndn: string; // ?꾨뀈?꾧퀬?뺤씠?섎컲?곴굔?꾩꽦
  brnchChngBrkdn: string; // ?곸뾽?먮?寃쎈궡??  n2NrmlAmt: number; // 2?뺤긽湲덉븸
  n2NrmlAprpRto: number; // 2?뺤긽異⑸떦鍮꾩쑉
  n2NrmlAprpAmt: number; // 2?뺤긽異⑸떦湲덉븸
  n2AttenAmt: number; // 2?붿＜?섍툑??  n2AttenAprpRto: number; // 2?붿＜?섏땐?밸퉬??  n2AttenAprpAmt: number; // 2?붿＜?섏땐?밴툑??  n2FxnAmt: number; // 2怨좎젙湲덉븸
  n2FxnAprpRto: number; // 2怨좎젙異⑸떦鍮꾩쑉
  n2FxnAprpAmt: number; // 2怨좎젙異⑸떦湲덉븸
  n2DtclAmt: number; // 2?뚯닔?섎Ц湲덉븸
  n2DtclAprpRto: number; // 2?뚯닔?섎Ц異⑸떦鍮꾩쑉
  n2DtclAprpAmt: number; // 2?뚯닔?섎Ц異⑸떦湲덉븸
  n2EslssAmt: number; // 2異붿젙?먯떎湲덉븸
  n2EsissAprpRto: number; // 2異붿젙?먯떎異⑸떦鍮꾩쓣
  n2EsissAprpAmt: number; // 2異붿젙?먯떎異⑸떦湲덉븸
  loanMnySum: number; // ?異쒓툑?⑷퀎
  aprpMny: number; // 異⑸떦湲?  thmmAprpMnyRto: number; // ?뱀썡異⑸떦湲덈퉬??  IsmthAprpMnyChngRto: number; // ?꾪꾩땐?밴툑蹂寃쎈퉬??  IsmthLoanMnyChngAmt: number; // ?꾩썡?異쒓툑蹂寃쎄툑??  IsmthAprpMnyChngAmt: number; // ?꾩썡異⑸떦湲덈?寃쎄툑??  prmumNrmlAmt: number; // ?좎쬆?뺤긽湲덉븸
  prmumNrmlAprpRto: number; // ?좎쬆?뺤긽異⑸떦鍮꾩쑉
  prmumNrmlAprpAmt: number; // ?좎쬆?뺤긽異⑸쭩湲덉븸
  prmumAttenAmt: number; // ?좎쬆?붿＜?섍툑??  prmumAttenAprpRto: number; // ?좎쬆?붿＜?섏땐?밸퉬??  prmumAttenAprpAmt: number; // ?좎쬆?붿＜?섏땐?밴툑??  prmumFxnAmt: number; // ?좎쬆怨좎젙湲덉븸
  prmumFxnAprpRto: number; // ?좎쬆怨좎젙異⑸떦鍮꾩쑉
  prmumFxnAprpAmt: number; // ?좎쬆怨좎젙異⑸떦湲덉븸
  prmumDtclAmt: number; // ?좎쬆?뚯닔?섎Ц湲덉븸
  prmumDtclAprpRto: number; // ?좎쬆?뚯닔?섎Ц異⑸떦鍮꾩쑉
  prmumDtclAprpAmt: number; // ?좎쬆?뚯닔?섎Ц異⑸떦湲덉븸
  prmumEsissAmt: number; // ?좎쬆異붿젙?먯떎湲덉븸
  prmumEsissAprpRto: number; // ?좎쬆異붿젙?먯떎異⑸떦鍮꾩쑉
  prmumEsissAprpAmt: number; // ?좎쬆異붿젙?먯떎異⑸떦湲덉븸
  prmumAmt: number; // ?좎쬆湲덉븸
  prmumAprpAmt: number; // ?좎쬆異⑸떦湲덉븸
  delYn: string; // ??젣?щ?
  frsRgstrnUsrno: string; // 理쒖“?깅줉?ъ슜?먮쾲??  frsRgstrnDtm: string; // 理쒖“?깅줉?쇱떆
  lastChngUsrno: string; // 理쒖쥌蹂寃쎌궗?⑹옄踰덊샇
  lastChngDtm: string; // 理쒖쥌蹂寃쎌씪??  usrNm: string; // ?ъ슜?먯씠由?  hbrNm: string; // ?ъ슜?먯???}

// --- Mock Data ---
const mockData: AssetSoundnessVerificationData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  sndnYm: "2024-11",
  itmsNm: "?쇰컲?먭툑?異?,
  custNm: `怨좉컼${i + 1}`,
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
  rpayMthNm: "?먮━湲덇퇏??,
  dycntDvNm: "365",
  irt: 5.5,
  arrIrt: 12.0,
  stffDvNm: "誘몄긽怨?,
  stffDt: "",
  manageTrnsferDt: "",
  lotbDvNm: "",
  lotbDt: "",
  bntmArrMncnt: 0,
  manageCrdlAcntDvNm: "?뺤긽",
  lastTrDt: "2024-11-01",
  n1MrtgDvNm: "遺?숈궛",
  n2MrtgDvNm: "蹂댁쬆??,
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
  mngrNm: "愿由ъ옄A",
  rptArrAmt: 0,
  dpstAcntNo: "",
  n1StgupAmt: 12000000,
  teamNm: "?곸뾽1?",
  detailPrdctNm: "吏곸옣?몄떊?⑸?異?,
  detailFndOgnlNm: "?먯껜?먭툑",
  n2NxttrmlntrPytDt: "",
  n1TpindClsNm: "?쒖“??,
  n2TpindClsNm: "?꾩옄遺??,
  eprzDvNm: "以묒냼湲곗뾽",
  eprzScINm: "?뚭린??,
  brchNm: "媛뺣궓吏??,
  notytBilnNrmllntr: 0,
  notytBilnArrs: 0,
  notytBilnArrIntr: 0,
  psnlBsrno: "123-45-67890",
  psnlBzplNm: "?됰났?곸궗",
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
  mainMrtgKndNm: "?꾪뙆??,
  n2StgupAmt: 0,
  apsdAmt: 20000000,
  n1UnsbdBondAmt: 0,
  n1ClctExpectAmt: 9000000,
  n2UnsbdBondAmt: 0,
  n2ClctExpectAmt: 0,
  cmtRgstrnDvNm: "誘몃벑濡?,
  afbd: 90000,
  apsdOrgnzNm: "?쒓뎅媛먯젙??,
  apsdDt: "2022-12-01",
  brchDvNm: "蹂몄젏",
  borwAddr: "?쒖슱??媛뺣궓援?,
  wrplAddr: "?쒖슱???쒖큹援?,
  addrPlcDvNm: "?먭?",
  wrplAddrDvNm: "蹂몄궗",
  areaApplcDvNm: "?쒖슱",
  areaDvNm: "?쒖슱",
  hndlBnkNm: "移쒖븷?異뺤???,
  rptMrtgDvNm: "遺?숈궛",
  n3MrtgDvNm: "",
  n1MrtgKndNm: "?꾪뙆??,
  loanMrtgPscndDvNm: "1?쒖쐞",
  n2MrtgKndNm: "",
  cltLctPlcNm: "?쒖슱??媛뺣궓援?,
  usdvNm: "?댁쟾?먭툑",
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
  arrSndnDstcd: "?뺤긽",
  arrDvNm: "?뺤긽",
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
  dbtrDvNm: "二쇱콈臾댁옄",
  rdcxptModDvNm: "",
  aplcSttsDvNm: "",
  acntPrgsSttsNm: "?뺤긽",
  prncRdcxptYn: "N",
  totRpayPrd: "24媛쒖썡",
  pytRn: 10,
  arrPrd: "",
  realArrPrd: "",
  credtRecvyXmptAmt: 0,
  perlSndnDstcd: "",
  perlAplcDvNm: "",
  sttsDvNm: "?쒕룞",
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
  sndnClsDvNm: "?뺤긽",
  credtRecvySndnClsDvNm: "",
  perlOfpmsDcsDvNm: "",
  credtRecvyPerlSndnCls: "",
  sprsMinSndnDstcd: "",
  lastAplySndnDstcd: "?뺤긽",
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
  usrNm: "愿由ъ옄",
  hbrNm: "?꾩궛?",
}));

// --- Columns ---
const columns: ColumnDef<AssetSoundnessVerificationData>[] = [
  { accessorKey: "id", header: "?쒕쾲" },
  { accessorKey: "sndnYm", header: "嫄댁쟾?깅뀈?? },
  { accessorKey: "itmsNm", header: "怨쇰ぉ紐? },
  { accessorKey: "custNm", header: "怨좉컼紐? },
  { accessorKey: "custNo", header: "怨좉컼踰덊샇" },
  { accessorKey: "acntNo", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "loanAmt", header: "?異쒓툑?? },
  { accessorKey: "loanBlce", header: "?異쒖옍?? },
  { accessorKey: "itdiLoanMny", header: "怨쇰ぉ蹂꾨?異쒓툑" },
  { accessorKey: "itdiAcntCnt", header: "怨쇰ぉ蹂꾧퀎醫뚯닔" },
  { accessorKey: "custLoanMny", header: "怨좉컼?異쒓툑" },
  { accessorKey: "custAcntCnt", header: "怨좉컼怨꾩쥖?? },
  { accessorKey: "loanPrdMncnt", header: "?異쒓린媛꾩썡?? },
  { accessorKey: "loanPrdDycnt", header: "?異쒓린媛꾩씪?? },
  { accessorKey: "loanDt", header: "?異쒖씪?? },
  { accessorKey: "expDt", header: "留뚭린?쇱옄" },
  { accessorKey: "expDdArrMncnt", header: "留뚭린?쇱뿰泥? },
  { accessorKey: "lastIntrPytDt", header: "理쒖쥌?댁옄?⑹엯?? },
  { accessorKey: "rpayMthNm", header: "?곹솚諛⑸쾿" },
  { accessorKey: "dycntDvNm", header: "?쇱닔援щ텇" },
  { accessorKey: "irt", header: "?댁쑉" },
  { accessorKey: "arrIrt", header: "?곗껜?댁쑉" },
  { accessorKey: "stffDvNm", header: "?곴퀎援щ텇" },
  { accessorKey: "stffDt", header: "?곴퀎?쇱옄" },
  { accessorKey: "manageTrnsferDt", header: "愿由ъ씠愿?쇱옄" },
  { accessorKey: "lotbDvNm", header: "湲고븳?댁씡?곸떎援щ텇" },
  { accessorKey: "lotbDt", header: "湲고븳?댁씡?곸떎?? },
  { accessorKey: "bntmArrMncnt", header: "湲고븳?댁씡?곗껜" },
  { accessorKey: "manageCrdlAcntDvNm", header: "愿由ъ뿬?좉퀎醫뚭뎄遺? },
  { accessorKey: "lastTrDt", header: "理쒖쥌嫄곕옒?쇱옄" },
  { accessorKey: "n1MrtgDvNm", header: "1?대낫援щ텇" },
  { accessorKey: "n2MrtgDvNm", header: "2?대낫援щ텇" },
  { accessorKey: "lastCptnDt", header: "理쒖쥌?댁닔?쇱옄" },
  { accessorKey: "lastCptnDtArrRn", header: "理쒖쥌?댁닔?쇱옄?곗껜?뚯감" },
  { accessorKey: "arrRn", header: "?곗껜?뚯감" },
  { accessorKey: "pytNtrDt", header: "?⑹엯?묐떦?? },
  { accessorKey: "n1lntrArrRn", header: "1?댁옄?곗껜?뚯감" },
  { accessorKey: "mmAcitrc", header: "?붾??섏씠?? },
  { accessorKey: "ddAcitrc", header: "?쇰??섏씠?? },
  { accessorKey: "acitrc", header: "誘몄닔?댁옄" },
  { accessorKey: "rvsDvNm", header: "蹂댁젙援щ텇" },
  { accessorKey: "rvslntr", header: "蹂댁젙?댁옄" },
  { accessorKey: "n1ArrIntr", header: "1?곗껜?댁옄" },
  { accessorKey: "frstlntr", header: "?쒖닔?댁옄" },
  { accessorKey: "nxttrmPrncPytDt", header: "李④린?먭툑?⑹엯?? },
  { accessorKey: "prncArrRn", header: "?먭툑?곗껜?뚯감" },
  { accessorKey: "n1NxttrmlntrPytDt", header: "1李④린?댁옄?⑹엯?? },
  { accessorKey: "n2lntrArrRn", header: "2?댁옄?곗껜?뚯감" },
  { accessorKey: "prncArrAmt", header: "?먭툑?곗껜湲덉븸" },
  { accessorKey: "nrmllntr", header: "?뺤긽?댁옄" },
  { accessorKey: "arrs", header: "?곗껜猷? },
  { accessorKey: "n2Arrlntr", header: "2?곗껜?댁옄" },
  { accessorKey: "mngrNm", header: "愿由ъ옄" },
  { accessorKey: "rptArrAmt", header: "蹂닿퀬?곗껜湲덉븸" },
  { accessorKey: "dpstAcntNo", header: "?섏떊怨꾩쥖踰덊샇" },
  { accessorKey: "n1StgupAmt", header: "1?ㅼ젙湲덉븸" },
  { accessorKey: "teamNm", header: "?紐? },
  { accessorKey: "detailPrdctNm", header: "?몃??곹뭹紐? },
  { accessorKey: "detailFndOgnlNm", header: "?몃??먭툑?? },
  { accessorKey: "n2NxttrmlntrPytDt", header: "2李④린?댁옄?⑹엯?? },
  { accessorKey: "n1TpindClsNm", header: "1?낆쥌遺꾨쪟" },
  { accessorKey: "n2TpindClsNm", header: "2?낆쥌遺꾨쪟" },
  { accessorKey: "eprzDvNm", header: "湲곗뾽援щ텇" },
  { accessorKey: "eprzScINm", header: "湲곗뾽洹쒕え" },
  { accessorKey: "brchNm", header: "吏?먮챸" },
  { accessorKey: "notytBilnNrmllntr", header: "誘몄쭠援ъ젙?곸씠?? },
  { accessorKey: "notytBilnArrs", header: "誘몄쭠援ъ뿰泥대즺" },
  { accessorKey: "notytBilnArrIntr", header: "誘몄쭠援ъ뿰泥댁씠?? },
  { accessorKey: "psnlBsrno", header: "媛쒖씤?ъ뾽?먮벑濡앸쾲?? },
  { accessorKey: "psnlBzplNm", header: "媛쒖씤?ъ뾽?λ챸" },
  { accessorKey: "rbrno", header: "二쇰??깅줉/?ъ뾽?먮쾲?? },
  { accessorKey: "rnmNo", header: "?ㅻ챸踰덊샇" },
  { accessorKey: "icctno", header: "踰뺤씤?깅줉踰덊샇" },
  { accessorKey: "bsrpNo", header: "?ъ뾽?먮쾲?? },
  { accessorKey: "arrMncnt", header: "?곗껜?붿닔" },
  { accessorKey: "rptArrMncnt", header: "蹂닿퀬?곗껜?붿닔" },
  { accessorKey: "rptArrRn", header: "蹂닿퀬?곗껜?뚯감" },
  { accessorKey: "cndPtApprArrRn", header: "議곌굔遺?곗껜" },
  { accessorKey: "n1NrmlAmt", header: "1?뺤긽湲덉븸" },
  { accessorKey: "n1AttenAmt", header: "1?붿＜?섍툑?? },
  { accessorKey: "n1FxnAmt", header: "1怨좎젙湲덉븸" },
  { accessorKey: "n1DtclAmt", header: "1?뚯닔?섎Ц湲덉븸" },
  { accessorKey: "n1EsissAmt", header: "1異붿젙?먯떎湲덉븸" },
  { accessorKey: "dpslsvMrtqBlce", header: "?덇툑?곴툑?대낫?붿븸" },
  { accessorKey: "mainMrtgKndNm", header: "二쇰떞蹂댁쥌瑜? },
  { accessorKey: "n2StgupAmt", header: "2?ㅼ젙湲덉븸" },
  { accessorKey: "apsdAmt", header: "媛먯젙湲덉븸" },
  { accessorKey: "n1UnsbdBondAmt", header: "1?좎닚?꾩콈沅뚭툑?? },
  { accessorKey: "n1ClctExpectAmt", header: "1?뚯닔?덉긽湲덉븸" },
  { accessorKey: "n2UnsbdBondAmt", header: "2?좎닚?꾩콈沅뚭툑?? },
  { accessorKey: "n2ClctExpectAmt", header: "2?뚯닔?덉긽湲덉븸" },
  { accessorKey: "cmtRgstrnDvNm", header: "?좎슜愿由щ??곷벑濡앹뿬遺" },
  { accessorKey: "afbd", header: "??먯땐?밴툑" },
  { accessorKey: "apsdOrgnzNm", header: "媛먯젙湲곌?" },
  { accessorKey: "apsdDt", header: "媛먯젙?쇱옄" },
  { accessorKey: "brchDvNm", header: "吏?먭뎄遺? },
  { accessorKey: "borwAddr", header: "李⑥＜二쇱냼吏" },
  { accessorKey: "wrplAddr", header: "吏곸옣二쇱냼吏" },
  { accessorKey: "addrPlcDvNm", header: "二쇱냼吏援щ텇" },
  { accessorKey: "wrplAddrDvNm", header: "吏곸옣二쇱냼援щ텇" },
  { accessorKey: "areaApplcDvNm", header: "吏??쟻?? },
  { accessorKey: "areaDvNm", header: "吏??뎄遺? },
  { accessorKey: "hndlBnkNm", header: "痍④툒??? },
  { accessorKey: "rptMrtgDvNm", header: "蹂닿퀬?대낫援щ텇" },
  { accessorKey: "n3MrtgDvNm", header: "3?대낫援щ텇" },
  { accessorKey: "n1MrtgKndNm", header: "1?대낫醫낅쪟" },
  { accessorKey: "loanMrtgPscndDvNm", header: "?異쒕떞蹂댄쁽?⑷뎄遺? },
  { accessorKey: "n2MrtgKndNm", header: "2?대낫醫낅쪟" },
  { accessorKey: "cltLctPlcNm", header: "?대낫臾쇱냼?ъ?" },
  { accessorKey: "usdvNm", header: "?⑸룄" },
  { accessorKey: "mrtgEvlAmt", header: "?대낫?됯?湲덉븸" },
  { accessorKey: "dcRto", header: "?좎씤鍮꾩쑉" },
  { accessorKey: "dcRtApplcMrtgEvlAmt", header: "?좎씤?⑥쟻?⑸떞蹂댄룊媛湲덉븸" },
  { accessorKey: "unsbdStgupAmt", header: "?좎닚?꾩꽕?뺢툑?? },
  { accessorKey: "etcUnsbdAmt", header: "湲고??좎닚?꾧툑?? },
  { accessorKey: "thbkStqupAmt", header: "?뱁뻾?ㅼ젙湲덉븸" },
  { accessorKey: "validMrtgAmt", header: "?좏슚?대낫湲덉븸" },
  { accessorKey: "clctExpectAmt", header: "?뚯닔?덉긽湲덉븸" },
  { accessorKey: "bfSndnRto", header: "?몄닔嫄댁쟾?깅퉬?? },
  { accessorKey: "lsmthLoanBlce", header: "?꾩썡?異쒖옍?? },
  { accessorKey: "IsmthAprpAmt", header: "?꾩썡異⑸떦湲덉븸" },
  { accessorKey: "lsmthAprpRto", header: "?꾩썡異⑸떦鍮꾩쑉" },
  { accessorKey: "lastArrRn", header: "理쒖쥌?곗껜?뚯감" },
  { accessorKey: "arrSndnDstcd", header: "?곗껜嫄댁쟾?? },
  { accessorKey: "arrDvNm", header: "?곗껜援щ텇" },
  { accessorKey: "spnpytLfmSndn", header: "媛吏湲됯툑踰뺤닔?띻굔?꾩꽦" },
  { accessorKey: "spnpytDvNm", header: "媛吏湲됯툑" },
  { accessorKey: "IfmDvNm", header: "踰뺤닔?? },
  { accessorKey: "IfmNml", header: "踰뺤닔?띿젙?곹솕" },
  { accessorKey: "sslSubrgtSndnDstcd", header: "?뉗궡濡좊??꾨??쒓굔?꾩꽦" },
  { accessorKey: "sslSubrgtDvNm", header: "?뉗궡濡좊??꾨??? },
  { accessorKey: "ifisSndnDstcd", header: "IFIS嫄댁쟾?? },
  { accessorKey: "slmDvNm", header: "?щ줈紐?PW" },
  { accessorKey: "kdnkRgstrnSndnDstcd", header: "??됱뿰?⑺쉶?깅줉嫄댁쟾?? },
  { accessorKey: "kdnkLnovPrd", header: "??됱뿰?⑺쉶理쒖옣?곗껜湲곌컙" },
  { accessorKey: "kdnkArrRgstrnAmt", header: "?쇳뻾?고빀?뚯뿰泥대벑濡앷툑?? },
  { accessorKey: "chngSndnClsDvNm", header: "?좎슜?뚮났 嫄댁쟾?? },
  { accessorKey: "dbtrDvNm", header: "梨꾨Т?먭뎄遺? },
  { accessorKey: "rdcxptModDvNm", header: "媛먮㈃諛⑹떇" },
  { accessorKey: "aplcSttsDvNm", header: "?좎껌?몄긽?? },
  { accessorKey: "acntPrgsSttsNm", header: "怨꾩쥖吏꾪뻾?곹깭?댁슜" },
  { accessorKey: "prncRdcxptYn", header: "?먭툑媛먮㈃?щ?" },
  { accessorKey: "totRpayPrd", header: "珥앹긽?섍린媛? },
  { accessorKey: "pytRn", header: "?⑹씪?뚯감" },
  { accessorKey: "arrPrd", header: "?곗껜湲곌컙" },
  { accessorKey: "realArrPrd", header: "?ㅼ젣?곗껜湲곌컙" },
  { accessorKey: "credtRecvyXmptAmt", header: "?좎슜?뚮났硫댁콉湲덉븸" },
  { accessorKey: "perlSndnDstcd", header: "媛쒖씤?뚯깮嫄댁쟾?? },
  { accessorKey: "perlAplcDvNm", header: "媛쒖씤?뚯깮?좎껌?멸뎄遺? },
  { accessorKey: "sttsDvNm", header: "?곹깭" },
  { accessorKey: "rhbRprtngAmt", header: "?뚯깮?좉퀬湲덉븸" },
  { accessorKey: "rhbFxdAmt", header: "?뚯깮?뺤젙湲덉븸" },
  { accessorKey: "rpymtAmt", header: "蹂?쒕늻怨? },
  { accessorKey: "pytRto", header: "?⑹엯鍮꾩쑉" },
  { accessorKey: "rhbExemptAmt", header: "?뚯깮硫댁젣湲덉븸" },
  { accessorKey: "perlArrYn", header: "媛쒖씤?뚯깮?곗껜?щ?" },
  { accessorKey: "cobSndnDstcd", header: "?먯뾽嫄댁쟾?? },
  { accessorKey: "cobDvNm", header: "?먯뾽" },
  { accessorKey: "pjDvNm", header: "?꾨줈?앺듃" },
  { accessorKey: "wkPmnSndnDstcd", header: "遺?ㅼ쭠?꾧굔?꾩꽦" },
  { accessorKey: "autOpnnRjctnDvNm", header: "媛먯궗?섍껄嫄곗젅" },
  { accessorKey: "dfcDvNm", header: "寃곗넀" },
  { accessorKey: "imcapDvNm", header: "?먮낯?좎떇" },
  { accessorKey: "brwmnyXcsDvNm", header: "李⑥엯湲덉“怨? },
  { accessorKey: "bkrpSndnDstcd", header: "?뚯궛嫄댁쟾?? },
  { accessorKey: "bkrpDbtrDvNm", header: "?뚯궛梨꾨Т?먭뎄遺? },
  { accessorKey: "bkrpSttsDvNm", header: "?뚯궛?곹깭" },
  { accessorKey: "dedSndnDstcd", header: "?щ쭩?먭굔?꾩꽦" },
  { accessorKey: "dedDvNm", header: "?щ쭩?? },
  { accessorKey: "rghinfrSndn", header: "沅뚮━移⑦빐嫄댁쟾?? },
  { accessorKey: "rghInfr", header: "沅뚮━移⑦빐" },
  { accessorKey: "etcSndnDstcd", header: "湲고?嫄댁쟾?? },
  { accessorKey: "etcClsNm", header: "湲고?遺꾨쪟" },
  { accessorKey: "bfYyFxnEgblw", header: "?꾨뀈?꾧퀬?뺤씠?? },
  { accessorKey: "brnchExmnt", header: "?곸뾽?먭??? },
  { accessorKey: "sndnClsDvNm", header: "嫄댁쟾?깅텇瑜? },
  { accessorKey: "credtRecvySndnClsDvNm", header: "?좎슜?뚮났嫄댁쟾?깅텇瑜? },
  { accessorKey: "perlOfpmsDcsDvNm", header: "媛쒖씤?뚯깮?멸?寃곗젙" },
  { accessorKey: "credtRecvyPerlSndnCls", header: "?좎슜?뚮났媛쒖씤?뚯깮嫄댁쟾?깅텇瑜? },
  { accessorKey: "sprsMinSndnDstcd", header: "?숈씪?몄턀?뚭굔?꾩꽦" },
  { accessorKey: "lastAplySndnDstcd", header: "理쒖쥌諛섏쁺嫄댁쟾?? },
  { accessorKey: "bfYyFxnEqblwSndn", header: "?꾨뀈?꾧퀬?뺤씠?섎컲?곴굔?꾩꽦" },
  { accessorKey: "brnchChngBrkdn", header: "?곸뾽?먮?寃쎈궡?? },
  { accessorKey: "n2NrmlAmt", header: "2?뺤긽湲덉븸" },
  { accessorKey: "n2NrmlAprpRto", header: "2?뺤긽異⑸떦鍮꾩쑉" },
  { accessorKey: "n2NrmlAprpAmt", header: "2?뺤긽異⑸떦湲덉븸" },
  { accessorKey: "n2AttenAmt", header: "2?붿＜?섍툑?? },
  { accessorKey: "n2AttenAprpRto", header: "2?붿＜?섏땐?밸퉬?? },
  { accessorKey: "n2AttenAprpAmt", header: "2?붿＜?섏땐?밴툑?? },
  { accessorKey: "n2FxnAmt", header: "2怨좎젙湲덉븸" },
  { accessorKey: "n2FxnAprpRto", header: "2怨좎젙異⑸떦鍮꾩쑉" },
  { accessorKey: "n2FxnAprpAmt", header: "2怨좎젙異⑸떦湲덉븸" },
  { accessorKey: "n2DtclAmt", header: "2?뚯닔?섎Ц湲덉븸" },
  { accessorKey: "n2DtclAprpRto", header: "2?뚯닔?섎Ц異⑸떦鍮꾩쑉" },
  { accessorKey: "n2DtclAprpAmt", header: "2?뚯닔?섎Ц異⑸떦湲덉븸" },
  { accessorKey: "n2EslssAmt", header: "2異붿젙?먯떎湲덉븸" },
  { accessorKey: "n2EsissAprpRto", header: "2異붿젙?먯떎異⑸떦鍮꾩쓣" },
  { accessorKey: "n2EsissAprpAmt", header: "2異붿젙?먯떎異⑸떦湲덉븸" },
  { accessorKey: "loanMnySum", header: "?異쒓툑?⑷퀎" },
  { accessorKey: "aprpMny", header: "異⑸떦湲? },
  { accessorKey: "thmmAprpMnyRto", header: "?뱀썡異⑸떦湲덈퉬?? },
  { accessorKey: "IsmthAprpMnyChngRto", header: "?꾪꾩땐?밴툑蹂寃쎈퉬?? },
  { accessorKey: "IsmthLoanMnyChngAmt", header: "?꾩썡?異쒓툑蹂寃쎄툑?? },
  { accessorKey: "IsmthAprpMnyChngAmt", header: "?꾩썡異⑸떦湲덈?寃쎄툑?? },
  { accessorKey: "prmumNrmlAmt", header: "?좎쬆?뺤긽湲덉븸" },
  { accessorKey: "prmumNrmlAprpRto", header: "?좎쬆?뺤긽異⑸떦鍮꾩쑉" },
  { accessorKey: "prmumNrmlAprpAmt", header: "?좎쬆?뺤긽異⑸쭩湲덉븸" },
  { accessorKey: "prmumAttenAmt", header: "?좎쬆?붿＜?섍툑?? },
  { accessorKey: "prmumAttenAprpRto", header: "?좎쬆?붿＜?섏땐?밸퉬?? },
  { accessorKey: "prmumAttenAprpAmt", header: "?좎쬆?붿＜?섏땐?밴툑?? },
  { accessorKey: "prmumFxnAmt", header: "?좎쬆怨좎젙湲덉븸" },
  { accessorKey: "prmumFxnAprpRto", header: "?좎쬆怨좎젙異⑸떦鍮꾩쑉" },
  { accessorKey: "prmumFxnAprpAmt", header: "?좎쬆怨좎젙異⑸떦湲덉븸" },
  { accessorKey: "prmumDtclAmt", header: "?좎쬆?뚯닔?섎Ц湲덉븸" },
  { accessorKey: "prmumDtclAprpRto", header: "?좎쬆?뚯닔?섎Ц異⑸떦鍮꾩쑉" },
  { accessorKey: "prmumDtclAprpAmt", header: "?좎쬆?뚯닔?섎Ц異⑸떦湲덉븸" },
  { accessorKey: "prmumEsissAmt", header: "?좎쬆異붿젙?먯떎湲덉븸" },
  { accessorKey: "prmumEsissAprpRto", header: "?좎쬆異붿젙?먯떎異⑸떦鍮꾩쑉" },
  { accessorKey: "prmumEsissAprpAmt", header: "?좎쬆異붿젙?먯떎異⑸떦湲덉븸" },
  { accessorKey: "prmumAmt", header: "?좎쬆湲덉븸" },
  { accessorKey: "prmumAprpAmt", header: "?좎쬆異⑸떦湲덉븸" },
  { accessorKey: "delYn", header: "??젣?щ?" },
  { accessorKey: "frsRgstrnUsrno", header: "理쒖“?깅줉?ъ슜?먮쾲?? },
  { accessorKey: "frsRgstrnDtm", header: "理쒖“?깅줉?쇱떆" },
  { accessorKey: "lastChngUsrno", header: "理쒖쥌蹂寃쎌궗?⑹옄踰덊샇" },
  { accessorKey: "lastChngDtm", header: "理쒖쥌蹂寃쎌씪?? },
  { accessorKey: "usrNm", header: "?ъ슜?먯씠由? },
  { accessorKey: "hbrNm", header: "?ъ슜?먯??? },
];

export default function AssetSoundnessVerificationPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData } = usePageStore();
  const [filters, setFilters] = useState<Record<string, any>>(currentState?.filters || {});

  // 濡쒖뺄 ?곹깭濡??뚯씠釉??곗씠?곕? 愿由ы븯嫄곕굹 store???곗씠?곕? ?ъ슜
  const tableData = useMemo(() => 
    currentState?.tables?.['soundnessVerificationTable'] || [], 
    [currentState?.tables]
  );

  // 珥덇린 濡쒕뱶 ??紐⑹뾽 ?곗씠???ㅼ젙 (?ㅼ젣濡쒕뒗 API ?몄텧)
  useEffect(() => {
    if (!currentState?.tables?.['soundnessVerificationTable']) {
      updateTableData(tabId, 'soundnessVerificationTable', mockData);
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
        handleFilterChange("customer", customer.customerName);
        // handleFilterChange("custNo", customer.centralCustomerNumber); // ?꾩슂??寃쎌슦
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

  // ?꾪꽣 蹂寃????ㅽ넗???낅뜲?댄듃
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
          label: "遺꾨쪟?꾩썡",
          options: [
            { value: "202411", label: "2024-11" },
            { value: "202410", label: "2024-10" },
          ],
        },
        {
          name: "customer",
          type: "long-search",
          label: "怨좉컼踰덊샇",
          readonly: true,
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
          name: "subject",
          type: "select",
          label: "怨쇰ぉ紐?,
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "general", label: "?쇰컲?먭툑?異? },
            { value: "facility", label: "?쒖꽕?먭툑?異? },
          ],
        },
        {
          name: "accountNumber",
          type: "text",
          label: "怨꾩쥖踰덊샇",
        },
      ],
    },
  ], [tabId]);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    updateTableData(tabId, 'soundnessVerificationTable', mockData);
  };

  const handleExcelDownload = () => {
    alert("?묒? ?ㅼ슫濡쒕뱶 ?ㅽ뻾");
  };

  if (!currentState) return null;

  // 湲덉븸 ?щ㎎?낆씠 ?꾩슂??而щ읆 由ъ뒪??  const amountColumns = [
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">?먯궛嫄댁쟾??寃利?/h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?먯궛嫄댁쟾????먯긽媛?/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>?먯궛嫄댁쟾??寃利?/BreadcrumbPage>
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
        <h3 className="font-semibold">寃??議곌굔</h3>
        <FilterContainer
          filterLayout={filterLayout}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        title="議고쉶 ?댁뿭"
        columns={columns}
        data={tableData}
        amountColumns={amountColumns}
        minWidth="1820px"
      />
    </div>
  );
}




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
  dprDvNm: "?쇰컲?곴컖",
  dprTrgetChcDt: "2024-11-20",
  itmsNm: "?좎슜?異?,
  custNm: `?띻만??{i + 1}`,
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
  rpayMthNm: "?먮━湲덇퇏??,
  dycntDvNm: "365??,
  irt: 5.5,
  arrIrt: 12.0,
  stffDvNm: "誘몄긽怨?,
  stffDt: "-",
  manageTrnsferDt: "2024-06-01",
  lotbDvNm: "?대떦?놁쓬",
  lotbDt: "-",
  bntmArrMncnt: 0,
  manageCrdlAcntDvNm: "?뺤긽",
  lastTrDt: "2024-10-01",
  n1MrtgDvNm: "?좎슜",
  n2MrtgDvNm: "-",
  n1LastCptnDt: "2024-10-01",
  lastCptnDtArrRn: 1,
  arrRn: 2,
  pytNtrDt: "2024-11-01",
  n1IntrArrRn: 1,
  mmAcitrc: 150000,
  ddAcitrc: 5000,
  acitrc: 155000,
  rvsDvNm: "?뺤긽",
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
  mngrNm: `源泥좎닔${i + 1}`,
  dpstAcntNo: "-",
  n1StgupAmt: 0,
  teamNm: "梨꾧텒愿由ы?",
  detailPrdctNm: "吏곸옣?몄떊?⑸?異?,
  detailFndOgnlNm: "?먯껜?먭툑",
  n2NxttrmlntrPytDt: "-",
  n1TpindClsNm: "媛怨?,
  n2TpindClsNm: "-",
  eprzDvNm: "媛쒖씤",
  eprzSclNm: "-",
  brchNm: "蹂몄젏",
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
  mainMrtgKndNm: "?좎슜",
  n2StgupAmt: 0,
  apsdAmt: 0,
  n1UnsbdBondAmt: 0,
  n1ClctExpectAmt: 0,
  n2UnsbdBondAmt: 0,
  n2ClctExpectAmt: 0,
  cmtRgstrnDvNm: "?깅줉",
  afbd: 500000,
  apsdOrgnzNm: "-",
  apsdDt: "-",
  brchDvNm: "蹂몄젏",
  borwAddr: "?쒖슱??媛뺣궓援?,
  wrplAddr: "?쒖슱???쒖큹援?,
  addrPlcDvNm: "?먭?",
  wrplAddrDvNm: "-",
  areaApplcDvNm: "?쒖슱",
  areaDvNm: "?섎룄沅?,
  hndlBnkNm: "移쒖븷?異뺤???,
  rptMrtgDvNm: "?좎슜",
  n3MrtgDvNm: "-",
  n1MrtgKndNm: "?좎슜",
  loanMrtgPscndDvNm: "-",
  n2MrtgKndNm: "-",
  cltLctPlcNm: "-",
  usdvNm: "媛怨꾩옄湲?,
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
  arrSndnDstcd: "?붿＜??,
  arrDvNm: "?④린?곗껜",
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
  dbtrDvNm: "二쇱콈臾댁옄",
  rdcxptModDvNm: "-",
  aplcSttsDvNm: "-",
  acntPrgsSttsNm: "?뺤긽",
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
  snanClsDvNm: "?붿＜??,
  credtRecvySndnClsDvNm: "-",
  perlOfpmsDcsDvNm: "-",
  chngSndnClsDvNm: "-",
  sprsMinSndnDstco: "-",
  lastAplySndnDstcd: "?붿＜??,
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
    if (typeof value === 'number' && !header.includes('?쒕쾲') && !header.includes('?뚯감') && !header.includes('湲곌컙') && !header.includes('媛쒖썡') && !header.includes('?쇱닔')) {
        return value.toLocaleString();
    }
    return value;
  }
});

const columns: ColumnDef<WriteOffTargetData>[] = [
  createColumn("no", "?쒕쾲"),
  createColumn("dprDvNm", "?곴컖援щ텇"),
  createColumn("dprTrgetChcDt", "?좎젙?쇱옄"),
  createColumn("itmsNm", "怨쇰ぉ紐?),
  createColumn("custNm", "怨좉컼紐?),
  createColumn("custNo", "怨좉컼踰덊샇"),
  createColumn("acntNo", "?ъ떊怨꾩쥖"),
  createColumn("loanAmt", "?異쒓툑??),
  createColumn("loanBlce", "?異쒖옍??),
  createColumn("itdiLoanMny", "怨쇰ぉ蹂꾨?異쒓툑"),
  createColumn("itdiAcntCnt", "怨쇰ぉ蹂꾧퀎醫뚯닔"),
  createColumn("custLoanMny", "怨좉컼?異쒓툑"),
  createColumn("custAcntCnt", "怨좉컼怨꾩쥖??),
  createColumn("loanPrdMncnt", "?異쒓린媛???"),
  createColumn("loanPrdDycnt", "?異쒓린媛???"),
  createColumn("loanDt", "?異쒖씪??),
  createColumn("expDt", "留뚭린?쇱옄"),
  createColumn("expDdArrMncnt", "留뚭린?쇱뿰泥?),
  createColumn("rpayMthNm", "?곹솚諛⑸쾿"),
  createColumn("dycntDvNm", "?쇱닔援щ텇"),
  createColumn("irt", "?댁쑉"),
  createColumn("arrIrt", "?곗껜?댁쑉"),
  createColumn("stffDvNm", "?곴퀎援щ텇"),
  createColumn("stffDt", "?곴퀎?쇱옄"),
  createColumn("manageTrnsferDt", "愿由ъ씠愿?쇱옄"),
  createColumn("lotbDvNm", "湲고븳?댁씡?곸떎援щ텇"),
  createColumn("lotbDt", "湲고븳?댁씡?곸떎?쇱옄"),
  createColumn("bntmArrMncnt", "湲고븳?댁씡?곗껜"),
  createColumn("manageCrdlAcntDvNm", "愿由ъ뿬?좉퀎醫?),
  createColumn("lastTrDt", "理쒖쥌嫄곕옒?쇱옄"),
  createColumn("n1MrtgDvNm", "?대낫援щ텇"),
  createColumn("n2MrtgDvNm", "?대낫援щ텇"),
  createColumn("n1LastCptnDt", "理쒖쥌?댁닔?쇱옄"),
  createColumn("lastCptnDtArrRn", "理쒖쥌?댁닔?쇱옄?곗껜?뚯감"),
  createColumn("arrRn", "?곗껜?뚯감"),
  createColumn("pytNtrDt", "?⑹엯?묐떦?쇱옄"),
  createColumn("n1IntrArrRn", "?댁옄?곗껜?뚯감"),
  createColumn("mmAcitrc", "?붾??섏씠??),
  createColumn("ddAcitrc", "?쇰??섏씠??),
  createColumn("acitrc", "誘몄닔?댁?"),
  createColumn("rvsDvNm", "蹂댁젙援щ텇"),
  createColumn("rvsIntr", "蹂댁젙?댁옄"),
  createColumn("n1Arrlntr", "?곗껜?댁옄"),
  createColumn("frstlntr", "?좎닔?댁옄"),
  createColumn("nxttrmPrncPytDt", "李④린?먭툑?⑹엯??),
  createColumn("n1PrncArrRn", "?먭툑?곗껜?뚯감"),
  createColumn("n2PrncArrRn", "?먭툑?곗껜?뚯감2"),
  createColumn("n1NxttrmlntrPytDt", "李④린?댁옄?⑹엯??),
  createColumn("n2lntrArrRn", "2?댁옄?곗껜?뚯감"),
  createColumn("lotblntrArrRn", "湲곌컙?댁씡?곸떎"),
  createColumn("prncArrAmt", "?먭툑?곗껜湲덉븸"),
  createColumn("nrmlIntr", "?뺤긽?댁옄"),
  createColumn("arrs", "?곗껜猷?),
  createColumn("n2ArrIntr", "?곗껜?댁옄"),
  createColumn("mngrNm", "愿由ъ옄"),
  createColumn("dpstAcntNo", "?섏떊怨꾩쥖踰덊샇"),
  createColumn("n1StgupAmt", "?ㅼ젙湲덉븸"),
  createColumn("teamNm", "?紐?),
  createColumn("detailPrdctNm", "?몃??곹뭹紐?),
  createColumn("detailFndOgnlNm", "?몃??먭툑??),
  createColumn("n2NxttrmlntrPytDt", "李④린?댁옄?⑹엯?쇱옄"),
  createColumn("n1TpindClsNm", "?낆쥌遺꾨쪟"),
  createColumn("n2TpindClsNm", "?낆쥌遺꾨쪟2"),
  createColumn("eprzDvNm", "湲곗뾽援щ텇"),
  createColumn("eprzSclNm", "湲곗뾽洹쒕え"),
  createColumn("brchNm", "吏?먮챸"),
  createColumn("notytBilnNrmlIntr", "誘몄쭠援ъ젙?곸씠??),
  createColumn("notytBilnArrs", "誘몄쭠援ъ뿰泥대즺"),
  createColumn("notytBilnArrIntr", "誘몄쭠援ъ뿰泥댁씠??),
  createColumn("psnIBsrno", "媛쒖씤?ъ뾽?먮벑濡앸쾲??),
  createColumn("psnlBzplNm", "媛쒖씤?ъ뾽?λ챸"),
  createColumn("rbrno", "二쇰??깅줉/?ъ뾽?먮쾲??),
  createColumn("rnmNo", "?ㅻ챸踰덊샇"),
  createColumn("icctno", "踰뺤씤?깅줉踰덊샇"),
  createColumn("bsrpNo", "?ъ뾽?먮쾲??),
  createColumn("arrMncnt", "?곗껜?붿닔"),
  createColumn("rptArrMncnt", "蹂닿퀬?곗껜?꾩닔"),
  createColumn("n1NrmlAmt", "?뺤긽"),
  createColumn("n1AttenAmt", "?붿＜??),
  createColumn("n1FxnAmt", "怨좎젙"),
  createColumn("n1DtclAmt", "?뚯닔?섎Ц"),
  createColumn("n1EslssAmt", "異붿젙?먯떎"),
  createColumn("dpslsvMrtgBlce", "?덇툑?곴툑?대낫?붿븸"),
  createColumn("mainMrtgKndNm", "二쇰떞蹂댁쥌瑜?),
  createColumn("n2StgupAmt", "?ㅼ젙??),
  createColumn("apsdAmt", "媛먯젙媛"),
  createColumn("n1UnsbdBondAmt", "?좎닚?꾩콈沅?"),
  createColumn("n1ClctExpectAmt", "?뚯닔?덉긽媛"),
  createColumn("n2UnsbdBondAmt", "?좎닚?꾩콈沅?"),
  createColumn("n2ClctExpectAmt", "?뚯닔?덉긽媛2"),
  createColumn("cmtRgstrnDvNm", "?좎슜愿由щ???),
  createColumn("afbd", "??먯땐?밴툑"),
  createColumn("apsdOrgnzNm", "媛먯젙湲곌?"),
  createColumn("apsdDt", "媛먯젙?쇱옄"),
  createColumn("brchDvNm", "?먰룷援щ텇"),
  createColumn("borwAddr", "李⑥＜二쇱냼吏"),
  createColumn("wrplAddr", "吏곸옣二쇱냼吏"),
  createColumn("addrPlcDvNm", "二쇱냼吏援щ텇"),
  createColumn("wrplAddrDvNm", "吏곸옣二쇱냼援щ?"),
  createColumn("areaApplcDvNm", "吏??쟻??),
  createColumn("areaDvNm", "吏??뎄遺?),
  createColumn("hndlBnkNm", "痍④툒???),
  createColumn("rptMrtgDvNm", "蹂닿퀬?대낫援щ텇"),
  createColumn("n3MrtgDvNm", "?대낫援щ텇"),
  createColumn("n1MrtgKndNm", "?대낫醫낅쪟"),
  createColumn("loanMrtgPscndDvNm", "?異쒕떞蹂댄쁽??),
  createColumn("n2MrtgKndNm", "?대낫醫낅쪟"),
  createColumn("cltLctPlcNm", "?대낫臾쇱냼?ъ?"),
  createColumn("usdvNm", "?⑸룄"),
  createColumn("mrtgEvlAmt", "?대낫?됯???),
  createColumn("dcRto", "?좎씤??),
  createColumn("dcRtApplcMrtgEvlAmt", "?좎씤?⑥쟻?⑺썑?대낫?됯???),
  createColumn("unsbdStqupAmt", "?좎닚?꾩꽕?뺢툑??),
  createColumn("etcUnsbdAmt", "湲고??좎닚??),
  createColumn("thbkStgupAmt", "?뱁뻾?ㅼ젙湲덉븸"),
  createColumn("validMrtgAmt", "?좏슚?대낫媛??),
  createColumn("clctExpectAmt", "?뚯닔?덉긽媛"),
  createColumn("bfSndnRto", "?몄닔嫄댁쟾??),
  createColumn("IsmthLoanBlce", "?꾪꾨?異쒖옍??),
  createColumn("IsmthAprpAmt", "?꾩썡異⑸떦湲?),
  createColumn("IsmthAprpRto", "?꾨춼異⑸떦鍮꾩쑉"),
  createColumn("lastArrRn", "理쒖쥌?곗껜?뚯감"),
  createColumn("arrSndnDstcd", "?곗껜嫄댁쟾??),
  createColumn("arrDvNm", "?곗껜援щ텇"),
  createColumn("spnpytLfmSndnAmt", "媛吏湲됰쾿?섏냽嫄댁쟾??),
  createColumn("spnpytDvNm", "媛吏湲됯툑"),
  createColumn("IfmDvNm", "踰뺤닔??),
  createColumn("sslSubrgtSndnDstcd", "?뉗궡濡좊??꾨??쒓굔?꾩꽦"),
  createColumn("sslSubrgtDvNm", "?뉗궡濡좊??꾨???),
  createColumn("ifisSndnDstcd", "IFIS嫄댁쟾??),
  createColumn("slmDvNm", "?붾줈紐촳w"),
  createColumn("kdnkRgstrnSndnDstcd", "??됱뿰?⑺쉶?깅줉嫄댁쟾??),
  createColumn("kdnkLnovPrd", "??됱뿰?⑺쉶理쒖옣?곗껜湲곌컙"),
  createColumn("kdnkArrRastrnAmt", "??됱뿰?⑺쉶?곗껜?깅줉湲덉븸"),
  createColumn("credtRecvySndnDstcd", "?좎슜?뚮났嫄댁쟾??),
  createColumn("dbtrDvNm", "梨꾨Т?먭뎄遺?),
  createColumn("rdcxptModDvNm", "媛먮㈃諛⑹떇"),
  createColumn("aplcSttsDvNm", "?좎껌?먯긽??),
  createColumn("acntPrgsSttsNm", "怨꾩쥖吏꾪뻾?곹깭?댁슜"),
  createColumn("prncRdcxptYn", "?먭툑媛먮㈃?щ?"),
  createColumn("totRpayPrd", "珥앹긽?섍린媛?),
  createColumn("pytRn", "?⑹엯?뚯콈"),
  createColumn("arrPrd", "?곗껜湲곌컙"),
  createColumn("realArrPrd", "?ㅼ젣?곗껜"),
  createColumn("perlSndnDstcd", "媛쒖씤?뚯깮嫄댁쟾??),
  createColumn("perlAplcDvNm", "媛쒖씤?뚯깮?좎껌?먭뎄遺?),
  createColumn("sttsDvNm", "?곹깭"),
  createColumn("rhbRprtngAmt", "?뚯깮?좉퀬湲덉븸"),
  createColumn("rhbFxdAmt", "?뚯깮?뺤젙湲덉븸"),
  createColumn("rpymtAmt", "蹂?쒓툑??),
  createColumn("rhbExemptAmt", "?뚯깮硫댁젣湲덉븸"),
  createColumn("cobSndnDstcd", "?먯뾽嫄댁쟾??),
  createColumn("cobDvNm", "?먯뾽"),
  createColumn("pjDvNm", "?꾨줈?앺듃"),
  createColumn("wkPmnSndnDstcd", "遺?ㅼ쭠?꾧굔?꾩꽦遺꾨쪟"),
  createColumn("autOpnnRjctnDvNm", "媛먯궗?섍껄嫄곗젏"),
  createColumn("dfcDvNm", "寃곗넀"),
  createColumn("imcapDvNm", "?먮낯?좎떇"),
  createColumn("brwmnyXcsDvNm", "李⑥엯湲덇낵??),
  createColumn("bkrpSndnDstcd", "?뚯궛嫄댁쟾??),
  createColumn("bkrpDbtrDvNm", "?뚯궛梨꾨Т?먭뎄遺?),
  createColumn("bkrpSttsDvNm", "?뚯궛?곹깭"),
  createColumn("dedSndnDstcd", "?щ쭩?먭굔?꾩꽦"),
  createColumn("dedDvNm", "?щ쭩??),
  createColumn("etcSndnDstcd", "湲고?嫄댁쟾??),
  createColumn("etcClsNm", "湲고?遺꾨쪟"),
  createColumn("clctN1TeoSndnDstcd", "?뚯닔1?꾩씠?곴굔?꾩꽦"),
  createColumn("n1TeoDtclAmt", "1?꾩씠?곹쉶?섏쓽臾?),
  createColumn("snanClsDvNm", "嫄댁쟾?깅텇瑜?),
  createColumn("credtRecvySndnClsDvNm", "?좎슜?뚮났嫄댁쟾?깅텇瑜?),
  createColumn("perlOfpmsDcsDvNm", "媛쒖씤?뚯깮?멸?寃곗젙"),
  createColumn("chngSndnClsDvNm", "嫄댁쟾?깅텇瑜??좊났,?뚯깮諛섏쁺)"),
  createColumn("sprsMinSndnDstco", "?숈씪?몄턀?섍굔?꾩꽦"),
  createColumn("lastAplySndnDstcd", "理쒖쥌諛섏쁺嫄댁쟾??),
  createColumn("n2NrmlAmt", "?뺤긽"),
  createColumn("n2NrmlAprpRto", "異⑸떦鍮꾩쑉"),
  createColumn("n2NrmlAprpAmt", "異⑸떦湲?),
  createColumn("n2AttenAmt", "?붿＜??),
  createColumn("n2AttenAprpRto", "異⑸떦鍮꾩쑉"),
  createColumn("n2AttenAprpAmt", "異⑸떦湲?),
  createColumn("n2FxnAmt", "怨좎젙"),
  createColumn("n2FxnAprpRto", "異⑸떦鍮꾩쑉"),
  createColumn("n2FxnAprpAmt", "異⑸떦湲?),
  createColumn("n2DtclAmt", "?뚯닔?섎Ц"),
  createColumn("n2DtclAprpRto", "異⑸떦鍮꾩쑉"),
  createColumn("n2DtclAprpAmt", "異⑸떦湲?),
  createColumn("n2EslssAmt", "異붿젙?먯떎"),
  createColumn("n2EslssAprpRto", "異⑸떦鍮꾩쑉"),
  createColumn("n2EslssAprpAmt", "異⑸떦湲?),
  createColumn("loanMnySum", "?異쒓툑?⑷퀎"),
  createColumn("aprpMny", "異⑸떦湲?),
  createColumn("thmmAprpMnyRto", "?뱀썡異⑸떦湲덈퉬??),
  createColumn("IsmthAprpMnyChngRto", "?꾩썡?鍮꾩땐?밴툑蹂?숈쑉"),
  createColumn("IsmthLoanMnyChngAmt", "?꾩썡?鍮꾨?異쒓툑蹂?숈븸"),
  createColumn("lsmthAprpMnyChngAmt", "?꾩썡?鍮꾩땐?밴툑蹂?숈븸"),
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
            label: "遺꾧린",
            options: [
              { value: "2024Q4", label: "2024??4遺꾧린" },
              { value: "2025Q1", label: "2025??1遺꾧린" },
              { value: "2025Q2", label: "2025??2遺꾧린" },
              { value: "2025Q3", label: "2025??3遺꾧린" },
              { value: "2025Q4", label: "2025??4遺꾧린" },
            ]
        },
        { 
            name: "branch", 
            type: "search", 
            label: "愿由щ???,
            onButtonClick: (val, e) => {
                e?.preventDefault();
                window.open(`${import.meta.env.BASE_URL}popup/branch-management?openerTabId=${tabId}`, "BranchManagement", "width=1600,height=800");
            }
        },
        { 
            name: "writeOffType", 
            type: "select", 
            label: "?곴컖援щ텇",
            options: [
              { value: "all", label: "?꾩껜" },
              { value: "general", label: "?쇰컲?곴컖" },
              { value: "special", label: "?뱀닔梨꾧텒" },
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">??먯긽媛곷???議고쉶</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ떊?ы썑</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?ъ궛嫄댁쟾????먯긽媛?/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>??먯긽媛곷???議고쉶</BreadcrumbPage>
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
        <h3 className="font-semibold">??먯긽媛곷???梨꾧텒 議고쉶 議곌굔</h3>
        <FilterContainer
            filterLayout={filterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <DataTable
          title="??먯긽媛곷???梨꾧텒"
          columns={columns}
          data={currentState.tables?.['writeOffTargetTable'] || []}
      />
    </div>
  );
}




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
  ?꾩껜: [
    createColumn("curRow", "?쒕쾲"),
    createColumn("fdnCustNo", "怨좉컼踰덊샇"),
    createColumn("rnmNo", "怨좉컼二쇰?踰덊샇"),
    createColumn("custNm", "怨좉컼紐?),
    createColumn("acntNo", "怨꾩쥖踰덊샇"),
    createColumn("rqsCustNo", "?좎껌?멸퀬媛앸쾲??),
    createColumn("perlSttsNm", "媛쒖씤?뚯깮?곹깭"),
    createColumn("rqsPrgsSttsNm", "?좎슜?뚮났?좎껌?몄쭊?됱긽??),
    createColumn("bkrpXmptSttsNm", "?뚯궛硫댁콉吏꾪뻾?곹깭"),
  ],
  媛쒖씤?뚯깮: [
    createColumn("curRow", "?쒕쾲"),
    createColumn("custNo", "怨좉컼踰덊샇"),
    createColumn("rnmNo", "怨좉컼二쇰?踰덊샇"),
    createColumn("unqsCtns", "?뱀씠?ы빆?댁슜"),
    createColumn("custNm", "怨좉컼紐?),
    createColumn("acntNo", "怨꾩쥖踰덊샇"),
    createColumn("vacctNo", "媛?곴퀎醫뚮쾲??),
    createColumn("rqsCustNo", "?좎껌?멸퀬媛앸쾲??),
    createColumn("rqsCustNm", "?좎껌?몃챸"),
    createColumn("blce", "?異쒖옍??),
    createColumn("abolRqsYn", "?먯??좎껌?щ?"),
    createColumn("rprtngPrnc", "?좉퀬?먭툑"),
    createColumn("rprtngAmt", "?좉퀬湲덉븸"),
    createColumn("fxdAmt", "?뺤젙湲덉븸"),
    createColumn("dffAmt", "李⑥븸湲덉븸"),
    createColumn("cortNm", "踰뺤썝紐?),
    createColumn("telNo", "?꾪솕踰덊샇"),
    createColumn("csNo", "?ш굔踰덊샇"),
    createColumn("rceptDt", "?묒닔??),
    createColumn("perlSttsNm", "媛쒖씤?뚯깮?곹깭"),
    createColumn("prhbtCmdDt", "湲덉?紐낅졊?쇱옄"),
    createColumn("dlvDt", "?〓떖?쇱옄"),
    createColumn("stodrDt", "以묒?紐낅졊?쇱옄"),
    createColumn("rptXpnPrcsDt", "蹂닿퀬?쒖쇅泥섎━?쇱옄"),
    createColumn("strtDt", "媛쒖떆?쇱옄"),
    createColumn("ofpmsDt", "?멸??쇱옄"),
    createColumn("wdrwDt", "痍⑦븯?쇱옄"),
    createColumn("ovrdDt", "湲곌컖?쇱옄"),
    createColumn("abolDt", "?먯??쇱옄"),
    createColumn("slfempEn", "?먯쁺?낆옄?좊Т"),
    createColumn("workwrplNm", "洹쇰Т泥?),
    createColumn("mmAvrIncmAmt", "?뷀룊洹좎냼??),
    createColumn("rpymtStrDt", "蹂?쒖떆?묒씪??),
    createColumn("rptmrEndDt", "蹂?쒖쥌猷뚯씪??),
    createColumn("rpymtrAcmtlAmt", "蹂?쒕늻怨?),
    createColumn("pytRto", "?⑹엯瑜?),
    createColumn("bondRqsNo", "梨꾧텒踰덊샇"),
    createColumn("sucYn", "?밴퀎?좊Т"),
    createColumn("acntDclrtYn", "怨꾩쥖?좉퀬?쒖쑀臾?),
    createColumn("objnRqsYn", "?댁쓽?좎껌?щ?"),
    createColumn("spnpyt", "媛吏湲됯툑"),
    createColumn("rpymtRto", "蹂?쒖쑉"),
    createColumn("prdctNm", "?곹뭹紐?),
    createColumn("caseCourt", "?ы뙋遺"),
    createColumn("frsRgstrnUsrNm", "?낅젰?대떦??),
    createColumn("frsRgstrnDt", "?깅줉?쇱떆"),
    createColumn("prrtyRpymtRn", "?곗꽑蹂?쒗쉶李?),
    createColumn("totPytRn", "珥앸궔?낇쉶李?),
    createColumn("stdPrgsRn", "吏꾪뻾?뚯감"),
    createColumn("stdPytRn", "?ㅻ궔?낇쉶李?),
    createColumn("stdArrRn", "?곗껜?뚯감"),
    createColumn("cortReqstTrgetYn", "踰뺤썝?붿껌??곸뿬遺"),
    createColumn("fxdYn", "?뺤젙?щ?"),
    createColumn("pytAmt1", "?⑹엯湲덉븸1?뚯감"),
    createColumn("pytAmt2", "?⑹엯湲덉븸2?뚯감"),
    createColumn("pytAmt3", "?⑹엯湲덉븸3?뚯감"),
    createColumn("pytAmt4", "?⑹엯湲덉븸4?뚯감"),
    createColumn("pytAmt5", "?⑹엯湲덉븸5?뚯감"),
    createColumn("pytAmt6", "?⑹엯湲덉븸6?뚯감"),
    createColumn("pytAmt7", "?⑹엯湲덉븸7?뚯감"),
    createColumn("pytAmt8", "?⑹엯湲덉븸8?뚯감"),
    createColumn("pytAmt9", "?⑹엯湲덉븸9?뚯감"),
    createColumn("pytAmt10", "?⑹엯湲덉븸10?뚯감"),
    createColumn("pytAmt11", "?⑹엯湲덉븸11?뚯감"),
    createColumn("pytAmt12", "?⑹엯湲덉븸12?뚯감"),
    createColumn("pytAmt13", "?⑹엯湲덉븸13?뚯감"),
    createColumn("pytAmt14", "?⑹엯湲덉븸14?뚯감"),
    createColumn("pytAmt15", "?⑹엯湲덉븸15?뚯감"),
    createColumn("pytAmt16", "?⑹엯湲덉븸16?뚯감"),
    createColumn("pytAmt17", "?⑹엯湲덉븸17?뚯감"),
    createColumn("pytAmt18", "?⑹엯湲덉븸18?뚯감"),
    createColumn("pytAmt19", "?⑹엯湲덉븸19?뚯감"),
    createColumn("pytAmt20", "?⑹엯湲덉븸20?뚯감"),
    createColumn("pytAmt21", "?⑹엯湲덉븸21?뚯감"),
    createColumn("pytAmt22", "?⑹엯湲덉븸22?뚯감"),
    createColumn("pytAmt23", "?⑹엯湲덉븸23?뚯감"),
    createColumn("pytAmt24", "?⑹엯湲덉븸24?뚯감"),
    createColumn("pytAmt25", "?⑹엯湲덉븸25?뚯감"),
    createColumn("pytAmt26", "?⑹엯湲덉븸26?뚯감"),
    createColumn("pytAmt27", "?⑹엯湲덉븸27?뚯감"),
    createColumn("pytAmt28", "?⑹엯湲덉븸28?뚯감"),
    createColumn("pytAmt29", "?⑹엯湲덉븸29?뚯감"),
    createColumn("pytAmt30", "?⑹엯湲덉븸30?뚯감"),
    createColumn("pytAmt31", "?⑹엯湲덉븸31?뚯감"),
    createColumn("pytAmt32", "?⑹엯湲덉븸32?뚯감"),
    createColumn("pytAmt33", "?⑹엯湲덉븸33?뚯감"),
    createColumn("pytAmt34", "?⑹엯湲덉븸34?뚯감"),
    createColumn("pytAmt35", "?⑹엯湲덉븸35?뚯감"),
    createColumn("pytAmt36", "?⑹엯湲덉븸36?뚯감"),
    createColumn("pytAmt37", "?⑹엯湲덉븸37?뚯감"),
    createColumn("pytAmt38", "?⑹엯湲덉븸38?뚯감"),
    createColumn("pytAmt39", "?⑹엯湲덉븸39?뚯감"),
    createColumn("pytAmt40", "?⑹엯湲덉븸40?뚯감"),
    createColumn("pytAmt41", "?⑹엯湲덉븸41?뚯감"),
    createColumn("pytAmt42", "?⑹엯湲덉븸42?뚯감"),
    createColumn("pytAmt43", "?⑹엯湲덉븸43?뚯감"),
    createColumn("pytAmt44", "?⑹엯湲덉븸44?뚯감"),
    createColumn("pytAmt45", "?⑹엯湲덉븸45?뚯감"),
    createColumn("pytAmt46", "?⑹엯湲덉븸46?뚯감"),
    createColumn("pytAmt47", "?⑹엯湲덉븸47?뚯감"),
    createColumn("pytAmt48", "?⑹엯湲덉븸48?뚯감"),
    createColumn("pytAmt49", "?⑹엯湲덉븸49?뚯감"),
    createColumn("pytAmt50", "?⑹엯湲덉븸50?뚯감"),
    createColumn("pytAmt51", "?⑹엯湲덉븸51?뚯감"),
    createColumn("pytAmt52", "?⑹엯湲덉븸52?뚯감"),
    createColumn("pytAmt53", "?⑹엯湲덉븸53?뚯감"),
    createColumn("pytAmt54", "?⑹엯湲덉븸54?뚯감"),
    createColumn("pytAmt55", "?⑹엯湲덉븸55?뚯감"),
    createColumn("pytAmt56", "?⑹엯湲덉븸56?뚯감"),
    createColumn("pytAmt57", "?⑹엯湲덉븸57?뚯감"),
    createColumn("pytAmt58", "?⑹엯湲덉븸58?뚯감"),
    createColumn("pytAmt59", "?⑹엯湲덉븸59?뚯감"),
    createColumn("pytAmt60", "?⑹엯湲덉븸60?뚯감"),
    createColumn("aclPytAmt1", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt2", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt3", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt4", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt5", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt6", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt7", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt8", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt9", "?ㅻ궔?낃툑???뚯감"),
    createColumn("aclPytAmt10", "?ㅻ궔?낃툑??0?뚯감"),
    createColumn("aclPytAmt11", "?ㅻ궔?낃툑??1?뚯감"),
    createColumn("aclPytAmt12", "?ㅻ궔?낃툑??2?뚯감"),
    createColumn("aclPytAmt13", "?ㅻ궔?낃툑??3?뚯감"),
    createColumn("aclPytAmt14", "?ㅻ궔?낃툑??4?뚯감"),
    createColumn("aclPytAmt15", "?ㅻ궔?낃툑??5?뚯감"),
    createColumn("aclPytAmt16", "?ㅻ궔?낃툑??6?뚯감"),
    createColumn("aclPytAmt17", "?ㅻ궔?낃툑??7?뚯감"),
    createColumn("aclPytAmt18", "?ㅻ궔?낃툑??8?뚯감"),
    createColumn("aclPytAmt19", "?ㅻ궔?낃툑??9?뚯감"),
    createColumn("aclPytAmt20", "?ㅻ궔?낃툑??0?뚯감"),
    createColumn("aclPytAmt21", "?ㅻ궔?낃툑??1?뚯감"),
    createColumn("aclPytAmt22", "?ㅻ궔?낃툑??2?뚯감"),
    createColumn("aclPytAmt23", "?ㅻ궔?낃툑??3?뚯감"),
    createColumn("aclPytAmt24", "?ㅻ궔?낃툑??4?뚯감"),
    createColumn("aclPytAmt25", "?ㅻ궔?낃툑??5?뚯감"),
    createColumn("aclPytAmt26", "?ㅻ궔?낃툑??6?뚯감"),
    createColumn("aclPytAmt27", "?ㅻ궔?낃툑??7?뚯감"),
    createColumn("aclPytAmt28", "?ㅻ궔?낃툑??8?뚯감"),
    createColumn("aclPytAmt29", "?ㅻ궔?낃툑??9?뚯감"),
    createColumn("aclPytAmt30", "?ㅻ궔?낃툑??0?뚯감"),
    createColumn("aclPytAmt31", "?ㅻ궔?낃툑??1?뚯감"),
    createColumn("aclPytAmt32", "?ㅻ궔?낃툑??2?뚯감"),
    createColumn("aclPytAmt33", "?ㅻ궔?낃툑??3?뚯감"),
    createColumn("aclPytAmt34", "?ㅻ궔?낃툑??4?뚯감"),
    createColumn("aclPytAmt35", "?ㅻ궔?낃툑??5?뚯감"),
    createColumn("aclPytAmt36", "?ㅻ궔?낃툑??6?뚯감"),
    createColumn("aclPytAmt37", "?ㅻ궔?낃툑??7?뚯감"),
    createColumn("aclPytAmt38", "?ㅻ궔?낃툑??8?뚯감"),
    createColumn("aclPytAmt39", "?ㅻ궔?낃툑??9?뚯감"),
    createColumn("aclPytAmt40", "?ㅻ궔?낃툑??0?뚯감"),
    createColumn("aclPytAmt41", "?ㅻ궔?낃툑??1?뚯감"),
    createColumn("aclPytAmt42", "?ㅻ궔?낃툑??2?뚯감"),
    createColumn("aclPytAmt43", "?ㅻ궔?낃툑??3?뚯감"),
    createColumn("aclPytAmt44", "?ㅻ궔?낃툑??4?뚯감"),
    createColumn("aclPytAmt45", "?ㅻ궔?낃툑??5?뚯감"),
    createColumn("aclPytAmt46", "?ㅻ궔?낃툑??6?뚯감"),
    createColumn("aclPytAmt47", "?ㅻ궔?낃툑??7?뚯감"),
    createColumn("aclPytAmt48", "?ㅻ궔?낃툑??8?뚯감"),
    createColumn("aclPytAmt49", "?ㅻ궔?낃툑??9?뚯감"),
    createColumn("aclPytAmt50", "?ㅻ궔?낃툑??0?뚯감"),
    createColumn("aclPytAmt51", "?ㅻ궔?낃툑??1?뚯감"),
    createColumn("aclPytAmt52", "?ㅻ궔?낃툑??2?뚯감"),
    createColumn("aclPytAmt53", "?ㅻ궔?낃툑??3?뚯감"),
    createColumn("aclPytAmt54", "?ㅻ궔?낃툑??4?뚯감"),
    createColumn("aclPytAmt55", "?ㅻ궔?낃툑??5?뚯감"),
    createColumn("aclPytAmt56", "?ㅻ궔?낃툑??6?뚯감"),
    createColumn("aclPytAmt57", "?ㅻ궔?낃툑??7?뚯감"),
    createColumn("aclPytAmt58", "?ㅻ궔?낃툑??8?뚯감"),
    createColumn("aclPytAmt59", "?ㅻ궔?낃툑??9?뚯감"),
    createColumn("aclPytAmt60", "?ㅻ궔?낃툑??0?뚯감"),
  ],
  ?좎슜?뚮났: [
    createColumn("curRow", "?쒕쾲"),
    createColumn("custNo", "怨좉컼踰덊샇"),
    createColumn("custNm", "怨좉컼紐?),
    createColumn("rqsRrn", "?좎껌二쇰??깅줉踰덊샇"),
    createColumn("rqsCustNm", "?좎껌?몃챸"),
    createColumn("acntNo", "怨꾩쥖踰덊샇"),
    createColumn("rqsPrgsSttsNm", "?좎껌吏꾪뻾?곹깭"),
    createColumn("acntPrgsSttsCtns", "怨꾩쥖吏꾪뻾?곹깭?댁슜"),
    createColumn("abandnDt", "?ㅽ슚/?꾩젣/?⑹쓽???ш린?쇱옄"),
    createColumn("rceptNticDt", "?묒닔?듭??쇱옄"),
    createColumn("fxdDt", "?뺤젙?쇱옄"),
    createColumn("mdatAfIrt", "議곗젙?꾩씠??),
    createColumn("mdatAfPrncAmt", "議곗젙?꾩썝湲?),
    createColumn("mdatAfIntrAmt", "議곗젙?꾩씠??),
    createColumn("mdatAfArrIntrAmt", "議곗젙?꾩뿰泥댁씠??),
    createColumn("mdatAfCstAmt", "議곗젙?꾨퉬??),
    createColumn("mdatAfSumAmt", "議곗젙?꾪빀怨?),
    createColumn("rqsDvCtns", "?좎껌援щ텇"),
    createColumn("prdctNm", "?곹뭹紐?),
  ],
  ?뚯궛硫댁콉: [
    createColumn("curRow", "?쒕쾲"),
    createColumn("custNo", "怨좉컼踰덊샇"),
    createColumn("custNm", "怨좉컼紐?),
    createColumn("rqsCustNo", "?좎껌?멸퀬媛앸쾲??),
    createColumn("rqsCustNm", "?좎껌?몃챸"),
    createColumn("acntNo", "怨꾩쥖踰덊샇"),
    createColumn("blceStdrYm", "?붿븸湲곗??꾩썡"),
    createColumn("stdrBlceAmt", "湲곗??붿븸湲덉븸"),
    createColumn("unqnCtns", "?뱀씠?ы빆"),
    createColumn("rceptDt", "?묒닔?쇱옄"),
    createColumn("bkrpXmptSttsNm", "?뚯궛硫댁콉?곹깭"),
    createColumn("sntcDt", "?좉퀬?쇱옄"),
    createColumn("xmptDt", "硫댁콉?쇱옄"),
    createColumn("abolDt", "?먯??쇱옄"),
    createColumn("cortNm", "踰뺤썝"),
    createColumn("bkrpCsNo", "?ш굔踰덊샇(?섎떒)"),
    createColumn("xmptCsNo", "?ш굔踰덊샇(?섎㈃)"),
    createColumn("prdctNm", "?곹뭹紐?),
    createColumn("hndlBnkNm", "痍④툒??됰챸"),
    createColumn("rnmNo", "怨좉컼二쇰?踰덊샇"),
  ],
  梨꾨Т議곗젙: [
    createColumn("curRow", "?쒕쾲"),
    createColumn("custNo", "怨좉컼踰덊샇"),
    createColumn("acntNo", "怨꾩쥖踰덊샇"),
    createColumn("custNm", "怨좉컼紐?),
    createColumn("fnoblMdatRqsDstcd", "?좎껌援щ텇"),
    createColumn("fnoblMdatComptDt", "梨꾨Т議곗젙?꾨즺?쇱옄"),
    createColumn("bfFnoblMdatComptDt", "?댁쟾梨꾨Т議곗젙?꾨즺?쇱옄"),
    createColumn("blce", "?異쒖옍??),
    createColumn("bfPrnc", "議곗젙?꾩썝湲?),
    createColumn("afPrnc", "議곗젙?꾩썝湲?),
    createColumn("agrtCnclnDt", "?⑹쓽?댁젣?쇱옄"),
    createColumn("dfrPrdEndDt", "嫄곗튂湲곌컙醫낅즺?쇱옄"),
    createColumn("trmnatDt", "?댁??쇱옄"),
    createColumn("rpayPstpTn", "?곹솚?좎삁?щ?"),
    createColumn("rpayPstpPrd", "?좎삁湲곌컙"),
    createColumn("rpayPstpPrncYn", "梨꾨Т議곗젙?ы빆1(?곹솚?좎삁(?먭툑))"),
    createColumn("rpayPstpPrinstYn", "梨꾨Т議곗젙?ы빆2(?곹솚?좎삁(?먮━湲?)"),
    createColumn("prncRdcxptDtmPymtYn", "梨꾨Т議곗젙?ы빆3(?먭툑媛먮㈃(?쇱떆??)"),
    createColumn("prncRdcxptInstPymtYn", "梨꾨Т議곗젙?ы빆4(?먭툑媛먮㈃(遺꾨궔))"),
    createColumn("intrRdcxptIntrYn", "梨꾨Т議곗젙?ы빆5(?댁옄媛먮㈃(?댁옄))"),
    createColumn("intrRdcxptArrIntrYn", "梨꾨Т議곗젙?ы빆6(?댁옄媛먮㈃(?곗껜?댁옄))"),
    createColumn("expXtnsYn", "梨꾨Т議곗젙?ы빆7(留뚭린?곗옣)"),
    createColumn("fnoblMdatDtlsEtcCtns", "梨꾨Т議곗젙?ы빆8(湲고?)"),
    createColumn("rpayPrd", "?곹솚湲곌컙"),
    createColumn("rpayStrDt", "?곹솚?쒖옉?쇱옄"),
    createColumn("rpayEndDt", "?곹솚醫낅즺?쇱옄"),
    createColumn("pytDd", "留ㅼ썡?⑹엯??),
  ],
};

const mockData: BondInquiryData[] = Array.from({ length: 23 }, (_, i) => ({
  curRow: i + 1,
  fdnCustNo: `F${1001 + i}`,
  rnmNo: `R${2001 + i}`,
  custNm: `怨좉컼${i + 1}`,
  acntNo: `ACC${3001 + i}`,
  rqsCustNo: `RQ${4001 + i}`,
  perlSttsNm: i % 2 === 0 ? "?뺤긽" : "遺??,
  rqsPrgsSttsNm: i % 3 === 0 ? "吏꾪뻾以? : "?꾨즺",
  bkrpXmptSttsNm: i % 4 === 0 ? "?좎껌" : "硫댁콉",
}));

// Data type for the Excel Upload table (can be the same if structure matches)
type ExcelUploadData = BondInquiryData;

// Mock data for the Excel Upload table
const excelMockData: ExcelUploadData[] = Array.from({ length: 12 }, (_, i) => ({
    curRow: i + 1,
    fdnCustNo: `EXF${1001 + i}`,
    rnmNo: `EXR${2001 + i}`,
    custNm: `?묒?怨좉컼${i + 1}`,
    acntNo: `EXACC${3001 + i}`,
    rqsCustNo: `EXRQ${4001 + i}`,
    perlSttsNm: i % 2 === 0 ? "?뺤긽" : "遺??,
    rqsPrgsSttsNm: i % 3 === 0 ? "吏꾪뻾以? : "?꾨즺",
    bkrpXmptSttsNm: i % 4 === 0 ? "?좎껌" : "硫댁콉",
}));

// Column definitions for the Excel Upload table
const excelColumns: ColumnDef<ExcelUploadData>[] = bondAdjustmentColumns["?꾩껜"];

export default function BondInquiryPage() {
  const tabId = usePathname();
  const { currentState, updateFilters, updateTableData, clearState } = usePageStore();
  const [activeBondAdjustmentType, setActiveBondAdjustmentType] = useState<string>("?꾩껜");

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
          label: "梨꾧텒議곗젙援щ텇", 
          options: [
            { value: "?꾩껜", label: "?꾩껜" },
            { value: "媛쒖씤?뚯깮", label: "媛쒖씤?뚯깮" },
            { value: "?좎슜?뚮났", label: "?좎슜?뚮났" },
            { value: "?뚯궛硫댁콉", label: "?뚯궛/硫댁콉" },
            { value: "梨꾨Т議곗젙", label: "梨꾨Т議곗젙" },
          ],
        },
        { 
          name: "customerName", 
          type: "search", 
          label: "?깅챸",
          onButtonClick: (value?: any, e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            const customerNameForSearch = value?.code || '';
            window.open(
              `${import.meta.env.BASE_URL}popup/customer-search?customerName=${customerNameForSearch}&openerTabId=${tabId}`,
              'CustomerSearch',
              'width=1600,height=800'
            );
          }
        },
        { name: "blank1", type: "blank" },
        { 
          name: "progressStatus", 
          type: "multi-select", 
          label: "吏꾪뻾 ?곹깭", 
          activator: false, // Component handles activator internally
          options: Array.from({ length: 100 }, (_, i) => ({
            value: `status-${i + 1}`,
            label: `吏꾪뻾?곹깭 ${i + 1}`,
          })), 
        },
        { name: "registrar", type: "search", label: "?좉퇋?깅줉?? },
        { name: "modifier", type: "search", label: "理쒖쥌?섏젙?? },
        { name: "paymentRate", type: "number-range", label: "?⑹엯瑜? },
        { name: "accountStatus", type: "select", label: "怨꾩쥖吏꾪뻾?곹깭", options: [] },
        { name: "registrationDate", type: "date-range", label: "?좉퇋?깅줉?쇱옄" },
        { name: "modificationDate", type: "date-range", label: "理쒖쥌?섏젙?쇱옄" },
        { name: "courtName", type: "select", label: "踰뺤썝紐?, options: [], activator: true },
        { name: "caseNumber", type: "text", label: "?ш굔踰덊샇" },
        { name: "progressRound", type: "number-range", label: "吏꾪뻾?뚯감" },
        { name: "actualPaymentRound", type: "number-range", label: "?ㅻ궔?낇쉶李? },
        { name: "overdueRound", type: "number-range", label: "?곗껜?뚯감" },
        { name: "cancellationRequest", type: "checkbox", label: "?먯??좎껌(Y)" },
        { name: "virtualAccountDate", type: "date-range", label: "媛?곴퀎醫뚮??ъ씪?? },
        { name: "baseDate", type: "date-range", label: "湲곗??? },
        { name: "debtAdjustmentCompleteDate", type: "date-range", label: "梨꾨Т議곗젙?꾨즺?? },
      ],
    },
  ];

  const currentColumns = bondAdjustmentColumns[activeBondAdjustmentType] || bondAdjustmentColumns["?꾩껜"];

  const amountColumnsMap: { [key: string]: string[] } = {
    ?꾩껜: [],
    媛쒖씤?뚯깮: ["blce", "rprtngPrnc", "rprtngAmt", "fxdAmt", "dffAmt", "mmAvrIncmAmt", "rpymtrAcmtlAmt", "pytRto", "spnpyt", "rpymtRto",
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
    ?좎슜?뚮났: ["mdatAfIrt", "mdatAfPrncAmt", "mdatAfIntrAmt", "mdatAfArrIntrAmt", "mdatAfCstAmt", "mdatAfSumAmt"],
    ?뚯궛硫댁콉: ["stdrBlceAmt"],
    梨꾨Т議곗젙: ["blce", "bfPrnc", "afPrnc"],
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
      
      setActiveBondAdjustmentType(selectedType || "?꾩껜");
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
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">梨꾧텒議고쉶</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span>??/span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>?ъ떊?ы썑</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>梨꾧텒議곗젙</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>梨꾧텒議고쉶</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        {activeBondAdjustmentType === "媛쒖씤?뚯깮" ? (
          <LeftActions actions={[{ id: 'batch-register' }, { id: 'cancel' }, { id: 'dm' }]} />
        ) : (
          <div></div>
        )}
        <RightActions actions={pageActions} />
      </div>

      <Tabs defaultValue="debt-inquiry">
        <TabsList>
          <TabsTrigger value="debt-inquiry">梨꾨Т愿??議고쉶</TabsTrigger>
          <TabsTrigger value="excel-save">?묒??뚯씪 ???/TabsTrigger>
        </TabsList>
        <TabsContent value="debt-inquiry" className="flex flex-col gap-3">
          <FilterContainer
            filterLayout={filterLayout}
            values={currentState.filters}
            onChange={handleFilterChange}
          />
          
          <DataTable 
            title="議고쉶?댁슜"
            columns={currentColumns} 
            data={currentState.tables?.['bondInquiryTable'] || []} 
            amountColumns={currentAmountColumns} 
          />
        </TabsContent>
        <TabsContent value="excel-save" className="flex flex-col gap-3">
          <div className="rounded-lg border px-4 py-4">
            <div className="flex flex-col gap-4">
              <FilterFileUpload label="泥⑤??뚯씪" />
              <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-4">
                <FilterSelect 
                  name="excelProgressStatus" 
                  label="吏꾪뻾?곹깭援щ텇" 
                  options={[]} 
                  value={currentState.filters.excelProgressStatus}
                  onChange={handleFilterChange}
                />
                <FilterInput 
                  name="excelProgressState" 
                  type="text" 
                  label="吏꾪뻾?곹깭" 
                  width="short" 
                  value={currentState.filters.excelProgressState}
                  onChange={handleFilterChange}
                />
                <FilterInput 
                  name="excelProgressCount" 
                  type="number" 
                  label="吏꾪뻾嫄댁닔" 
                  value={currentState.filters.excelProgressCount}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
          <DataTable 
            title="?낅줈???댁슜"
            columns={excelColumns} 
            data={currentState.tables?.['excelUploadTable'] || []} 
            amountColumns={currentAmountColumns} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

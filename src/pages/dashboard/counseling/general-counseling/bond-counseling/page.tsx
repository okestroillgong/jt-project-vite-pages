

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
import { FilterDateRange } from "@/components/filters/FilterDateRange";
import { RightActions } from "@/components/app/RightActions";
import type { FilterLayout } from "@/components/filters/types";
import { usePageStore } from "@/lib/store/pageStore";
import { listenForPopupMessages } from "@/lib${import.meta.env.BASE_URL}popup-bus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { X, Mail } from "lucide-react";
import IconRegister from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯03?깅줉?곗깋";
import { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent } from "@/components/app/CustomTabs";

// --- Types ---

interface CustomerManagementCodeData {
  id: number;
  customer: string; // 怨좉컼
  screening: string; // ?ъ궗
  prohibition: string; // 湲덉?
  debtAdjustment: string; // 梨꾨Т議곗젙
  legalAction: string; // 踰뺤“移?  pr: string; // PR
  certificate: string; // ?쒖쬆紐낆꽌
  otherCode: string; // 湲고?肄붾뱶
}

interface AccountInfoData {
  id: number;
  alternateWithdrawal: string; // 寃⑹씪異쒓툑
  accountNumber: string; // 怨꾩쥖踰덊샇
  subjectName: string; // 怨쇰ぉ紐?  accountStatus: string; // 怨꾩쥖?곹깭
  amount: number; // 湲덉븸
  interestRate: string; // ?댁쑉
  rateReduction: string; // 湲덈━?명븯
  collateral: string; // ?대낫
  newDate: string; // ?좉퇋?쇱옄
  expiryDate: string; // 留뚭린?쇱옄
}

interface ApplicationHistoryData1 {
  id: number;
  loanApplicationNumber: string; // ?異쒖떊泥?쾲??  accessRoute: string; // ?묒냽寃쎈줈
  accessChannel: string; // ?묒냽梨꾨꼸
  accessMedia: string; // ?묒냽留ㅼ껜
  applicationDate: string; // ?좎껌??  productName: string; // ?곹뭹紐?  loanType: string; // ?異쒓뎄遺?  applicationStatus: string; // ?좎껌?곹깭
  applicationAmount: number; // ?좎껌湲덉븸
  approvalDate: string; // ?뱀씤??}

interface ApplicationHistoryData2 {
  id: number;
  applicationDate: string; // ?좎껌?쇱옄
  applicationNumber: string; // ?좎껌踰덊샇
  customerName: string; // 怨좉컼紐?  carrier: string; // ?댄넻??  mobile: string; // ?대???  owner: string; // 紐낆쓽??  actualResidence: string; // ?ㅺ굅二쇱?
}

interface CollateralData {
  id: number;
  collateralNumber: string; // ?대낫踰덊샇
  ownerName: string; // ?뚯쑀?먮챸
  creditAccountNumber: string; // ?ъ떊怨꾩쥖踰덊샇
  debtor: string; // 梨꾨Т??  account: string; // 怨꾩쥖
  linkedProduct: string; // ?곌껐?곹뭹
  collateralAmount: number; // ?대낫蹂꾨떞蹂닿툑??}

interface RelatedPersonData {
  id: number;
  accountNumber: string; // 怨꾩쥖踰덊샇
  classification: string; // 援щ텇
  status: string; // ?곹깭
  name: string; // ?깅챸
  relationship: string; // 愿怨?  residentNumber: string; // 二쇰?踰덊샇
  mobile: string; // ?대??곕쾲??  homePhone: string; // ?먰깮踰덊샇
  workPhone: string; // 吏곸옣?꾪솕
}

interface CounselingHistoryData {
  id: number;
  counselingDateTime: string; // ?곷떞?쇱떆
  counselor: string; // ?곷떞??  contact: string; // ?묒큺
  selectionTarget: string; // ?좏깮???  task: string; // ?낅Т
  contactResult: string; // ?곕씫寃곌낵
  promiseDate: string; // ?쎌냽?쇱옄
  promiseTime: string; // ?쎌냽?쒓컙
  promiseAmount: number; // ?쎌냽湲덉븸
  selectionLocation: string; // ?좏깮?μ냼
}

interface CMSInfoData {
  id: number;
  registrationDateTime: string; // ?깅줉?쇱떆
  accountNumber: string; // 怨꾩쥖踰덊샇
  status: string; // ?곹깭
  classification: string; // 援щ텇
  bank: string; // ???  bankAccountNumber: string; // ??됯퀎醫뚮쾲??  customerName: string; // 怨좉컼紐?  processingAmount: number; // 泥섎━湲덉븸
}

interface AlarmTalkSMSData {
  id: number;
  sendDateTime: string; // ?꾩넚?쇱떆
  receiverNumber: string; // ?섏떊踰덊샇
  messageType: string; // 硫붿꽭吏?좏삎
  result: string; // 寃곌낵
  content: string; // ?댁슜
  replyNumber: string; // ?뚯떊踰덊샇
  counselingContent: string; // ?곷떞?댁슜
}

interface DepositHistoryData {
  id: number;
  transactionDate: string; // 嫄곕옒?쇱옄
  depositMethod: string; // ?낃툑諛⑹떇
  customerName: string; // 怨좉컼紐?  bank: string; // ???  processingStatus: string; // 泥섎━?곹깭
  processingDateTime: string; // 泥섎━?쇱떆
  request: string; // ?붿껌?ы빆
}

interface DMFAXData {
  id: number;
  sequenceNumber: number; // ?쒕쾲
  sendDateTime: string; // 諛쒖넚?쇱떆
  accountNumber: string; // 怨꾩쥖踰덊샇
  formName: string; // ?묒떇紐?  registrationNumber: string; // ?깃린踰덊샇
}

interface InterestConfirmationData {
  id: number;
  sequenceNumber: number; // ?쒕쾲
  issueDateTime: string; // 諛쒓툒?쇱떆
  issueNumber: string; // 諛쒓툒踰덊샇
  viewConfirmation: string; // ?대엺?뺤씤?щ?
  transcriptCount: number; // 珥덈낯??  personalInfoChange: string; // 媛쒖씤?몄쟻?ы빆蹂寃쎌뿬遺
  pastAddressHistory: string; // 怨쇨굅二쇱냼蹂?숇궡??  targetName: string; // ??곸옄紐?}

// --- Mock Data ---
const mockData: CustomerManagementCodeData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  customer: `怨좉컼肄붾뱶${i + 1}`,
  screening: `?ъ궗${i + 1}`,
  prohibition: "",
  debtAdjustment: "",
  legalAction: "",
  pr: "",
  certificate: "",
  otherCode: "",
}));

const mockAccountData: AccountInfoData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  alternateWithdrawal: "",
  accountNumber: `1234-5678-${1000 + i}`,
  subjectName: "蹂댄넻?덇툑",
  accountStatus: "?뺤긽",
  amount: 1000000 * (i + 1),
  interestRate: "3.5%",
  rateReduction: "",
  collateral: "",
  newDate: "2024-01-15",
  expiryDate: "2025-01-15",
}));

const mockApplicationData1: ApplicationHistoryData1[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  loanApplicationNumber: `L2024-${1000 + i}`,
  accessRoute: "??,
  accessChannel: "PC",
  accessMedia: "?명꽣??,
  applicationDate: "2024-01-15",
  productName: "?쇰컲?異?,
  loanType: "?좎슜?異?,
  applicationStatus: "?뱀씤",
  applicationAmount: 5000000 * (i + 1),
  approvalDate: "2024-01-16",
}));

const mockApplicationData2: ApplicationHistoryData2[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  applicationDate: "2024-01-15",
  applicationNumber: `A2024-${1000 + i}`,
  customerName: `怨좉컼${i + 1}`,
  carrier: "SKT",
  mobile: "010-1234-5678",
  owner: `紐낆쓽??{i + 1}`,
  actualResidence: "?쒖슱??媛뺣궓援?,
}));

const mockCollateralData: CollateralData[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  collateralNumber: `C2024-${1000 + i}`,
  ownerName: `?뚯쑀??{i + 1}`,
  creditAccountNumber: `1234-5678-${1000 + i}`,
  debtor: `梨꾨Т??{i + 1}`,
  account: `怨꾩쥖${i + 1}`,
  linkedProduct: "?쇰컲?異?,
  collateralAmount: 10000000 * (i + 1),
}));

const mockRelatedPersonData: RelatedPersonData[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  accountNumber: `1234-5678-${1000 + i}`,
  classification: "蹂댁쬆??,
  status: "?뺤긽",
  name: `愿怨꾩씤${i + 1}`,
  relationship: "諛곗슦??,
  residentNumber: "******-*******",
  mobile: "010-1234-5678",
  homePhone: "02-1234-5678",
  workPhone: "02-9876-5432",
}));

const mockCounselingHistoryData: CounselingHistoryData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  counselingDateTime: "2024-01-15 10:30",
  counselor: `?곷떞??{i + 1}`,
  contact: "?꾪솕",
  selectionTarget: "蹂몄씤",
  task: "?곹솚?낆큺",
  contactResult: "?듯솕?꾨즺",
  promiseDate: "2024-01-20",
  promiseTime: "14:00",
  promiseAmount: 500000 * (i + 1),
  selectionLocation: "吏??,
  sample01: "?섑뵆01",
  sample02: "?섑뵆02",
  sample03: "?섑뵆03",
}));

const mockCMSInfoData: CMSInfoData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  registrationDateTime: "2024-01-15 09:00",
  accountNumber: `1234-5678-${1000 + i}`,
  status: "?뺤긽",
  classification: "?먮룞?댁껜",
  bank: "援?????,
  bankAccountNumber: `9876-5432-${1000 + i}`,
  customerName: `怨좉컼${i + 1}`,
  processingAmount: 100000 * (i + 1),
}));

const mockAlarmTalkSMSData: AlarmTalkSMSData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  sendDateTime: "2024-01-15 11:00",
  receiverNumber: "010-1234-5678",
  messageType: "?뚮┝??,
  result: "諛쒖넚?깃났",
  content: `?곹솚 ?덈궡 硫붿떆吏 ${i + 1}`,
  replyNumber: "1588-0000",
  counselingContent: "?곹솚 ?낆큺",
}));

const mockDepositHistoryData: DepositHistoryData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  transactionDate: "2024-01-15",
  depositMethod: "怨꾩쥖?댁껜",
  customerName: `怨좉컼${i + 1}`,
  bank: "?좏븳???,
  processingStatus: "?꾨즺",
  processingDateTime: "2024-01-15 15:30",
  request: "",
}));

const mockDMFAXData: DMFAXData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  sequenceNumber: i + 1,
  sendDateTime: "2024-01-15 10:00",
  accountNumber: `1234-5678-${1000 + i}`,
  formName: "?낆큺??,
  registrationNumber: `REG-2024-${1000 + i}`,
}));

const mockInterestConfirmationData: InterestConfirmationData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  sequenceNumber: i + 1,
  issueDateTime: "2024-01-15 14:00",
  issueNumber: `ISS-2024-${1000 + i}`,
  viewConfirmation: "?뺤씤",
  transcriptCount: i + 1,
  personalInfoChange: "蹂寃쎌뾾??,
  pastAddressHistory: "蹂?숈뾾??,
  targetName: `??곸옄${i + 1}`,
}));

// --- Columns ---
const columns: ColumnDef<CustomerManagementCodeData>[] = [
  { accessorKey: "customer", header: "怨좉컼" },
  { accessorKey: "screening", header: "?ъ궗" },
  { accessorKey: "prohibition", header: "湲덉?" },
  { accessorKey: "debtAdjustment", header: "梨꾨Т議곗젙" },
  { accessorKey: "legalAction", header: "踰뺤“移? },
  { accessorKey: "pr", header: "PR" },
  { accessorKey: "certificate", header: "?쒖쬆紐낆꽌" },
  { accessorKey: "otherCode", header: "湲고?肄붾뱶" },
];

const accountColumns: ColumnDef<AccountInfoData>[] = [
  { accessorKey: "alternateWithdrawal", header: "寃⑹씪異쒓툑" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "subjectName", header: "怨쇰ぉ紐? },
  { accessorKey: "accountStatus", header: "怨꾩쥖?곹깭" },
  { accessorKey: "amount", header: "湲덉븸" },
  { accessorKey: "interestRate", header: "?댁쑉" },
  { accessorKey: "rateReduction", header: "湲덈━?명븯" },
  { accessorKey: "collateral", header: "?대낫" },
  { accessorKey: "newDate", header: "?좉퇋?쇱옄" },
  { accessorKey: "expiryDate", header: "留뚭린?쇱옄" },
];

const applicationHistory1Columns: ColumnDef<ApplicationHistoryData1>[] = [
  { accessorKey: "loanApplicationNumber", header: "?異쒖떊泥?쾲?? },
  { accessorKey: "accessRoute", header: "?묒냽寃쎈줈" },
  { accessorKey: "accessChannel", header: "?묒냽梨꾨꼸" },
  { accessorKey: "accessMedia", header: "?묒냽留ㅼ껜" },
  { accessorKey: "applicationDate", header: "?좎껌?? },
  { accessorKey: "productName", header: "?곹뭹紐? },
  { accessorKey: "loanType", header: "?異쒓뎄遺? },
  { accessorKey: "applicationStatus", header: "?좎껌?곹깭" },
  { accessorKey: "applicationAmount", header: "?좎껌湲덉븸" },
  { accessorKey: "approvalDate", header: "?뱀씤?? },
];

const applicationHistory2Columns: ColumnDef<ApplicationHistoryData2>[] = [
  { accessorKey: "applicationDate", header: "?좎껌?쇱옄" },
  { accessorKey: "applicationNumber", header: "?좎껌踰덊샇" },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "carrier", header: "?댄넻?? },
  { accessorKey: "mobile", header: "?대??? },
  { accessorKey: "owner", header: "紐낆쓽?? },
  { accessorKey: "actualResidence", header: "?ㅺ굅二쇱?" },
];

const collateralColumns: ColumnDef<CollateralData>[] = [
  { accessorKey: "collateralNumber", header: "?대낫踰덊샇" },
  { accessorKey: "ownerName", header: "?뚯쑀?먮챸" },
  { accessorKey: "creditAccountNumber", header: "?ъ떊怨꾩쥖踰덊샇" },
  { accessorKey: "debtor", header: "梨꾨Т?? },
  { accessorKey: "account", header: "怨꾩쥖" },
  { accessorKey: "linkedProduct", header: "?곌껐?곹뭹" },
  { accessorKey: "collateralAmount", header: "?대낫蹂꾨떞蹂닿툑?? },
];

const relatedPersonColumns: ColumnDef<RelatedPersonData>[] = [
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "classification", header: "援щ텇" },
  { accessorKey: "status", header: "?곹깭" },
  { accessorKey: "name", header: "?깅챸" },
  { accessorKey: "relationship", header: "愿怨? },
  { accessorKey: "residentNumber", header: "二쇰?踰덊샇" },
  { accessorKey: "mobile", header: "?대??곕쾲?? },
  { accessorKey: "homePhone", header: "?먰깮踰덊샇" },
  { accessorKey: "workPhone", header: "吏곸옣?꾪솕" },
];

const counselingHistoryColumns: ColumnDef<CounselingHistoryData>[] = [
  { accessorKey: "counselingDateTime", header: "?곷떞?쇱떆" },
  { accessorKey: "counselor", header: "?곷떞?? },
  { accessorKey: "contact", header: "?묒큺" },
  { accessorKey: "selectionTarget", header: "?좏깮??? },
  { accessorKey: "task", header: "?낅Т" },
  { accessorKey: "contactResult", header: "?곕씫寃곌낵" },
  { accessorKey: "promiseDate", header: "?쎌냽?쇱옄" },
  { accessorKey: "promiseTime", header: "?쎌냽?쒓컙" },
  { accessorKey: "promiseAmount", header: "?쎌냽湲덉븸" },
  { accessorKey: "selectionLocation", header: "?좏깮?μ냼" },
  { accessorKey: "sample01", header: "?섑뵆01" },
  { accessorKey: "sample02", header: "?섑뵆02" },
  { accessorKey: "sample03", header: "?섑뵆03" },
];

const cmsInfoColumns: ColumnDef<CMSInfoData>[] = [
  { accessorKey: "registrationDateTime", header: "?깅줉?쇱떆" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "status", header: "?곹깭" },
  { accessorKey: "classification", header: "援щ텇" },
  { accessorKey: "bank", header: "??? },
  { accessorKey: "bankAccountNumber", header: "??됯퀎醫뚮쾲?? },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "processingAmount", header: "泥섎━湲덉븸" },
];

const alarmTalkSMSColumns: ColumnDef<AlarmTalkSMSData>[] = [
  { accessorKey: "sendDateTime", header: "?꾩넚?쇱떆" },
  { accessorKey: "receiverNumber", header: "?섏떊踰덊샇" },
  { accessorKey: "messageType", header: "硫붿꽭吏?좏삎" },
  { accessorKey: "result", header: "寃곌낵" },
  { accessorKey: "content", header: "?댁슜" },
  { accessorKey: "replyNumber", header: "?뚯떊踰덊샇" },
  { accessorKey: "counselingContent", header: "?곷떞?댁슜" },
];

const depositHistoryColumns: ColumnDef<DepositHistoryData>[] = [
  { accessorKey: "transactionDate", header: "嫄곕옒?쇱옄" },
  { accessorKey: "depositMethod", header: "?낃툑諛⑹떇" },
  { accessorKey: "customerName", header: "怨좉컼紐? },
  { accessorKey: "bank", header: "??? },
  { accessorKey: "processingStatus", header: "泥섎━?곹깭" },
  { accessorKey: "processingDateTime", header: "泥섎━?쇱떆" },
  { accessorKey: "request", header: "?붿껌?ы빆" },
];

const dmFaxColumns: ColumnDef<DMFAXData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="紐⑤몢 ?좏깮"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="???좏깮"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "sequenceNumber", header: "?쒕쾲" },
  { accessorKey: "sendDateTime", header: "諛쒖넚?쇱떆" },
  { accessorKey: "accountNumber", header: "怨꾩쥖踰덊샇" },
  { accessorKey: "formName", header: "?묒떇紐? },
  { accessorKey: "registrationNumber", header: "?깃린踰덊샇" },
];

const interestConfirmationColumns: ColumnDef<InterestConfirmationData>[] = [
  { accessorKey: "sequenceNumber", header: "?쒕쾲" },
  { accessorKey: "issueDateTime", header: "諛쒓툒?쇱떆" },
  { accessorKey: "issueNumber", header: "諛쒓툒踰덊샇" },
  { accessorKey: "viewConfirmation", header: "?대엺?뺤씤?щ?" },
  { accessorKey: "transcriptCount", header: "珥덈낯?? },
  { accessorKey: "personalInfoChange", header: "媛쒖씤?몄쟻?ы빆蹂寃쎌뿬遺" },
  { accessorKey: "pastAddressHistory", header: "怨쇨굅二쇱냼蹂?숇궡?? },
  { accessorKey: "targetName", header: "??곸옄紐? },
];

// 湲곗〈 踰꾪듉 由ъ뒪??const buttons = [
  "?뚮┝??SMS",
  "DM諛쒖넚",
  "?異쒖“嫄?,
  "?ъ떊?먯옣",
  "?ъ떊?곹솚",
  "諛⑸Ц?깅줉",
  "嫄곕옒?댁뿭",
  "?섏젙?뺣낫",
  "遺?숈궛寃쎈ℓ?뺣낫",
  "議곌린寃쎈낫",
  "諛쒓툒?댁뿭",
  "10?몄꽌??,
  "7?몄꽌??,
  "異붿떖?곕씫?쒗븳",
  "梨꾨Т議곗젙",
  "二쇱냼寃利?,
  "?곷떞?깅줉",
  "?뱀젙?뺣낫議고쉶",
  "硫붿꽭吏?좏삎",
  "怨좉컼愿由ъ퐫??,
];

const implementedButtons = [
  "?뚮┝??SMS",
  "DM諛쒖넚",
  "?異쒖“嫄?,
  "?ъ떊?곹솚",
  "?ъ떊?먯옣",
  "嫄곕옒?댁뿭",
  "議곌린寃쎈낫",
  "遺?숈궛寃쎈ℓ?뺣낫",
  "諛쒓툒?댁뿭",
  "?섏젙?뺣낫",
  "諛⑸Ц?깅줉",
  "異붿떖?곕씫?쒗븳",
  "二쇱냼寃利?,
  "?곷떞?깅줉",
  "?뱀젙?뺣낫議고쉶",
  "硫붿꽭吏?좏삎",
  "怨좉컼愿由ъ퐫??,
  "梨꾨Т議곗젙",
  "7?몄꽌??,
  "10?몄꽌??,
];

// 二쇱냼 寃利?而댄룷?뚰듃
const AddressVerificationRow = ({
  label,
  type
}: {
  label: string;
  type: "?? | "?? | "珥?;
}) => {
  const handleAddressSearch = () => {
    alert("二쇱냼 寃???앹뾽 ?ㅽ뻾");
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
      <Label className="text-sm font-medium pt-2">{label}</Label>
      <div className="flex flex-wrap gap-2 items-center">
        <Input className="w-[100px] h-9 text-sm" placeholder="?고렪踰덊샇" />
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={handleAddressSearch}
          title="二쇱냼 寃??
        >
          <Mail className="h-4 w-4" />
        </Button>
        <Input className="flex-1 min-w-[200px] h-9 text-sm" placeholder="?ㅼ젣 二쇱냼" />
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="??젣">
          <X className="h-4 w-4" />
        </Button>
        <Select>
          <SelectTrigger className="w-[100px] h-9 text-sm">
            <SelectValue placeholder="?꾨줈紐? />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="road">?꾨줈紐?/SelectItem>
            <SelectItem value="old">援ъ?踰?/SelectItem>
          </SelectContent>
        </Select>
        <Input className="w-[150px] h-9 text-sm" placeholder="?곸꽭二쇱냼" />
        <Input className="w-[100px] h-9 text-sm" placeholder="鍮꾧퀬" />
        <Checkbox />
        <span className="text-sm font-medium w-6">{type}</span>
        <Button variant="outline" size="sm" className="h-9">
          寃利?        </Button>
      </div>
    </div>
  );
};

export default function BondCounselingPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData } = usePageStore();

  // ?섎떒 ???곹깭 異붿쟻
  const [bottomTabValue, setBottomTabValue] = useState("?곷떞?대젰");

  // 珥덇린 ?꾪꽣 媛??ㅼ젙 (紐⑤뱺 ?꾨뱶瑜?鍮?臾몄옄?대줈 珥덇린??
  const initialFilters = {
    // 醫뚯륫 ?곸뿭
    residentNumber: "",
    customerNumber: "",
    accountNumber: "",
    dmDestination: "",
    workplaceInfo: "",
    resignation: "no",
    jobCategory: "",
    email: "",
    visitLocation: "",
    depositPromiseDate: "",
    lmsLastSendDate: "",
    // ?곗륫 ?곸뿭
    quickSearch: "",
    bondManager: "",
    regularManager: "",
    assignmentDate: "",
    mobile: "",
    home: "",
    office: "",
    other: "",
    memo: "",
  };

  const [filters, setFilters] = useState<Record<string, any>>(
    currentState?.filters || initialFilters
  );

  const tableData = useMemo(() =>
    currentState?.tables?.['customerManagementCodeTable'] || [],
    [currentState?.tables]
  );

  useEffect(() => {
    if (!currentState?.tables?.['customerManagementCodeTable']) {
      updateTableData(tabId, 'customerManagementCodeTable', mockData);
    }
  }, [tabId, currentState?.tables, updateTableData]);

  useEffect(() => {
    loadState(tabId);
  }, [tabId, loadState]);

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId) return;

      if (message.source === "customer-search") {
        const customer = message.payload;
        handleFilterChange("customerNumber", customer.centralCustomerNumber);
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

  useEffect(() => {
    updateFilters(tabId, filters);
  }, [tabId, filters, updateFilters]);

  // ?곗륫 ?꾪꽣 ?덉씠?꾩썐
  const rightAreaFilterLayout1: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "quickSearch",
          type: "select",
          label: "鍮좊Ⅸ寃??,
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "option1", label: "?듭뀡1" },
            { value: "option2", label: "?듭뀡2" },
          ],
        },
      ],
    },
  ], []);

  // ?곗륫 ?꾪꽣 ?덉씠?꾩썐
  const rightAreaFilterLayout2: FilterLayout = useMemo(() => [
    [
      {
        name: "bondManager",
        type: "input-button",
        label: "梨꾧텒 ?대떦??,
        buttonText: "?닿?",
        onButtonClick: () => alert("梨꾧텒 ?대떦???닿?"),
      },
      {
        name: "regularManager",
        type: "input-button",
        label: "?곸떆愿由??대떦??,
        buttonText: "?닿?",
        onButtonClick: () => alert("?곸떆愿由??대떦???닿?"),
      },
      {
        name: "assignmentDate",
        type: "date",
        label: "諛곗젙?쇱옄",
      },
      {
        name: "mobile",
        type: "select-with-input",
        label: "?몃뱶??,
        options: [
          { value: "010", label: "010" },
          { value: "011", label: "011" },
          { value: "016", label: "016" },
        ],
      },
      {
        name: "home",
        type: "select-with-input",
        label: "?먰깮",
        options: [
          { value: "02", label: "02" },
          { value: "031", label: "031" },
          { value: "032", label: "032" },
        ],
      },
      {
        name: "office",
        type: "select-with-input",
        label: "吏곸옣",
        options: [
          { value: "02", label: "02" },
          { value: "031", label: "031" },
          { value: "032", label: "032" },
        ],
      },
      {
        name: "other",
        type: "select-with-input",
        label: "湲고?",
        options: [
          { value: "02", label: "02" },
          { value: "031", label: "031" },
          { value: "032", label: "032" },
        ],
      },
      {
        name: "memo",
        type: "textarea",
        label: "硫붾え",
      },
    ],
  ], []);

  // 醫뚯륫 ?꾪꽣 ?덉씠?꾩썐 1 (?곷떒)
  const leftAreaFilterLayout1: FilterLayout = useMemo(() => [
    // row 1: 二쇰?踰덊샇, 怨좉컼踰덊샇, 怨꾩쥖踰덊샇, DM諛쒖넚泥?    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "residentNumber",
          type: "text",
          label: "二쇰?踰덊샇",
        },
        {
          name: "customerNumber",
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
          name: "accountNumber",
          type: "text",
          label: "怨꾩쥖踰덊샇",
        },
        {
          name: "dmDestination",
          type: "select",
          label: "DM諛쒖넚泥?,
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "home", label: "?먰깮" },
            { value: "office", label: "吏곸옣" },
          ],
        },
      ],
    },
  ], [tabId]);

  // 醫뚯륫 ?꾪꽣 ?덉씠?꾩썐 2 (?섎떒)
  const leftAreaFilterLayout2: FilterLayout = useMemo(() => [
    // row 1: 吏곸뾽援щ텇, ?대찓??    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "jobCategory",
          type: "select",
          label: "吏곸뾽援щ텇",
          options: [
            { value: "employee", label: "吏곸옣?? },
            { value: "business", label: "?먯쁺?? },
            { value: "other", label: "湲고?" },
          ],
        },
        {
          name: "email",
          type: "text",
          label: "?대찓??,
        },
      ],
    },
    // row 2: 諛⑸Ц?μ냼, ?낃툑?쎌냽??    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "depositPromiseDate",
          type: "date",
          label: "?낃툑?쎌냽??,
        },
        {
          name: "lmsLastSendDate",
          type: "date",
          label: "LMS?덈궡 理쒖쥌諛쒖넚??,
        },
        {
          name: "visitLocation",
          type: "text",
          label: "諛⑸Ц?μ냼",
        },
      ],
    },

    // row 3: LMS諛쒖넚 3?쇨꼍怨? 梨꾧텒愿由щ벑湲? ?곸떆愿由щ벑湲?(grid ???
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "lmsThreeDaysElapsed",
          type: "checkbox",
          label: "LMS諛쒖넚 3?쇨꼍怨?,
        },
        {
          name: "bondManagementGrade",
          type: "text",
          label: "梨꾧텒愿由щ벑湲?,
        },
        {
          name: "regularManagementGrade",
          type: "text",
          label: "?곸떆愿由щ벑湲?,
        },
      ],
    },

    // row 4: 怨좉컼?깃툒(?덈궡/?? 諛?嫄곕? 泥댄겕諛뺤뒪 ?뚯씠釉?    [
      {
        name: "customerGradeAndRefusal",
        type: "custom",
        className: "w-full",
        render: () => (
          <div className="flex gap-8">
            {/* ?쇱そ: 怨좉컼?깃툒 */}
            <div className="flex items-center gap-2">
              <Label className="w-[120px] text-right text-sm font-medium">怨좉컼?깃툒(?덈궡/??</Label>
              <div className="flex items-center gap-1">
                <Input className="w-[80px] h-9" placeholder="?덈궡" />
                <span className="text-sm">/</span>
                <Input className="w-[80px] h-9" placeholder="?? />
              </div>
            </div>

            {/* ?ㅻⅨ履? 嫄곕? 泥댄겕諛뺤뒪 ?뚯씠釉?*/}
            <div className="flex flex-col gap-2">
              {/* ?ㅻ뜑 ??*/}
              <div className="flex items-center gap-4">
                <div className="w-[100px]"></div>
                <div className="flex items-center gap-12">
                  <span className="w-[50px] text-center text-sm font-medium">?띾낫</span>
                  <span className="w-[50px] text-center text-sm font-medium">?쇰컲</span>
                  <span className="w-[50px] text-center text-sm font-medium">?먮궖肄?/span>
                  <span className="w-[50px] text-center text-sm font-medium">湲고?</span>
                </div>
              </div>

              {/* SMS 嫄곕? */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">SMS 嫄곕?</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-sm mr-1">留뚭린?듬낫</span>
                    <Checkbox />
                  </div>
                </div>
              </div>

              {/* TM 嫄곕? */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">TM 嫄곕?</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>

              {/* DM 嫄곕? */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">DM 嫄곕?</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>

              {/* E-mail 嫄곕? */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">E-mail 嫄곕?</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>

              {/* ?뚮┝??嫄곕? */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">?뚮┝??嫄곕?</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px]"></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  ], [tabId]);

  // 怨꾩쥖?뺣낫 ?꾪꽣 ?덉씠?꾩썐 1
  const accountFilterLayout1: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "inquiryType",
          type: "select",
          label: "議고쉶援щ텇",
          options: [
            { value: "all", label: "?꾩껜" },
            { value: "deposit", label: "?섏떊" },
            { value: "credit", label: "?ъ떊" },
          ],
        },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "depositTotal",
          type: "text",
          label: "?섏떊?⑷퀎",
        },
        {
          name: "creditTotal",
          type: "text",
          label: "?ъ떊?⑷퀎",
        },
      ],
    },
  ], []);

  // 怨꾩쥖?뺣낫 ?꾪꽣 ?덉씠?꾩썐 2
  const accountFilterLayout2: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "openBranch", type: "select", label: "媛쒖꽕吏??, options: [{ value: "none", label: "?좏깮" }] },
        { name: "manageBranch", type: "select", label: "愿由ъ???, options: [{ value: "none", label: "?좏깮" }] },
        { name: "recommender", type: "text", label: "沅뚯쑀?? },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "executionDate", type: "date", label: "?ㅽ뻾?쇱옄" },
        { name: "interestRepaymentMethod", type: "select", label: "?댁옄?곹솚諛⑸쾿", options: [{ value: "none", label: "?좏깮" }] },
        { name: "principalRepaymentMethod", type: "select", label: "?먭툑?곹솚諛⑸쾿", options: [{ value: "none", label: "?좏깮" }] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "manager", type: "text", label: "愿由ъ옄" },
        { name: "terminationDate", type: "date", label: "?댁??쇱옄" },
        { name: "offsetType", type: "select", label: "?곴퀎援щ텇", options: [{ value: "none", label: "?좏깮" }] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "nextPaymentDate", type: "date", label: "李④린?⑹엯?? },
        { name: "benefitLossDate", type: "date", label: "?쒖씠?듭긽?ㅼ씪" },
        { name: "cmsRequestDate", type: "date", label: "CMS?붿껌?쇱옄" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "limitApprovalAmount", type: "text", label: "?쒕룄/?뱀씤湲덉븸" },
        { name: "executionAmount", type: "text", label: "?ㅽ뻾湲덉븸" },
        { name: "loanBalance", type: "text", label: "?異쒖옍?? },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "uncollectedNormalInterest", type: "text", label: "誘몄쭠?섏젙?곸씠?? },
        { name: "accountDeposit", type: "text", label: "怨꾩쥖媛?섍툑" },
        { name: "cmsAccount", type: "text", label: "CMS怨꾩쥖" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "excessInterest", type: "text", label: "怨쇱엵?댁옄" },
        { name: "virtualAccountBank", type: "text", label: "媛?곴퀎醫뚯??됰챸" },
        { name: "cmsBank", type: "text", label: "CMS??됰챸" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "accountPayable", type: "text", label: "怨꾩쥖媛吏湲됯툑" },
        { name: "monthlyPayment", type: "text", label: "?붾텋?낃툑" },
        { name: "delinquencyStartDate", type: "date", label: "?곗껜?쒖옉?? },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "fullRepaymentAmount", type: "text", label: "?꾩젣?곹솚湲덉븸" },
        { name: "normalizationAmount", type: "text", label: "?뺤긽?붽툑?? },
        { name: "delinquencyRate", type: "text", label: "?곗껜?댁쑉" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "maturityDate", type: "text", label: "留뚭린?쇱옄" },
        { name: "specialDeposit", type: "text", label: "蹂꾨떒?덇툑" },
        { name: "contractMonths", type: "text", label: "?쎌젙媛쒖썡?? },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "paymentDate", type: "date", label: "?⑹엯?? },
        { name: "delinquencyMonths", type: "text", label: "?곗껜?붿닔" },
        { name: "specialReceivable", type: "text", label: "怨좉꺽媛?섍툑" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "specialPayable", type: "text", label: "怨좉꺽媛吏湲됯툑" },
        { name: "lateFee", type: "text", label: "?곗껜猷? },
        { name: "lastDepositStatus", type: "select", label: "理쒖쥌?낃툑?곹깭", options: [{ value: "none", label: "?좏깮" }] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "contract", type: "text", label: "怨꾩빟?? },
        { name: "publicCertification", type: "text", label: "怨듭씤?몄쬆" },
        { name: "notarization", type: "text", label: "怨듭젙利앹꽭" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "earlyRepaymentFee", type: "text", label: "以묐룄?곹솚?섏닔猷? },
        { name: "earlyRepaymentFeeRate", type: "text", label: "以묐룄?곹솚?섏닔猷뚯쑉" },
        { name: "gracePeriodEndDate", type: "date", label: "嫄곗튂湲곌컙醫낅즺?쇱옄" },
      ],
    },
  ], []);

  // ?대낫 ?꾪꽣 ?덉씠?꾩썐
  const collateralFilterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "collateralAddress", type: "text", label: "?대낫臾쇱＜?뚯?" },
        { name: "area", type: "text", label: "硫댁쟻" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "provider", type: "text", label: "?쒓났?? },
        { name: "providerResidentNumber", type: "text", label: "?쒓났?먯＜誘쇰쾲?? },
        { name: "collateralRegistrationNumber", type: "text", label: "?대낫臾쇰벑濡앸쾲?? },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "appraisalValue", type: "text", label: "媛먯젙媛" },
        { name: "seniorPriorityAmount", type: "text", label: "?좎닚?꾧툑??嫄댁닔)" },
        { name: "leaseDeposit", type: "text", label: "?꾩감蹂댁쬆湲? },
      ],
    },
  ], []);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    updateTableData(tabId, 'customerManagementCodeTable', mockData);
  };

  const handleExcelDownload = () => {
    alert("?묒? ?ㅼ슫濡쒕뱶 ?ㅽ뻾");
  };

  const handleRegister = () => {
    alert("?깅줉?섏뿀?듬땲??);
  };

  const renderButton = (label: string) => {
    const isImplemented = implementedButtons.includes(label);

    return (
      <Button
        key={label}
        variant="secondary"
        className="w-[100px] h-[32px] rounded-md text-xs font-medium shadow-sm transition-colors border bg-[#e8e7e3] hover:bg-[#dcdbd7] text-black border-[#d1d0cc]"
        onClick={() => {
          const popupConfigs: Record<string, { width: number; height: number; path: string; tab?: string }> = {
            "?뚮┝??SMS": { width: 1000, height: 800, path: "${import.meta.env.BASE_URL}popup/send-sms" },
            "DM諛쒖넚": { width: 1000, height: 800, path: "${import.meta.env.BASE_URL}popup/send-dm" },
            "?異쒖“嫄?: { width: 1600, height: 900, path: "${import.meta.env.BASE_URL}popup/loan-conditions" },
            "?ъ떊?곹솚": { width: 1600, height: 900, path: "${import.meta.env.BASE_URL}popup/credit-repayment" },
            "?ъ떊?먯옣": { width: 1600, height: 800, path: "${import.meta.env.BASE_URL}popup/credit-ledger" },
            "嫄곕옒?댁뿭": { width: 1600, height: 800, path: "${import.meta.env.BASE_URL}popup/transaction-history" },
            "議곌린寃쎈낫": { width: 1200, height: 800, path: "${import.meta.env.BASE_URL}popup/early-warning" },
            "遺?숈궛寃쎈ℓ?뺣낫": { width: 1400, height: 800, path: "${import.meta.env.BASE_URL}popup/real-estate-auction" },
            "諛쒓툒?댁뿭": { width: 1400, height: 800, path: "${import.meta.env.BASE_URL}popup/issuance-history" },
            "?섏젙?뺣낫": { width: 1000, height: 600, path: "${import.meta.env.BASE_URL}popup/correction-history" },
            "諛⑸Ц?깅줉": { width: 800, height: 400, path: "${import.meta.env.BASE_URL}popup/visit-registration" },
            "異붿떖?곕씫?쒗븳": { width: 1200, height: 600, path: "${import.meta.env.BASE_URL}popup/debt-collection-restriction" },
            "二쇱냼寃利?: { width: 1000, height: 600, path: "${import.meta.env.BASE_URL}popup/address-verification" },
            "?곷떞?깅줉": { width: 1200, height: 800, path: "${import.meta.env.BASE_URL}popup/counseling-registration" },
            "?뱀젙?뺣낫議고쉶": { width: 1200, height: 600, path: "${import.meta.env.BASE_URL}popup/specific-info-inquiry" },
            "硫붿꽭吏?좏삎": { width: 1000, height: 600, path: "${import.meta.env.BASE_URL}popup/message-type" },
            "怨좉컼愿由ъ퐫??: { width: 1600, height: 800, path: "${import.meta.env.BASE_URL}popup/customer-management-code" },
            "梨꾨Т議곗젙": { width: 1600, height: 900, path: "${import.meta.env.BASE_URL}popup/debt-adjustment-management" },
            "7?몄꽌??: { width: 1400, height: 900, path: "${import.meta.env.BASE_URL}popup/form-7", tab: "form7" },
            "10?몄꽌??: { width: 1400, height: 900, path: "${import.meta.env.BASE_URL}popup/form-7", tab: "form10" },
          };

          const config = popupConfigs[label];
          if (config) {
            const left = (window.screen.width / 2) - (config.width / 2);
            const top = (window.screen.height / 2) - (config.height / 2);

            // URL ?뚮씪誘명꽣 援ъ꽦
            const params = new URLSearchParams();
            if (label === "梨꾨Т議곗젙") {
              params.append("openerTabId", tabId);
            }
            if (config.tab) {
              params.append("tab", config.tab);
            }

            const queryString = params.toString();
            const url = `${config.path}${queryString ? `?${queryString}` : ''}`;

            window.open(
              url,
              label.replace(/\//g, ''),
              `width=${config.width},height=${config.height},top=${top},left=${left}`
            );
          }
        }}
      >
        {label}
      </Button>
    );
  };

  if (!currentState) return null;

  const implemented = buttons.filter(b => implementedButtons.includes(b));
  const notImplemented = buttons.filter(b => !implementedButtons.includes(b));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="??댄? ?꾩씠肄? width={40} height={40} />
          <h2 className="text-lg font-semibold">梨꾧텒?곷떞</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>??/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?곷떞愿由?/BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>?쇰컲?곷떞</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>梨꾧텒?곷떞</BreadcrumbPage>
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

      {/* ?꾩껜 ?덉씠?꾩썐 - ?⑥씪 grid濡?紐⑤뱺 ?뱀뀡???덈퉬 ?쇱튂 蹂댁옣 */}
      <div className="grid grid-cols-[4fr_1fr] gap-4">
        {/* ?곷떒 醫뚯륫 ?곸뿭 */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* ?꾪꽣 */}
          <div className="p-4 bg-white">
            <FilterContainer
              filterLayout={leftAreaFilterLayout1}
              values={filters}
              onChange={handleFilterChange}
            />

            {/* 二쇱냼 寃利??곸뿭 */}
            <div className="my-4 space-y-3">
              <AddressVerificationRow label="珥덈낯二쇱냼" type="?? />
              <AddressVerificationRow label="?먰깮二쇱냼" type="?? />
              <AddressVerificationRow label="吏곸옣二쇱냼" type="珥? />
            </div>

            <FilterContainer
              filterLayout={leftAreaFilterLayout2}
              values={filters}
              onChange={handleFilterChange}
            />
          </div>



          {/* ?곗씠???뚯씠釉?*/}
          <div className="rounded-lg bg-white">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div></div>
                <Button
                  variant="secondary"
                  className="flex items-center justify-center text-white p-0 cursor-pointer bg-[#ababab] hover:bg-[#ababab]/90 px-4 py-2"
                  style={{ width: "35px", height: "35px", borderRadius: "12px" }}
                  onClick={handleRegister}
                >
                  <IconRegister className="size-5" />
                </Button>
              </div>
              <div className="rounded-lg overflow-auto">
                <DataTable
                  columns={columns}
                  data={tableData}
                  minWidth="600px"
                  title="怨좉컼 愿由?肄붾뱶"
                />
              </div>
            </div>
          </div>

          {/* 怨꾩쥖?뺣낫 ???뱀뀡 */}
          <div className="rounded-lg bg-white p-4">
            <CustomTabs defaultValue="怨꾩쥖?뺣낫">
              <CustomTabsList>
                <CustomTabsTrigger value="怨꾩쥖?뺣낫">怨꾩쥖?뺣낫</CustomTabsTrigger>
                <CustomTabsTrigger value="?좎껌?대젰">?좎껌?대젰</CustomTabsTrigger>
                <CustomTabsTrigger value="?대낫">?대낫</CustomTabsTrigger>
                <CustomTabsTrigger value="愿怨꾩씤?대젰">愿怨꾩씤?대젰</CustomTabsTrigger>
              </CustomTabsList>

              <CustomTabsContent value="怨꾩쥖?뺣낫" className="mt-4 space-y-4">
                <FilterContainer
                  filterLayout={accountFilterLayout1}
                  values={filters}
                  onChange={handleFilterChange}
                />

                <div className="overflow-auto">
                  <DataTable
                    columns={accountColumns}
                    data={mockAccountData}
                    minWidth="1600px"
                    hideToolbar={true}
                    pageSize={5}
                  />
                </div>

                <FilterContainer
                  filterLayout={accountFilterLayout2}
                  values={filters}
                  onChange={handleFilterChange}
                />
              </CustomTabsContent>

              <CustomTabsContent value="?좎껌?대젰" className="mt-4 space-y-4">
                <div className="overflow-auto">
                  <DataTable
                    columns={applicationHistory1Columns}
                    data={mockApplicationData1}
                    minWidth="1600px"
                    hideToolbar={true}
                    pageSize={5}
                  />
                </div>

                <div className="overflow-auto">
                  <DataTable
                    columns={applicationHistory2Columns}
                    data={mockApplicationData2}
                    minWidth="1600px"
                    hideToolbar={true}
                    pageSize={5}
                  />
                </div>
              </CustomTabsContent>

              <CustomTabsContent value="?대낫" className="mt-4 space-y-4">
                <div className="overflow-auto">
                  <DataTable
                    columns={collateralColumns}
                    data={mockCollateralData}
                    minWidth="1600px"
                    hideToolbar={true}
                    pageSize={5}
                  />
                </div>

                <FilterContainer
                  filterLayout={collateralFilterLayout}
                  values={filters}
                  onChange={handleFilterChange}
                />
              </CustomTabsContent>

              <CustomTabsContent value="愿怨꾩씤?대젰" className="mt-4">
                <div className="overflow-auto">
                  <DataTable
                    columns={relatedPersonColumns}
                    data={mockRelatedPersonData}
                    minWidth="1600px"
                    hideToolbar={true}
                    pageSize={5}
                  />
                </div>
              </CustomTabsContent>
            </CustomTabs>
          </div>
        </div>

        {/* ?곷떒 ?곗륫 ?곸뿭 */}
        <div className="flex flex-col gap-4">
          {/* ?꾪꽣 */}
          <div className="p-4 bg-white space-y-2">
            <FilterContainer
              filterLayout={rightAreaFilterLayout1}
              values={filters}
              onChange={handleFilterChange}
              labelAlign="left"
            />
            <FilterContainer
              filterLayout={rightAreaFilterLayout2}
              values={filters}
              onChange={handleFilterChange}
              labelAlign="left"
            />
          </div>

          {/* 踰꾪듉 由ъ뒪??*/}
          <div className="rounded-lg p-4 bg-white">
            <div className="flex flex-wrap justify-between gap-y-1.5">
              {implemented.map(label => renderButton(label))}
              {notImplemented.map(label => renderButton(label))}
              {/* 留덉?留?以꾩쓣 ?뺣젹?섍린 ?꾪븳 鍮?怨듦컙 */}
              {Array.from({ length: (3 - ((implemented.length + notImplemented.length) % 3)) % 3 }).map((_, i) => (
                <div key={`empty-${i}`} className="w-[100px]" />
              ))}
            </div>
          </div>
        </div>

        {/* ?섎떒 醫뚯륫: ?곷떞?대젰 ??*/}
        <div className="rounded-lg bg-white p-4 min-w-0">
          <CustomTabs value={bottomTabValue} onValueChange={setBottomTabValue}>
            <div className="flex items-center justify-between gap-4">
              <CustomTabsList>
                <CustomTabsTrigger value="?곷떞?대젰">?곷떞?대젰</CustomTabsTrigger>
                <CustomTabsTrigger value="CMS ?뺣낫">CMS ?뺣낫</CustomTabsTrigger>
                <CustomTabsTrigger value="?뚮┝??SMS">?뚮┝??SMS</CustomTabsTrigger>
                <CustomTabsTrigger value="?낃툑?댁뿭">?낃툑?댁뿭</CustomTabsTrigger>
                <CustomTabsTrigger value="DM/FAX">DM/FAX</CustomTabsTrigger>
                <CustomTabsTrigger value="?댄빐愿怨꾩궗?ㅽ솗?몄꽌">?댄빐愿怨꾩궗?ㅽ솗?몄꽌</CustomTabsTrigger>
              </CustomTabsList>
              <div className="flex items-center gap-1.5">
                {bottomTabValue === "?곷떞?대젰" && (
                  <div className="flex items-center gap-1.5">
                    <Checkbox id="sms-include" />
                    <Label htmlFor="sms-include" className="text-sm font-medium cursor-pointer whitespace-nowrap">
                      SMS ?ы븿
                    </Label>
                  </div>
                )}
                {bottomTabValue === "DM/FAX" && (
                  <Button variant="default" onClick={() => console.log("?낅젰/?섏젙")}>
                    ?낅젰/?섏젙
                  </Button>
                )}
                <FilterDateRange label="" />
                <Button variant="default" onClick={() => console.log("議고쉶")}>
                  議고쉶
                </Button>
              </div>
            </div>

            <CustomTabsContent value="?곷떞?대젰" className="mt-4">
              <div className="overflow-x-auto max-w-full">
                <DataTable
                  columns={counselingHistoryColumns}
                  data={mockCounselingHistoryData}
                  minWidth="1200px"
                  hideToolbar={true}
                  pageSize={5}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="CMS ?뺣낫" className="mt-4">
              <div className="overflow-x-auto max-w-full">
                <DataTable
                  columns={cmsInfoColumns}
                  data={mockCMSInfoData}
                  minWidth="1200px"
                  hideToolbar={true}
                  pageSize={5}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="?뚮┝??SMS" className="mt-4">
              <div className="overflow-x-auto max-w-full">
                <DataTable
                  columns={alarmTalkSMSColumns}
                  data={mockAlarmTalkSMSData}
                  minWidth="1200px"
                  hideToolbar={true}
                  pageSize={5}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="?낃툑?댁뿭" className="mt-4">
              <div className="overflow-x-auto max-w-full">
                <DataTable
                  columns={depositHistoryColumns}
                  data={mockDepositHistoryData}
                  minWidth="1200px"
                  hideToolbar={true}
                  pageSize={5}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="DM/FAX" className="mt-4">
              <div className="overflow-x-auto max-w-full">
                <DataTable
                  columns={dmFaxColumns}
                  data={mockDMFAXData}
                  minWidth="1200px"
                  hideToolbar={true}
                  pageSize={5}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="?댄빐愿怨꾩궗?ㅽ솗?몄꽌" className="mt-4">
              <div className="overflow-x-auto max-w-full">
                <DataTable
                  columns={interestConfirmationColumns}
                  data={mockInterestConfirmationData}
                  minWidth="1200px"
                  hideToolbar={true}
                  pageSize={5}
                />
              </div>
            </CustomTabsContent>
          </CustomTabs>
        </div>

        {/* ?섎떒 ?곗륫: 議곌굔遺 諛뺤뒪 */}
        <div className="flex flex-col gap-4">
          {/* ?곷떞?대젰 ?? ?곷떞?깅줉 諛뺤뒪 */}
          {bottomTabValue === "?곷떞?대젰" && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="space-y-3">
                <Button variant="default" className="w-full">
                  ?곷떞?깅줉
                </Button>
                <textarea
                  className="w-full min-h-[400px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="?곷떞 ?댁슜???낅젰?섏꽭??.."
                />
              </div>
            </div>
          )}

          {/* ?뚮┝??SMS ?? ?댁슜 議고쉶 諛뺤뒪 */}
          {bottomTabValue === "?뚮┝??SMS" && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="space-y-2">
                <Label className="text-sm font-medium">?댁슜</Label>
                <div className="w-full min-h-[400px] p-3 border rounded-md bg-gray-50 text-sm whitespace-pre-wrap">
                  {/* ?좏깮??硫붿떆吏 ?댁슜???쒖떆?⑸땲??*/}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


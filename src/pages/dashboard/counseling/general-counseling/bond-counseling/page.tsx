

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
import { listenForPopupMessages } from "@/lib/popup-bus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { X, Mail } from "lucide-react";
import IconRegister from "@/assets/icons/js/오른쪽버튼아이콘03등록흰색";
import { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent } from "@/components/app/CustomTabs";

// --- Types ---

interface CustomerManagementCodeData {
  id: number;
  customer: string; // 고객
  screening: string; // 심사
  prohibition: string; // 금지
  debtAdjustment: string; // 채무조정
  legalAction: string; // 법조치
  pr: string; // PR
  certificate: string; // 제증명서
  otherCode: string; // 기타코드
}

interface AccountInfoData {
  id: number;
  alternateWithdrawal: string; // 격일출금
  accountNumber: string; // 계좌번호
  subjectName: string; // 과목명
  accountStatus: string; // 계좌상태
  amount: number; // 금액
  interestRate: string; // 이율
  rateReduction: string; // 금리인하
  collateral: string; // 담보
  newDate: string; // 신규일자
  expiryDate: string; // 만기일자
}

interface ApplicationHistoryData1 {
  id: number;
  loanApplicationNumber: string; // 대출신청번호
  accessRoute: string; // 접속경로
  accessChannel: string; // 접속채널
  accessMedia: string; // 접속매체
  applicationDate: string; // 신청일
  productName: string; // 상품명
  loanType: string; // 대출구분
  applicationStatus: string; // 신청상태
  applicationAmount: number; // 신청금액
  approvalDate: string; // 승인일
}

interface ApplicationHistoryData2 {
  id: number;
  applicationDate: string; // 신청일자
  applicationNumber: string; // 신청번호
  customerName: string; // 고객명
  carrier: string; // 이통사
  mobile: string; // 휴대폰
  owner: string; // 명의자
  actualResidence: string; // 실거주지
}

interface CollateralData {
  id: number;
  collateralNumber: string; // 담보번호
  ownerName: string; // 소유자명
  creditAccountNumber: string; // 여신계좌번호
  debtor: string; // 채무자
  account: string; // 계좌
  linkedProduct: string; // 연결상품
  collateralAmount: number; // 담보별담보금액
}

interface RelatedPersonData {
  id: number;
  accountNumber: string; // 계좌번호
  classification: string; // 구분
  status: string; // 상태
  name: string; // 성명
  relationship: string; // 관계
  residentNumber: string; // 주민번호
  mobile: string; // 휴대폰번호
  homePhone: string; // 자택번호
  workPhone: string; // 직장전화
}

interface CounselingHistoryData {
  id: number;
  counselingDateTime: string; // 상담일시
  counselor: string; // 상담원
  contact: string; // 접촉
  selectionTarget: string; // 선택대상
  task: string; // 업무
  contactResult: string; // 연락결과
  promiseDate: string; // 약속일자
  promiseTime: string; // 약속시간
  promiseAmount: number; // 약속금액
  selectionLocation: string; // 선택장소
}

interface CMSInfoData {
  id: number;
  registrationDateTime: string; // 등록일시
  accountNumber: string; // 계좌번호
  status: string; // 상태
  classification: string; // 구분
  bank: string; // 은행
  bankAccountNumber: string; // 은행계좌번호
  customerName: string; // 고객명
  processingAmount: number; // 처리금액
}

interface AlarmTalkSMSData {
  id: number;
  sendDateTime: string; // 전송일시
  receiverNumber: string; // 수신번호
  messageType: string; // 메세지유형
  result: string; // 결과
  content: string; // 내용
  replyNumber: string; // 회신번호
  counselingContent: string; // 상담내용
}

interface DepositHistoryData {
  id: number;
  transactionDate: string; // 거래일자
  depositMethod: string; // 입금방식
  customerName: string; // 고객명
  bank: string; // 은행
  processingStatus: string; // 처리상태
  processingDateTime: string; // 처리일시
  request: string; // 요청사항
}

interface DMFAXData {
  id: number;
  sequenceNumber: number; // 순번
  sendDateTime: string; // 발송일시
  accountNumber: string; // 계좌번호
  formName: string; // 양식명
  registrationNumber: string; // 등기번호
}

interface InterestConfirmationData {
  id: number;
  sequenceNumber: number; // 순번
  issueDateTime: string; // 발급일시
  issueNumber: string; // 발급번호
  viewConfirmation: string; // 열람확인여부
  transcriptCount: number; // 초본수
  personalInfoChange: string; // 개인인적사항변경여부
  pastAddressHistory: string; // 과거주소변동내역
  targetName: string; // 대상자명
}

// --- Mock Data ---
const mockData: CustomerManagementCodeData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  customer: `고객코드${i + 1}`,
  screening: `심사${i + 1}`,
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
  subjectName: "보통예금",
  accountStatus: "정상",
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
  accessRoute: "웹",
  accessChannel: "PC",
  accessMedia: "인터넷",
  applicationDate: "2024-01-15",
  productName: "일반대출",
  loanType: "신용대출",
  applicationStatus: "승인",
  applicationAmount: 5000000 * (i + 1),
  approvalDate: "2024-01-16",
}));

const mockApplicationData2: ApplicationHistoryData2[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  applicationDate: "2024-01-15",
  applicationNumber: `A2024-${1000 + i}`,
  customerName: `고객${i + 1}`,
  carrier: "SKT",
  mobile: "010-1234-5678",
  owner: `명의자${i + 1}`,
  actualResidence: "서울시 강남구",
}));

const mockCollateralData: CollateralData[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  collateralNumber: `C2024-${1000 + i}`,
  ownerName: `소유자${i + 1}`,
  creditAccountNumber: `1234-5678-${1000 + i}`,
  debtor: `채무자${i + 1}`,
  account: `계좌${i + 1}`,
  linkedProduct: "일반대출",
  collateralAmount: 10000000 * (i + 1),
}));

const mockRelatedPersonData: RelatedPersonData[] = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  accountNumber: `1234-5678-${1000 + i}`,
  classification: "보증인",
  status: "정상",
  name: `관계인${i + 1}`,
  relationship: "배우자",
  residentNumber: "******-*******",
  mobile: "010-1234-5678",
  homePhone: "02-1234-5678",
  workPhone: "02-9876-5432",
}));

const mockCounselingHistoryData: CounselingHistoryData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  counselingDateTime: "2024-01-15 10:30",
  counselor: `상담원${i + 1}`,
  contact: "전화",
  selectionTarget: "본인",
  task: "상환독촉",
  contactResult: "통화완료",
  promiseDate: "2024-01-20",
  promiseTime: "14:00",
  promiseAmount: 500000 * (i + 1),
  selectionLocation: "지점",
  sample01: "샘플01",
  sample02: "샘플02",
  sample03: "샘플03",
}));

const mockCMSInfoData: CMSInfoData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  registrationDateTime: "2024-01-15 09:00",
  accountNumber: `1234-5678-${1000 + i}`,
  status: "정상",
  classification: "자동이체",
  bank: "국민은행",
  bankAccountNumber: `9876-5432-${1000 + i}`,
  customerName: `고객${i + 1}`,
  processingAmount: 100000 * (i + 1),
}));

const mockAlarmTalkSMSData: AlarmTalkSMSData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  sendDateTime: "2024-01-15 11:00",
  receiverNumber: "010-1234-5678",
  messageType: "알림톡",
  result: "발송성공",
  content: `상환 안내 메시지 ${i + 1}`,
  replyNumber: "1588-0000",
  counselingContent: "상환 독촉",
}));

const mockDepositHistoryData: DepositHistoryData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  transactionDate: "2024-01-15",
  depositMethod: "계좌이체",
  customerName: `고객${i + 1}`,
  bank: "신한은행",
  processingStatus: "완료",
  processingDateTime: "2024-01-15 15:30",
  request: "",
}));

const mockDMFAXData: DMFAXData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  sequenceNumber: i + 1,
  sendDateTime: "2024-01-15 10:00",
  accountNumber: `1234-5678-${1000 + i}`,
  formName: "독촉장",
  registrationNumber: `REG-2024-${1000 + i}`,
}));

const mockInterestConfirmationData: InterestConfirmationData[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  sequenceNumber: i + 1,
  issueDateTime: "2024-01-15 14:00",
  issueNumber: `ISS-2024-${1000 + i}`,
  viewConfirmation: "확인",
  transcriptCount: i + 1,
  personalInfoChange: "변경없음",
  pastAddressHistory: "변동없음",
  targetName: `대상자${i + 1}`,
}));

// --- Columns ---
const columns: ColumnDef<CustomerManagementCodeData>[] = [
  { accessorKey: "customer", header: "고객" },
  { accessorKey: "screening", header: "심사" },
  { accessorKey: "prohibition", header: "금지" },
  { accessorKey: "debtAdjustment", header: "채무조정" },
  { accessorKey: "legalAction", header: "법조치" },
  { accessorKey: "pr", header: "PR" },
  { accessorKey: "certificate", header: "제증명서" },
  { accessorKey: "otherCode", header: "기타코드" },
];

const accountColumns: ColumnDef<AccountInfoData>[] = [
  { accessorKey: "alternateWithdrawal", header: "격일출금" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "subjectName", header: "과목명" },
  { accessorKey: "accountStatus", header: "계좌상태" },
  { accessorKey: "amount", header: "금액" },
  { accessorKey: "interestRate", header: "이율" },
  { accessorKey: "rateReduction", header: "금리인하" },
  { accessorKey: "collateral", header: "담보" },
  { accessorKey: "newDate", header: "신규일자" },
  { accessorKey: "expiryDate", header: "만기일자" },
];

const applicationHistory1Columns: ColumnDef<ApplicationHistoryData1>[] = [
  { accessorKey: "loanApplicationNumber", header: "대출신청번호" },
  { accessorKey: "accessRoute", header: "접속경로" },
  { accessorKey: "accessChannel", header: "접속채널" },
  { accessorKey: "accessMedia", header: "접속매체" },
  { accessorKey: "applicationDate", header: "신청일" },
  { accessorKey: "productName", header: "상품명" },
  { accessorKey: "loanType", header: "대출구분" },
  { accessorKey: "applicationStatus", header: "신청상태" },
  { accessorKey: "applicationAmount", header: "신청금액" },
  { accessorKey: "approvalDate", header: "승인일" },
];

const applicationHistory2Columns: ColumnDef<ApplicationHistoryData2>[] = [
  { accessorKey: "applicationDate", header: "신청일자" },
  { accessorKey: "applicationNumber", header: "신청번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "carrier", header: "이통사" },
  { accessorKey: "mobile", header: "휴대폰" },
  { accessorKey: "owner", header: "명의자" },
  { accessorKey: "actualResidence", header: "실거주지" },
];

const collateralColumns: ColumnDef<CollateralData>[] = [
  { accessorKey: "collateralNumber", header: "담보번호" },
  { accessorKey: "ownerName", header: "소유자명" },
  { accessorKey: "creditAccountNumber", header: "여신계좌번호" },
  { accessorKey: "debtor", header: "채무자" },
  { accessorKey: "account", header: "계좌" },
  { accessorKey: "linkedProduct", header: "연결상품" },
  { accessorKey: "collateralAmount", header: "담보별담보금액" },
];

const relatedPersonColumns: ColumnDef<RelatedPersonData>[] = [
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "classification", header: "구분" },
  { accessorKey: "status", header: "상태" },
  { accessorKey: "name", header: "성명" },
  { accessorKey: "relationship", header: "관계" },
  { accessorKey: "residentNumber", header: "주민번호" },
  { accessorKey: "mobile", header: "휴대폰번호" },
  { accessorKey: "homePhone", header: "자택번호" },
  { accessorKey: "workPhone", header: "직장전화" },
];

const counselingHistoryColumns: ColumnDef<CounselingHistoryData>[] = [
  { accessorKey: "counselingDateTime", header: "상담일시" },
  { accessorKey: "counselor", header: "상담원" },
  { accessorKey: "contact", header: "접촉" },
  { accessorKey: "selectionTarget", header: "선택대상" },
  { accessorKey: "task", header: "업무" },
  { accessorKey: "contactResult", header: "연락결과" },
  { accessorKey: "promiseDate", header: "약속일자" },
  { accessorKey: "promiseTime", header: "약속시간" },
  { accessorKey: "promiseAmount", header: "약속금액" },
  { accessorKey: "selectionLocation", header: "선택장소" },
  { accessorKey: "sample01", header: "샘플01" },
  { accessorKey: "sample02", header: "샘플02" },
  { accessorKey: "sample03", header: "샘플03" },
];

const cmsInfoColumns: ColumnDef<CMSInfoData>[] = [
  { accessorKey: "registrationDateTime", header: "등록일시" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "status", header: "상태" },
  { accessorKey: "classification", header: "구분" },
  { accessorKey: "bank", header: "은행" },
  { accessorKey: "bankAccountNumber", header: "은행계좌번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "processingAmount", header: "처리금액" },
];

const alarmTalkSMSColumns: ColumnDef<AlarmTalkSMSData>[] = [
  { accessorKey: "sendDateTime", header: "전송일시" },
  { accessorKey: "receiverNumber", header: "수신번호" },
  { accessorKey: "messageType", header: "메세지유형" },
  { accessorKey: "result", header: "결과" },
  { accessorKey: "content", header: "내용" },
  { accessorKey: "replyNumber", header: "회신번호" },
  { accessorKey: "counselingContent", header: "상담내용" },
];

const depositHistoryColumns: ColumnDef<DepositHistoryData>[] = [
  { accessorKey: "transactionDate", header: "거래일자" },
  { accessorKey: "depositMethod", header: "입금방식" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "bank", header: "은행" },
  { accessorKey: "processingStatus", header: "처리상태" },
  { accessorKey: "processingDateTime", header: "처리일시" },
  { accessorKey: "request", header: "요청사항" },
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
        aria-label="모두 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "sequenceNumber", header: "순번" },
  { accessorKey: "sendDateTime", header: "발송일시" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "formName", header: "양식명" },
  { accessorKey: "registrationNumber", header: "등기번호" },
];

const interestConfirmationColumns: ColumnDef<InterestConfirmationData>[] = [
  { accessorKey: "sequenceNumber", header: "순번" },
  { accessorKey: "issueDateTime", header: "발급일시" },
  { accessorKey: "issueNumber", header: "발급번호" },
  { accessorKey: "viewConfirmation", header: "열람확인여부" },
  { accessorKey: "transcriptCount", header: "초본수" },
  { accessorKey: "personalInfoChange", header: "개인인적사항변경여부" },
  { accessorKey: "pastAddressHistory", header: "과거주소변동내역" },
  { accessorKey: "targetName", header: "대상자명" },
];

// 기존 버튼 리스트
const buttons = [
  "알림톡/SMS",
  "DM발송",
  "대출조건",
  "여신원장",
  "여신상환",
  "방문등록",
  "거래내역",
  "수정정보",
  "부동산경매정보",
  "조기경보",
  "발급내역",
  "10호서식",
  "7호서식",
  "추심연락제한",
  "채무조정",
  "주소검증",
  "상담등록",
  "특정정보조회",
  "메세지유형",
  "고객관리코드",
];

const implementedButtons = [
  "알림톡/SMS",
  "DM발송",
  "대출조건",
  "여신상환",
  "여신원장",
  "거래내역",
  "조기경보",
  "부동산경매정보",
  "발급내역",
  "수정정보",
  "방문등록",
  "추심연락제한",
  "주소검증",
  "상담등록",
  "특정정보조회",
  "메세지유형",
  "고객관리코드",
  "채무조정",
  "7호서식",
  "10호서식",
];

// 주소 검증 컴포넌트
const AddressVerificationRow = ({
  label,
  type
}: {
  label: string;
  type: "하" | "상" | "초";
}) => {
  const handleAddressSearch = () => {
    alert("주소 검색 팝업 실행");
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
      <Label className="text-sm font-medium pt-2">{label}</Label>
      <div className="flex flex-wrap gap-2 items-center">
        <Input className="w-[100px] h-9 text-sm" placeholder="우편번호" />
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={handleAddressSearch}
          title="주소 검색"
        >
          <Mail className="h-4 w-4" />
        </Button>
        <Input className="flex-1 min-w-[200px] h-9 text-sm" placeholder="실제 주소" />
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="삭제">
          <X className="h-4 w-4" />
        </Button>
        <Select>
          <SelectTrigger className="w-[100px] h-9 text-sm">
            <SelectValue placeholder="도로명" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="road">도로명</SelectItem>
            <SelectItem value="old">구지번</SelectItem>
          </SelectContent>
        </Select>
        <Input className="w-[150px] h-9 text-sm" placeholder="상세주소" />
        <Input className="w-[100px] h-9 text-sm" placeholder="비고" />
        <Checkbox />
        <span className="text-sm font-medium w-6">{type}</span>
        <Button variant="outline" size="sm" className="h-9">
          검증
        </Button>
      </div>
    </div>
  );
};

export default function BondCounselingPage() {
  const tabId = usePathname();
  const { currentState, loadState, updateFilters, updateTableData } = usePageStore();

  // 하단 탭 상태 추적
  const [bottomTabValue, setBottomTabValue] = useState("상담이력");

  // 초기 필터 값 설정 (모든 필드를 빈 문자열로 초기화)
  const initialFilters = {
    // 좌측 영역
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
    // 우측 영역
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

  // 우측 필터 레이아웃
  const rightAreaFilterLayout1: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "quickSearch",
          type: "select",
          label: "빠른검색",
          options: [
            { value: "all", label: "전체" },
            { value: "option1", label: "옵션1" },
            { value: "option2", label: "옵션2" },
          ],
        },
      ],
    },
  ], []);

  // 우측 필터 레이아웃
  const rightAreaFilterLayout2: FilterLayout = useMemo(() => [
    [
      {
        name: "bondManager",
        type: "input-button",
        label: "채권 담당자",
        buttonText: "이관",
        onButtonClick: () => alert("채권 담당자 이관"),
      },
      {
        name: "regularManager",
        type: "input-button",
        label: "상시관리 담당자",
        buttonText: "이관",
        onButtonClick: () => alert("상시관리 담당자 이관"),
      },
      {
        name: "assignmentDate",
        type: "date",
        label: "배정일자",
      },
      {
        name: "mobile",
        type: "select-with-input",
        label: "핸드폰",
        options: [
          { value: "010", label: "010" },
          { value: "011", label: "011" },
          { value: "016", label: "016" },
        ],
      },
      {
        name: "home",
        type: "select-with-input",
        label: "자택",
        options: [
          { value: "02", label: "02" },
          { value: "031", label: "031" },
          { value: "032", label: "032" },
        ],
      },
      {
        name: "office",
        type: "select-with-input",
        label: "직장",
        options: [
          { value: "02", label: "02" },
          { value: "031", label: "031" },
          { value: "032", label: "032" },
        ],
      },
      {
        name: "other",
        type: "select-with-input",
        label: "기타",
        options: [
          { value: "02", label: "02" },
          { value: "031", label: "031" },
          { value: "032", label: "032" },
        ],
      },
      {
        name: "memo",
        type: "textarea",
        label: "메모",
      },
    ],
  ], []);

  // 좌측 필터 레이아웃 1 (상단)
  const leftAreaFilterLayout1: FilterLayout = useMemo(() => [
    // row 1: 주민번호, 고객번호, 계좌번호, DM발송처
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "residentNumber",
          type: "text",
          label: "주민번호",
        },
        {
          name: "customerNumber",
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
          name: "accountNumber",
          type: "text",
          label: "계좌번호",
        },
        {
          name: "dmDestination",
          type: "select",
          label: "DM발송처",
          options: [
            { value: "all", label: "전체" },
            { value: "home", label: "자택" },
            { value: "office", label: "직장" },
          ],
        },
      ],
    },
  ], [tabId]);

  // 좌측 필터 레이아웃 2 (하단)
  const leftAreaFilterLayout2: FilterLayout = useMemo(() => [
    // row 1: 직업구분, 이메일
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "jobCategory",
          type: "select",
          label: "직업구분",
          options: [
            { value: "employee", label: "직장인" },
            { value: "business", label: "자영업" },
            { value: "other", label: "기타" },
          ],
        },
        {
          name: "email",
          type: "text",
          label: "이메일",
        },
      ],
    },
    // row 2: 방문장소, 입금약속일
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "depositPromiseDate",
          type: "date",
          label: "입금약속일",
        },
        {
          name: "lmsLastSendDate",
          type: "date",
          label: "LMS안내 최종발송일",
        },
        {
          name: "visitLocation",
          type: "text",
          label: "방문장소",
        },
      ],
    },

    // row 3: LMS발송 3일경과, 채권관리등급, 상시관리등급 (grid 타입)
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "lmsThreeDaysElapsed",
          type: "checkbox",
          label: "LMS발송 3일경과",
        },
        {
          name: "bondManagementGrade",
          type: "text",
          label: "채권관리등급",
        },
        {
          name: "regularManagementGrade",
          type: "text",
          label: "상시관리등급",
        },
      ],
    },

    // row 4: 고객등급(안내/현) 및 거부 체크박스 테이블
    [
      {
        name: "customerGradeAndRefusal",
        type: "custom",
        className: "w-full",
        render: () => (
          <div className="flex gap-8">
            {/* 왼쪽: 고객등급 */}
            <div className="flex items-center gap-2">
              <Label className="w-[120px] text-right text-sm font-medium">고객등급(안내/현)</Label>
              <div className="flex items-center gap-1">
                <Input className="w-[80px] h-9" placeholder="안내" />
                <span className="text-sm">/</span>
                <Input className="w-[80px] h-9" placeholder="현" />
              </div>
            </div>

            {/* 오른쪽: 거부 체크박스 테이블 */}
            <div className="flex flex-col gap-2">
              {/* 헤더 행 */}
              <div className="flex items-center gap-4">
                <div className="w-[100px]"></div>
                <div className="flex items-center gap-12">
                  <span className="w-[50px] text-center text-sm font-medium">홍보</span>
                  <span className="w-[50px] text-center text-sm font-medium">일반</span>
                  <span className="w-[50px] text-center text-sm font-medium">두낫콜</span>
                  <span className="w-[50px] text-center text-sm font-medium">기타</span>
                </div>
              </div>

              {/* SMS 거부 */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">SMS 거부</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-sm mr-1">만기통보</span>
                    <Checkbox />
                  </div>
                </div>
              </div>

              {/* TM 거부 */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">TM 거부</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>

              {/* DM 거부 */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">DM 거부</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>

              {/* E-mail 거부 */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">E-mail 거부</Label>
                <div className="flex items-center gap-12">
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px] flex justify-center"><Checkbox /></div>
                  <div className="w-[50px]"></div>
                  <div className="w-[50px]"></div>
                </div>
              </div>

              {/* 알림톡 거부 */}
              <div className="flex items-center gap-4">
                <Label className="w-[100px] text-right text-sm font-medium">알림톡 거부</Label>
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

  // 계좌정보 필터 레이아웃 1
  const accountFilterLayout1: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "inquiryType",
          type: "select",
          label: "조회구분",
          options: [
            { value: "all", label: "전체" },
            { value: "deposit", label: "수신" },
            { value: "credit", label: "여신" },
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
          label: "수신합계",
        },
        {
          name: "creditTotal",
          type: "text",
          label: "여신합계",
        },
      ],
    },
  ], []);

  // 계좌정보 필터 레이아웃 2
  const accountFilterLayout2: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "openBranch", type: "select", label: "개설지점", options: [{ value: "none", label: "선택" }] },
        { name: "manageBranch", type: "select", label: "관리지점", options: [{ value: "none", label: "선택" }] },
        { name: "recommender", type: "text", label: "권유자" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "executionDate", type: "date", label: "실행일자" },
        { name: "interestRepaymentMethod", type: "select", label: "이자상환방법", options: [{ value: "none", label: "선택" }] },
        { name: "principalRepaymentMethod", type: "select", label: "원금상환방법", options: [{ value: "none", label: "선택" }] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "manager", type: "text", label: "관리자" },
        { name: "terminationDate", type: "date", label: "해지일자" },
        { name: "offsetType", type: "select", label: "상계구분", options: [{ value: "none", label: "선택" }] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "nextPaymentDate", type: "date", label: "차기납입일" },
        { name: "benefitLossDate", type: "date", label: "한이익상실일" },
        { name: "cmsRequestDate", type: "date", label: "CMS요청일자" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "limitApprovalAmount", type: "text", label: "한도/승인금액" },
        { name: "executionAmount", type: "text", label: "실행금액" },
        { name: "loanBalance", type: "text", label: "대출잔액" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "uncollectedNormalInterest", type: "text", label: "미징수정상이자" },
        { name: "accountDeposit", type: "text", label: "계좌가수금" },
        { name: "cmsAccount", type: "text", label: "CMS계좌" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "excessInterest", type: "text", label: "과잉이자" },
        { name: "virtualAccountBank", type: "text", label: "가상계좌은행명" },
        { name: "cmsBank", type: "text", label: "CMS은행명" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "accountPayable", type: "text", label: "계좌가지급금" },
        { name: "monthlyPayment", type: "text", label: "월불입금" },
        { name: "delinquencyStartDate", type: "date", label: "연체시작일" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "fullRepaymentAmount", type: "text", label: "완제상환금액" },
        { name: "normalizationAmount", type: "text", label: "정상화금액" },
        { name: "delinquencyRate", type: "text", label: "연체이율" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "maturityDate", type: "text", label: "만기일자" },
        { name: "specialDeposit", type: "text", label: "별단예금" },
        { name: "contractMonths", type: "text", label: "약정개월수" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "paymentDate", type: "date", label: "납입일" },
        { name: "delinquencyMonths", type: "text", label: "연체월수" },
        { name: "specialReceivable", type: "text", label: "고격가수금" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "specialPayable", type: "text", label: "고격가지급금" },
        { name: "lateFee", type: "text", label: "연체료" },
        { name: "lastDepositStatus", type: "select", label: "최종입금상태", options: [{ value: "none", label: "선택" }] },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "contract", type: "text", label: "계약서" },
        { name: "publicCertification", type: "text", label: "공인인증" },
        { name: "notarization", type: "text", label: "공정증세" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "earlyRepaymentFee", type: "text", label: "중도상환수수료" },
        { name: "earlyRepaymentFeeRate", type: "text", label: "중도상환수수료율" },
        { name: "gracePeriodEndDate", type: "date", label: "거치기간종료일자" },
      ],
    },
  ], []);

  // 담보 필터 레이아웃
  const collateralFilterLayout: FilterLayout = useMemo(() => [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "collateralAddress", type: "text", label: "담보물주소지" },
        { name: "area", type: "text", label: "면적" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "provider", type: "text", label: "제공자" },
        { name: "providerResidentNumber", type: "text", label: "제공자주민번호" },
        { name: "collateralRegistrationNumber", type: "text", label: "담보물등록번호" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "appraisalValue", type: "text", label: "감정가" },
        { name: "seniorPriorityAmount", type: "text", label: "선순위금액(건수)" },
        { name: "leaseDeposit", type: "text", label: "임차보증금" },
      ],
    },
  ], []);

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    updateTableData(tabId, 'customerManagementCodeTable', mockData);
  };

  const handleExcelDownload = () => {
    alert("엑셀 다운로드 실행");
  };

  const handleRegister = () => {
    alert("등록되었습니다");
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
            "알림톡/SMS": { width: 1000, height: 800, path: "/popup/send-sms" },
            "DM발송": { width: 1000, height: 800, path: "/popup/send-dm" },
            "대출조건": { width: 1600, height: 900, path: "/popup/loan-conditions" },
            "여신상환": { width: 1600, height: 900, path: "/popup/credit-repayment" },
            "여신원장": { width: 1600, height: 800, path: "/popup/credit-ledger" },
            "거래내역": { width: 1600, height: 800, path: "/popup/transaction-history" },
            "조기경보": { width: 1200, height: 800, path: "/popup/early-warning" },
            "부동산경매정보": { width: 1400, height: 800, path: "/popup/real-estate-auction" },
            "발급내역": { width: 1400, height: 800, path: "/popup/issuance-history" },
            "수정정보": { width: 1000, height: 600, path: "/popup/correction-history" },
            "방문등록": { width: 800, height: 400, path: "/popup/visit-registration" },
            "추심연락제한": { width: 1200, height: 600, path: "/popup/debt-collection-restriction" },
            "주소검증": { width: 1000, height: 600, path: "/popup/address-verification" },
            "상담등록": { width: 1200, height: 800, path: "/popup/counseling-registration" },
            "특정정보조회": { width: 1200, height: 600, path: "/popup/specific-info-inquiry" },
            "메세지유형": { width: 1000, height: 600, path: "/popup/message-type" },
            "고객관리코드": { width: 1600, height: 800, path: "/popup/customer-management-code" },
            "채무조정": { width: 1600, height: 900, path: "/popup/debt-adjustment-management" },
            "7호서식": { width: 1400, height: 900, path: "/popup/form-7", tab: "form7" },
            "10호서식": { width: 1400, height: 900, path: "/popup/form-7", tab: "form10" },
          };

          const config = popupConfigs[label];
          if (config) {
            const left = (window.screen.width / 2) - (config.width / 2);
            const top = (window.screen.height / 2) - (config.height / 2);

            // URL 파라미터 구성
            const params = new URLSearchParams();
            if (label === "채무조정") {
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
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">채권상담</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>상담관리</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>일반상담</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>채권상담</BreadcrumbPage>
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

      {/* 전체 레이아웃 - 단일 grid로 모든 섹션의 너비 일치 보장 */}
      <div className="grid grid-cols-[4fr_1fr] gap-4">
        {/* 상단 좌측 영역 */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* 필터 */}
          <div className="p-4 bg-white">
            <FilterContainer
              filterLayout={leftAreaFilterLayout1}
              values={filters}
              onChange={handleFilterChange}
            />

            {/* 주소 검증 영역 */}
            <div className="my-4 space-y-3">
              <AddressVerificationRow label="초본주소" type="하" />
              <AddressVerificationRow label="자택주소" type="상" />
              <AddressVerificationRow label="직장주소" type="초" />
            </div>

            <FilterContainer
              filterLayout={leftAreaFilterLayout2}
              values={filters}
              onChange={handleFilterChange}
            />
          </div>



          {/* 데이터 테이블 */}
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
                  title="고객 관리 코드"
                />
              </div>
            </div>
          </div>

          {/* 계좌정보 탭 섹션 */}
          <div className="rounded-lg bg-white p-4">
            <CustomTabs defaultValue="계좌정보">
              <CustomTabsList>
                <CustomTabsTrigger value="계좌정보">계좌정보</CustomTabsTrigger>
                <CustomTabsTrigger value="신청이력">신청이력</CustomTabsTrigger>
                <CustomTabsTrigger value="담보">담보</CustomTabsTrigger>
                <CustomTabsTrigger value="관계인이력">관계인이력</CustomTabsTrigger>
              </CustomTabsList>

              <CustomTabsContent value="계좌정보" className="mt-4 space-y-4">
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

              <CustomTabsContent value="신청이력" className="mt-4 space-y-4">
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

              <CustomTabsContent value="담보" className="mt-4 space-y-4">
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

              <CustomTabsContent value="관계인이력" className="mt-4">
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

        {/* 상단 우측 영역 */}
        <div className="flex flex-col gap-4">
          {/* 필터 */}
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

          {/* 버튼 리스트 */}
          <div className="rounded-lg p-4 bg-white">
            <div className="flex flex-wrap justify-between gap-y-1.5">
              {implemented.map(label => renderButton(label))}
              {notImplemented.map(label => renderButton(label))}
              {/* 마지막 줄을 정렬하기 위한 빈 공간 */}
              {Array.from({ length: (3 - ((implemented.length + notImplemented.length) % 3)) % 3 }).map((_, i) => (
                <div key={`empty-${i}`} className="w-[100px]" />
              ))}
            </div>
          </div>
        </div>

        {/* 하단 좌측: 상담이력 탭 */}
        <div className="rounded-lg bg-white p-4 min-w-0">
          <CustomTabs value={bottomTabValue} onValueChange={setBottomTabValue}>
            <div className="flex items-center justify-between gap-4">
              <CustomTabsList>
                <CustomTabsTrigger value="상담이력">상담이력</CustomTabsTrigger>
                <CustomTabsTrigger value="CMS 정보">CMS 정보</CustomTabsTrigger>
                <CustomTabsTrigger value="알림톡/SMS">알림톡/SMS</CustomTabsTrigger>
                <CustomTabsTrigger value="입금내역">입금내역</CustomTabsTrigger>
                <CustomTabsTrigger value="DM/FAX">DM/FAX</CustomTabsTrigger>
                <CustomTabsTrigger value="이해관계사실확인서">이해관계사실확인서</CustomTabsTrigger>
              </CustomTabsList>
              <div className="flex items-center gap-1.5">
                {bottomTabValue === "상담이력" && (
                  <div className="flex items-center gap-1.5">
                    <Checkbox id="sms-include" />
                    <Label htmlFor="sms-include" className="text-sm font-medium cursor-pointer whitespace-nowrap">
                      SMS 포함
                    </Label>
                  </div>
                )}
                {bottomTabValue === "DM/FAX" && (
                  <Button variant="default" onClick={() => console.log("입력/수정")}>
                    입력/수정
                  </Button>
                )}
                <FilterDateRange label="" />
                <Button variant="default" onClick={() => console.log("조회")}>
                  조회
                </Button>
              </div>
            </div>

            <CustomTabsContent value="상담이력" className="mt-4">
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

            <CustomTabsContent value="CMS 정보" className="mt-4">
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

            <CustomTabsContent value="알림톡/SMS" className="mt-4">
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

            <CustomTabsContent value="입금내역" className="mt-4">
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

            <CustomTabsContent value="이해관계사실확인서" className="mt-4">
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

        {/* 하단 우측: 조건부 박스 */}
        <div className="flex flex-col gap-4">
          {/* 상담이력 탭: 상담등록 박스 */}
          {bottomTabValue === "상담이력" && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="space-y-3">
                <Button variant="default" className="w-full">
                  상담등록
                </Button>
                <textarea
                  className="w-full min-h-[400px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상담 내용을 입력하세요..."
                />
              </div>
            </div>
          )}

          {/* 알림톡/SMS 탭: 내용 조회 박스 */}
          {bottomTabValue === "알림톡/SMS" && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="space-y-2">
                <Label className="text-sm font-medium">내용</Label>
                <div className="w-full min-h-[400px] p-3 border rounded-md bg-gray-50 text-sm whitespace-pre-wrap">
                  {/* 선택된 메시지 내용이 표시됩니다 */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

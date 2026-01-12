

import { useState, Suspense } from "react";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions } from "@/components/app/PopupRightActions";
import { DataTable } from "@/components/app/DataTable";
import { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent } from "@/components/app/CustomTabs";
import { Button } from "@/components/ui/button";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// 상환스케줄 데이터 타입 (중앙회 탭)
interface RepaymentSchedule {
  id: number;
  scheduledPaymentDate: string; // 불입예정일
  installment: number; // 회차
  principalRepayment: number; // 상환원금
  interestRepayment: number; // 상환이자
  monthlyPayment: number; // 월납입액
  interestCalculationBase: number; // 이자계산대상액
  interestCalculationStartDate: string; // 이자계산시작일자
  interestCalculationEndDate: string; // 이자계산종료일자
  interestCalculationDays: number; // 이자계산일수
}

// 대출원리금 데이터 타입 (시뮬레이션 탭)
interface LoanPrincipalInterest {
  id: number;
  number: number; // 번호
  priority: number; // 우선순위
  repaymentMethod: string; // 상환방식
  loanPrincipal: number; // 대출원금
  startInstallment: number; // 시작회차
  endInstallment: number; // 종료회차
  interestRate: string; // 금리
  startDate: string; // 시작일자
  endDate: string; // 종료일자
  paymentCycle: string; // 납입주기
  paymentStartInstallment: number; // 납입시작회차
}

// 시뮬레이션 상환스케줄 데이터 타입
interface SimulationRepaymentSchedule {
  id: number;
  scheduledPaymentDate: string; // 불입예정일
  installment: number; // 회차
  principalRepayment: number; // 상환원금
  interestRepayment: number; // 상환이자
  monthlyPayment: number; // 월납입액
  interestCalculationBase: number; // 이자계산대상액
  interestCalculationStartDate: string; // 이자계산시작일자
  interestCalculationEndDate: string; // 이자계산종료일자
  interestCalculationDays: number; // 이자계산일수
}

// 조기상환수수료 데이터 타입
interface EarlyRepaymentFeeSchedule {
  id: number;
  scheduledPaymentDate: string; // 불입예정일
  installment: number; // 회차
  principalRepayment: number; // 상환원금
  interest: number; // 이자
  calculationBase: number; // 계산대상액
  interestCalculationStartDate: string; // 이자계산시작일자
  interestCalculationEndDate: string; // 이자계산종료일자
  interestCalculationDays: number; // 이자계산일수
  targetDays: number; // 대상일수
  earlyRepaymentFee: number; // 조기상환수수료
}

// Mock 데이터 - 중앙회 탭
const mockRepaymentData: RepaymentSchedule[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  scheduledPaymentDate: "2024-01-15",
  installment: i + 1,
  principalRepayment: 1000000,
  interestRepayment: 50000,
  monthlyPayment: 1050000,
  interestCalculationBase: 50000000,
  interestCalculationStartDate: "2024-01-01",
  interestCalculationEndDate: "2024-01-31",
  interestCalculationDays: 31,
}));

// Mock 데이터 - 시뮬레이션 탭 (대출원리금)
const mockLoanPrincipalInterestData: LoanPrincipalInterest[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  priority: i + 1,
  repaymentMethod: "원리금균등",
  loanPrincipal: 50000000,
  startInstallment: 1,
  endInstallment: 60,
  interestRate: "3.5%",
  startDate: "2024-01-01",
  endDate: "2028-12-31",
  paymentCycle: "월",
  paymentStartInstallment: 1,
}));

// Mock 데이터 - 시뮬레이션 탭 (상환스케줄)
const mockSimulationRepaymentData: SimulationRepaymentSchedule[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  scheduledPaymentDate: "2024-01-15",
  installment: i + 1,
  principalRepayment: 1000000,
  interestRepayment: 50000,
  monthlyPayment: 1050000,
  interestCalculationBase: 50000000,
  interestCalculationStartDate: "2024-01-01",
  interestCalculationEndDate: "2024-01-31",
  interestCalculationDays: 31,
}));

// Mock 데이터 - 조기상환수수료 탭
const mockEarlyRepaymentFeeData: EarlyRepaymentFeeSchedule[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  scheduledPaymentDate: "2024-01-15",
  installment: i + 1,
  principalRepayment: 1000000,
  interest: 50000,
  calculationBase: 50000000,
  interestCalculationStartDate: "2024-01-01",
  interestCalculationEndDate: "2024-01-31",
  interestCalculationDays: 31,
  targetDays: 31,
  earlyRepaymentFee: 75000,
}));

// 컬럼 정의 - 중앙회 탭
const repaymentColumns: ColumnDef<RepaymentSchedule>[] = [
  { accessorKey: "scheduledPaymentDate", header: "불입예정일" },
  { accessorKey: "installment", header: "회차" },
  { accessorKey: "principalRepayment", header: "상환원금" },
  { accessorKey: "interestRepayment", header: "상환이자" },
  { accessorKey: "monthlyPayment", header: "월납입액" },
  { accessorKey: "interestCalculationBase", header: "이자계산대상액" },
  { accessorKey: "interestCalculationStartDate", header: "이자계산시작일자" },
  { accessorKey: "interestCalculationEndDate", header: "이자계산종료일자" },
  { accessorKey: "interestCalculationDays", header: "이자계산일수" },
];

// 컬럼 정의 - 시뮬레이션 탭 (대출원리금)
const loanPrincipalInterestColumns: ColumnDef<LoanPrincipalInterest>[] = [
  { accessorKey: "number", header: "번호" },
  { accessorKey: "priority", header: "우선순위" },
  { accessorKey: "repaymentMethod", header: "상환방식" },
  { accessorKey: "loanPrincipal", header: "대출원금" },
  { accessorKey: "startInstallment", header: "시작회차" },
  { accessorKey: "endInstallment", header: "종료회차" },
  { accessorKey: "interestRate", header: "금리" },
  { accessorKey: "startDate", header: "시작일자" },
  { accessorKey: "endDate", header: "종료일자" },
  { accessorKey: "paymentCycle", header: "납입주기" },
  { accessorKey: "paymentStartInstallment", header: "납입시작회차" },
];

// 컬럼 정의 - 시뮬레이션 탭 (상환스케줄)
const simulationRepaymentColumns: ColumnDef<SimulationRepaymentSchedule>[] = [
  { accessorKey: "scheduledPaymentDate", header: "불입예정일" },
  { accessorKey: "installment", header: "회차" },
  { accessorKey: "principalRepayment", header: "상환원금" },
  { accessorKey: "interestRepayment", header: "상환이자" },
  { accessorKey: "monthlyPayment", header: "월납입액" },
  { accessorKey: "interestCalculationBase", header: "이자계산대상액" },
  { accessorKey: "interestCalculationStartDate", header: "이자계산시작일자" },
  { accessorKey: "interestCalculationEndDate", header: "이자계산종료일자" },
  { accessorKey: "interestCalculationDays", header: "이자계산일수" },
];

// 컬럼 정의 - 조기상환수수료 탭
const earlyRepaymentFeeColumns: ColumnDef<EarlyRepaymentFeeSchedule>[] = [
  { accessorKey: "scheduledPaymentDate", header: "불입예정일" },
  { accessorKey: "installment", header: "회차" },
  { accessorKey: "principalRepayment", header: "상환원금" },
  { accessorKey: "interest", header: "이자" },
  { accessorKey: "calculationBase", header: "계산대상액" },
  { accessorKey: "interestCalculationStartDate", header: "이자계산시작일자" },
  { accessorKey: "interestCalculationEndDate", header: "이자계산종료일자" },
  { accessorKey: "interestCalculationDays", header: "이자계산일수" },
  { accessorKey: "targetDays", header: "대상일수" },
  { accessorKey: "earlyRepaymentFee", header: "조기상환수수료" },
];

function LoanConditionsContent() {
  // 필터 상태 - 조기상환수수료 탭
  const [earlyFeeFilters, setEarlyFeeFilters] = useState({
    // 필터 레이아웃 1
    earlyRepaymentPrincipal: "",
    todayInterest: "",
    earlyRepaymentFee: "",
    totalAmount: "",
    appliedEarlyRepaymentFeeRate: "",
    // 필터 레이아웃 2
    principalRepaymentTotal: "",
    earlyRepaymentTotal: "",
    refundInterestTotal: "",
    normalInterestTotal: "",
    delinquencyFeeTotal: "",
    delinquencyInterestTotal: "",
    interestRepaymentGrandTotal: "",
    uncollectedNormalInterest: "",
    uncollectedDelinquencyFee: "",
    uncollectedDelinquencyInterest: "",
    uncollectedGrandTotal: "",
    excessInterest: "",
    repaymentGrandTotal: "",
  });

  // 필터 상태
  const [filters, setFilters] = useState({
    accountNumber: "",
    customerNumber: "",
    customerName: "",
    centralOrEarlyRepayment: "central",
    loanAmount: "",
    interestPaymentMethod: "",
    loanRepaymentMethod: "",
    repaymentCycle: "",
    fixedCycle: "",
    loanDate1: "",
    loanDate2: "",
    loanPeriodEnabled: false,
    loanPeriod: { select1: "", select2: "" },
    maturityDateEnabled: false,
    maturityDate: "",
    firstInterestPaymentDate: "",
    loanRate: "",
    gracePeriodYn: "",
    gracePeriodMonths: "",
    interestFreeYn: "",
    interestFreeDays: "",
    finalPaymentInstallment: "",
    dueDate: "",
    repaymentAmountEnabled: false,
    repaymentAmount: "",
    repaymentDate: "",
    repaymentInstallment: "",
    unpaidPrincipalEnabled: false,
    unpaidPrincipal: "",
    unpaidInterestEnabled: false,
    unpaidInterest: "",
    earlyRepaymentAmountEnabled: false,
    earlyRepaymentAmount: "",
    earlyRepaymentFeeRate: "",
    earlyRepaymentDate: "",
    todayRepaymentYn: "",
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEarlyFeeFilterChange = (name: string, value: any) => {
    setEarlyFeeFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("조회:", filters);
  };

  const handleReset = () => {
    setFilters({
      accountNumber: "",
      customerNumber: "",
      customerName: "",
      centralOrEarlyRepayment: "central",
      loanAmount: "",
      interestPaymentMethod: "",
      loanRepaymentMethod: "",
      repaymentCycle: "",
      fixedCycle: "",
      loanDate1: "",
      loanDate2: "",
      loanPeriodEnabled: false,
      loanPeriod: { select1: "", select2: "" },
      maturityDateEnabled: false,
      maturityDate: "",
      firstInterestPaymentDate: "",
      loanRate: "",
      gracePeriodYn: "",
      gracePeriodMonths: "",
      interestFreeYn: "",
      interestFreeDays: "",
      finalPaymentInstallment: "",
      dueDate: "",
      repaymentAmountEnabled: false,
      repaymentAmount: "",
      repaymentDate: "",
      repaymentInstallment: "",
      unpaidPrincipalEnabled: false,
      unpaidPrincipal: "",
      unpaidInterestEnabled: false,
      unpaidInterest: "",
      earlyRepaymentAmountEnabled: false,
      earlyRepaymentAmount: "",
      earlyRepaymentFeeRate: "",
      earlyRepaymentDate: "",
      todayRepaymentYn: "",
    });
  };

  // 고객정보 필터 레이아웃
  const customerInfoLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "accountNumber",
          type: "long-search",
          label: "계좌번호",
        },
        {
          name: "customerNumber",
          type: "text",
          label: "고객번호",
        },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "customerName",
          type: "text",
          label: "고객명",
        },
        {
          name: "centralOrEarlyRepayment",
          type: "radio-group",
          label: "구분",
          options: [
            { value: "genie", label: "지니" },
            { value: "central", label: "중앙회" },
            { value: "earlyRepayment", label: "조기상환" },
          ],
        },
      ],
    },
  ];

  // 시뮬레이션 조건 필터 레이아웃
  const simulationConditionLayout: FilterLayout = [
    // row 1
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "loanAmount",
          type: "text",
          label: "대출금액",
        },
        {
          name: "interestPaymentMethod",
          type: "select",
          label: "이자납입방법",
          options: [
            { value: "monthly", label: "월납입" },
            { value: "maturity", label: "만기일시" },
          ],
        },
        {
          name: "loanRepaymentMethod",
          type: "select",
          label: "대출상환방법",
          options: [
            { value: "equal", label: "원리금균등" },
            { value: "equalPrincipal", label: "원금균등" },
            { value: "maturity", label: "만기일시" },
          ],
        },
      ],
    },
    // row 2
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "repaymentCycle",
          type: "select",
          label: "상환주기",
          options: [
            { value: "monthly", label: "월" },
            { value: "quarterly", label: "분기" },
            { value: "annually", label: "년" },
          ],
        },
        {
          name: "fixedCycle",
          type: "text",
          label: "일정주기",
        },
        {
          name: "loanDate1",
          type: "date",
          label: "대출일자",
        },
      ],
    },
    // row 3
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "loanPeriodEnabled",
          type: "checkbox",
          label: "대출기간여부",
        },
        {
          name: "loanPeriod",
          type: "double-select",
          label: "대출기간",
          options1: [
            { value: "year", label: "년" },
            { value: "month", label: "월" },
          ],
          options2: Array.from({ length: 100 }, (_, i) => ({
            value: String(i + 1),
            label: String(i + 1),
          })),
        },
      ],
    },
    // row 4
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "maturityDateEnabled",
          type: "checkbox",
          label: "만기일자 여부",
        },
        {
          name: "maturityDate",
          type: "date",
          label: "만기일자",
        },
        {
          name: "firstInterestPaymentDate",
          type: "date",
          label: "첫이자납입일",
        },
      ],
    },
    // row 5
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "loanRate",
          type: "text",
          label: "대출금리",
        },
        {
          name: "gracePeriodYn",
          type: "select",
          label: "거치여부",
          options: [
            { value: "Y", label: "예" },
            { value: "N", label: "아니오" },
          ],
        },
        {
          name: "gracePeriodMonths",
          type: "text",
          label: "거치기간 회차",
        },
      ],
    },
    // row 6
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "interestFreeYn",
          type: "select",
          label: "무이자여부",
          options: [
            { value: "Y", label: "예" },
            { value: "N", label: "아니오" },
          ],
        },
        {
          name: "interestFreeDays",
          type: "text",
          label: "무이자기간(일)",
        },
        {
          name: "finalPaymentInstallment",
          type: "text",
          label: "최종납입회차",
        },
      ],
    },
    // row 7
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "dueDate",
          type: "text",
          label: "응당일",
        },
      ],
    },
    // row 8: 텍스트 영역
    [
      {
        name: "partialRepaymentLabel",
        type: "custom",
        render: () => (
          <div className="py-2">
            <span className="text-sm font-medium text-gray-700">※ 일부상환 시뮬레이션 조건</span>
          </div>
        ),
      },
    ],
    // row 9
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "repaymentAmount",
          type: "text",
          label: "상환금액",
          activator: true,
        },
        {
          name: "repaymentDate",
          type: "date",
          label: "상환일자",
        },
        {
          name: "repaymentInstallment",
          type: "text",
          label: "상환회차",
        },
      ],
    },
    // row 10
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "unpaidPrincipal",
          type: "text",
          label: "미수원금",
          activator: true,
        },
        {
          name: "unpaidInterest",
          type: "text",
          label: "미수이자",
          activator: true,
        },
      ],
    },
    // row 11: 텍스트 영역
    [
      {
        name: "earlyRepaymentLabel",
        type: "custom",
        render: () => (
          <div className="py-2">
            <span className="text-sm font-medium text-gray-700">※ 조기상환수수료 조건</span>
          </div>
        ),
      },
    ],
    // row 12
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "earlyRepaymentAmount",
          type: "text",
          label: "조기상환금액",
          activator: true,
        },
        {
          name: "earlyRepaymentFeeRate",
          type: "text",
          label: "조기상환수수료율",
        },
      ],
    },
    // row 13
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "earlyRepaymentDate",
          type: "date",
          label: "조기상환일자",
        },
        {
          name: "todayRepaymentYn",
          type: "select",
          label: "금일상환여부",
          options: [
            { value: "Y", label: "예" },
            { value: "N", label: "아니오" },
          ],
        },
      ],
    },
  ];

  // 조기상환수수료 탭 - 필터 레이아웃 1 (타이틀 없음)
  const earlyFeeLayout1: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "earlyRepaymentPrincipal",
          type: "text",
          label: "조기상환원금",
        },
        {
          name: "todayInterest",
          type: "text",
          label: "금일이자금",
        },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "earlyRepaymentFee",
          type: "text",
          label: "조기상환수수료",
        },
        {
          name: "totalAmount",
          type: "text",
          label: "합계금액",
        },
        {
          name: "appliedEarlyRepaymentFeeRate",
          type: "text",
          label: "적용조기상환수수료율",
        },
      ],
    },
  ];

  // 조기상환수수료 탭 - 필터 레이아웃 2 (타이틀: 조기상환수수료)
  const earlyFeeLayout2: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "principalRepaymentTotal",
          type: "text",
          label: "상환원금합계",
        },
        {
          name: "earlyRepaymentTotal",
          type: "text",
          label: "조기상환합계",
        },
        {
          name: "refundInterestTotal",
          type: "text",
          label: "환출이자합계",
        },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "normalInterestTotal",
          type: "text",
          label: "정상이자합계",
        },
        {
          name: "delinquencyFeeTotal",
          type: "text",
          label: "연체료합계",
        },
        {
          name: "delinquencyInterestTotal",
          type: "text",
          label: "연체이자합계",
        },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "interestRepaymentGrandTotal",
          type: "text",
          label: "이자상환총합계",
        },
        {
          name: "uncollectedNormalInterest",
          type: "text",
          label: "미징수정상이자",
        },
        {
          name: "uncollectedDelinquencyFee",
          type: "text",
          label: "미징수연체료",
        },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "uncollectedDelinquencyInterest",
          type: "text",
          label: "미징수연체이자",
        },
        {
          name: "uncollectedGrandTotal",
          type: "text",
          label: "미징수총합계",
        },
        {
          name: "excessInterest",
          type: "text",
          label: "과잉이자",
        },
      ],
    },
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "repaymentGrandTotal",
          type: "text",
          label: "상환총합계(원금 + 미징수 - 과잉 - 환출이자)",
        },
      ],
    },
  ];

  const handleMmsPreview = () => {
    console.log("MMS 미리보기");
  };

  const handleMmsSend = () => {
    console.log("MMS 발송");
  };

  const handleExcelSave = () => {
    console.log("엑셀저장");
  };

  const handleSimulation = () => {
    console.log("시뮬레이션");
  };

  const handleUnpaidInterestInquiry = () => {
    console.log("미수이자조회");
  };

  const handleEarlyRepaymentFeeRate = () => {
    console.log("조기상환수수료율");
  };

  const handleSimulationExcelSave = () => {
    console.log("시뮬레이션 엑셀저장");
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">대출정보</h2>
        <PopupRightActions
          actions={[
            { id: "search", text: "조회", onClick: handleSearch },
            { id: "reset", text: "초기화", onClick: handleReset },
          ]}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
        <h3 className="text-sm font-medium ">고객정보</h3>
        <FilterContainer
          filterLayout={customerInfoLayout}
          values={filters}
          onChange={handleFilterChange}
        />

        <div className="flex items-center justify-between ">
          <h3 className="text-sm font-medium">시뮬레이션 조건</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSimulation}
            >
              시뮬레이션
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUnpaidInterestInquiry}
            >
              미수이자조회
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEarlyRepaymentFeeRate}
            >
              조기상환수수료율
            </Button>
          </div>
        </div>
        <FilterContainer
          filterLayout={simulationConditionLayout}
          values={filters}
          onChange={handleFilterChange}
        />

        {/* 탭 영역 */}
        <div className="flex-1 min-h-0">
          <CustomTabs defaultValue="central">
            <CustomTabsList>
              <CustomTabsTrigger value="central">중앙회</CustomTabsTrigger>
              <CustomTabsTrigger value="simulation">시뮬레이션</CustomTabsTrigger>
              <CustomTabsTrigger value="earlyRepaymentFee">조기상환수수료</CustomTabsTrigger>
            </CustomTabsList>

            <CustomTabsContent value="central" className="mt-4">
              {/* 커스텀 헤더 */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">상환스케줄</h3>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMmsPreview}
                  >
                    MMS 미리보기
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMmsSend}
                  >
                    MMS 발송
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExcelSave}
                  >
                    엑셀저장
                  </Button>
                </div>
              </div>

              <DataTable
                columns={repaymentColumns}
                data={mockRepaymentData}
                minWidth="1600px"
                hideToolbar={true}
                pageSize={10}
              />
            </CustomTabsContent>

            <CustomTabsContent value="simulation" className="mt-4 flex flex-col gap-4">
              {/* 대출원리금 테이블 */}
              <DataTable
                title="대출원리금"
                columns={loanPrincipalInterestColumns}
                data={mockLoanPrincipalInterestData}
                minWidth="1600px"
                hideToolbar={true}
                pageSize={10}
              />

              {/* 상환스케줄 테이블 */}
              <div>
                {/* 커스텀 헤더 */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">상환스케줄</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSimulationExcelSave}
                  >
                    엑셀저장
                  </Button>
                </div>

                <DataTable
                  columns={simulationRepaymentColumns}
                  data={mockSimulationRepaymentData}
                  minWidth="1600px"
                  hideToolbar={true}
                  pageSize={10}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="earlyRepaymentFee" className="mt-4 flex flex-col gap-4">
              {/* 필터 레이아웃 1 - 타이틀 없음 */}
              <FilterContainer
                filterLayout={earlyFeeLayout1}
                values={earlyFeeFilters}
                onChange={handleEarlyFeeFilterChange}
              />

              {/* 필터 레이아웃 2 - 타이틀: 조기상환수수료 */}
              <h3 className="text-sm font-medium mb-2">조기상환수수료</h3>
              <FilterContainer
                filterLayout={earlyFeeLayout2}
                values={earlyFeeFilters}
                onChange={handleEarlyFeeFilterChange}
              />

              {/* 데이터 테이블 - 타이틀 없음, 버튼 없음 */}
              <DataTable
                columns={earlyRepaymentFeeColumns}
                data={mockEarlyRepaymentFeeData}
                minWidth="1600px"
                hideToolbar={true}
                pageSize={10}
              />
            </CustomTabsContent>
          </CustomTabs>
        </div>
      </div>
    </div>
  );
}

export default function LoanConditionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanConditionsContent />
    </Suspense>
  );
}

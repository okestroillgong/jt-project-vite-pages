

import { useState, Suspense } from "react";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions } from "@/components/app/PopupRightActions";
import { DataTable } from "@/components/app/DataTable";
import { Button } from "@/components/ui/button";
import type { FilterLayout } from "@/components/filters/types";
import { ColumnDef } from "@tanstack/react-table";

// 이자계산내역 데이터 타입
interface InterestCalculation {
  id: number;
  scheduledPaymentDate: string; // 납입예정일
  installment: number; // 회차
  principalRepayment: number; // 상환원금
  normalInterest: number; // 정상이자
  delinquencyFee: number; // 연체료
  delinquencyInterest: number; // 연체이자
  settlementTargetAmount: number; // 정산대상금액
  targetRate: string; // 대상이율
  normalInterestPeriodStart: string; // 정상이자계산기간 - 시작일자
  normalInterestPeriodEnd: string; // 정상이자계산기간 - 종료일자
}

// Mock 데이터
const mockInterestCalculationData: InterestCalculation[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  scheduledPaymentDate: "2024-01-15",
  installment: i + 1,
  principalRepayment: 1000000,
  normalInterest: 50000,
  delinquencyFee: 5000,
  delinquencyInterest: 3000,
  settlementTargetAmount: 1058000,
  targetRate: "3.5%",
  normalInterestPeriodStart: "2024-01-01",
  normalInterestPeriodEnd: "2024-01-31",
}));

// 컬럼 정의 - 2차 컬럼 구조 (정상이자계산기간 그룹)
const interestCalculationColumns: ColumnDef<InterestCalculation>[] = [
  { accessorKey: "scheduledPaymentDate", header: "납입예정일" },
  { accessorKey: "installment", header: "회차" },
  { accessorKey: "principalRepayment", header: "상환원금" },
  { accessorKey: "normalInterest", header: "정상이자" },
  { accessorKey: "delinquencyFee", header: "연체료" },
  { accessorKey: "delinquencyInterest", header: "연체이자" },
  { accessorKey: "settlementTargetAmount", header: "정산대상금액" },
  { accessorKey: "targetRate", header: "대상이율" },
  {
    id: "normalInterestPeriod",
    header: "정상이자계산기간",
    columns: [
      { accessorKey: "normalInterestPeriodStart", header: "시작일자" },
      { accessorKey: "normalInterestPeriodEnd", header: "종료일자" },
    ],
  },
];

function CreditRepaymentContent() {
  // 필터 상태
  const [filters, setFilters] = useState({
    // 필터 레이아웃 01
    loanAccountNumber: "",
    inquiryType: "",
    baseDate: "",
    startDate: "",
    repaymentType: "",
    repaymentInstallment: "",
    principalInterestReceipt: "",
    repaymentAmount: "",
    // 필터 레이아웃 02 (고객게좌정보)
    customerNumber: "",
    loanDate: "",
    maturityDate: "",
    suspenseAccount: "",
    specialDeposit: "",
    advancePayment: "",
    ordinaryDepositBalance: "",
    cmsDeduction: "",
    cmsBankName: "",
    autoTransferAccount: "",
    progressPaymentDelinquency: "",
    delinquencyYn: "",
    normalRate: "",
    delinquencyRate: "",
    // 필터 레이아웃 03
    principalRepaymentTotal: "",
    earlyRepaymentTotal: "",
    refundInterestTotal: "",
    principalGrandTotal: "",
    normalInterestTotal: "",
    delinquencyFeeTotal: "",
    delinquencyInterestTotal: "",
    interestRepaymentGrandTotal: "",
    uncollectedNormalInterest: "",
    uncollectedDelinquencyFee: "",
    uncollectedGrandTotal: "",
    excessInterest: "",
    repaymentGrandTotal: "",
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAlertTalkSms = () => {
    console.log("알림톡/SMS");
  };

  const handleSearch = () => {
    console.log("조회:", filters);
  };

  const handlePrint = () => {
    console.log("출력");
  };

  const handleInterestRateExcessInquiry = () => {
    console.log("이자율제한초과내역조회");
  };

  // 필터 레이아웃 01 (타이틀 없음, 버튼: 출력)
  const filterLayout01: FilterLayout = [
    // row 1
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "loanAccountNumber",
          type: "long-search",
          label: "대출계좌번호",
        },
        {
          name: "inquiryType",
          type: "select",
          label: "조회구분",
          options: [
            { value: "all", label: "전체" },
            { value: "normal", label: "정상" },
            { value: "delinquent", label: "연체" },
          ],
        },
        {
          name: "baseDate",
          type: "date",
          label: "기준일자",
        },
      ],
    },
    // row 2
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "startDate",
          type: "date",
          label: "기산일자",
        },
        {
          name: "repaymentType",
          type: "select",
          label: "상환구분",
          options: [
            { value: "full", label: "전액상환" },
            { value: "partial", label: "일부상환" },
          ],
        },
        {
          name: "repaymentInstallment",
          type: "text",
          label: "상환회차",
        },
      ],
    },
    // row 3
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "principalInterestReceipt",
          type: "select",
          label: "원리금수납",
          options: [
            { value: "Y", label: "예" },
            { value: "N", label: "아니오" },
          ],
        },
        {
          name: "repaymentAmount",
          type: "text",
          label: "상환금액",
        },
      ],
    },
  ];

  // 필터 레이아웃 02 (타이틀: 고객게좌정보, 버튼 없음, 전부 입력형)
  const filterLayout02: FilterLayout = [
    // row 1
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "customerNumber",
          type: "text",
          label: "고객번호",
        },
        {
          name: "loanDate",
          type: "text",
          label: "대출일자",
        },
        {
          name: "maturityDate",
          type: "text",
          label: "만기일자",
        },
      ],
    },
    // row 2
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "suspenseAccount",
          type: "text",
          label: "가수금",
        },
        {
          name: "specialDeposit",
          type: "text",
          label: "별단에금",
        },
        {
          name: "advancePayment",
          type: "text",
          label: "가지급금",
        },
      ],
    },
    // row 3
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "ordinaryDepositBalance",
          type: "text",
          label: "보통에금잔액",
        },
        {
          name: "cmsDeduction",
          type: "text",
          label: "CMS/파출수납",
        },
        {
          name: "cmsBankName",
          type: "text",
          label: "CMS은행명",
        },
      ],
    },
    // row 4
    {
      type: "grid",
      columns: 2,
      filters: [
        {
          name: "autoTransferAccount",
          type: "text",
          label: "자동이체계좌",
        },
        {
          name: "progressPaymentDelinquency",
          type: "text",
          label: "진행/납입/연체회차",
        },
      ],
    },
    // row 5
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "delinquencyYn",
          type: "text",
          label: "연체여부",
        },
        {
          name: "normalRate",
          type: "text",
          label: "정상이율",
        },
        {
          name: "delinquencyRate",
          type: "text",
          label: "연체이율",
        },
      ],
    },
  ];

  // 필터 레이아웃 03 (타이틀 없음, 버튼: 이자율제한초과내역조회, 전부 입력형)
  const filterLayout03: FilterLayout = [
    // row 1
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
    // row 2
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "principalGrandTotal",
          type: "text",
          label: "원금총합계",
        },
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
      ],
    },
    // row 3
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "delinquencyInterestTotal",
          type: "text",
          label: "연체이자합계",
        },
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
      ],
    },
    // row 4
    {
      type: "grid",
      columns: 3,
      filters: [
        {
          name: "uncollectedDelinquencyFee",
          type: "text",
          label: "미징수연체료",
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
    // row 5
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "repaymentGrandTotal",
          type: "text",
          label: "상환총합계(원금 + 이자 + 미징수 - 과잉 - 환출이자)",
        },
      ],
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">여신상환</h2>
        <PopupRightActions
          actions={[
            { id: "alertTalkSms", text: "알림톡/SMS", onClick: handleAlertTalkSms },
            { id: "search", text: "조회", onClick: handleSearch },
          ]}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {/* 필터 레이아웃 01 */}
        <div className="flex items-center justify-end">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            출력
          </Button>
        </div>
        <FilterContainer
          filterLayout={filterLayout01}
          values={filters}
          onChange={handleFilterChange}
        />

        {/* 필터 레이아웃 02 - 고객게좌정보 */}
        <h3 className="text-sm font-medium">고객게좌정보</h3>
        <FilterContainer
          filterLayout={filterLayout02}
          values={filters}
          onChange={handleFilterChange}
        />

        {/* 데이터 테이블 - 이자계산내역 */}
        <div className="shrink-0">
          <DataTable
            title="이자계산내역"
            columns={interestCalculationColumns}
            data={mockInterestCalculationData}
            minWidth="1600px"
            hideToolbar={true}
            pageSize={10}
          />
        </div>

        {/* 필터 레이아웃 03 */}
        <div className="flex items-center justify-end mb-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleInterestRateExcessInquiry}
          >
            이자율제한초과내역조회
          </Button>
        </div>
        <FilterContainer
          filterLayout={filterLayout03}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

export default function CreditRepaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreditRepaymentContent />
    </Suspense>
  );
}

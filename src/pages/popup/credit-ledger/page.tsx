

import { useState, Suspense, useCallback } from "react";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// Type for the Bill Table
type BillData = {
  id: number;
  billType: string;
  issuerName: string;
  industryCode: string;
  businessNumber: string;
  repName: string;
};

// Mock Data for Bill Table
const mockBillData: BillData[] = [];

const billColumns: ColumnDef<BillData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "billType", header: "할인어음배서인발행인구분코드" },
  { accessorKey: "issuerName", header: "발행업체명" },
  { accessorKey: "industryCode", header: "업종코드" },
  { accessorKey: "businessNumber", header: "주민사업자등록번호" },
  { accessorKey: "repName", header: "대표자명" },
];

function CreditLedgerPopupContent() {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "print", text: "출력" },
  ];

  // 1. Search Section
  const searchLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        { name: "loanAccountNumber", type: "long-search", label: "대출계좌번호" },
      ],
    },
  ];

  // 2. Account Info Section
  const accountInfoLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { name: "customerName", type: "text", label: "고객명" },
        { name: "productCode", type: "text", label: "상품코드" },
        { name: "loanAppNumber", type: "text", label: "여신신청번호" },
        { name: "newBranch", type: "select", label: "신규지점", options: [] },

        { name: "executionDate", type: "date", label: "실행일자" },
        { name: "maturityDate", type: "date", label: "만기일자" },
        { name: "completionDate", type: "date", label: "완제일자" },
        { name: "mgmtBranch", type: "select", label: "관리지점", options: [] },

        { name: "ledgerStatus", type: "select", label: "원장상태", options: [] },
        { name: "subjectCode", type: "select", label: "과목코드", options: [] },
        { name: "balanceCertDate", type: "date", label: "잔액증명서발급일자" },
        { name: "manager", type: "text", label: "관리자" },

        { name: "accountCode", type: "text", label: "회계코드" },
        { name: "depositAccount", type: "text", label: "입금계좌번호" },
        { name: "creditInfoProvide", type: "select", label: "신용정보원신용공여과목코드", options: [] }, // Long label
        { name: "recommender", type: "text", label: "권유자" },

        { name: "limitClass", type: "select", label: "한도구분", options: [] },
        { name: "approvalAmount", type: "text", label: "승인금액" },
        { name: "loanAmount", type: "text", label: "대출금액" },
        { name: "loanBalance", type: "text", label: "대출잔액" },

        { name: "loanHandlingClass", type: "select", label: "대출취급구분", options: [] },
        { name: "loanFundClass", type: "select", label: "여신자금구분", options: [] },
        { name: "collateralCreditClass", type: "select", label: "담보신용구분", options: [] },
        { name: "fundUsageClass", type: "select", label: "자금용도구분", options: [] },

        { name: "baseRateCode", type: "select", label: "기준금리코드", options: [] },
        { name: "rateChangeCycle", type: "text", label: "이율변동주기월수" },
        { name: "nextRateChangeDate", type: "date", label: "다음이율변동일자" },
        { name: "appliedRate", type: "text", label: "적용이율" }, // % suffix ideally

        { name: "rateChangeApply", type: "select", label: "이율변경적용", options: [] },
        { name: "overdueRateApply", type: "select", label: "연체이율적용", options: [] },
        { name: "mgmtBondInc", type: "select", label: "관리채권편입", options: [] },
        { name: "overdueRate", type: "text", label: "연체이율" }, // % suffix

        { name: "principalRepayMethod", type: "select", label: "원금상환방법", options: [] },
        { name: "principalInterestCycle", type: "select", label: "원리금상환주기", options: [] },
        { name: "principalRepayCycle", type: "text", label: "원금상환주기" },
        { name: "interestRepayCycle", type: "text", label: "이자상환주기" },

        { name: "prepayPostpay", type: "select", label: "선취후취구분", options: [] },
        { name: "dueDate", type: "text", label: "응당일" },
        { name: "lastInterestRepayInstallment", type: "text", label: "최종이자상환회차" },
        { name: "lastPrincipalRepayInstallment", type: "text", label: "최종원금상환회차" },

        { name: "finalCollectionDate", type: "date", label: "최종이수일자" },
        { name: "nextInterestPayDate", type: "date", label: "다음이자납입일자" },
        { name: "nextPrincipalPayDate", type: "date", label: "다음원금납입일자" },
        { name: "lastPrincipalPayDate", type: "date", label: "최종원금상환일자" },

        { name: "uncollectedInterest", type: "text", label: "미징수정상이자" },
        { name: "uncollectedLateFee", type: "text", label: "미징수연체료" },
        { name: "uncollectedLateInterest", type: "text", label: "미징수연체이자" },
        { name: "excessInterest", type: "text", label: "과잉이자" },

        { name: "interestCalcDays", type: "select", label: "이자계산일수", options: [] },
        { name: "lateFeeReduceDate", type: "date", label: "연체료감면일수" },
        { name: "prepayDays", type: "text", label: "선납일수" },
        { name: "principalDeferStdAmt", type: "text", label: "원금유예기준금액" },

        { name: "overdueCalcMethodPre", type: "select", label: "만기전연체계산방법구분코드", options: [], colSpan: 2 },
        { name: "overdueCalcMethodPost", type: "select", label: "만기후연체계산방법구분코드", options: [], colSpan: 2 },

        { name: "termBenefitLossDate", type: "date", label: "기한이익상실일" },
        { name: "forcedTermBenefitLossDate", type: "date", label: "강제기한이익상실일자" },
        { name: "overdueCalcDate", type: "date", label: "연체계산일자" },
        { name: "virtualAccountNo", type: "text", label: "가상계좌번호" },

        { name: "txSerialNo", type: "text", label: "거래일련번호" },
        { name: "ledgerChangeSerialNo", type: "text", label: "원장변경일련번호" },
        { name: "termBenefitLossNo", type: "text", label: "기한이익일련번호" },
        { name: "midRepayFeeTarget", type: "text", label: "중도상환수수료대상여부" },

        { name: "completionReason", type: "select", label: "완제사유", options: [] },
        { name: "offsetDate", type: "date", label: "상계일자" },
        { name: "offsetYn", type: "text", label: "상계여부" },
        { name: "mciAccountYn", type: "text", label: "MCI계좌여부" },

        { name: "changeDate", type: "date", label: "변경일자" },
        { name: "changeTime", type: "text", label: "변경시각" },
        { name: "noPassbookCount", type: "text", label: "무통장건수" },
        { name: "noPassbookAmt", type: "text", label: "무통장처리금액" },
      ],
    },
  ];

  // 3. General Loan Section
  const generalLoanLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { name: "repayDeferClass", type: "select", label: "개대유예구분", options: [] },
        { name: "maxRepayDays", type: "text", label: "최대보장가능일수" },
        { name: "dueDateCorrection", type: "text", label: "응당일보정사용일" },
        { name: "maturityCorrection", type: "text", label: "만기일자보정여부" },

        { name: "interestReduceDays", type: "text", label: "이자감면일수" },
        { name: "gracePeriodEnd", type: "date", label: "거치기간종료일자" },
        { name: "repayUnit", type: "text", label: "상환금액단위" },
        { name: "spacer2", type: "spacer" },

        { name: "maturityRepay", type: "text", label: "만기일시상환" },
        { name: "installmentAmountPer", type: "text", label: "매회분할상환" },
        { name: "lastInstallment", type: "text", label: "최종분할상환" },
        { name: "splitPrincipal", type: "text", label: "분할원금선납" },

        { name: "passbookMonth", type: "text", label: "통장이월수" },
        { name: "passbookPage", type: "text", label: "통장페이지수" },
        { name: "passbookLine", type: "text", label: "통장라인수" },
        { name: "spacer3", type: "spacer" },
      ],
    },
  ];

  // 4. Comprehensive Passbook Loan Section
  const comprehensiveLoanLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { name: "todayStartBalance", type: "text", label: "금일개시잔액" },
        { name: "todayMaxBalance", type: "text", label: "금일최고잔액" },
        { name: "todayCloseBalance", type: "text", label: "금일마감잔액" },
        { name: "lastInterestDate", type: "date", label: "최종이자원가일자" },

        { name: "rotatePeriodMonth", type: "text", label: "회전기간월수" },
        { name: "autoExtendStop", type: "text", label: "자동연장중지여부" },
        { name: "interestAdd", type: "text", label: "이자원가중지여부" },
        { name: "termExtendCount", type: "text", label: "기한연장건수" },
      ],
    },
  ];

  // 5. Discount Bill Section
  const discountBillLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { name: "billAccount", type: "text", label: "계좌번호" },
        { name: "billNewDate", type: "date", label: "어음신규일자" },
        { name: "billCancelDate", type: "date", label: "이음해지일자" },
        { name: "payBank", type: "select", label: "지급은행", options: [] },

        { name: "keepBank", type: "select", label: "보관은행", options: [] },
        { name: "payBankBranch", type: "text", label: "지급은행점포" },
        { name: "issuerNameInput", type: "text", label: "발행인명", colSpan: 2 }, // Merged? No, standard grid.
      ],
    },
  ];

  // 6. Foreign Currency Bond Section
  const foreignBondLayout: FilterLayout = [
    {
      type: "grid",
      columns: 4,
      filters: [
        { name: "bondMgmtNo", type: "text", label: "채권관리번호" },
        { name: "approvalMgmtNo", type: "text", label: "상신결재관리번호" },
        { name: "issueNo", type: "text", label: "발행번호" },
        { name: "contractDate", type: "date", label: "계약일자" },

        { name: "bondAmount", type: "text", label: "채권금액" },
        { name: "issueDate", type: "date", label: "발행일자" },
        { name: "maturityDate2", type: "date", label: "만기일자" },
        { name: "loanPossibleDate", type: "date", label: "대출가능일자" },

        { name: "buyerCode", type: "text", label: "구매업체고객" },
        { name: "buyerName", type: "text", label: "구매업체명" },
        { name: "buyerBizNo", type: "text", label: "구매업체사업자번호", colSpan: 2 },

        { name: "invoiceDate", type: "date", label: "계산서발행일자" },
        { name: "itemName", type: "text", label: "매매체결물품명", colSpan: 3 },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">여신원장</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* Search */}
        <div>
            <h3 className="font-semibold mb-2">검색</h3>
            <FilterContainer filterLayout={searchLayout} values={filters} onChange={handleFilterChange} />
        </div>

        {/* Account Info */}
        <div>
            <h3 className="font-semibold mb-2">계좌정보</h3>
            <FilterContainer filterLayout={accountInfoLayout} values={filters} onChange={handleFilterChange} />
        </div>

        {/* General Loan */}
        <div>
            <h3 className="font-semibold mb-2">일반대출(할인어음, 외상채권, 기타채권 제외)</h3>
            <FilterContainer filterLayout={generalLoanLayout} values={filters} onChange={handleFilterChange} />
        </div>

        {/* Comprehensive Loan */}
        <div>
            <h3 className="font-semibold mb-2">종합통장대출</h3>
            <FilterContainer filterLayout={comprehensiveLoanLayout} values={filters} onChange={handleFilterChange} />
        </div>

        {/* Discount Bill */}
        <div>
            <h3 className="font-semibold mb-2">할인어음</h3>
            <div className="flex flex-col gap-2">
                <FilterContainer filterLayout={discountBillLayout} values={filters} onChange={handleFilterChange} />
                <DataTable columns={billColumns} data={mockBillData} hidePagination hideToolbar />
            </div>
        </div>

        {/* Foreign Bond */}
        <div>
            <h3 className="font-semibold mb-2">외상채권</h3>
            <FilterContainer filterLayout={foreignBondLayout} values={filters} onChange={handleFilterChange} />
        </div>
      </div>
    </div>
  );
}

export default function CreditLedgerPopupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreditLedgerPopupContent />
        </Suspense>
    )
}

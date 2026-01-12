

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import { FilterContainer } from '@/components/filters/FilterContainer';
import type { FilterLayout } from '@/components/filters/FilterContainer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";

const creditRecoveryFilterLayout: FilterLayout = [
  [
    { name: "debtorName", type: "text",   label: "채무자명" },
    { name: "residentRegistrationNumber", type: "text",   label: "주민등록번호" },
    { name: "customerNumber", type: "search", label: "고객번호" }
  ],
  [
    { name: "accountNumber", type: "text",   label: "계좌번호" },
    { name: "applicantName", type: "search", label: "신청자명" },
    { name: "loanBalance", type: "number", label: "대출잔액" }
  ],
  [
    { name: "applicantStatus", type: "select", label: "신청인진행상태", options: [] },
    { name: "accountStatusDetails", type: "text",   label: "계좌진행상태내용", width: "long" },
    { name: "applicationType", type: "text",   label: "신청구분" }
  ],
  [
    { name: "receiptNoticeDate", type: "date",   label: "접수통지일자" },
    { name: "confirmationDate", type: "date",   label: "확정일" },
    { name: "invalidationDate", type: "date",   label: "실효/완제/합의서포기일" }
  ],
  [
    { name: "adjustedInterestRate", type: "number", label: "조정후이율" },
    { name: "adjustedPrincipal", type: "number", label: "조정후원금" },
    { name: "adjustedInterest", type: "number", label: "조정후이자" }
  ],
  [
    { name: "adjustedOverdueInterest", type: "number", label: "조정후연체이자" },
    { name: "adjustedCosts", type: "number", label: "조정후비용" },
    { name: "adjustedTotal", type: "number", label: "조정후합계" }
  ],
  [
    { name: "principalReduction", type: "select", label: "원금감면여부", options: [] },
    { name: "totalRepaymentPeriod", type: "number", label: "총상환기간" },
    { name: "paymentInstallment", type: "number", label: "납입회차" }
  ],
  [
    { name: "overduePeriod", type: "number", label: "연체기간" },
    { name: "reductionMethod", type: "text",   label: "감면방식" }
  ]
];

export default function CreditRecoveryPage() {
  const tabId = usePathname();
  const { currentState, updateFilters } = usePageStore();

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      updateFilters(tabId, { [name]: value });
    },
    [tabId, updateFilters]
  );

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Title and Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">신용회복관리</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>채권관리</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>신용회복관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Row 2: Filters */}
      <FilterContainer 
        filterLayout={creditRecoveryFilterLayout} 
        values={currentState.filters}
        onChange={handleFilterChange}
      />

      {/* TODO: Add Action Buttons and Data Table */}
    </div>
  );
}

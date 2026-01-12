

import { useState, useCallback } from "react";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer, FilterLayout } from "@/components/filters/FilterContainer";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// --- Helper Component ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col gap-2">
        <h3 className="font-semibold">{title}</h3>
        {children}
    </div>
);


// 1. 열람대상자정보
const targetInfoLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "custNm", type: "text", label: "성명", readonly: true },
        { name: "rbrNo", type: "text", label: "주민등록표-발급", readonly: true },
        { name: "addr", type: "text", label: "도로명주소-현재", readonly: true },
    ]}
];

// 2. 세대주정보
const householderInfoLayout: FilterLayout = [
    { type: "grid", columns: 2, filters: [
        { name: "changeDt", type: "date", label: "변동일", readonly: true },
        { name: "changeRsn", type: "text", label: "변동사유", readonly: true },
    ]}
];

// 3. 세대원정보
type HouseholdMember = { hshrRtn: string; changeDt: string; changeRsn: string; };
const householdMemberColumns: ColumnDef<HouseholdMember>[] = [
    { accessorKey: "hshrRtn", header: "세대주 관계" },
    { accessorKey: "changeDt", header: "변동일" },
    { accessorKey: "changeRsn", header: "변동사유" },
];
const householdMemberMockData: HouseholdMember[] = [
    { hshrRtn: '배우자', changeDt: '2022-01-01', changeRsn: '전입' }
];


// 4. 주민번호정정이력
type RrnHistory = { crrctBfBrn: string; crrctAfBrn: string; rrnCrrctDt: string; rrnCrrctRsn: string; };
const rrnHistoryColumns: ColumnDef<RrnHistory>[] = [
    { accessorKey: "crrctBfBrn", header: "정정이전주민번호" },
    { accessorKey: "crrctAfBrn", header: "정정이후주민번호" },
    { accessorKey: "rrnCrrctDt", header: "주민번호정정일자" },
    { accessorKey: "rrnCrrctRsn", header: "주민번호정정사유" },
];
const rrnHistoryMockData: RrnHistory[] = []; // empty for now

// 5. 성명정정이력
type NameHistory = { crrctBfBrn: string; crrctAfBrn: string; custNmCrrctDt: string; custNmCrrctRsn: string; };
const nameHistoryColumns: ColumnDef<NameHistory>[] = [
    { accessorKey: "crrctBfBrn", header: "정정이전주민번호" },
    { accessorKey: "crrctAfBrn", header: "정정이후주민번호" },
    { accessorKey: "custNmCrrctDt", header: "성명정정일자" },
    { accessorKey: "custNmCrrctRsn", header: "성명정정사유" },
];
const nameHistoryMockData: NameHistory[] = []; // empty for now

// 6. 주소이력
type AddressHistory = { trnsfcDt: string; Dd1: string; Dd2: string; addr: string; addrHist: string; };
const addressHistoryColumns: ColumnDef<AddressHistory>[] = [
    { accessorKey: "trnsfcDt", header: "전입일" },
    { accessorKey: "Dd1", header: "변동일" },
    { accessorKey: "Dd2", header: "변동사유" },
    { accessorKey: "addr", header: "주소" },
    { accessorKey: "addrHist", header: "도로명주소-이력" },
];
const addressHistoryMockData: AddressHistory[] = []; // empty for now

// 7. 건강보험공단 내역
const healthInsuranceLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "pyerNo", type: "text", label: "납부자번호", readonly: true },
        { name: "isuNo", type: "text", label: "발급번호", readonly: true },
        { name: "sbscrDv", type: "text", label: "가입자구분", readonly: true },
        { name: "lseDd", type: "date", label: "자격상실일", readonly: true },
        { name: "qlfAcqDd", type: "date", label: "자격취득일", readonly: true },
    ]}
];

// 8. 건강보험 고지 및 납부확인
type HealthInsurancePayment = { pymtMntly: string; ancAmtHlth: number; ancAmtLntr: number; pymAmHlth: number; pymAmtLntr: number; incmMmHlth: number; incmMmLntr: number; applcRt: string; salry: number; };
const healthInsurancePaymentColumns: ColumnDef<HealthInsurancePayment>[] = [
    { accessorKey: "pymtMntly", header: "납부월별" },
    { header: "고지금액", columns: [
        { accessorKey: "ancAmtHlth", header: "건강" },
        { accessorKey: "ancAmtLntr", header: "장기요양" },
    ]},
    { header: "납부금액", columns: [
        { accessorKey: "pymAmHlth", header: "건강" },
        { accessorKey: "pymAmtLntr", header: "장기요양" },
    ]},
    { header: "고지금액(소득월액)", columns: [
        { accessorKey: "incmMmHlth", header: "건강" },
        { accessorKey: "incmMmLntr", header: "장기요양" },
    ]},
    { accessorKey: "applcRt", header: "적용율" },
    { accessorKey: "salry", header: "급여" },
];
const healthInsurancePaymentMockData: HealthInsurancePayment[] = [
    { pymtMntly: '2024-01', ancAmtHlth: 100000, ancAmtLntr: 10000, pymAmHlth: 100000, pymAmtLntr: 10000, incmMmHlth: 0, incmMmLntr: 0, applcRt: '7.09%', salry: 3000000 }
];
const healthInsurancePaymentFooterLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "pymtTot", type: "number", label: "납부총액", readonly: true },
        { name: "usePurpose", type: "text", label: "용도구분", readonly: true },
        { name: "confirmPurpose", type: "text", label: "납부확인용", readonly: true },
    ]}
];


// 9. 건강보험 자격득실 확인 (Mixed)
const qualificationRequesterLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "custNm04", type: "text", label: "성명", readonly: true },
        { name: "rsrNo", type: "text", label: "주민등록번호", readonly: true },
        { name: "isuNo04", type: "text", label: "발급번호", readonly: true },
    ]}
];
type QualificationHistory = { curRow: number; sbscrDv04: string; bzplNm: string; qlfAcqDd04: string; lseDd04: string; };
const qualificationHistoryColumns: ColumnDef<QualificationHistory>[] = [
    { accessorKey: "curRow", header: "No" },
    { accessorKey: "sbscrDv04", header: "가입자구분" },
    { accessorKey: "bzplNm", header: "사업장명칭" },
    { accessorKey: "qlfAcqDd04", header: "자격취득일" },
    { accessorKey: "lseDd04", header: "자격상실일" },
];
const qualificationHistoryMockData: QualificationHistory[] = [
    { curRow: 1, sbscrDv04: '직장가입자', bzplNm: '지니시스템', qlfAcqDd04: '2020-01-01', lseDd04: '-' }
];

// 10. 수기계산
const manualCalculationLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "analIncmAmt", type: "number", label: "건강보험 총납부금액", readonly: true },
        { name: "incmApplcM", type: "text", label: "건강보험 납부개월", readonly: true },
        { name: "applcAmt", type: "number", label: "평균 납부금액", readonly: true },
    ]}
];

// 11. 지방세 세목별 과세증명서 내역 (Mixed)
const localTaxInfoLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "custNm3", type: "text", label: "납세자성명", readonly: true },
        { name: "rbno3", type: "text", label: "주민등록번호", readonly: true },
        { name: "yyyyStr", type: "text", label: "대상년도시작", readonly: true },
        { name: "yyyyEnd", type: "text", label: "대상년도종료", readonly: true },
        { name: "ordCd", type: "text", label: "기관코드", readonly: true },
        { name: "ordNm", type: "text", label: "기관명", readonly: true },
        { name: "reqNo3", type: "text", label: "발급번호", readonly: true },
        { name: "reqDt3", type: "date", label: "발급일자", readonly: true },
        { name: "taxOff3", type: "text", label: "발급기관장", readonly: true },
    ]}
];
type TaxableItem = { taxEtty: string; taxation: string; year: string; gb: string; taxNo: string; tax: number; sttsIndc: string; adt: number; };
const taxableItemColumns: ColumnDef<TaxableItem>[] = [
    { accessorKey: "taxEtty", header: "과세물건지" },
    { accessorKey: "taxation", header: "세목" },
    { accessorKey: "year", header: "부과년도" },
    { accessorKey: "gb", header: "부과유형(기본)" },
    { accessorKey: "taxNo", header: "과세번호" },
    { accessorKey: "tax", header: "세액" },
    { accessorKey: "sttsIndc", header: "상태표시" },
    { accessorKey: "adt", header: "가산액" },
];
const taxableItemMockData: TaxableItem[] = []; // empty for now

// 12. 소득금액증명원 내역
const incomeProofLayout: FilterLayout = [
    { type: "grid", columns: 3, filters: [
        { name: "rceptNo", type: "text", label: "민원접수번호", readonly: true },
        { name: "rceptDt", type: "text", label: "민원접수일시", readonly: true },
        { name: "rcept", type: "text", label: "민원접수청서", readonly: true },
        { name: "txtnStrM", type: "text", label: "과세기간시작년월", readonly: true },
        { name: "txtnEndM", type: "text", label: "과세기간종료년월", readonly: true },
        { name: "reqNo", type: "text", label: "발급번호", readonly: true },
        { name: "reqDt", type: "date", label: "발급일자", readonly: true },
        { name: "taxOff", type: "text", label: "발급세무서명", readonly: true },
        { name: "custNm2", type: "text", label: "민원인성명", readonly: true },
        { name: "rbno", type: "text", label: "주민등록번호", readonly: true },
        { name: "rbnmAdr", type: "text", label: "도로명주소", readonly: true },
        { name: "lglAdr", type: "text", label: "법정동주소", readonly: true },
    ]}
];

// 13. 종합소득세신고(결정*경정)현황
type ComprehensiveIncomeTax = { pytAmt: string; aclPytAmt: string; prcsDt: number; curRow: number; acntNo: number; rqsCustNo: number; rqsCustNm: number; acntSttsCd: number; prdctNm: number; nwDt: number; expDt: number; };
const comprehensiveIncomeTaxColumns: ColumnDef<ComprehensiveIncomeTax>[] = [
    { accessorKey: "pytAmt", header: "년도" },
    { accessorKey: "aclPytAmt", header: "구분" },
    { header: "종합과세", columns: [
        { accessorKey: "prcsDt", header: "이자" },
        { accessorKey: "curRow", header: "배당" },
        { accessorKey: "acntNo", header: "사업" },
        { accessorKey: "rqsCustNo", header: "근로" },
        { accessorKey: "rqsCustNm", header: "연금" },
        { accessorKey: "acntSttsCd", header: "기타" },
        { accessorKey: "prdctNm", header: "합계" },
    ]},
    { accessorKey: "nwDt", header: "분리과세" },
    { accessorKey: "expDt", header: "총결정세액" },
];
const comprehensiveIncomeTaxMockData: ComprehensiveIncomeTax[] = [];

// 14. 연말정산(지급명세서)현황
type YearEndSettlement = { year: string; sort: string; bsbsNm: string; bno: string; incmAmt: number; toatalAmt: number; totalTaxAmt: number; remark: string; };
const yearEndSettlementColumns: ColumnDef<YearEndSettlement>[] = [
    { accessorKey: "year", header: "년도" },
    { accessorKey: "sort", header: "구분" },
    { header: "소득발생처", columns: [
        { accessorKey: "bsbsNm", header: "법인명(상호명)" },
        { accessorKey: "bno", header: "사업자등록번호" },
    ]},
    { accessorKey: "incmAmt", header: "지급받은총액" },
    { accessorKey: "toatalAmt", header: "소득금액" },
    { accessorKey: "totalTaxAmt", header: "총결정세액" },
    { accessorKey: "remark", header: "비고" },
];
const yearEndSettlementMockData: YearEndSettlement[] = [];


// --- Main Popup Component ---
export default function AbstractAndPaymentPopup() {
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const handleFilterChange = (name: string, value: any) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };
  
    const popupActions: PopupAction[] = [
        { id: "close", text: "닫기", onClick: () => window.close() },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-sm">
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <h1 className="text-xl font-bold">초본 및 납부내역</h1>
                <PopupRightActions actions={popupActions} />
            </div>

            <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
                <Section title="열람대상자정보">
                    <FilterContainer filterLayout={targetInfoLayout} values={formValues} onChange={handleFilterChange} />
                </Section>

                <Section title="세대주정보">
                    <FilterContainer filterLayout={householderInfoLayout} values={formValues} onChange={handleFilterChange} />
                </Section>
                
                <DataTable title="세대원정보" columns={householdMemberColumns} data={householdMemberMockData} />

                <DataTable title="주민번호정정이력" columns={rrnHistoryColumns} data={rrnHistoryMockData} />
                
                <DataTable title="성명정정이력" columns={nameHistoryColumns} data={nameHistoryMockData} />
                
                <DataTable title="주소이력" columns={addressHistoryColumns} data={addressHistoryMockData} />

                <Section title="건강보험공단 내역">
                    <FilterContainer filterLayout={healthInsuranceLayout} values={formValues} onChange={handleFilterChange} />
                </Section>

                <div className="flex flex-col gap-4">
                    <DataTable title="건강보험 고지 및 납부확인" columns={healthInsurancePaymentColumns} data={healthInsurancePaymentMockData} />
                    <FilterContainer filterLayout={healthInsurancePaymentFooterLayout} values={formValues} onChange={handleFilterChange} />
                </div>
                
                <Section title="건강보험 자격득실 확인">
                    <FilterContainer filterLayout={qualificationRequesterLayout} values={formValues} onChange={handleFilterChange} />
                    <div className="pt-2">
                      <DataTable title="확인청구자" columns={qualificationHistoryColumns} data={qualificationHistoryMockData} />
                    </div>
                </Section>

                <Section title="수기계산">
                    <FilterContainer filterLayout={manualCalculationLayout} values={formValues} onChange={handleFilterChange} />
                </Section>
                
                <Section title="지방세 세목별 과세증명서 내역">
                    <FilterContainer filterLayout={localTaxInfoLayout} values={formValues} onChange={handleFilterChange} />
                    <div className="pt-2">
                      <DataTable title="과세대상" columns={taxableItemColumns} data={taxableItemMockData} />
                    </div>
                </Section>
                
                <Section title="소득금액증명원 내역">
                    <FilterContainer filterLayout={incomeProofLayout} values={formValues} onChange={handleFilterChange} />
                </Section>

                <DataTable title="종합소득세신고(결정*경정)현황" columns={comprehensiveIncomeTaxColumns} data={comprehensiveIncomeTaxMockData} />
                
                <DataTable title="연말정산(지급명세서)현황" columns={yearEndSettlementColumns} data={yearEndSettlementMockData} />

            </div>
        </div>
    );
}

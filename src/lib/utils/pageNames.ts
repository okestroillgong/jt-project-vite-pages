/**
 * 페이지 경로와 한글 이름 매핑
 * Sidebar.tsx의 메뉴 항목과 동기화 유지 필요
 */

// 상담관리 > 일반상담
const counselingPages: Record<string, string> = {
  "/counseling/general-counseling/bond-counseling": "채권상담",
  "/counseling/general-counseling/manager-change-history": "담당자변경이력",
  "/counseling/general-counseling/cms-due-date": "CMS응당일조회",
  "/counseling/general-counseling/sale-write-off-list": "매각/상각 리스트",
  "/counseling/general-counseling/pds-management": "PDS관리",
};

// 여신사후 > 채권조정
const bondAdjustmentPages: Record<string, string> = {
  "/after-loan/bond-adjustment/bond-inquiry": "채권조회",
  "/after-loan/bond-adjustment/credit-recovery": "신용회복관리",
  "/after-loan/bond-adjustment/personal-rehabilitation": "개인회생관리",
  "/after-loan/bond-adjustment/bankruptcy-exemption": "파산면책관리",
  "/after-loan/bond-adjustment/debt-adjustment-management": "채무조정관리",
};

// 여신사후 > 채권관리
const bondManagementPages: Record<string, string> = {
  "/after-loan/bond-management/credit-recovery": "신용회복관리",
};

// 여신사후 > 법적조치
const legalActionPages: Record<string, string> = {
  "/after-loan/legal-action/legal-info-sync": "법무정보 동기화",
  "/after-loan/legal-action/inquiry-legal-proceedings": "법무진행 조회",
  "/after-loan/legal-action/legal-management": "법무관리",
  "/after-loan/legal-action/excel-upload": "통합엑셀업로드",
};

// 여신사후 > 자산건전성/대손상각
const assetSoundnessPages: Record<string, string> = {
  "/after-loan/asset-soundness-bad-debt/soundness-foundation-data-generation": "건전성 기초자료 생성",
  "/after-loan/asset-soundness-bad-debt/soundness-data-generation": "건전성 자료 생성",
  "/after-loan/asset-soundness-bad-debt/asset-soundness-verification": "자산건전성 검증",
  "/after-loan/asset-soundness-bad-debt/bad-debt-management": "대손상각대상 관리",
  "/after-loan/asset-soundness-bad-debt/write-off-target": "대손상각대상 조회",
  "/after-loan/asset-soundness-bad-debt/write-off-application-specifications": "대손신청채권명세",
  "/after-loan/asset-soundness-bad-debt/business-area-address-management": "영업구역 주소관리",
};

// 여신사후 > 특수채권
const specialBondPages: Record<string, string> = {
  "/after-loan/special-bond/subscription-inquiry": "특수채권 편입조회",
  "/after-loan/special-bond/management-ledger": "특수채권 관리대장",
  "/after-loan/special-bond/manager-management": "특수채권 담당자관리",
  "/after-loan/special-bond/manager-inquiry": "특수채권 담당자조회",
};

// 여신사후 > 기타
const otherAfterLoanPages: Record<string, string> = {
  "/after-loan/collective-registration-of-bonds-for-sale": "매각채권일괄등록",
  "/after-loan/credit-rating-excel-upload": "채권관리등급 엑셀 업로드",
};

// 전체 페이지 이름 매핑
export const PAGE_NAMES: Record<string, string> = {
  ...counselingPages,
  ...bondAdjustmentPages,
  ...bondManagementPages,
  ...legalActionPages,
  ...assetSoundnessPages,
  ...specialBondPages,
  ...otherAfterLoanPages,
};

/**
 * 경로로부터 한글 페이지 이름을 가져옵니다.
 * @param path - 페이지 경로 (예: "/counseling/general-counseling/bond-counseling")
 * @returns 한글 페이지 이름 또는 undefined
 */
export function getPageName(path: string): string | undefined {
  return PAGE_NAMES[path];
}

/**
 * 경로로부터 한글 페이지 이름을 가져오고, 없으면 fallback을 반환합니다.
 * @param path - 페이지 경로
 * @param fallback - 매핑이 없을 때 사용할 기본값
 * @returns 한글 페이지 이름 또는 fallback
 */
export function getPageNameOrFallback(path: string, fallback?: string): string {
  return PAGE_NAMES[path] || fallback || path.split("/").pop() || "페이지";
}

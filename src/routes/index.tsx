import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import PopupLayout from '@/layouts/PopupLayout';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';

// Lazy load wrapper
const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const LazyComponent = lazy(importFn);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};

// Login page
const LoginPage = () => lazyLoad(() => import('@/pages/login/page'));

// Dashboard pages
const DashboardPage = () => lazyLoad(() => import('@/pages/dashboard/page'));
const CounselingPage = () => lazyLoad(() => import('@/pages/dashboard/counseling/page'));
const CreditInfoPage = () => lazyLoad(() => import('@/pages/dashboard/credit-info/page'));
const ReportsPage = () => lazyLoad(() => import('@/pages/dashboard/reports/page'));
const UnderConstructionPage = () => lazyLoad(() => import('@/pages/dashboard/under-construction/page'));

// Counseling > General Counseling
const BondCounselingPage = () => lazyLoad(() => import('@/pages/dashboard/counseling/general-counseling/bond-counseling/page'));
const ManagerChangeHistoryPage = () => lazyLoad(() => import('@/pages/dashboard/counseling/general-counseling/manager-change-history/page'));
const CMSDueDatePage = () => lazyLoad(() => import('@/pages/dashboard/counseling/general-counseling/cms-due-date/page'));
const SaleWriteOffListPage = () => lazyLoad(() => import('@/pages/dashboard/counseling/general-counseling/sale-write-off-list/page'));
const PDSManagementPage = () => lazyLoad(() => import('@/pages/dashboard/counseling/general-counseling/pds-management/page'));

// After Loan > Bond Adjustment
const BondInquiryPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/bond-adjustment/bond-inquiry/page'));
const CreditRecoveryAdjustmentPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/bond-adjustment/credit-recovery/page'));
const PersonalRehabilitationPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/bond-adjustment/personal-rehabilitation/page'));
const BankruptcyExemptionPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/bond-adjustment/bankruptcy-exemption/page'));
const DebtAdjustmentManagementPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/bond-adjustment/debt-adjustment-management/page'));

// After Loan > Bond Management
const CreditRecoveryManagementPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/bond-management/credit-recovery/page'));

// After Loan > Legal Action
const LegalInfoSyncPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/legal-action/legal-info-sync/page'));
const InquiryLegalProceedingsPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/legal-action/inquiry-legal-proceedings/page'));
const LegalManagementPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/legal-action/legal-management/page'));
const LegalExcelUploadPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/legal-action/excel-upload/page'));

// After Loan > Asset Soundness
const SoundnessFoundationDataGenPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/soundness-foundation-data-generation/page'));
const SoundnessDataGenPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/soundness-data-generation/page'));
const AssetSoundnessVerificationPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/asset-soundness-verification/page'));
const BadDebtManagementPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/bad-debt-management/page'));
const WriteOffTargetPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/write-off-target/page'));
const WriteOffAppSpecsPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/write-off-application-specifications/page'));
const BusinessAreaAddressPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/asset-soundness-bad-debt/business-area-address-management/page'));

// After Loan > Special Bond
const SubscriptionInquiryPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/special-bond/subscription-inquiry/page'));
const ManagementLedgerPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/special-bond/management-ledger/page'));
const ManagerManagementPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/special-bond/manager-management/page'));
const ManagerInquiryPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/special-bond/manager-inquiry/page'));

// After Loan > Others
const CollectiveRegistrationPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/collective-registration-of-bonds-for-sale/page'));
const CreditRatingExcelUploadPage = () => lazyLoad(() => import('@/pages/dashboard/after-loan/credit-rating-excel-upload/page'));

// Popup pages
const CustomerSearchPopup = () => lazyLoad(() => import('@/pages/popup/customer-search/page'));
const UserSearchPopup = () => lazyLoad(() => import('@/pages/popup/user-search/page'));
const DebtAdjustmentManagementPopup = () => lazyLoad(() => import('@/pages/popup/debt-adjustment-management/page'));
const DocumentScanPopup = () => lazyLoad(() => import('@/pages/popup/document-scan/page'));
const MultiSelectPopup = () => lazyLoad(() => import('@/pages/popup/multi-select/page'));
const AssetSoundnessProgressPopup = () => lazyLoad(() => import('@/pages/popup/asset-soundness-progress/page'));
const SoundnessAuditOpinionPopup = () => lazyLoad(() => import('@/pages/popup/soundness-audit-opinion/page'));
const AbstractAndPaymentPopup = () => lazyLoad(() => import('@/pages/popup/abstract-and-payment/page'));
const AddressVerificationPopup = () => lazyLoad(() => import('@/pages/popup/address-verification/page'));
const BondLegalProgressPopup = () => lazyLoad(() => import('@/pages/popup/bond-legal-progress/page'));
const BranchManagementPopup = () => lazyLoad(() => import('@/pages/popup/branch-management/page'));
const CaseInquiryPopup = () => lazyLoad(() => import('@/pages/popup/case-inquiry/page'));
const CorrectionHistoryPopup = () => lazyLoad(() => import('@/pages/popup/correction-history/page'));
const CreditLedgerPopup = () => lazyLoad(() => import('@/pages/popup/credit-ledger/page'));
const CustomerManagementCodePopup = () => lazyLoad(() => import('@/pages/popup/customer-management-code/page'));
const DebtAdjustmentESignaturePopup = () => lazyLoad(() => import('@/pages/popup/debt-adjustment-e-signature/page'));
const DebtCollectionRestrictionPopup = () => lazyLoad(() => import('@/pages/popup/debt-collection-restriction/page'));
const DocumentSearchPopup = () => lazyLoad(() => import('@/pages/popup/document-search/page'));
const EarlyWarningPopup = () => lazyLoad(() => import('@/pages/popup/early-warning/page'));
const ExcelDownloadPopup = () => lazyLoad(() => import('@/pages/popup/excel-download/page'));
const IssuanceHistoryPopup = () => lazyLoad(() => import('@/pages/popup/issuance-history/page'));
const MessageTypePopup = () => lazyLoad(() => import('@/pages/popup/message-type/page'));
const ModificationHistoryPopup = () => lazyLoad(() => import('@/pages/popup/modification-history/page'));
const MultiExcelDownloadPopup = () => lazyLoad(() => import('@/pages/popup/multi-excel-download/page'));
const RealEstateAuctionPopup = () => lazyLoad(() => import('@/pages/popup/real-estate-auction/page'));
const SendDMPopup = () => lazyLoad(() => import('@/pages/popup/send-dm/page'));
const SendSMSPopup = () => lazyLoad(() => import('@/pages/popup/send-sms/page'));
const SpecificInfoInquiryPopup = () => lazyLoad(() => import('@/pages/popup/specific-info-inquiry/page'));
const TransactionHistoryPopup = () => lazyLoad(() => import('@/pages/popup/transaction-history/page'));
const UnprocessedAmountProcessingPopup = () => lazyLoad(() => import('@/pages/popup/unprocessed-amount-processing/page'));
const Form7Popup = () => lazyLoad(() => import('@/pages/popup/form-7/page'));
const LoanConditionsPopup = () => lazyLoad(() => import('@/pages/popup/loan-conditions/page'));
const CreditRepaymentPopup = () => lazyLoad(() => import('@/pages/popup/credit-repayment/page'));
const VisitRegistrationPopup = () => lazyLoad(() => import('@/pages/popup/visit-registration/page'));
const CounselingRegistrationPopup = () => lazyLoad(() => import('@/pages/popup/counseling-registration/page'));
const FavoritesManagementPopup = () => lazyLoad(() => import('@/pages/popup/favorites-management/page'));

export const router = createBrowserRouter([
  // Login page (standalone, no layout)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Redirect root to login
      { index: true, element: <Navigate to="/login" replace /> },
      // Dashboard routes with DashboardLayout
      {
        element: <DashboardLayout />,
        children: [
          { path: 'counseling', element: <CounselingPage /> },
          { path: 'credit-info', element: <CreditInfoPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'under-construction', element: <UnderConstructionPage /> },

          // Counseling > General Counseling
          { path: 'counseling/general-counseling/bond-counseling', element: <BondCounselingPage /> },
          { path: 'counseling/general-counseling/manager-change-history', element: <ManagerChangeHistoryPage /> },
          { path: 'counseling/general-counseling/cms-due-date', element: <CMSDueDatePage /> },
          { path: 'counseling/general-counseling/sale-write-off-list', element: <SaleWriteOffListPage /> },
          { path: 'counseling/general-counseling/pds-management', element: <PDSManagementPage /> },

          // After Loan > Bond Adjustment
          { path: 'after-loan/bond-adjustment/bond-inquiry', element: <BondInquiryPage /> },
          { path: 'after-loan/bond-adjustment/credit-recovery', element: <CreditRecoveryAdjustmentPage /> },
          { path: 'after-loan/bond-adjustment/personal-rehabilitation', element: <PersonalRehabilitationPage /> },
          { path: 'after-loan/bond-adjustment/bankruptcy-exemption', element: <BankruptcyExemptionPage /> },
          { path: 'after-loan/bond-adjustment/debt-adjustment-management', element: <DebtAdjustmentManagementPage /> },

          // After Loan > Bond Management
          { path: 'after-loan/bond-management/credit-recovery', element: <CreditRecoveryManagementPage /> },

          // After Loan > Legal Action
          { path: 'after-loan/legal-action/legal-info-sync', element: <LegalInfoSyncPage /> },
          { path: 'after-loan/legal-action/inquiry-legal-proceedings', element: <InquiryLegalProceedingsPage /> },
          { path: 'after-loan/legal-action/legal-management', element: <LegalManagementPage /> },
          { path: 'after-loan/legal-action/excel-upload', element: <LegalExcelUploadPage /> },

          // After Loan > Asset Soundness
          { path: 'after-loan/asset-soundness-bad-debt/soundness-foundation-data-generation', element: <SoundnessFoundationDataGenPage /> },
          { path: 'after-loan/asset-soundness-bad-debt/soundness-data-generation', element: <SoundnessDataGenPage /> },
          { path: 'after-loan/asset-soundness-bad-debt/asset-soundness-verification', element: <AssetSoundnessVerificationPage /> },
          { path: 'after-loan/asset-soundness-bad-debt/bad-debt-management', element: <BadDebtManagementPage /> },
          { path: 'after-loan/asset-soundness-bad-debt/write-off-target', element: <WriteOffTargetPage /> },
          { path: 'after-loan/asset-soundness-bad-debt/write-off-application-specifications', element: <WriteOffAppSpecsPage /> },
          { path: 'after-loan/asset-soundness-bad-debt/business-area-address-management', element: <BusinessAreaAddressPage /> },

          // After Loan > Special Bond
          { path: 'after-loan/special-bond/subscription-inquiry', element: <SubscriptionInquiryPage /> },
          { path: 'after-loan/special-bond/management-ledger', element: <ManagementLedgerPage /> },
          { path: 'after-loan/special-bond/manager-management', element: <ManagerManagementPage /> },
          { path: 'after-loan/special-bond/manager-inquiry', element: <ManagerInquiryPage /> },

          // After Loan > Others
          { path: 'after-loan/collective-registration-of-bonds-for-sale', element: <CollectiveRegistrationPage /> },
          { path: 'after-loan/credit-rating-excel-upload', element: <CreditRatingExcelUploadPage /> },
        ],
      },
      // Popup routes with PopupLayout
      {
        path: 'popup',
        element: <PopupLayout />,
        children: [
          { path: 'customer-search', element: <CustomerSearchPopup /> },
          { path: 'user-search', element: <UserSearchPopup /> },
          { path: 'debt-adjustment-management', element: <DebtAdjustmentManagementPopup /> },
          { path: 'document-scan', element: <DocumentScanPopup /> },
          { path: 'multi-select', element: <MultiSelectPopup /> },
          { path: 'asset-soundness-progress', element: <AssetSoundnessProgressPopup /> },
          { path: 'soundness-audit-opinion', element: <SoundnessAuditOpinionPopup /> },
          { path: 'abstract-and-payment', element: <AbstractAndPaymentPopup /> },
          { path: 'address-verification', element: <AddressVerificationPopup /> },
          { path: 'bond-legal-progress', element: <BondLegalProgressPopup /> },
          { path: 'branch-management', element: <BranchManagementPopup /> },
          { path: 'case-inquiry', element: <CaseInquiryPopup /> },
          { path: 'correction-history', element: <CorrectionHistoryPopup /> },
          { path: 'credit-ledger', element: <CreditLedgerPopup /> },
          { path: 'customer-management-code', element: <CustomerManagementCodePopup /> },
          { path: 'debt-adjustment-e-signature', element: <DebtAdjustmentESignaturePopup /> },
          { path: 'debt-collection-restriction', element: <DebtCollectionRestrictionPopup /> },
          { path: 'document-search', element: <DocumentSearchPopup /> },
          { path: 'early-warning', element: <EarlyWarningPopup /> },
          { path: 'excel-download', element: <ExcelDownloadPopup /> },
          { path: 'issuance-history', element: <IssuanceHistoryPopup /> },
          { path: 'message-type', element: <MessageTypePopup /> },
          { path: 'modification-history', element: <ModificationHistoryPopup /> },
          { path: 'multi-excel-download', element: <MultiExcelDownloadPopup /> },
          { path: 'real-estate-auction', element: <RealEstateAuctionPopup /> },
          { path: 'send-dm', element: <SendDMPopup /> },
          { path: 'send-sms', element: <SendSMSPopup /> },
          { path: 'specific-info-inquiry', element: <SpecificInfoInquiryPopup /> },
          { path: 'transaction-history', element: <TransactionHistoryPopup /> },
          { path: 'unprocessed-amount-processing', element: <UnprocessedAmountProcessingPopup /> },
          { path: 'form-7', element: <Form7Popup /> },
          { path: 'loan-conditions', element: <LoanConditionsPopup /> },
          { path: 'credit-repayment', element: <CreditRepaymentPopup /> },
          { path: 'visit-registration', element: <VisitRegistrationPopup /> },
          { path: 'counseling-registration', element: <CounselingRegistrationPopup /> },
          { path: 'favorites-management', element: <FavoritesManagementPopup /> },
        ],
      },
    ],
  },
]);

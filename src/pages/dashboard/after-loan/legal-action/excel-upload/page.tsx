

import { usePathname } from "@/lib/hooks/useAppLocation";
import { useCallback } from "react";
import { usePageStore } from "@/lib/store/pageStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ColumnDef } from "@tanstack/react-table";

// Data type for the table
type ExcelUploadData = {
  id: number;
  legalManagementCode: string;
  customerNumber: string;
  customerName: string;
  realNameNumber: string;
  accountNumber: string;
  provisionalPayment: number;
  loanBalance: number;
  plaintiffName: string;
  defendantName: string;
  processingStatus: string;
};

// Mock data for the table
const mockData: ExcelUploadData[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  legalManagementCode: `LMC0${i % 3 + 1}`,
  customerNumber: `CUST${1001 + i}`,
  customerName: `고객${i + 1}`,
  realNameNumber: `900101-123456${i}`,
  accountNumber: `ACC${2001 + i}`,
  provisionalPayment: 50000 * (i + 1),
  loanBalance: 1000000 * (i + 1),
  plaintiffName: "친애저축은행",
  defendantName: `피고${i + 1}`,
  processingStatus: i % 2 === 0 ? "완료" : "진행중",
}));

// Column definitions for the table
const columns: ColumnDef<ExcelUploadData>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "legalManagementCode", header: "법류관리구분코드" },
  { accessorKey: "customerNumber", header: "고객번호" },
  { accessorKey: "customerName", header: "고객명" },
  { accessorKey: "realNameNumber", header: "실명번호" },
  { accessorKey: "accountNumber", header: "계좌번호" },
  { accessorKey: "provisionalPayment", header: "가지급금" },
  { accessorKey: "loanBalance", header: "대출잔액" },
  { accessorKey: "plaintiffName", header: "원고명" },
  { accessorKey: "defendantName", header: "피고명" },
  { accessorKey: "processingStatus", header: "처리상태" },
];

export default function ExcelUploadPage() {
  const tabId = usePathname();
  const { currentState, updateTableData } = usePageStore();

  // In a real app, the 'register' button would likely trigger the upload and processing
  const handleRegister = () => {
    console.log("Registering data...");
    // For demonstration, we'll just populate the table with mock data
    updateTableData(tabId, 'excelUploadTable', mockData);
  };

  if (!currentState) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Title and Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
          <h2 className="text-lg font-semibold">통합엑셀업로드</h2>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>여신사후</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>법적조치</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>통합엑셀업로드</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Row 2: Right Action Buttons */}
      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "excel-upload" }, // onClick would open a file dialog in a real app
            { id: "register", onClick: handleRegister },
          ]}
        />
      </div>

      {/* Row 3: Table */}
      <DataTable
        title="통합 EXCEL UPLOAD"
        columns={columns}
        data={currentState.tables?.['excelUploadTable'] || []}
        amountColumns={["provisionalPayment", "loanBalance"]}
      />
    </div>
  );
}

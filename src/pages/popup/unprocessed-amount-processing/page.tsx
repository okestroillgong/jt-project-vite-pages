

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import type { FilterLayout } from "@/components/filters/types";

// --- Types ---
type UnprocessedTargetData = {
  id: number;
  curRow: number;
  acntNo: string;
  rasCustNm: string;
  untAmt: number;
  lastPrcsDt: string;
};

type PaymentHistoryData = {
  id: number;
  pytRn: number;
  pytAmt: number;
  aclPytAmt: number;
  prcsDt: string;
};

// --- Mock Data ---
const unprocessedTargetMockData: UnprocessedTargetData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  curRow: i + 1,
  acntNo: `123-456-789${i}`,
  rasCustNm: `홍길동${i + 1}`,
  untAmt: 50000 * (i + 1),
  lastPrcsDt: "2024-01-01",
}));

const paymentHistoryMockData: PaymentHistoryData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  pytRn: i + 1,
  pytAmt: 100000 * (i + 1),
  aclPytAmt: 100000 * (i + 1),
  prcsDt: "2024-02-01",
}));

export default function UnprocessedAmountProcessingPopup() {
  const searchParams = useSearchParams();
  
  const [unprocessedAmount, setUnprocessedAmount] = useState("");
  const [targetData, setTargetData] = useState<UnprocessedTargetData[]>([]);
  const [historyData, setHistoryData] = useState<PaymentHistoryData[]>([]);
  const [detailInfo, setDetailInfo] = useState({
    applicationDate: "",
    unprocessedAmountDetail: "",
    unprocessedBalance: "",
  });

  useEffect(() => {
    const amount = searchParams.get("unprocessedAmount");
    if (amount) {
        setUnprocessedAmount(amount);
    }
  }, [searchParams]);

  // Handlers
  const handleApply = () => {
    // 1. 조회(적용) 버튼 클릭 시 -> 미처리적용대상 데이터 채움 (Mock fetch)
    setTargetData(unprocessedTargetMockData);
  };

  const handleSave = () => {
    // 저장 로직 (Mock)
    alert("저장되었습니다.");
  };

  const handleTargetRowDoubleClick = (row: UnprocessedTargetData) => {
    // 3. 미처리적용대상 로우 더블 클릭 -> 하단 상세 정보 및 납입내역 채움
    setDetailInfo({
        applicationDate: "2024-01-01",
        unprocessedAmountDetail: row.untAmt.toLocaleString(),
        unprocessedBalance: (row.untAmt * 5).toLocaleString(),
    });
    setHistoryData(paymentHistoryMockData);
  };

  const [selectedHistoryIds, setSelectedHistoryIds] = useState<Set<number>>(new Set());

  const toggleHistorySelection = useCallback((id: number) => {
    setSelectedHistoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const toggleAllHistory = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedHistoryIds(new Set(historyData.map((d) => d.id)));
    } else {
      setSelectedHistoryIds(new Set());
    }
  }, [historyData]);

  // --- Columns Definitions ---
  const targetColumns: ColumnDef<UnprocessedTargetData>[] = [
    { accessorKey: "curRow", header: "순번" },
    { accessorKey: "acntNo", header: "계좌번호" },
    { accessorKey: "rasCustNm", header: "신청인" },
    { accessorKey: "untAmt", header: "미처리금액" },
    { accessorKey: "lastPrcsDt", header: "최종처리일자" },
  ];

  const historyColumns: ColumnDef<PaymentHistoryData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center px-0">
            <Checkbox
            checked={
                historyData.length > 0 &&
                selectedHistoryIds.size === historyData.length
            }
            onCheckedChange={(value) => toggleAllHistory(!!value)}
            aria-label="Select all"
            />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center px-0">
            <Checkbox
            checked={selectedHistoryIds.has(row.original.id)}
            onCheckedChange={() => toggleHistorySelection(row.original.id)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
            />
        </div>
      ),
      size: 30,
    },
    { accessorKey: "pytRn", header: "납입회차" },
    { accessorKey: "pytAmt", header: "납입금액" },
    { accessorKey: "aclPytAmt", header: "실제납입금액" },
    { accessorKey: "prcsDt", header: "처리일자" },
  ];

  const popupActions: PopupAction[] = [
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  const detailLayout: FilterLayout = [
      {
          type: "grid",
          columns: 3,
          filters: [
              { name: "applicationDate", type: "text", label: "신청일", readonly: true },
              { name: "unprocessedAmountDetail", type: "text", label: "미처리금액", readonly: true },
              { name: "unprocessedBalance", type: "text", label: "미처리잔액", readonly: true },
          ]
      }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold">미처리금액 처리</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {/* 1. Filter Area */}
        <div className="flex items-center justify-end gap-2 bg-white p-2 border rounded-sm shadow-sm">
          <Label htmlFor="unprocessedAmount" className="whitespace-nowrap font-medium">
            미처리금액
          </Label>
          <Input 
            id="unprocessedAmount" 
            className="w-48 h-8" 
            value={unprocessedAmount}
            onChange={(e) => setUnprocessedAmount(e.target.value)}
          />
          <Button variant="secondary" size="sm" className="h-8 px-3" onClick={handleApply}>
            적용
          </Button>
          <Button variant="secondary" size="sm" className="h-8 px-3" onClick={handleSave}>
            저장
          </Button>
        </div>

        {/* 2. Unprocessed Target Grid */}
        <div className="h-auto"> 
          <DataTable 
              title="미처리적용대상"
              columns={targetColumns} 
              data={targetData}
              amountColumns={["untAmt"]}
              onRowDoubleClick={handleTargetRowDoubleClick}
          />
        </div>

        {/* 3. Detail Info (FilterContainer) */}
        <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base">미처리적용대상 상세</h3>
            <FilterContainer 
                filterLayout={detailLayout}
                values={detailInfo}
                onChange={() => {}} // Readonly
            />
        </div>

        {/* 4. Payment History Grid */}
        <div className="h-auto">
          <DataTable 
              title="납입내역"
              columns={historyColumns} 
              data={historyData}
              amountColumns={["pytAmt", "aclPytAmt"]}
          />
        </div>
      </div>

      {/* 5. Status Bar */}
      <div className="bg-gray-100 border-t p-2 text-xs text-gray-600">
        처리 완료되었습니다
      </div>
    </div>
  );
}
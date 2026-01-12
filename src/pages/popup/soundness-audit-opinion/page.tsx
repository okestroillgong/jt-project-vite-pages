

import { useState, useCallback, Suspense, useMemo, useEffect } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";

// Mock data type
type AuditOpinion = {
  id: number;
  opinion: string;
  registrant: string;
};

// Mock data
const mockOpinions: AuditOpinion[] = [
  { id: 1, opinion: "건전성 지표가 양호합니다.", registrant: "홍길동" },
  { id: 2, opinion: "특이사항 없습니다.", registrant: "이순신" },
];

function SoundnessAuditOpinionContent() {
  const searchParams = useSearchParams();
  const openerTabId = searchParams.get("openerTabId");
  const initialSelectedMonth = searchParams.get("selectedMonth") || "202401";
  const monthOptionsParam = searchParams.get("monthOptions");

  const [settlementMonth, setSettlementMonth] = useState(initialSelectedMonth);
  const [monthOptions, setMonthOptions] = useState<{value: string, label: string}[]>([]);
  const [opinionText, setOpinionText] = useState("");
  const [opinions, setOpinions] = useState<AuditOpinion[]>(mockOpinions);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (monthOptionsParam) {
      try {
        const parsedOptions = JSON.parse(decodeURIComponent(monthOptionsParam));
        setMonthOptions(parsedOptions);
      } catch (e) {
        console.error("Failed to parse month options:", e);
      }
    }
  }, [monthOptionsParam]);

  const handleRegister = useCallback(() => {
    if (!opinionText.trim()) return;

    const newOpinion: AuditOpinion = {
      id: Math.max(0, ...opinions.map((o) => o.id)) + 1,
      opinion: opinionText,
      registrant: "관리자", // In a real app, this would be the logged-in user
    };

    setOpinions((prev) => [...prev, newOpinion]);
    setOpinionText("");
  }, [opinionText, opinions]);

  const handleDelete = useCallback(() => {
    setOpinions((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
    setSelectedIds([]);
  }, [selectedIds]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(opinions.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowDoubleClick = (opinion: string) => {
    setOpinionText(opinion);
  };

  const rightActions: PopupAction[] = useMemo(() => [
    {
      id: "register",
      text: "등록/수정",
      onClick: handleRegister,
    },
    {
      id: "delete",
      text: "삭제",
      onClick: handleDelete,
    },
  ], [handleRegister, handleDelete]);

  return (
    <div className="flex flex-col h-full bg-background p-6 gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">건전성자료 감리의견</h2>
        <PopupRightActions actions={rightActions} />
      </div>

      <div className="flex items-center gap-2 border-t pt-4">
        <span className="text-sm font-medium">결산월:</span>
        <Select value={settlementMonth} onValueChange={setSettlementMonth}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.length > 0 ? (
              monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            ) : (
              // Fallback options if no data is passed
              <>
                <SelectItem value="202401">202401</SelectItem>
                <SelectItem value="202402">202402</SelectItem>
                <SelectItem value="202403">202403</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <Textarea
          placeholder="의견 또는 결과를 입력하세요"
          className="resize-none h-32"
          value={opinionText}
          onChange={(e) => setOpinionText(e.target.value)}
        />

        <div className="flex-grow rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="w-[50px] text-center p-0 border-r last:border-r-0">
                  <div className="flex justify-center items-center w-full h-full">
                    <Checkbox
                      checked={
                        opinions.length > 0 &&
                        selectedIds.length === opinions.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </div>
                </TableHead><TableHead className="w-[60px] text-center border-r last:border-r-0">순번</TableHead><TableHead className="border-r last:border-r-0">감리의견</TableHead><TableHead className="w-[100px] text-center border-r last:border-r-0">등록자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opinions.length > 0 ? (
                opinions.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    onDoubleClick={() => handleRowDoubleClick(row.opinion)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="text-center p-0 border-r last:border-r-0">
                        <div className="flex justify-center items-center w-full h-full">
                          <Checkbox
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => toggleSelect(row.id)}
                            onClick={(e) => e.stopPropagation()} 
                          />
                        </div>
                    </TableCell><TableCell className="text-center border-r last:border-r-0">{index + 1}</TableCell><TableCell className="border-r last:border-r-0">{row.opinion}</TableCell><TableCell className="text-center border-r last:border-r-0">
                      {row.registrant}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 border-r last:border-r-0">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default function SoundnessAuditOpinionPopup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SoundnessAuditOpinionContent />
    </Suspense>
  );
}
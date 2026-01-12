

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { postPopupMessage } from "@/lib/popup-bus";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function MultiSelectPopupContent() {
  const searchParams = useSearchParams();
  const openerTabId = searchParams.get("openerTabId");
  const source = searchParams.get("source");
  const optionsParam = searchParams.get("options");
  const selectedParam = searchParams.get("selected");
  const title = searchParams.get("title") || "선택";

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (optionsParam) {
      try {
        const parsedOptions = JSON.parse(decodeURIComponent(optionsParam));
        setOptions(parsedOptions);
      } catch (e) {
        console.error("Failed to parse options", e);
      }
    }
    if (selectedParam) {
        try {
            const parsedSelected = JSON.parse(decodeURIComponent(selectedParam));
            if (Array.isArray(parsedSelected)) {
                setSelectedValues(parsedSelected);
            }
        } catch (e) {
            console.error("Failed to parse selected values", e);
        }
    }
  }, [optionsParam, selectedParam]);

  const handleToggle = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedValues((prev) => [...prev, value]);
    } else {
      setSelectedValues((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleConfirm = () => {
    if (openerTabId && source) {
      postPopupMessage({
        targetTabId: openerTabId,
        source: source,
        payload: selectedValues,
      });
      window.close();
    }
  };

  const handleCancel = () => {
    window.close();
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      
      <div className="flex-1 overflow-y-auto border rounded-md mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">선택</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">비고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                  항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              options.map((option) => (
                <TableRow 
                  key={option.value}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    // 행 클릭 시 체크박스 토글
                    const isChecked = selectedValues.includes(option.value);
                    handleToggle(option.value, !isChecked);
                  }}
                >
                  <TableCell className="text-center p-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                        <Checkbox
                        id={`opt-${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={(checked) => handleToggle(option.value, checked as boolean)}
                        />
                    </div>
                  </TableCell>
                  <TableCell className="text-center p-2">
                    <label
                        htmlFor={`opt-${option.value}`}
                        className="cursor-pointer w-full h-full block"
                        onClick={(e) => {
                             e.stopPropagation(); // Checkbox toggle handled by row click or checkbox change
                             const isChecked = selectedValues.includes(option.value);
                             handleToggle(option.value, !isChecked);
                        }}
                    >
                        {option.label}
                    </label>
                  </TableCell>
                  <TableCell className="text-center p-2 text-muted-foreground">
                    {/* 비고란은 현재 데이터가 없으므로 공란 */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>취소</Button>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </div>
  );
}

export default function MultiSelectPopupPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MultiSelectPopupContent />
        </Suspense>
    );
}
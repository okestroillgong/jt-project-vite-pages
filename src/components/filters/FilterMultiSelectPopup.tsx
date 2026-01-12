

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { FilterOption } from "./types";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { listenForPopupMessages } from "@/lib/popup-bus";

export type FilterMultiSelectPopupProps = {
  name: string;
  label?: string;
  options?: FilterOption[];
  value?: string[]; // Array of selected values
  onChange?: (value: string[] | undefined) => void;
  disabled?: boolean;
  readonly?: boolean;
};

export function FilterMultiSelectPopup({
  name,
  label,
  options = [],
  value,
  onChange,
  disabled: wrapperDisabled,
  readonly,
}: FilterMultiSelectPopupProps) {
  const tabId = usePathname();
  
  // value가 undefined면 체크 해제 상태
  const isChecked = value !== undefined;
  
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
        const labels = value.map(v => options.find(o => o.value === v)?.label || v);
        setInputValue(labels.join(", "));
    } else {
        setInputValue("");
    }
  }, [value, options]);

  useEffect(() => {
    const cleanup = listenForPopupMessages((message) => {
      if (message.targetTabId !== tabId || message.source !== `multi-select-${name}`) return;
      const selectedValues = message.payload;
      if (Array.isArray(selectedValues) && onChange) {
        onChange(selectedValues);
      }
    });
    return cleanup;
  }, [tabId, name, onChange]);

  const handleActivatorChange = (checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      // 체크됨: 빈 배열로 초기화하고 팝업 오픈
      onChange([]);
      openPopup([]);
    } else {
      // 체크 해제됨: undefined로 초기화
      onChange(undefined);
    }
  };

  const openPopup = (currentValues: string[]) => {
      const popupWidth = 400;
      const popupHeight = 600;
      const left = (window.screen.width / 2) - (popupWidth / 2);
      const top = (window.screen.height / 2) - (popupHeight / 2);
      
      const optionsParam = encodeURIComponent(JSON.stringify(options));
      const selectedParam = encodeURIComponent(JSON.stringify(currentValues));
      const titleParam = encodeURIComponent(label || name);

      window.open(
        `/popup/multi-select?openerTabId=${tabId}&source=multi-select-${name}&options=${optionsParam}&selected=${selectedParam}&title=${titleParam}`,
        'MultiSelectPopup',
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
      );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    if (onChange) {
        const values = newVal.split(",").map(s => s.trim()).filter(s => s !== "");
        onChange(values);
    }
  };

  return (
    <div className="flex h-9 items-center w-full gap-2">
      <Checkbox
        id={`chk-activator-${name}`}
        checked={isChecked}
        onCheckedChange={handleActivatorChange}
        disabled={wrapperDisabled || readonly}
      />
      <Input
        value={inputValue}
        onChange={handleInputChange}
        className="bg-white"
        disabled={!isChecked || wrapperDisabled}
        readOnly={readonly}
        placeholder="선택 또는 입력하세요"
        onClick={() => {
            // 이미 체크된 상태에서 클릭 시, 팝업을 띄울지 여부.
            // 사용자가 "텍스트 입력"을 원하면 팝업이 방해될 수 있음.
            // 요구사항: "체크 시, 우측 인풋창에 텍스트 입력을 할 수 없음" -> 해결됨.
            // 팝업은 "체크 활성화 시점"에만 띄우기로 했으므로 여기서는 팝업 로직 제거.
        }}
      />
    </div>
  );
}

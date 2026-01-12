

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { FilterOption } from "./types";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { listenForPopupMessages } from "@/lib${import.meta.env.BASE_URL}popup-bus";

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
  
  // value媛 undefined硫?泥댄겕 ?댁젣 ?곹깭
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
      // 泥댄겕?? 鍮?諛곗뿴濡?珥덇린?뷀븯怨??앹뾽 ?ㅽ뵂
      onChange([]);
      openPopup([]);
    } else {
      // 泥댄겕 ?댁젣?? undefined濡?珥덇린??      onChange(undefined);
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
        `${import.meta.env.BASE_URL}popup/multi-select?openerTabId=${tabId}&source=multi-select-${name}&options=${optionsParam}&selected=${selectedParam}&title=${titleParam}`,
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
        placeholder="?좏깮 ?먮뒗 ?낅젰?섏꽭??
        onClick={() => {
            // ?대? 泥댄겕???곹깭?먯꽌 ?대┃ ?? ?앹뾽???꾩슱吏 ?щ?.
            // ?ъ슜?먭? "?띿뒪???낅젰"???먰븯硫??앹뾽??諛⑺빐?????덉쓬.
            // ?붽뎄?ы빆: "泥댄겕 ?? ?곗륫 ?명뭼李쎌뿉 ?띿뒪???낅젰???????놁쓬" -> ?닿껐??
            // ?앹뾽? "泥댄겕 ?쒖꽦???쒖젏"?먮쭔 ?꾩슦湲곕줈 ?덉쑝誘濡??ш린?쒕뒗 ?앹뾽 濡쒖쭅 ?쒓굅.
        }}
      />
    </div>
  );
}


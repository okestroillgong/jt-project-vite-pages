

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import type { FilterOption } from "./types";

export type FilterComboboxProps = {
  name: string;
  options?: FilterOption[];
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  readonly?: boolean;
};

export function FilterCombobox({
  name,
  options = [],
  value,
  onChange,
  disabled,
  readonly,
}: FilterComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // value prop이 변경되면 inputValue 동기화
  React.useEffect(() => {
    // 1. 옵션에 일치하는 값이 있으면 라벨 표시
    const option = options.find((opt) => opt.value === value);
    if (option) {
        setInputValue(option.label);
    } else {
        // 2. 일치하는 값이 없으면?
        // 값이 존재하면(Custom input 등) 그 값 자체를 표시, 없으면 빈 문자열
        setInputValue(value || "");
    }
  }, [value, options]);

  // 외부 클릭 처리 (블러 시점)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        
        // 포커스를 잃었을 때, 현재 입력된 값이 저장되지 않은 상태라면 저장 시도
        // (타이핑만 하고 엔터나 선택 없이 나갔을 경우)
        if (onChange && !disabled && !readonly) {
            // 현재 입력값이 value와 다르다면 업데이트
            // (inputValue가 label일 수도 있고 value일 수도 있음. 
            //  여기서는 사용자가 입력한 텍스트 그대로를 '값'으로 취급하여 전달하거나,
            //  옵션 매칭을 시도함)
            
            const matchedOption = options.find(o => o.label === inputValue);
            const newValue = matchedOption ? matchedOption.value : inputValue;
            
            // 현재 저장된 value와 다를 때만 업데이트
            if (newValue !== value) {
                onChange(newValue === "" ? undefined : newValue);
            }
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, onChange, options, value, disabled, readonly]);


  const handleSelect = (currentValue: string) => {
    if (onChange) {
      onChange(currentValue);
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    if (!open) setOpen(true);
  };
  
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => !disabled && !readonly && setOpen(true)}
          onFocus={() => !disabled && !readonly && setOpen(true)}
          placeholder="선택하세요..."
          className="w-full pr-8"
          disabled={disabled || readonly}
          autoComplete="off"
        />
        <ChevronsUpDown 
            className="absolute right-2 top-2.5 h-4 w-4 opacity-50 cursor-pointer" 
            onClick={() => {
                if (!disabled && !readonly) {
                    setOpen(!open);
                    inputRef.current?.focus();
                }
            }}
        />
      </div>
      
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full min-w-[200px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <Command>
            <CommandList className="max-h-[300px] overflow-auto">
                <CommandGroup>
                  {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => handleSelect(option.value)}
                          className="cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))
                  ) : (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        {inputValue ? "일치하는 항목 없음" : "항목 없음"}
                      </div>
                  )}
                </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

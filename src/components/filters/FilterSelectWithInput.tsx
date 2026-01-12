import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { FilterOption } from "./types";

export type FilterSelectWithInputProps = {
  name: string;
  options?: FilterOption[];
  value?: { select: string; input: string };
  onChange?: (name: string, value: { select: string; input: string }) => void;
  disabled?: boolean;
  readonly?: boolean;
};

export function FilterSelectWithInput({
  name,
  options = [],
  value = { select: "", input: "" },
  onChange,
  disabled,
  readonly,
}: FilterSelectWithInputProps) {
  const handleSelectChange = (newSelect: string) => {
    if (onChange) {
      onChange(name, { ...value, select: newSelect });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(name, { ...value, input: e.target.value });
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Select
        value={value.select}
        onValueChange={handleSelectChange}
        disabled={disabled || readonly}
      >
        <SelectTrigger className="w-1/2 h-9">
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={value.input}
        onChange={handleInputChange}
        className="w-1/2 h-9"
        disabled={disabled || readonly}
        placeholder="상세 설명"
      />
    </div>
  );
}

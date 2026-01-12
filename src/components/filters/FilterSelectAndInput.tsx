

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOption } from "./types";

interface FilterSelectAndInputProps {
  name: string;
  value?: { select: string; input: string };
  onChange: (value: { select: string; input: string }) => void;
  options: FilterOption[];
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}

export function FilterSelectAndInput({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  readonly,
}: FilterSelectAndInputProps) {
  const currentVal = value || { select: "", input: "" };

  const handleSelectChange = (val: string) => {
    onChange({
      ...currentVal,
      select: val,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...currentVal,
      input: e.target.value,
    });
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Select
        value={currentVal.select}
        onValueChange={handleSelectChange}
        disabled={disabled || readonly}
      >
        <SelectTrigger className="h-9 w-1/2">
          <SelectValue placeholder={placeholder || "선택"} />
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
        type="text"
        value={currentVal.input}
        onChange={handleInputChange}
        className="h-9 w-1/2"
        disabled={disabled}
        readOnly={readonly}
      />
    </div>
  );
}

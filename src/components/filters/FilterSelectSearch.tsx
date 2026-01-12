

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSelectSearchProps {
  name: string;
  value: { select: string; input: string } | undefined;
  onChange: (value: { select: string; input: string }) => void;
  options: { value: string; label: string; subValue?: string }[]; // Added subValue to map to input
  placeholder?: string;
  readonly?: boolean;
}

export function FilterSelectSearch({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  readonly,
}: FilterSelectSearchProps) {
  const selectedValue = value?.select || "";
  const inputValue = value?.input || "";

  const handleSelectChange = (val: string) => {
    // Find the selected option to get its subValue
    const selectedOption = options.find((opt) => opt.value === val);
    const associatedValue = selectedOption?.subValue || "";
    
    onChange({
      select: val,
      input: associatedValue,
    });
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Select
        value={selectedValue}
        onValueChange={handleSelectChange}
        disabled={readonly}
      >
        <SelectTrigger className="h-9 w-[6.5rem]">
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
        value={inputValue}
        className="h-9 flex-grow bg-muted text-muted-foreground"
        readOnly
        disabled
      />
    </div>
  );
}

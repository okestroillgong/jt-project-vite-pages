import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import type { FilterOption } from "./types";

export type FilterSelectProps = {
  name: string;
  label?: string;
  options?: FilterOption[];
  activator?: boolean;
  value?: string;
  onChange?: (name: string, value: string | undefined) => void;
  readonly?: boolean;
  disabled?: boolean;
};

export function FilterSelect({
  name,
  label,
  options,
  activator,
  value,
  onChange,
  readonly,
  disabled,
}: FilterSelectProps) {
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(name, newValue);
    }
  };

  const handleActivatorChange = (checked: boolean) => {
    if (onChange) {
      onChange(name, checked ? "" : undefined);
    }
  };

  const labelId = `label-${label!.replace(/\s+/g, "-")}`;

  return (
    <div className="flex h-9 items-center gap-2">
      <Label
        htmlFor={labelId}
        className="block w-[100px] flex-shrink-0 text-right text-sm font-medium"
      >
        {label}
      </Label>
      {activator && (
        <Checkbox
          checked={!disabled}
          onCheckedChange={handleActivatorChange}
        />
      )}
      <Select
        name={name}
        disabled={disabled || readonly}
        value={value}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-9 w-48">
          <SelectValue id={labelId} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
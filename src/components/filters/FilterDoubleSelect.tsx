

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOption } from "./types";

export type FilterDoubleSelectProps = {
  name: string;
  options1?: FilterOption[];
  options2?: FilterOption[];
  value?: { select1: string; select2: string };
  onChange?: (name: string, value: { select1: string; select2: string }) => void;
  disabled?: boolean;
  readonly?: boolean;
};

export function FilterDoubleSelect({
  name,
  options1 = [],
  options2 = [],
  value = { select1: "", select2: "" },
  onChange,
  disabled,
  readonly,
}: FilterDoubleSelectProps) {

  const handleSelect1Change = (newSelect1: string) => {
    if (onChange) {
      onChange(name, { ...value, select1: newSelect1 });
    }
  };

  const handleSelect2Change = (newSelect2: string) => {
    if (onChange) {
      onChange(name, { ...value, select2: newSelect2 });
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Select
        value={value.select1}
        onValueChange={handleSelect1Change}
        disabled={disabled || readonly}
      >
        <SelectTrigger className="w-1/2 h-9">
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        <SelectContent>
          {options1.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={value.select2}
        onValueChange={handleSelect2Change}
        disabled={disabled || readonly}
      >
        <SelectTrigger className="w-1/2 h-9">
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        <SelectContent>
          {options2.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

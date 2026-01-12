

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { FilterOption } from "./types";

export type FilterRadioGroupProps = {
  name: string;
  options?: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export function FilterRadioGroup({
  name,
  options = [],
  value,
  onChange,
  disabled,
}: FilterRadioGroupProps) {
  return (
    <RadioGroup
      name={name}
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      className="flex flex-row gap-4 h-9 items-center"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
          <Label htmlFor={`${name}-${option.value}`} className="font-normal cursor-pointer">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

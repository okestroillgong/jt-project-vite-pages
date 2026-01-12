
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type FilterCheckboxProps = {
  label?: string;
};

export function FilterCheckbox({ label }: FilterCheckboxProps) {
  // Label과 Checkbox를 연결하기 위한 고유 ID 생성
  const checkboxId = `checkbox-${label!.replace(/\s+/g, "-")}`;

  return (
    <div className="flex h-9 items-center gap-2">
      <Label
        htmlFor={checkboxId}
        className="block w-[100px] flex-shrink-0 text-right text-sm font-medium"
      >
        {label}
      </Label>
      <Checkbox id={checkboxId} />
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FilterFileProps = {
  label?: string;
};

export function FilterFile({ label }: FilterFileProps) {
  const labelId = `label-${label!.replace(/\s+/g, "-")}`;
  return (
    <div className="flex h-9 items-center gap-2">
      <Label
        htmlFor={labelId}
        className="block w-[100px] flex-shrink-0 text-right text-sm font-medium"
      >
        {label}
      </Label>
      <Input id={labelId} type="file" className="h-9"/>
    </div>
  );
}
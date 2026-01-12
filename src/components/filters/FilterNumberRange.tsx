
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterNumberRangeProps = {
  label?: string;
  activator?: boolean;
};

export function FilterNumberRange({
  label,
  activator,
}: FilterNumberRangeProps) {
  const [minVal, setMinVal] = useState<string>("");
  const [maxVal, setMaxVal] = useState<string>("");
  const [disabled, setDisabled] = useState(activator);

  useEffect(() => {
    setDisabled(activator);
    if (activator) {
      setMinVal("");
      setMaxVal("");
    }
  }, [activator]);

  const handleMinBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const minValue = e.target.value;
    if (minValue && maxVal && Number(minValue) > Number(maxVal)) {
      setMaxVal(minValue);
    }
  };

  const handleMaxBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const maxValue = e.target.value;
    if (maxValue && minVal && Number(maxValue) < Number(minVal)) {
      setMaxVal(minVal);
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
          onCheckedChange={(checked) => setDisabled(!checked)}
        />
      )}
      <div className="flex items-center gap-2">
        <Input
          id={labelId}
          type="number"
          min="0"
          value={minVal}
          onChange={(e) => setMinVal(e.target.value)}
          onBlur={handleMinBlur}
          className="h-9 w-24"
          disabled={disabled}
        />
        <span className="text-muted-foreground">~</span>
        <Input
          type="number"
          min="0"
          value={maxVal}
          onChange={(e) => setMaxVal(e.target.value)}
          onBlur={handleMaxBlur}
          className="h-9 w-24"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

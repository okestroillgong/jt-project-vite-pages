import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";

export type FilterSearchProps = {
  label?: string;
  activator?: boolean;
};

export function FilterSearch({ label, activator }: FilterSearchProps) {
  const [disabled, setDisabled] = useState(activator);

  useEffect(() => {
    setDisabled(activator);
  }, [activator]);

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
        <div className="relative flex items-center">
          <Input id={labelId} type="text" className="h-9 w-24" disabled={disabled} />
          <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          className="h-9 w-32 bg-muted"
          readOnly
          disabled={disabled}
        />
      </div>
    </div>
  );
}
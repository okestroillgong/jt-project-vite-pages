import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React from "react";

export type FilterInputProps = {
  name: string;
  type: "text" | "number";
  label?: string;
  maxLength?: number;
  width?: "short" | "middle" | "long";
  activator?: boolean;
  value?: string | number;
  onChange?: (name: string, value: string | number | undefined) => void;
  disabled?: boolean;
};

const widthClasses = {
  short: "w-32",
  middle: "w-64",
  long: "w-96",
};

export function FilterInput({
  name,
  type,
  label,
  width,
  activator,
  maxLength,
  value,
  onChange,
  disabled,
}: FilterInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  const inputWidth = type === "text" && width ? widthClasses[width] : "w-48";
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
          onCheckedChange={(checked) => {
            if (onChange) {
              onChange(name, checked ? "" : undefined);
            }
          }}
        />
      )}
      <Input
        id={labelId}
        name={name}
        type={type}
        min={type === "number" ? 0 : undefined}
        maxLength={maxLength}
        className={cn("h-9", inputWidth)}
        disabled={disabled}
        value={value || ""}
        onChange={handleChange}
      />
    </div>
  );
}

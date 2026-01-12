


import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterDatePickerProps = {
  label?: string;
  activator?: boolean;
  popoverSide?: "top" | "bottom";
};

export function FilterDatePicker({
  label,
  activator,
  popoverSide,
}: FilterDatePickerProps) {
  const [date, setDate] = useState<Date>();
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={labelId}
            variant={"outline"}
            className={cn(
              "h-9 w-32 justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span>{date ? format(date, "yyyy-MM-dd") : ""}</span>
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          side={popoverSide || "bottom"}
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

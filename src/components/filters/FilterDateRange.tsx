


import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterDateRangeProps = {
  label?: string;
  activator?: boolean;
};

export function FilterDateRange({ label, activator }: FilterDateRangeProps) {
  const [range, setRange] = useState<DateRange | undefined>();
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
              "h-9 w-[260px] justify-start text-left font-normal",
              !range && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "yyyy-mm-dd")} -{" "}
                  {format(range.to, "yyyy-mm-dd")}
                </>
              ) : (
                format(range.from, "yyyy-mm-dd")
              )
            ) : (
              <span>기간 선택</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}



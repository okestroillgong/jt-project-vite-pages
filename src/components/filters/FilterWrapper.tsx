import React from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import type { Filter, FilterOption, LabelAlign } from "./types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn, formatNumberWithCommas, parseFormattedNumber } from "@/lib/utils";
import { FilterInputWithButton } from "./FilterInputWithButton";
import { FilterLongSearch } from "./FilterLongSearch";
import { FilterCombobox } from "./FilterCombobox";
import { FilterMultiSelectPopup } from "./FilterMultiSelectPopup";
import { FilterSelectWithInput } from "./FilterSelectWithInput";
import { FilterSelectSearch } from "./FilterSelectSearch";
import { FilterMultiSelect } from "./FilterMultiSelect";
import { FilterRadioGroup } from "./FilterRadioGroup";
import { FilterDoubleSelect } from "./FilterDoubleSelect";
import { FilterSelectAndInput } from "./FilterSelectAndInput";
import { Textarea } from "@/components/ui/textarea";

type FilterWrapperProps = Filter & {
  value?: any;
  onChange?: (name: string, value: any) => void;
  labelAlign?: LabelAlign;
};

const FilterWrapper: React.FC<FilterWrapperProps> = (filter) => {
  const tabId = usePathname();
  const { labelAlign = "right" } = filter;
  const isLeft = labelAlign === "left";

  const { name, value, onChange, activator, readonly, defaultValue, disabled } = filter;

  // isDisabled는 각 필터가 활성 체크박스에 의해 비활성화될 때 사용
  const isInternalDisabled = activator && value === undefined;

  let finalOnButtonClick = filter.onButtonClick;

  if (filter.type === 'textarea') {
    const handleChange = (newValue: any) => {
      if (onChange) {
        onChange(name, newValue);
      }
    };

    return (
      <Textarea 
        value={value || ''} 
        onChange={(e) => handleChange(e.target.value)} 
        className="w-full resize-none h-40" 
        disabled={disabled || isInternalDisabled} // filter.disabled 또는 isInternalDisabled
        readOnly={readonly} 
        placeholder={filter.placeholder} 
      />
    );
  }
  
  const finalValue = value ?? defaultValue;

  // Auto-inject popup logic for specific filters
  if (!finalOnButtonClick && filter.label === "고객번호" && filter.type === "long-search") {
    finalOnButtonClick = (currentValue?: any) => {
      const customerNumber = currentValue || '';
      const popupWidth = 1600;
      const popupHeight = 800;
      const left = (window.screen.width / 2) - (popupWidth / 2);
      const top = (window.screen.height / 2) - (popupHeight / 2);
      window.open(
        `/popup/customer-search?customerNumber=${customerNumber}&openerTabId=${tabId}`,
        'CustomerSearch',
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
      );
    };
  }

  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(name, newValue);
    }
  };

  const handleRangeChange = (part: 'start' | 'end', partValue: any) => {
    if (onChange) {
      const otherPart = part === 'start' ? 'end' : 'start';
      const otherValue = finalValue?.[otherPart];
      
      if (part === 'start' && otherValue && new Date(partValue) > new Date(otherValue)) {
        onChange(name, { [part]: partValue, [otherPart]: undefined });
      } else if (part === 'end' && otherValue && new Date(partValue) < new Date(otherValue)) {
        // Do nothing
      } else {
        onChange(name, { ...finalValue, [part]: partValue });
      }
    }
  };

  const handleActivatorChange = (checked: boolean) => {
    if (onChange) {
      onChange(name, checked ? '' : undefined);
    }
  };

  const isDisabled = activator && value === undefined;

  const renderFilter = () => {
    const props = { ...filter, disabled: isDisabled, readOnly: readonly };
    const className = "h-9 w-full";

    switch (props.type) {
      case "text":
        return <Input type="text" value={finalValue || ''} onChange={(e) => handleChange(e.target.value)} className={className} disabled={props.disabled} readOnly={props.readOnly} />;
      
      case "number":
        return <Input 
                  type="text" 
                  pattern="[0-9,]*"
                  value={formatNumberWithCommas(finalValue)} 
                  onChange={(e) => {
                    const numericValue = parseFormattedNumber(e.target.value);
                    if (/^\d*$/.test(numericValue) || numericValue === "") {
                      handleChange(numericValue);
                    }
                  }} 
                  className={className} 
                  disabled={props.disabled} 
                  readOnly={props.readOnly} 
                />;

      case "select":
        return (
          <Select
            value={finalValue}
            onValueChange={handleChange}
            disabled={props.disabled || props.readOnly}
          >
            <SelectTrigger className={className}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {props.options?.map((option: FilterOption) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

        case "search":
          return (
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Input 
                  type="text" 
                  value={finalValue?.code || ''} 
                  onChange={(e) => handleChange({ ...finalValue, code: e.target.value })} 
                  className="h-9 w-[6.5rem]" 
                  disabled={isDisabled} 
                  readOnly={props.readOnly} 
                />
                <button
                  type="button"  // 명시적으로 type="button" 추가
                  className="absolute right-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground active:scale-95"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onButtonClick?.(finalValue);
                  }}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <Input
                type="text"
                value={finalValue?.name || ''}
                className="h-9 flex-grow bg-muted"
                readOnly
                disabled
              />
            </div>
          );

      case "date":
        let dateValue;
        if (finalValue) {
            if (finalValue instanceof Date) {
                dateValue = finalValue;
            } else if (typeof finalValue === 'string') {
                const parsed = parseISO(finalValue);
                if (!isNaN(parsed.getTime())) {
                    dateValue = parsed;
                }
            }
        }
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("h-9 w-full justify-between text-left font-normal", !dateValue && "text-muted-foreground")}
                disabled={isDisabled || props.readOnly}
              >
                <span>{dateValue ? format(dateValue, "yyyy-MM-dd") : ""}</span>
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              side={props.popoverSide || "bottom"}
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(d) => handleChange(d?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "date-range":
        const startDate = finalValue?.start ? (typeof finalValue.start === 'string' ? parseISO(finalValue.start) : finalValue.start) : undefined;
        const endDate = finalValue?.end ? (typeof finalValue.end === 'string' ? parseISO(finalValue.end) : finalValue.end) : undefined;
        return (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("h-9 flex-1 justify-between text-left font-normal", !startDate && "text-muted-foreground")}
                  disabled={isDisabled || props.readOnly}
                >
                  <span>{startDate ? format(startDate, "yyyy-MM-dd") : ""}</span>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" side={props.popoverSide || "bottom"} align="start">
                <Calendar mode="single" selected={startDate} onSelect={(d) => handleRangeChange('start', d?.toISOString())} toDate={endDate} initialFocus />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">~</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("h-9 flex-1 justify-between text-left font-normal", !endDate && "text-muted-foreground")}
                  disabled={isDisabled || !startDate || props.readOnly}
                >
                  <span>{endDate ? format(endDate, "yyyy-MM-dd") : ""}</span>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" side={props.popoverSide || "bottom"} align="start">
                <Calendar mode="single" selected={endDate} onSelect={(d) => handleRangeChange('end', d?.toISOString())} fromDate={startDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "number-range":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              pattern="[0-9,]*"
              value={formatNumberWithCommas(finalValue?.start)}
              onChange={(e) => {
                const numericValue = parseFormattedNumber(e.target.value);
                if (/^\d*$/.test(numericValue) || numericValue === "") {
                  handleRangeChange('start', numericValue);
                }
              }}
              className="h-9 w-full"
              disabled={isDisabled}
              readOnly={props.readOnly}
            />
            <span className="text-muted-foreground">~</span>
            <Input
              type="text"
              pattern="[0-9,]*"
              value={formatNumberWithCommas(finalValue?.end)}
              onChange={(e) => {
                const numericValue = parseFormattedNumber(e.target.value);
                if (/^\d*$/.test(numericValue) || numericValue === "") {
                  handleRangeChange('end', numericValue);
                }
              }}
              className="h-9 w-full"
              disabled={isDisabled}
              readOnly={props.readOnly}
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center h-full">
            <Checkbox id={`checkbox-${filter.label}`} checked={!!finalValue} onCheckedChange={handleChange} />
          </div>
        );

      case "input-button":
        return (
          <FilterInputWithButton
            name={name}
            value={formatNumberWithCommas(finalValue)}
            onChange={(val: string) => {
              const numericValue = parseFormattedNumber(val);
              if (/^\d*$/.test(numericValue) || numericValue === "") {
                handleChange(numericValue);
              }
            }}
            placeholder={props.label}
            readonly={props.readOnly}
            buttonText={props.buttonText}
            onButtonClick={props.onButtonClick}
          />
        );

      case "long-search":
        const displayValue = typeof finalValue === 'object' && finalValue !== null 
          ? (finalValue.name || finalValue.code || '') 
          : finalValue;
          
        return (
          <FilterLongSearch
            name={name}
            value={displayValue}
            onChange={handleChange}
            readonly={props.readOnly}
            onSearch={() => finalOnButtonClick?.(finalValue)}
          />
        );

      case "combobox":
        return (
          <FilterCombobox
            name={name}
            options={props.options}
            value={finalValue}
            onChange={handleChange}
            disabled={isDisabled}
            readonly={props.readOnly}
          />
        );

      case "multi-select-popup":
        return (
          <FilterMultiSelectPopup
            name={name}
            label={props.label}
            options={props.options}
            value={finalValue}
            onChange={handleChange}
            disabled={isDisabled}
            readonly={props.readOnly}
          />
        );

      case "multi-select":
        return (
          <FilterMultiSelect
            options={props.options || []}
            value={finalValue}
            onChange={handleChange}
            disabled={isDisabled || props.readOnly}
          />
        );

      case "select-with-input":
        return (
          <FilterSelectWithInput
            name={name}
            options={props.options}
            value={finalValue || { select: "", input: "" }}
            onChange={handleChange}
            disabled={isDisabled}
            readonly={props.readOnly}
          />
        );

      case "select-search":
        return (
          <FilterSelectSearch
            name={name}
            value={finalValue}
            onChange={handleChange}
            options={props.options || []}
            readonly={props.readOnly}
          />
        );

      case "phone-number":
        const handlePhoneChange = (part: 'part1' | 'part2' | 'part3', val: string) => {
            if (/^\d*$/.test(val)) {
                if (onChange) {
                    onChange(name, { ...finalValue, [part]: val });
                }
            }
        };
        
        return (
            <div className="flex items-center gap-1 w-full">
                <Input 
                    className="h-9 w-full text-center" 
                    value={finalValue?.part1 || ''} 
                    onChange={(e) => handlePhoneChange('part1', e.target.value)} 
                    maxLength={3}
                    disabled={isDisabled}
                    readOnly={props.readOnly}
                />
                <Input 
                    className="h-9 w-full text-center" 
                    value={finalValue?.part2 || ''} 
                    onChange={(e) => handlePhoneChange('part2', e.target.value)} 
                    maxLength={4}
                    disabled={isDisabled}
                    readOnly={props.readOnly}
                />
                <Input 
                    className="h-9 w-full text-center" 
                    value={finalValue?.part3 || ''} 
                    onChange={(e) => handlePhoneChange('part3', e.target.value)} 
                    maxLength={4}
                    disabled={isDisabled}
                    readOnly={props.readOnly}
                />
            </div>
        );

      case "days-of-week":
        const days = ["월", "화", "수", "목", "금", "토", "일"];
        const selectedDays: string[] = Array.isArray(finalValue) ? finalValue : [];
        
        const toggleDay = (day: string, checked: boolean) => {
            if (onChange) {
                if (checked) {
                    onChange(name, [...selectedDays, day]);
                } else {
                    onChange(name, selectedDays.filter(d => d !== day));
                }
            }
        };

        return (
            <div className="flex items-center gap-3">
                {days.map(day => (
                    <div key={day} className="flex items-center gap-1">
                        <Checkbox 
                            id={`${name}-${day}`} 
                            checked={selectedDays.includes(day)}
                            onCheckedChange={(checked) => toggleDay(day, !!checked)}
                            disabled={isDisabled || props.readOnly}
                        />
                        <label 
                            htmlFor={`${name}-${day}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            {day}
                        </label>
                    </div>
                ))}
            </div>
        );

      case "hour-range":
        const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        const startHour = finalValue?.start || "";
        const endHour = finalValue?.end || "";

        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <Select 
                        value={startHour} 
                        onValueChange={(val) => onChange && onChange(name, { ...finalValue, start: val })}
                        disabled={isDisabled || props.readOnly}
                    >
                        <SelectTrigger className="h-9 w-20">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <span className="text-sm">시</span>
                </div>
                <span className="text-muted-foreground">~</span>
                <div className="flex items-center gap-1">
                    <Select 
                        value={endHour} 
                        onValueChange={(val) => onChange && onChange(name, { ...finalValue, end: val })}
                        disabled={isDisabled || props.readOnly}
                    >
                        <SelectTrigger className="h-9 w-20">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <span className="text-sm">시</span>
                </div>
            </div>
        );
      
      case "radio-group":
        return (
          <FilterRadioGroup
            name={name}
            options={props.options}
            value={finalValue}
            onChange={handleChange}
            disabled={isDisabled || props.readOnly}
          />
        );

      case "double-select":
        return (
          <FilterDoubleSelect
            name={name}
            options1={props.options1}
            options2={props.options2}
            value={finalValue}
            onChange={handleChange}
            disabled={isDisabled || props.readOnly}
          />
        );

      case "select-and-input":
        return (
          <FilterSelectAndInput
            name={name}
            options={props.options || []}
            value={finalValue || { select: "", input: "" }}
            onChange={handleChange}
            disabled={isDisabled}
            readonly={props.readOnly}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-1 min-w-[320px] items-center h-9", filter.className)}>
      <label
        className={cn(
          // ✅ 기존 right 기본값은 그대로 유지 (기존 페이지 무영향)
          !isLeft && "w-48 flex-shrink-0 text-right text-sm font-medium mr-4",

          // ✅ left일 때만 레이아웃을 '압축'해서 입력도 같이 좌측으로 당김
          isLeft && "w-auto flex-shrink-0 text-left text-sm font-medium mr-2"
        )}
        htmlFor={filter.type === "checkbox" ? `checkbox-${filter.label}` : undefined}
      >
        {filter.label}
      </label>
      <div className="flex-grow flex items-center">
        {activator && (
          <Checkbox
            className="mr-2"
            checked={!isDisabled}
            onCheckedChange={handleActivatorChange}
          />
        )}
        <div className="w-full">{renderFilter()}</div>
      </div>
    </div>
  );
};

export default FilterWrapper;

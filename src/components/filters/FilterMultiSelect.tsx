
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type Option = {
  label: string
  value: string
}

interface FilterMultiSelectProps {
  options: Option[]
  value?: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function FilterMultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "선택하세요",
  disabled,
  className,
}: FilterMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedValues = new Set(value)

  const toggleOption = (optionValue: string) => {
    const newSelectedValues = new Set(selectedValues)
    if (newSelectedValues.has(optionValue)) {
      newSelectedValues.delete(optionValue)
    } else {
      newSelectedValues.add(optionValue)
    }
    onChange(Array.from(newSelectedValues))
  }

  const handleSelectAll = () => {
    if (selectedValues.size === options.length) {
      onChange([])
    } else {
      onChange(options.map((option) => option.value))
    }
  }

  const displayValue = React.useMemo(() => {
    if (selectedValues.size === 0) return placeholder
    if (selectedValues.size === options.length) return "전체"
    
    const selectedLabels = options
      .filter((option) => selectedValues.has(option.value))
      .map((option) => option.label)
    
    if (selectedLabels.length <= 2) {
      return selectedLabels.join(", ")
    } else {
      return `${selectedLabels[0]} 외 ${selectedLabels.length - 1}건`
    }
  }, [selectedValues, options, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-9 font-normal", className)}
          disabled={disabled}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
                <CommandItem
                  onSelect={handleSelectAll}
                  className="cursor-pointer"
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedValues.size === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}>
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>(전체)</span>
                </CommandItem>
              {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}>
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

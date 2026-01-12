

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseFormattedNumber } from "@/lib/utils";

interface FilterInputWithButtonProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
  buttonText?: string;
  onButtonClick?: (value: string) => void;
}

export function FilterInputWithButton({
  name,
  value,
  onChange,
  placeholder,
  readonly,
  buttonText = "조회", // Default text
  onButtonClick,
}: FilterInputWithButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readonly}
        className="flex-grow"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => onButtonClick?.(value)}
        disabled={!value || Number(parseFormattedNumber(String(value))) <= 0}
        className="flex-shrink-0 px-3"
      >
        {buttonText}
      </Button>
    </div>
  );
}

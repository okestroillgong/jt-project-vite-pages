

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FilterLongSearchProps {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
  onSearch?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function FilterLongSearch({
  name,
  value,
  onChange,
  placeholder,
  readonly,
  onSearch,
}: FilterLongSearchProps) {
  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onSearch) {
      onSearch(e);
    }
  };

  return (
    <div className="flex w-full items-center">
      <div className="relative flex-grow">
        <Input
          type="text"
          name={name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readonly}
          className="h-9 w-full pr-10 read-only:bg-gray-200 read-only:opacity-100 read-only:text-gray-500"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 cursor-pointer hover:bg-gray-100"
          onClick={handleSearchClick}
          disabled={readonly && !value}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

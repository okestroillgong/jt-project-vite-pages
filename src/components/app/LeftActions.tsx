

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageStore } from "@/lib/store/pageStore";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { ChevronDown } from "lucide-react";

type ActionConfig = {
  text: string;
  handler?: () => void;
  isDropdown?: boolean;
  options?: { value: string; label: string }[];
};

const actionMap: Record<string, ActionConfig> = {
  terminate: { text: "해지" },
  "batch-register": { text: "폐지등록" },
  cancel: { text: "폐지취소" },
  dm: { text: "DM" },
  "first-request": { text: "1차요청자료" },
  "second-request": { text: "2차요청자료" },
  sync: { text: "동기화" },
  confirm: {
    text: "확정",
    isDropdown: true,
    options: [
      { value: "personal-rehabilitation", label: "개인회생" },
      { value: "credit-recovery", label: "신용회복" },
      { value: "bankruptcy-exemption", label: "파산면책" },
      { value: "legal-affairs-director", label: "법무원장" },
    ],
  },
  "modification-history": { text: "수정내역" },
  compare: { text: "비교" },
  progressStatus: { text: "진행상태" },
  complete: { text: "완료" },
  generateData: { text: "자료생성" },
  "history-list": { 
    text: "내역",
    isDropdown: true,
    options: [
      { value: "history-list-01", label: "내역01" },
      { value: "history-list-02", label: "내역02" },
      { value: "history-list-03", label: "내역03" },
      { value: "history-list-04", label: "내역04" },
    ],
  },
  "history-zip": { 
    text: "내역 Zip",
    isDropdown: true,
    options: [
      { value: "history-zip-list-01", label: "내역 Zip 01" },
      { value: "history-zip-list-02", label: "내역 Zip 02" },
      { value: "history-zip-list-03", label: "내역 Zip 03" },
      { value: "history-zip-list-04", label: "내역 Zip 04" },
    ],
  },
  category: {
    text: "구분",
    isDropdown: true,
    options: [
      { value: "bond", label: "채권" },
      { value: "regular-management", label: "상시관리" },
    ],
  },
};

export type ActionType = keyof typeof actionMap;

interface LeftActionsProps {
  actions: {
    id: ActionType;
    onClick?: () => void;
  }[];
}

export function LeftActions({ actions = [] }: LeftActionsProps) {
  const tabId = usePathname();
  const { currentState, updateFilters } = usePageStore();

  const handleDropdownSelect = (value: string) => {
    updateFilters(tabId, { confirmStatus: value });
  };

  return (
    <div className="flex gap-2">
      {actions.map(({ id, onClick }) => {
        const config = actionMap[id];
        if (!config) return null;

        if (config.isDropdown) {
          const selectedValue = currentState?.filters?.confirmStatus;
          const selectedOption = config.options?.find(opt => opt.value === selectedValue);
          const buttonText = selectedOption ? selectedOption.label : config.text;

          return (
            <DropdownMenu key={id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-[35px] w-36 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300 flex items-center justify-between"
                >
                  <span>{buttonText}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                {config.options?.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => handleDropdownSelect(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        const finalOnClick = config.handler || onClick;

        return (
          <Button
            key={id}
            variant="secondary"
            className="h-[35px] w-28 cursor-pointer rounded-[18px] bg-[#e5e5e5] text-black hover:bg-gray-300"
            onClick={finalOnClick}
          >
            {config.text}
          </Button>
        );
      })}
    </div>
  );
}

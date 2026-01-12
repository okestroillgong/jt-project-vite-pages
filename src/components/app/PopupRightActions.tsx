

import { Button } from "@/components/ui/button";

export interface PopupAction {
  id: string;
  text: string;
  onClick?: () => void;
}

interface PopupRightActionsProps {
  actions: PopupAction[];
}

export function PopupRightActions({ actions }: PopupRightActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {actions.map(({ id, text, onClick }) => (
        <Button
          key={id}
          variant="secondary"
          className="h-[35px] w-24 cursor-pointer rounded-2xl"
          onClick={onClick}
        >
          {text}
        </Button>
      ))}
    </div>
  );
}

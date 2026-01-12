

import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";

export default function DebtAdjustmentESignaturePopup() {

  const popupActions: PopupAction[] = [
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      {/* 1. Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold">채무조정 전자서명</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 flex gap-4 min-h-0 p-4">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-2">
           <h2 className="text-base font-semibold">1차 전자서명</h2>
           <div className="flex-1 border rounded-lg p-4 bg-white">
                {/* Content will be added later */}
           </div>
        </div>
        
        {/* Right Panel */}
        <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-base font-semibold">2차 전자서명</h2>
            <div className="flex-1 border rounded-lg p-4 bg-white">
                {/* Content will be added later */}
            </div>
        </div>
      </div>
    </div>
  );
}

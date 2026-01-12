

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IconReset from "@/assets/icons/js/오른쪽버튼아이콘01초기화흰색";
import IconExcel from "@/assets/icons/js/오른쪽버튼아이콘02엑셀다운로드흰색";
import IconDelete from "@/assets/icons/js/오른쪽버튼아이콘05삭제흰색";
import IconSearch from "@/assets/icons/js/오른쪽버튼아이콘06조회흰색";
import IconRegister from "@/assets/icons/js/오른쪽버튼아이콘03등록흰색";
import IconSave from "@/assets/icons/js/오른쪽버튼아이콘04저장흰색";
import IconScan from "@/assets/icons/js/오른쪽버튼아이콘07문서스캔흰색";
import IconAttach from "@/assets/icons/js/오른쪽버튼아이콘08파일첨부흰색";
import IconSearchDoc from "@/assets/icons/js/오른쪽버튼아이콘09문서검색흰색";
import IconDataReset from "@/assets/icons/js/오른쪽버튼아이콘10데이터초기화흰색";
import { X, CheckCircle, FilePenLine, FileText, ShieldCheck, Percent, Hourglass, History, Printer, Gavel, Play, Pause, XSquare, ExternalLink, Star } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useTabStore } from "@/lib/store/tabs";

// 각 액션 버튼의 설정을 위한 타입을 정의합니다.
type ActionConfig = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
  handler?: () => void; // handler는 선택적 프로퍼티입니다.
};

const iconMap: Record<string, ActionConfig> = {
  reset: {
    icon: IconReset,
    text: "페이지 새로고침",
    handler: () => window.location.reload(),
  },
  excel: { icon: IconExcel, text: "엑셀다운로드" },
  "excel-generate": { icon: IconSave, text: "엑셀생성" },
  delete: { icon: IconDelete, text: "삭제" },
  search: { icon: IconSearch, text: "조회" },
  register: { icon: IconRegister, text: "등록" },
  new: { icon: IconRegister, text: "신규" },
  save: { icon: IconSave, text: "저장" },
  process: { icon: IconSave, text: "처리" },
  scan: { icon: IconScan, text: "문서 스캔" },
  attach: { icon: IconAttach, text: "파일첨부" },
  "file-upload": { icon: IconAttach, text: "파일 업로드" },
  "excel-upload": { icon: IconAttach, text: "엑셀업로드" },
  "court-search": { icon: Gavel, text: "법원사건조회" },
  edit: { icon: FilePenLine, text: "수정" },
    searchDoc: { 
      icon: IconSearchDoc, 
      text: "문서검색",
    },  "data-reset": { icon: IconDataReset, text: "데이터 초기화" },
  close: { icon: X, text: "닫기", handler: () => window.close() },
  assignConfirm: { icon: CheckCircle, text: "지정확인" },
  modify: { icon: FilePenLine, text: "수정" },
  auditOpinion: { icon: FileText, text: "감리미의견" },
  auditConfirm: { icon: ShieldCheck, text: "감리확인" },
  surcharge: { icon: Percent, text: "할증차금" },
  progressStatus: { icon: Hourglass, text: "진행상태" },
  history: { icon: History, text: "수정내역" },
  print: { icon: Printer, text: "인쇄" },
  "loss-confirmation": { icon: CheckCircle, text: "로스확정" },
  "doc-reception": { icon: FileText, text: "문서접수" },
  execute: { icon: Play, text: "실행" },
  stop: { icon: Pause, text: "중지" },
  terminate: { icon: XSquare, text: "종료" },
  "open-popup": { icon: ExternalLink, text: "새 창으로 열기" },
  favorite: { icon: Star, text: "즐겨찾기" },
};

export type ActionType = keyof typeof iconMap;

interface RightActionsProps {
  actions: {
    id: ActionType;
    onClick?: () => void; // 'reset'과 같이 고정된 동작이 있는 버튼은 onClick이 필요 없습니다.
  }[];
}

const getButtonColors = (id: ActionType) => {
  switch (id) {
    case "register":
    case "save":
      return "bg-[#ababab] hover:bg-[#ababab]/90";
    case "search":
      return "bg-[#45de85] hover:bg-[#45de85]/90";
    default:
      return "bg-[#25292e] hover:bg-[#25292e]/90";
  }
};

export function RightActions({ actions }: RightActionsProps) {
  const tabId = usePathname();
  const { isFavorite } = useFavoritesStore();
  const activeTab = useTabStore((state) => state.tabs.find(t => t.id === tabId));
  const isCurrentFavorite = isFavorite(tabId);

  // Filter out 'favorite' from actions array (it will be rendered first automatically)
  const filteredActions = actions.filter(action => action.id !== 'favorite');

  // Favorite button handler - opens favorites management popup
  const handleFavoriteClick = () => {
    const label = activeTab?.label || tabId.split('/').pop() || '페이지';
    const popupWidth = 800;
    const popupHeight = 600;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);

    window.open(
      `/popup/favorites-management?pageId=${encodeURIComponent(tabId)}&pageName=${encodeURIComponent(label)}`,
      'FavoritesManagement',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Favorite button - always rendered first */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className={`flex items-center justify-center text-white p-0 cursor-pointer ${
                isCurrentFavorite
                  ? "bg-[#f5a623] hover:bg-[#f5a623]/90"
                  : "bg-[#25292e] hover:bg-[#25292e]/90"
              }`}
              style={{ width: "35px", height: "35px", borderRadius: "8px" }}
              onClick={handleFavoriteClick}
            >
              <Star className={isCurrentFavorite ? "size-5 fill-current" : "size-5"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isCurrentFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Other action buttons */}
        {filteredActions.map(({ id, onClick }) => {
          const actionConfig = iconMap[id];
          if (!actionConfig) return null;

          const { icon: Icon, text, handler } = actionConfig;
          const colors = getButtonColors(id);

          // Allow overriding the default handler if an onClick is provided
          let finalOnClick = onClick || handler;

          if (id === 'searchDoc' && !onClick) {
            finalOnClick = () => {
              const popupWidth = 1600;
              const popupHeight = 800;
              const left = (window.screen.width / 2) - (popupWidth / 2);
              const top = (window.screen.height / 2) - (popupHeight / 2);
              window.open(
                `/popup/document-search?openerTabId=${tabId}`,
                'DocumentSearch',
                `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
              );
            }
          }

          if (id === 'open-popup' && !onClick) {
            finalOnClick = () => {
              const popupWidth = 1600;
              const popupHeight = 800;
              const left = (window.screen.width / 2) - (popupWidth / 2);
              const top = (window.screen.height / 2) - (popupHeight / 2);
              // 현재 페이지를 팝업으로 열기 (popup 경로로 변환)
              const popupPath = `/popup${tabId}`;
              window.open(
                popupPath,
                'PagePopup',
                `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
              );
            }
          }

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  className={`flex items-center justify-center text-white p-0 cursor-pointer ${colors}`}
                  style={{ width: "35px", height: "35px", borderRadius: "8px" }}
                  onClick={finalOnClick}
                >
                  <Icon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{text}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
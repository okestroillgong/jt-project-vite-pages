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
import {
  X,
  CheckCircle,
  FilePenLine,
  FileText,
  ShieldCheck,
  Percent,
  Play,
  Pause,
  XSquare,
  ExternalLink,
  Star,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useTabStore } from "@/lib/store/tabs";
import { getPageNameOrFallback } from "@/lib/utils/pageNames";

// 각 액션 버튼의 설정을 위한 타입을 정의합니다.
type ActionConfig = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
  tooltip: string;
  onClick: () => void;
  visible?: boolean;
};

// 각 페이지에서 사용할 액션 버튼 구성을 정의합니다.
// pathKey는 URL path의 key로 사용되며, 각 키에 해당하는 버튼들이 렌더링됩니다.
type ActionsConfig = {
  [pathKey: string]: ActionConfig[];
};

export default function RightActions() {
  const pathname = usePathname();
  const { currentTabId, getTabById } = useTabStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  // 현재 탭 정보
  const currentTab = currentTabId ? getTabById(currentTabId) : null;
  const tabId = currentTab?.id ?? pathname;
  const label = currentTab?.label ?? getPageNameOrFallback(tabId);

  // Favorites 팝업 열기
  const openFavoritesPopup = () => {
    const popupWidth = 1200;
    const popupHeight = 800;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);

    window.open(
      `/popup/favorites-management?pageId=${encodeURIComponent(tabId)}&pageName=${encodeURIComponent(label)}`,
      'FavoritesManagement',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );
  };

  // 경로 매칭용 키(기본적으로 pathname)
  const pathKey = pathname;

  // 버튼 동작(샘플/placeholder)
  const handleReset = () => console.log("초기화 클릭", tabId);
  const handleExcel = () => console.log("엑셀 다운로드 클릭", tabId);
  const handleDelete = () => console.log("삭제 클릭", tabId);
  const handleSearch = () => console.log("조회 클릭", tabId);
  const handleRegister = () => console.log("등록 클릭", tabId);
  const handleSave = () => console.log("저장 클릭", tabId);
  const handleScan = () => console.log("문서 스캔 클릭", tabId);
  const handleAttach = () => console.log("파일 첨부 클릭", tabId);
  const handleDataReset = () => console.log("데이터 초기화 클릭", tabId);

  const actionsConfig: ActionsConfig = {
    // 예시: 특정 경로별 버튼 구성
    "/after-loan/bond-adjustment/bond-inquiry/": [
      { icon: IconReset, text: "초기화", tooltip: "초기화", onClick: handleReset },
      { icon: IconSearch, text: "조회", tooltip: "조회", onClick: handleSearch },
      { icon: IconExcel, text: "엑셀", tooltip: "엑셀 다운로드", onClick: handleExcel },
      { icon: Star as any, text: "즐겨찾기", tooltip: "즐겨찾기 관리", onClick: openFavoritesPopup },
    ],
  };

  // 기본 버튼(경로별 구성 없을 때)
  const defaultActions: ActionConfig[] = [
    { icon: IconReset, text: "초기화", tooltip: "초기화", onClick: handleReset },
    { icon: IconSearch, text: "조회", tooltip: "조회", onClick: handleSearch },
  ];

  const actions = actionsConfig[pathKey] ?? defaultActions;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {actions.map((action, idx) => {
          const visible = action.visible ?? true;
          if (!visible) return null;

          return (
            <Tooltip key={`${action.text}-${idx}`}>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  className="h-9 px-3 gap-2"
                  onClick={action.onClick}
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-sm">{action.text}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{action.tooltip}</TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>

      {/* 현재 탭 즐겨찾기 토글(예: 별 아이콘) */}
      <Button
        variant="outline"
        className="h-9 px-3 gap-2"
        onClick={() => toggleFavorite({ id: tabId, label })}
      >
        <Star className="h-4 w-4" />
        <span className="text-sm">
          {isFavorite(tabId) ? "해제" : "추가"}
        </span>
      </Button>
    </div>
  );
}

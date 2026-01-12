

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IconReset from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯01珥덇린?뷀씛??;
import IconExcel from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯02?묒??ㅼ슫濡쒕뱶?곗깋";
import IconDelete from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯05??젣?곗깋";
import IconSearch from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯06議고쉶?곗깋";
import IconRegister from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯03?깅줉?곗깋";
import IconSave from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯04??ν씛??;
import IconScan from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯07臾몄꽌?ㅼ틪?곗깋";
import IconAttach from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯08?뚯씪泥⑤??곗깋";
import IconSearchDoc from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯09臾몄꽌寃?됲씛??;
import IconDataReset from "@/assets/icons/js/?ㅻⅨ履쎈쾭?쇱븘?댁퐯10?곗씠?곗큹湲고솕?곗깋";
import { X, CheckCircle, FilePenLine, FileText, ShieldCheck, Percent, Hourglass, History, Printer, Gavel, Play, Pause, XSquare, ExternalLink, Star } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useTabStore } from "@/lib/store/tabs";
import { getPageNameOrFallback } from "@/lib/utils/pageNames";

// 媛??≪뀡 踰꾪듉???ㅼ젙???꾪븳 ??낆쓣 ?뺤쓽?⑸땲??
type ActionConfig = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
  handler?: () => void; // handler???좏깮???꾨줈?쇳떚?낅땲??
};

const iconMap: Record<string, ActionConfig> = {
  reset: {
    icon: IconReset,
    text: "?섏씠吏 ?덈줈怨좎묠",
    handler: () => window.location.reload(),
  },
  excel: { icon: IconExcel, text: "?묒??ㅼ슫濡쒕뱶" },
  "excel-generate": { icon: IconSave, text: "?묒??앹꽦" },
  delete: { icon: IconDelete, text: "??젣" },
  search: { icon: IconSearch, text: "議고쉶" },
  register: { icon: IconRegister, text: "?깅줉" },
  new: { icon: IconRegister, text: "?좉퇋" },
  save: { icon: IconSave, text: "??? },
  process: { icon: IconSave, text: "泥섎━" },
  scan: { icon: IconScan, text: "臾몄꽌 ?ㅼ틪" },
  attach: { icon: IconAttach, text: "?뚯씪泥⑤?" },
  "file-upload": { icon: IconAttach, text: "?뚯씪 ?낅줈?? },
  "excel-upload": { icon: IconAttach, text: "?묒??낅줈?? },
  "court-search": { icon: Gavel, text: "踰뺤썝?ш굔議고쉶" },
  edit: { icon: FilePenLine, text: "?섏젙" },
    searchDoc: { 
      icon: IconSearchDoc, 
      text: "臾몄꽌寃??,
    },  "data-reset": { icon: IconDataReset, text: "?곗씠??珥덇린?? },
  close: { icon: X, text: "?リ린", handler: () => window.close() },
  assignConfirm: { icon: CheckCircle, text: "吏?뺥솗?? },
  modify: { icon: FilePenLine, text: "?섏젙" },
  auditOpinion: { icon: FileText, text: "媛먮━誘몄쓽寃? },
  auditConfirm: { icon: ShieldCheck, text: "媛먮━?뺤씤" },
  surcharge: { icon: Percent, text: "?좎쬆李④툑" },
  progressStatus: { icon: Hourglass, text: "吏꾪뻾?곹깭" },
  history: { icon: History, text: "?섏젙?댁뿭" },
  print: { icon: Printer, text: "?몄뇙" },
  "loss-confirmation": { icon: CheckCircle, text: "濡쒖뒪?뺤젙" },
  "doc-reception": { icon: FileText, text: "臾몄꽌?묒닔" },
  execute: { icon: Play, text: "?ㅽ뻾" },
  stop: { icon: Pause, text: "以묒?" },
  terminate: { icon: XSquare, text: "醫낅즺" },
  "open-popup": { icon: ExternalLink, text: "??李쎌쑝濡??닿린" },
  favorite: { icon: Star, text: "利먭꺼李얘린" },
};

export type ActionType = keyof typeof iconMap;

interface RightActionsProps {
  actions: {
    id: ActionType;
    onClick?: () => void; // 'reset'怨?媛숈씠 怨좎젙???숈옉???덈뒗 踰꾪듉? onClick???꾩슂 ?놁뒿?덈떎.
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
    const label = activeTab?.label || getPageNameOrFallback(tabId);
    const popupWidth = 800;
    const popupHeight = 600;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);

    window.open(
      `${import.meta.env.BASE_URL}popup/favorites-management?pageId=${encodeURIComponent(tabId)}&pageName=${encodeURIComponent(label)}`,
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
            <p>{isCurrentFavorite ? '利먭꺼李얘린 ?댁젣' : '利먭꺼李얘린 異붽?'}</p>
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
                `${import.meta.env.BASE_URL}popup/document-search?openerTabId=${tabId}`,
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
              // ?꾩옱 ?섏씠吏瑜??앹뾽?쇰줈 ?닿린 (popup 寃쎈줈濡?蹂??
              const popupPath = `${import.meta.env.BASE_URL}popup${tabId}`;
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

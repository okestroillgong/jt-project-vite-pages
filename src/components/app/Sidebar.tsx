

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronUp, Star, Menu, Folder, FolderOpen } from "lucide-react";
import { useTabStore } from "@/lib/store/tabs";
import { useLayoutStore } from "@/lib/store/layoutStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";

// 1st level icons
import IconMainMenu01 from "@/assets/icons/js/硫붿씤硫붾돱01?곷떞愿由?;
import IconMainMenu02 from "@/assets/icons/js/硫붿씤硫붾돱02?ъ떊?ы썑";

// 2nd level icons
import IconSubMenu01 from "@/assets/icons/js/?쒕툕硫붾돱01梨꾧텒議곗젙";
import IconSubMenu02 from "@/assets/icons/js/?쒕툕硫붾돱02梨꾧텒愿由?;
import IconSubMenu03 from "@/assets/icons/js/?쒕툕硫붾돱03?ъ궛議곗궗";
import IconSubMenu04 from "@/assets/icons/js/?쒕툕硫붾돱04踰뺤쟻議곗튂";
import IconSubMenu05 from "@/assets/icons/js/?쒕툕硫붾돱05?먯궛嫄댁쟾?깅??먯긽媛?;
import IconSubMenu06 from "@/assets/icons/js/?쒕툕硫붾돱06?뱀닔梨꾧텒";
import IconSubMenu07 from "@/assets/icons/js/?쒕툕硫붾돱07留ㅺ컖梨꾧텒?쇨큵?깅줉";
import IconSubMenu08 from "@/assets/icons/js/?쒕툕硫붾돱08梨꾧텒愿由щ벑湲됱뿊??낅줈??;
import IconCreditMonitoring from "@/assets/icons/js/IconCreditMonitoring";
import IconSettings from "@/assets/icons/js/IconSettings";
import IconAdmin from "@/assets/icons/js/IconAdmin";

import IconGijun from "@/assets/icons/js/IconGijun";
import IconEmail from "@/assets/icons/js/IconEmail";
import IconIlban from "@/assets/icons/js/IconIlban";
import IconHelpdesk from "@/assets/icons/js/IconHelpdesk";

const primaryNavItems = [
  { name: "?곷떞愿由?, icon: IconMainMenu01, href: "#", panelId: "counseling" },
  { name: "?ъ떊?ы썑", icon: IconMainMenu02, href: "#", panelId: "afterLoan" },
  { name: "?ㅼ젙", icon: IconSettings, href: "/under-construction?page=?ㅼ젙", panelId: "under-construction" },
];

const counselingSecondaryNavItems = [
  {
    name: "?쇰컲?곷떞",
    icon: IconIlban,
    children: [
        { name: "梨꾧텒?곷떞", href: "/counseling/general-counseling/bond-counseling" },
        { name: "洹몃９??梨꾧텒)", href: "/under-construction?page=洹몃９??梨꾧텒)" },
        { name: "諛곗젙愿由?梨꾧텒)", href: "/under-construction?page=諛곗젙愿由?梨꾧텒)" },
        { name: "?대떦?먮?寃쎌씠??, href: "/counseling/general-counseling/manager-change-history" },
        { name: "?곷떞愿由?梨꾧텒)", href: "/under-construction?page=?곷떞愿由?梨꾧텒)" },
        { name: "CMS?묐떦?쇱“??, href: "/counseling/general-counseling/cms-due-date" },
        { name: "留ㅺ컖/?곴컖 由ъ뒪??, href: "/counseling/general-counseling/sale-write-off-list" },
        { name: "PDS愿由?, href: "/counseling/general-counseling/pds-management" },
        { name: "PDS(梨꾧텒)", href: "/under-construction?page=PDS(梨꾧텒)" },
    ]
  },
  {
    name: "SMS/?대찓??,
    icon: IconEmail,
    href: "/under-construction?page=SMS/?대찓??,
  },
  {
    name: "HELPDESK",
    icon: IconHelpdesk,
    href: "/under-construction?page=HELPDESK",
  },
  {
    name: "湲곗??뺣낫",
    icon: IconGijun,
    href: "/under-construction?page=湲곗??뺣낫",
  },
];

const afterLoanSecondaryNavItems = [
  {
    name: "梨꾧텒議곗젙",
    icon: IconSubMenu01,
    children: [
      {
        name: "梨꾧텒議고쉶",
        href: "/after-loan/bond-adjustment/bond-inquiry",
      },
      {
        name: "?좎슜?뚮났愿由?,
        href: "/after-loan/bond-adjustment/credit-recovery",
      },
      {
        name: "媛쒖씤?뚯깮愿由?,
        href: "/after-loan/bond-adjustment/personal-rehabilitation",
      },
      {
        name: "?뚯궛硫댁콉愿由?,
        href: "/after-loan/bond-adjustment/bankruptcy-exemption",
      },
      {
        name: "梨꾧텒?뺣낫?숆린??,
        href: "/under-construction?page=梨꾧텒?뺣낫?숆린??,
      },
      {
        name: "誘몄쿂由ш툑?≪“??,
        href: "/under-construction?page=誘몄쿂由ш툑?≪“??,
      },
      {
        name: "梨꾨Т議곗젙愿由?,
        href: "/after-loan/bond-adjustment/debt-adjustment-management",
      },
      {
        name: "梨꾧텒議고쉶 (梨꾨Т議곗젙愿由??앹뾽 ?앹꽦)",
        href: "/under-construction?page=梨꾧텒議고쉶 (梨꾨Т議곗젙愿由??앹뾽 ?앹꽦)",
      },
    ],
  },
  {
    name: "梨꾧텒愿由?,
    icon: IconSubMenu02,
    href: "/under-construction?page=梨꾧텒愿由?,
  },
  {
    name: "?ъ궛議곗궗",
    icon: IconSubMenu03,
    href: "/under-construction?page=?ъ궛議곗궗",
  },
  {
    name: "踰뺤쟻議곗튂",
    icon: IconSubMenu04,
    children: [
        { name: "踰뺣Т?뺣낫 ?숆린??, href: "/after-loan/legal-action/legal-info-sync" },
        { name: "踰뺣Т吏꾪뻾 議고쉶", href: "/after-loan/legal-action/inquiry-legal-proceedings" },
        { name: "踰뺣Т愿由?, href: "/after-loan/legal-action/legal-management" },
        { name: "?ы썑愿由ъ씪吏議고쉶", href: "/under-construction?page=?ы썑愿由ъ씪吏議고쉶" },
        { name: "梨꾧텒?뱀꽦?뺣낫", href: "/under-construction?page=梨꾧텒?뱀꽦?뺣낫" },
        { name: "?듯빀?묒??낅줈??, href: "/after-loan/legal-action/excel-upload" },
    ]
  },
  {
    name: "?ъ궛嫄댁쟾????먯긽媛?,
    icon: IconSubMenu05,
    children: [
        { name: "嫄댁쟾??湲곗큹?먮즺 ?앹꽦", href: "/after-loan/asset-soundness-bad-debt/soundness-foundation-data-generation" },
        { name: "嫄댁쟾???먮즺 ?앹꽦", href: "/after-loan/asset-soundness-bad-debt/soundness-data-generation" },
        { name: "?먯궛嫄댁쟾??寃利?, href: "/after-loan/asset-soundness-bad-debt/asset-soundness-verification" },
        { name: "??먯긽媛곷???愿由?, href: "/after-loan/asset-soundness-bad-debt/bad-debt-management" },
        { name: "??먯긽媛곷???議고쉶", href: "/after-loan/asset-soundness-bad-debt/write-off-target" },
        { name: "??먯떊泥?콈沅뚮챸??, href: "/after-loan/asset-soundness-bad-debt/write-off-application-specifications" },
        { name: "遺?ㅼ콉?꾩꽦?ъ쓽猶곗꽌", href: "/under-construction?page=遺?ㅼ콉?꾩꽦?ъ쓽猶곗꽌" },
        { name: "?곸뾽援ъ뿭 二쇱냼愿由?, href: "/after-loan/asset-soundness-bad-debt/business-area-address-management" },
    ]
  },
  {
    name: "?뱀닔梨꾧텒",
    icon: IconSubMenu06,
    children: [
        { name: "?뱀닔梨꾧텒 ?몄엯議고쉶", href: "/after-loan/special-bond/subscription-inquiry" },
        { name: "?뱀닔梨꾧텒 愿由щ???, href: "/after-loan/special-bond/management-ledger" },
        { name: "?뱀닔梨꾧텒 ?대떦?먭?由?, href: "/after-loan/special-bond/manager-management" },
        { name: "?뱀닔梨꾧텒 ?대떦?먯“??, href: "/after-loan/special-bond/manager-inquiry" },
    ]
  },
  {
    name: "?ъ떊?곸떆紐⑤땲?곕쭅",
    icon: IconCreditMonitoring,
    children: [
        { name: "?ъ떊?곸떆紐⑤땲?곕쭅 蹂?숉쁽??, href: "/under-construction?page=?ъ떊?곸떆紐⑤땲?곕쭅 蹂?숉쁽?? },
        { name: "?ъ떊?곸떆紐⑤땲?곕쭅 寃곌낵", href: "/under-construction?page=?ъ떊?곸떆紐⑤땲?곕쭅 寃곌낵" },
    ]
  },
  {
    name: "留ㅺ컖梨꾧텒?쇨큵?깅줉",
    icon: IconSubMenu07,
    href: "/after-loan/collective-registration-of-bonds-for-sale",
  },
  {
    name: "梨꾧텒愿由щ벑湲??묒? ?낅줈??,
    icon: IconSubMenu08,
    href: "/after-loan/credit-rating-excel-upload",
  },
];

export function Sidebar() {
  const [selected, setSelected] = useState("?곷떞愿由?);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'menu' | 'favorites'>('menu');

  const router = useRouter();
  const pathname = usePathname();
  const { addTab } = useTabStore();
  const { isSidebarExpanded } = useLayoutStore();

  useEffect(() => {
    const currentItem = primaryNavItems.find(item => pathname.startsWith(item.href) && item.href !== "#");
    if (currentItem) {
      setSelected(currentItem.name);
    } else if (pathname.startsWith("/after-loan")) {
      setSelected("?ъ떊?ы썑");
      if (isSidebarExpanded) {
        setExpandedMenu("?ъ떊?ы썑");
      }
    }
  }, [pathname, isSidebarExpanded]);

  const handleLinkClick = (path: string, label: string) => {
    addTab({ id: path, label, path });
    router.push(path);
  };

  const handlePrimaryNavClick = (item: (typeof primaryNavItems)[0]) => {
    setSelected(item.name);
    
    if (isSidebarExpanded) {
        if (item.name === "?ъ떊?ы썑") {
            setExpandedMenu(expandedMenu === "?ъ떊?ы썑" ? null : "?ъ떊?ы썑");
        } else if (item.name === "?곷떞愿由?) {
             setExpandedMenu(expandedMenu === "?곷떞愿由? ? null : "?곷떞愿由?);
        } else {
            // Leaf node navigation
            if (item.href !== "#") {
                handleLinkClick(item.href, item.name);
            }
        }
    } else {
        if (item.name !== "?ъ떊?ы썑" && item.href !== "#") {
            handleLinkClick(item.href, item.name);
        }
    }
  };

  return (
    <div
      className="relative flex h-full"
      onMouseLeave={() => {
        if (openPanel !== 'favorites') {
          setOpenPanel(null);
        }
      }}
    >
      <aside className={cn(
          "flex h-full flex-col py-4 transition-all duration-300",
          isSidebarExpanded ? "w-64" : "w-[108px]"
      )}>
        {/* Tab Buttons */}
        {isSidebarExpanded ? (
          <div className="flex gap-1 px-4 mb-4">
            <Button
              variant={sidebarTab === 'favorites' ? 'default' : 'ghost'}
              onClick={() => setSidebarTab('favorites')}
              className={cn(
                "flex-1 h-9 rounded-xl transition-colors",
                sidebarTab === 'favorites'
                  ? "bg-[#25292e] text-white hover:bg-[#25292e]/90"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              利먭꺼李얘린
            </Button>
            <Button
              variant={sidebarTab === 'menu' ? 'default' : 'ghost'}
              onClick={() => {
                setSidebarTab('menu');
                setOpenPanel(null);
              }}
              className={cn(
                "flex-1 h-9 rounded-xl transition-colors",
                sidebarTab === 'menu'
                  ? "bg-[#25292e] text-white hover:bg-[#25292e]/90"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              ?낅Т硫붾돱
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 px-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => {
                setSidebarTab('favorites');
                setOpenPanel('favorites');
              }}
              className={cn(
                "h-10 w-full rounded-xl transition-colors",
                sidebarTab === 'favorites'
                  ? "bg-[#25292e] text-white hover:bg-[#25292e] hover:text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <Star className="size-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSidebarTab('menu');
                setOpenPanel(null);
              }}
              className={cn(
                "h-10 w-full rounded-xl transition-colors",
                sidebarTab === 'menu'
                  ? "bg-[#25292e] text-white hover:bg-[#25292e] hover:text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        )}

        {/* Scrollable Menu Area */}
        {sidebarTab === 'menu' && (
        <div className="flex-grow overflow-y-auto no-scrollbar">
          <div className="px-4">
            {primaryNavItems.map((item) => {
              const isSelected = selected === item.name;
              const hasChildren = item.name === "?ъ떊?ы썑" || item.name === "?곷떞愿由?;

              return (
                <div key={item.name} className="w-full mb-1">
                    <Button
                        variant={isSelected ? "secondary" : "ghost"}
                        className={cn(
                            "group flex w-full items-center gap-3 rounded-2xl py-3 transition-colors duration-300 ease-in-out",
                            isSidebarExpanded ? "justify-between h-12 px-3" : "justify-center h-12 flex-row",
                            { "bg-[#219361] text-[#fefefe]": isSelected },
                            { "text-gray-800": !isSelected },
                            "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                        )}
                        onClick={() => handlePrimaryNavClick(item)}
                        onMouseEnter={() => !isSidebarExpanded && setOpenPanel(item.panelId || null)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 flex items-center justify-center">
                                <item.icon className={cn("size-5", isSelected ? "text-[#fefefe]" : "text-gray-800", "group-hover:text-gray-800")} />
                            </div>
                            {isSidebarExpanded && (
                                <span className={cn("text-sm font-medium", isSelected ? "text-[#fefefe]" : "text-gray-800", "group-hover:text-gray-800")}>
                                    {item.name}
                                </span>
                            )}
                        </div>
                        
                        {/* Arrows */}
                        {isSidebarExpanded ? (
                            hasChildren && (
                                expandedMenu === item.name 
                                    ? <ChevronUp className={cn("size-4", isSelected ? "text-[#fefefe]" : "text-gray-800", "group-hover:text-gray-800")} />
                                    : <ChevronDown className={cn("size-4", isSelected ? "text-[#fefefe]" : "text-gray-800", "group-hover:text-gray-800")} />
                            )
                        ) : (
                            <ChevronRight className={cn("size-4", isSelected ? "text-[#fefefe]" : "text-gray-800", "group-hover:text-gray-800")} />
                        )}
                    </Button>

                    {/* Inline Submenu for Expanded Mode */}
                    {isSidebarExpanded && expandedMenu === item.name && (
                        <div className="mt-1 space-y-1">
                            {item.name === "?ъ떊?ы썑" && (
                                <InlineAfterLoanMenu handleLinkClick={handleLinkClick} />
                            )}
                            {item.name === "?곷떞愿由? && (
                                <InlineCounselingMenu handleLinkClick={handleLinkClick} />
                            )}
                        </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Favorites List */}
        {sidebarTab === 'favorites' && (
          <FavoritesList
            handleLinkClick={handleLinkClick}
            isExpanded={isSidebarExpanded}
          />
        )}

        {/* Admin Profile Section - Sticky Footer */}
        <div className={cn("flex-shrink-0 px-4 pt-2 pb-0", isSidebarExpanded ? "border-t" : "pt-4")}>
            <div className={cn("flex", isSidebarExpanded ? "items-start gap-3" : "justify-center items-center")}>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black">
                    <IconAdmin className="size-6 text-white" />
                </div>
                {isSidebarExpanded && (
                     <div className="overflow-hidden flex flex-col justify-start">
                        <p className="truncate text-sm font-semibold text-gray-800 leading-tight">
                            ?띻만??                        </p>
                        <p className="truncate text-xs text-gray-500 mt-0.5">
                            admin@example.com
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-800 mt-1">
                            JT 移쒖븷?異뺤???                        </p>
                    </div>
                )}
            </div>
        </div>
      </aside>

      {/* Floating Panel for Collapsed Mode ONLY */}
      {!isSidebarExpanded && openPanel && (
        <div className="absolute left-full top-0 h-full py-2 z-20">
          {openPanel === 'afterLoan' && <AfterLoanSecondarySidebar handleLinkClick={handleLinkClick} />}
          {openPanel === 'counseling' && <CounselingSecondarySidebar handleLinkClick={handleLinkClick} />}
          {openPanel === 'favorites' && <FavoritesSecondarySidebar handleLinkClick={handleLinkClick} />}
        </div>
      )}
    </div>
  );
}

function InlineAfterLoanMenu({ handleLinkClick }: { handleLinkClick: (path: string, label: string) => void }) {
    const activeTabId = useTabStore((state) => state.activeTabId);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const checkIsActive = (href: string) => activeTabId === href;

    return (
        <div className="flex flex-col w-full gap-1">
            {afterLoanSecondaryNavItems.map((item) => (
                <div key={item.name}>
                    {item.children ? (
                        <>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "group w-full flex items-center justify-between pl-12 pr-4 h-10 text-sm rounded-2xl transition-colors",
                                    { "bg-[#219361] text-[#fefefe]": openSubMenu === item.name },
                                    { "text-gray-800": openSubMenu !== item.name },
                                    "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                                )}
                                onClick={() => setOpenSubMenu(openSubMenu === item.name ? null : item.name)}
                            >
                                <div className="flex items-center gap-2 overflow-hidden ml-5">
                                     {item.icon && (
                                        <item.icon className={cn("size-5 shrink-0", 
                                            openSubMenu === item.name ? "text-[#fefefe] brightness-0 invert" : "text-gray-800",
                                            "group-hover:text-gray-800 group-hover:brightness-100 group-hover:invert-0"
                                        )} />
                                     )}
                                    <span className="truncate">{item.name}</span>
                                </div>
                                <ChevronDown
                                    className={cn("size-3 transition-transform", 
                                        { "rotate-180": openSubMenu === item.name },
                                        openSubMenu === item.name ? "text-[#fefefe]" : "text-gray-800",
                                        "group-hover:text-gray-800"
                                    )}
                                />
                            </Button>
                            {openSubMenu === item.name && (
                                <div className="mt-1 space-y-1">
                                    {item.children.map((child) => (
                                        <Button
                                            key={child.name}
                                            variant="ghost"
                                            className={cn(
                                                "group w-full flex items-center justify-start pl-14 pr-4 h-9 text-xs transition-colors",
                                                "rounded-[0.8rem]",
                                                checkIsActive(child.href) 
                                                    ? "bg-[#219361] text-[#fefefe] font-medium"
                                                    : "text-gray-800",
                                                "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                                            )}
                                            onClick={() => {
                                                if (child.name === "梨꾧텒議고쉶 (梨꾨Т議곗젙愿由??앹뾽 ?앹꽦)") {
                                                    const popupWidth = 1600;
                                                    const popupHeight = 800;
                                                    const left = (window.screen.width / 2) - (popupWidth / 2);
                                                    const top = (window.screen.height / 2) - (popupHeight / 2);
                                                    window.open(
                                                      '${import.meta.env.BASE_URL}popup/debt-adjustment-management',
                                                      'DebtAdjustmentManagement',
                                                      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
                                                    );
                                                } else {
                                                    handleLinkClick(child.href, child.name);
                                                }
                                            }}
                                        >
                                            <span className="truncate">??{child.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn(
                                "group w-full flex items-center justify-start pl-8 pr-4 h-10 text-sm rounded-2xl transition-colors",
                                item.href && checkIsActive(item.href) 
                                    ? "bg-[#219361] text-[#fefefe] font-medium"
                                    : "text-gray-800",
                                "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                            )}
                            onClick={() => item.href && handleLinkClick(item.href, item.name)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {item.icon && (
                                    <item.icon className={cn("size-5 shrink-0", 
                                        item.href && checkIsActive(item.href) ? "text-[#fefefe] brightness-0 invert" : "text-gray-800",
                                        "group-hover:text-gray-800 group-hover:brightness-100 group-hover:invert-0"
                                    )} />
                                )}
                                <span className="truncate">{item.name}</span>
                            </div>
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}

function CounselingSecondarySidebar({ handleLinkClick }: { handleLinkClick: (path: string, label: string) => void }) {
  const activeTabId = useTabStore((state) => state.activeTabId);

  const findOpenSubMenu = () => {
    if (!activeTabId || !activeTabId.startsWith('/counseling')) {
      return null; 
    }
    const foundParent = counselingSecondaryNavItems.find(item => 
      item.children?.some(child => child.href === activeTabId)
    );
    return foundParent ? foundParent.name : null;
  };

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(findOpenSubMenu);

  const checkIsActive = (href: string) => {
    return activeTabId === href;
  };

  return (
    <aside className="h-full w-60 rounded-2xl border-r border-border bg-background py-4 ml-2 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold px-4">?곷떞愿由?/h2>
      <nav className="flex flex-col gap-1">
        {counselingSecondaryNavItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <Button
                  variant={"ghost"}
                  className="w-full flex items-center justify-between gap-1 h-10 hover:bg-muted text-foreground px-4"
                  size="icon-sm"
                  onClick={() =>
                    setOpenSubMenu(openSubMenu === item.name ? null : item.name)
                  }
                >
                  <div className="flex items-center gap-1">
                    {item.icon && (
                      <item.icon className="size-6 text-foreground shrink-0" />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      {
                        "rotate-180": openSubMenu === item.name,
                      }
                    )}
                  />
                </Button>
                {openSubMenu === item.name && (
                  <div className="py-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.name}
                        variant={"ghost"}
                        size="sm"
                        className={cn(
                          "w-full h-10 justify-start text-foreground hover:bg-muted pl-7 pr-4",
                          {
                            "bg-accent text-accent-foreground font-semibold hover:bg-accent hover:text-accent-foreground":
                              checkIsActive(child.href),
                          }
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(child.href, child.name);
                        }}
                      >
                        ??{child.name}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Button
                variant={"ghost"}
                className={cn(
                  "w-full flex items-center justify-start gap-1 h-10 hover:bg-muted text-foreground px-4",
                  {
                    "bg-accent text-accent-foreground font-semibold hover:bg-accent hover:text-accent-foreground":
                      item.href && checkIsActive(item.href),
                  }
                )}
                size="icon-sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.href) {
                    handleLinkClick(item.href, item.name);
                  }
                }}
              >
                {item.icon && (
                  <item.icon className="size-6 text-foreground shrink-0" />
                )}
                <span>{item.name}</span>
              </Button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function InlineCounselingMenu({ handleLinkClick }: { handleLinkClick: (path: string, label: string) => void }) {
    const activeTabId = useTabStore((state) => state.activeTabId);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const checkIsActive = (href: string) => activeTabId === href;

    return (
        <div className="flex flex-col w-full gap-1">
            {counselingSecondaryNavItems.map((item) => (
                <div key={item.name}>
                    {item.children ? (
                        <>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "group w-full flex items-center justify-between pl-12 pr-4 h-10 text-sm rounded-2xl transition-colors",
                                    { "bg-[#219361] text-[#fefefe]": openSubMenu === item.name },
                                    { "text-gray-800": openSubMenu !== item.name },
                                    "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                                )}
                                onClick={() => setOpenSubMenu(openSubMenu === item.name ? null : item.name)}
                            >
                                <div className="flex items-center gap-2 overflow-hidden ml-5">
                                     {item.icon && (
                                        <item.icon className={cn("size-5 shrink-0", 
                                            openSubMenu === item.name ? "text-[#fefefe] brightness-0 invert" : "text-gray-800",
                                            "group-hover:text-gray-800 group-hover:brightness-100 group-hover:invert-0"
                                        )} />
                                     )}
                                    <span className="truncate">{item.name}</span>
                                </div>
                                <ChevronDown
                                    className={cn("size-3 transition-transform", 
                                        { "rotate-180": openSubMenu === item.name },
                                        openSubMenu === item.name ? "text-[#fefefe]" : "text-gray-800",
                                        "group-hover:text-gray-800"
                                    )}
                                />
                            </Button>
                            {openSubMenu === item.name && (
                                <div className="mt-1 space-y-1">
                                    {item.children.map((child) => (
                                        <Button
                                            key={child.name}
                                            variant="ghost"
                                            className={cn(
                                                "group w-full flex items-center justify-start pl-14 pr-4 h-9 text-xs transition-colors",
                                                "rounded-[0.8rem]",
                                                checkIsActive(child.href) 
                                                    ? "bg-[#219361] text-[#fefefe] font-medium"
                                                    : "text-gray-800",
                                                "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                                            )}
                                            onClick={() => {
                                                handleLinkClick(child.href, child.name);
                                            }}
                                        >
                                            <span className="truncate">??{child.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn(
                                "group w-full flex items-center justify-start pl-8 pr-4 h-10 text-sm rounded-2xl transition-colors",
                                item.href && checkIsActive(item.href) 
                                    ? "bg-[#219361] text-[#fefefe] font-medium"
                                    : "text-gray-800",
                                "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                            )}
                            onClick={() => item.href && handleLinkClick(item.href, item.name)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {item.icon && (
                                    <item.icon className={cn("size-5 shrink-0", 
                                        item.href && checkIsActive(item.href) ? "text-[#fefefe] brightness-0 invert" : "text-gray-800",
                                        "group-hover:text-gray-800 group-hover:brightness-100 group-hover:invert-0"
                                    )} />
                                )}
                                <span className="truncate">{item.name}</span>
                            </div>
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}

function AfterLoanSecondarySidebar({ handleLinkClick }: { handleLinkClick: (path: string, label: string) => void }) {
  const activeTabId = useTabStore((state) => state.activeTabId);

  const findOpenSubMenu = () => {
    if (!activeTabId || !activeTabId.startsWith('/after-loan')) {
      return null; // Not an after-loan page, so no submenu should be open
    }
    const foundParent = afterLoanSecondaryNavItems.find(item =>
      item.children?.some(child => child.href === activeTabId)
    );
    return foundParent ? foundParent.name : null; // Return parent name or null if not found
  };

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(findOpenSubMenu);

  const checkIsActive = (href: string) => {
    return activeTabId === href;
  };

  return (
    <aside className="h-full w-60 rounded-2xl border-r border-border bg-background py-4 ml-2 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold px-4">?ъ떊?ы썑</h2>
      <nav className="flex flex-col gap-1">
        {afterLoanSecondaryNavItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <Button
                  variant={"ghost"}
                  className="w-full flex items-center justify-between gap-1 h-10 hover:bg-muted text-foreground px-4"
                  size="icon-sm"
                  onClick={() =>
                    setOpenSubMenu(openSubMenu === item.name ? null : item.name)
                  }
                >
                  <div className="flex items-center gap-1">
                    {item.icon && (
                      <item.icon className="size-6 text-foreground shrink-0" />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      {
                        "rotate-180": openSubMenu === item.name,
                      }
                    )}
                  />
                </Button>
                {openSubMenu === item.name && (
                  <div className="py-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.name}
                        variant={"ghost"}
                        size="sm"
                        className={cn(
                          "w-full h-10 justify-start text-foreground hover:bg-muted pl-7 pr-4",
                          {
                            "bg-accent text-accent-foreground font-semibold hover:bg-accent hover:text-accent-foreground":
                              checkIsActive(child.href),
                          }
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          if (child.name === "梨꾧텒議고쉶 (梨꾨Т議곗젙愿由??앹뾽 ?앹꽦)") {
                            const popupWidth = 1600;
                            const popupHeight = 800;
                            const left = (window.screen.width / 2) - (popupWidth / 2);
                            const top = (window.screen.height / 2) - (popupHeight / 2);
                            window.open(
                              '${import.meta.env.BASE_URL}popup/debt-adjustment-management',
                              'DebtAdjustmentManagement',
                              `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
                            );
                          } else {
                            handleLinkClick(child.href, child.name);
                          }
                        }}
                      >
                        ??{child.name}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Button
                variant={"ghost"}
                className={cn(
                  "w-full flex items-center justify-start gap-1 h-10 hover:bg-muted text-foreground px-4",
                  {
                    "bg-accent text-accent-foreground font-semibold hover:bg-accent hover:text-accent-foreground":
                      item.href && checkIsActive(item.href),
                  }
                )}
                size="icon-sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.href) {
                    handleLinkClick(item.href, item.name);
                  }
                }}
              >
                {item.icon && (
                  <item.icon className="size-6 text-foreground shrink-0" />
                )}
                <span>{item.name}</span>
              </Button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function FavoritesSecondarySidebar({ handleLinkClick }: { handleLinkClick: (path: string, label: string) => void }) {
  const { folders, favorites } = useFavoritesStore();
  const activeTabId = useTabStore((state) => state.activeTabId);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['root']));

  const checkIsActive = (href: string) => activeTabId === href;

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const getFolderChildren = (parentId: string | null) => {
    return folders.filter(f => f.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const getFolderFavorites = (folderId: string) => {
    return favorites.filter(f => f.folderId === folderId).sort((a, b) => b.addedAt - a.addedAt);
  };

  const renderFolder = (folder: typeof folders[0], depth: number = 0) => {
    const isOpen = openFolders.has(folder.id);
    const childFolders = getFolderChildren(folder.id);
    const folderFavorites = getFolderFavorites(folder.id);
    const hasChildren = childFolders.length > 0 || folderFavorites.length > 0;

    return (
      <div key={folder.id}>
        {/* Folder header - skip root folder header */}
        {folder.id !== 'root' && (
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between h-10 hover:bg-muted text-foreground"
            style={{ paddingLeft: `${16 + depth * 12}px`, paddingRight: '12px' }}
            onClick={() => toggleFolder(folder.id)}
          >
            <div className="flex items-center gap-3">
              {isOpen ? (
                <FolderOpen className="size-5 shrink-0 text-foreground" />
              ) : (
                <Folder className="size-5 shrink-0 text-foreground" />
              )}
              <span>{folder.name}</span>
            </div>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  { "rotate-180": isOpen }
                )}
              />
            )}
          </Button>
        )}

        {/* Folder contents */}
        {(folder.id === 'root' || isOpen) && (
          <div className="py-1">
            {/* Sub-folders */}
            {childFolders.map(childFolder => renderFolder(childFolder, folder.id === 'root' ? 0 : depth + 1))}

            {/* Favorites in this folder */}
            {folderFavorites.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-3 h-10 justify-start text-foreground hover:bg-muted",
                  {
                    "bg-accent text-accent-foreground font-semibold hover:bg-accent hover:text-accent-foreground":
                      checkIsActive(item.path),
                  }
                )}
                style={{ paddingLeft: `${16 + (folder.id === 'root' ? 0 : depth + 1) * 12}px`, paddingRight: '12px' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.path, item.label);
                }}
              >
                <Star className={cn(
                  "size-5 shrink-0",
                  checkIsActive(item.path)
                    ? "text-yellow-300 fill-yellow-300"
                    : "text-yellow-500 fill-yellow-500"
                )} />
                <span className="truncate text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getFolderChildren(null);

  if (favorites.length === 0) {
    return (
      <aside className="h-full w-60 rounded-2xl border-r border-border bg-background py-4 ml-2 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold px-4">利먭꺼李얘린</h2>
        <div className="flex items-start justify-center pt-8 text-[#25292e] text-sm">
          <div className="text-center">
            <Folder className="size-8 mx-auto mb-2 text-[#25292e]" />
            <p>利먭꺼李얘린媛 ?놁뒿?덈떎</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-60 rounded-2xl border-r border-border bg-background py-4 ml-2 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold px-4">利먭꺼李얘린</h2>
      <nav className="flex flex-col gap-1 overflow-y-auto">
        {rootFolders.map(folder => renderFolder(folder, 0))}
      </nav>
    </aside>
  );
}

function FavoritesList({
  handleLinkClick,
  isExpanded,
}: {
  handleLinkClick: (path: string, label: string) => void;
  isExpanded: boolean;
}) {
  const { folders, favorites } = useFavoritesStore();
  const activeTabId = useTabStore((state) => state.activeTabId);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['root']));

  const checkIsActive = (href: string) => activeTabId === href;

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Build folder tree
  const getFolderChildren = (parentId: string | null) => {
    return folders.filter(f => f.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const getFolderFavorites = (folderId: string) => {
    return favorites.filter(f => f.folderId === folderId).sort((a, b) => b.addedAt - a.addedAt);
  };

  const renderFolder = (folder: typeof folders[0], depth: number = 0) => {
    const isOpen = openFolders.has(folder.id);
    const childFolders = getFolderChildren(folder.id);
    const folderFavorites = getFolderFavorites(folder.id);
    const hasChildren = childFolders.length > 0 || folderFavorites.length > 0;

    if (!isExpanded) {
      // Collapsed mode: only show favorites as flat list
      return null;
    }

    // Root folder: skip header, render children directly at depth 0
    if (folder.id === 'root') {
      return (
        <div key={folder.id}>
          {/* Sub-folders at depth 0 */}
          {childFolders.map(childFolder => renderFolder(childFolder, 0))}
          {/* Favorites in root folder at depth 0 */}
          {folderFavorites.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "group w-full flex items-center gap-3 h-12 py-3 rounded-2xl transition-colors justify-start",
                checkIsActive(item.path)
                  ? "bg-[#219361] text-[#fefefe] font-medium"
                  : "text-gray-800",
                "hover:bg-[#FEFEFE] group-hover:text-gray-800"
              )}
              style={{ paddingLeft: '16px', paddingRight: '12px' }}
              onClick={() => handleLinkClick(item.path, item.label)}
            >
              <Star
                className={cn(
                  "size-5 shrink-0",
                  checkIsActive(item.path)
                    ? "text-yellow-300 fill-yellow-300"
                    : "text-yellow-500 fill-yellow-500"
                )}
              />
              <span className="truncate text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      );
    }

    return (
      <div key={folder.id}>
        {/* Folder header */}
        <Button
          variant="ghost"
          className={cn(
            "group w-full flex items-center justify-between h-12 py-3 rounded-2xl transition-colors",
            isOpen
              ? "bg-[#219361] text-[#fefefe]"
              : "text-gray-800",
            "hover:bg-[#FEFEFE] group-hover:text-gray-800"
          )}
          style={{ paddingLeft: `${16 + depth * 12}px`, paddingRight: '12px' }}
          onClick={() => toggleFolder(folder.id)}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {isOpen ? (
              <FolderOpen className={cn("size-5 shrink-0", isOpen ? "text-[#fefefe]" : "text-[#25292e]")} />
            ) : (
              <Folder className="size-5 text-[#25292e] shrink-0" />
            )}
            <span className="truncate text-sm font-medium">{folder.name}</span>
            <span className={cn("text-xs", isOpen ? "text-[#fefefe]" : "text-gray-800")}>
              {folderFavorites.length + childFolders.length}
            </span>
          </div>
          {hasChildren && (
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                isOpen ? "text-[#fefefe] rotate-180" : "text-gray-800 group-hover:text-gray-800"
              )}
            />
          )}
        </Button>

        {/* Folder contents */}
        {isOpen && (
          <div className="mt-1 space-y-1">
            {/* Sub-folders */}
            {childFolders.map(childFolder => renderFolder(childFolder, depth + 1))}

            {/* Favorites in this folder */}
            {folderFavorites.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "group w-full flex items-center gap-3 h-12 py-3 rounded-2xl transition-colors justify-start",
                  checkIsActive(item.path)
                    ? "bg-[#219361] text-[#fefefe] font-medium"
                    : "text-gray-800",
                  "hover:bg-[#FEFEFE] group-hover:text-gray-800"
                )}
                style={{ paddingLeft: `${6 + (depth + 2) * 12}px`, paddingRight: '12px' }}
                onClick={() => handleLinkClick(item.path, item.label)}
              >
                <Star
                  className={cn(
                    "size-5 shrink-0",
                    checkIsActive(item.path)
                      ? "text-yellow-300 fill-yellow-300"
                      : "text-yellow-500 fill-yellow-500"
                  )}
                />
                <span className="truncate text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Collapsed mode: only show empty space (icons shown in secondary sidebar)
  if (!isExpanded) {
    return <div className="flex-grow" />;
  }

  // Expanded mode: show folder tree
  const rootFolders = getFolderChildren(null);

  if (favorites.length === 0 && rootFolders.length <= 1) {
    return (
      <div className="flex-grow flex items-start justify-center pt-8 px-4">
        <div className="text-center text-[#25292e] text-sm">
          <Folder className="size-8 mx-auto mb-2 text-[#25292e]" />
          <p>利먭꺼李얘린???섏씠吏媛 ?놁뒿?덈떎</p>
          <p className="text-xs mt-1 text-[#25292e]/70">
            ?섏씠吏?먯꽌 ??踰꾪듉???대┃?섏뿬<br />利먭꺼李얘린瑜?異붽??섏꽭??          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-1 px-4">
        {rootFolders.map(folder => renderFolder(folder, 0))}
      </div>
    </div>
  );
}


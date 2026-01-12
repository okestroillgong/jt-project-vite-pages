

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronUp, Star, Menu } from "lucide-react";
import { useTabStore } from "@/lib/store/tabs";
import { useLayoutStore } from "@/lib/store/layoutStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";

// 1st level icons
import IconMainMenu01 from "@/assets/icons/js/메인메뉴01상담관리";
import IconMainMenu02 from "@/assets/icons/js/메인메뉴02여신사후";

// 2nd level icons
import IconSubMenu01 from "@/assets/icons/js/서브메뉴01채권조정";
import IconSubMenu02 from "@/assets/icons/js/서브메뉴02채권관리";
import IconSubMenu03 from "@/assets/icons/js/서브메뉴03재산조사";
import IconSubMenu04 from "@/assets/icons/js/서브메뉴04법적조치";
import IconSubMenu05 from "@/assets/icons/js/서브메뉴05자산건전성대손상각";
import IconSubMenu06 from "@/assets/icons/js/서브메뉴06특수채권";
import IconSubMenu07 from "@/assets/icons/js/서브메뉴07매각채권일괄등록";
import IconSubMenu08 from "@/assets/icons/js/서브메뉴08채권관리등급엑셀업로드";
import IconCreditMonitoring from "@/assets/icons/js/IconCreditMonitoring";
import IconSettings from "@/assets/icons/js/IconSettings";
import IconAdmin from "@/assets/icons/js/IconAdmin";

import IconGijun from "@/assets/icons/js/IconGijun";
import IconEmail from "@/assets/icons/js/IconEmail";
import IconIlban from "@/assets/icons/js/IconIlban";
import IconHelpdesk from "@/assets/icons/js/IconHelpdesk";

const primaryNavItems = [
  { name: "상담관리", icon: IconMainMenu01, href: "#", panelId: "counseling" },
  { name: "여신사후", icon: IconMainMenu02, href: "#", panelId: "afterLoan" },
  { name: "설정", icon: IconSettings, href: "/under-construction?page=설정", panelId: "under-construction" },
];

const counselingSecondaryNavItems = [
  {
    name: "일반상담",
    icon: IconIlban,
    children: [
        { name: "채권상담", href: "/counseling/general-counseling/bond-counseling" },
        { name: "그룹핑(채권)", href: "/under-construction?page=그룹핑(채권)" },
        { name: "배정관리(채권)", href: "/under-construction?page=배정관리(채권)" },
        { name: "담당자변경이력", href: "/counseling/general-counseling/manager-change-history" },
        { name: "상담관리(채권)", href: "/under-construction?page=상담관리(채권)" },
        { name: "CMS응당일조회", href: "/counseling/general-counseling/cms-due-date" },
        { name: "매각/상각 리스트", href: "/counseling/general-counseling/sale-write-off-list" },
        { name: "PDS관리", href: "/counseling/general-counseling/pds-management" },
        { name: "PDS(채권)", href: "/under-construction?page=PDS(채권)" },
    ]
  },
  {
    name: "SMS/이메일",
    icon: IconEmail,
    href: "/under-construction?page=SMS/이메일",
  },
  {
    name: "HELPDESK",
    icon: IconHelpdesk,
    href: "/under-construction?page=HELPDESK",
  },
  {
    name: "기준정보",
    icon: IconGijun,
    href: "/under-construction?page=기준정보",
  },
];

const afterLoanSecondaryNavItems = [
  {
    name: "채권조정",
    icon: IconSubMenu01,
    children: [
      {
        name: "채권조회",
        href: "/after-loan/bond-adjustment/bond-inquiry",
      },
      {
        name: "신용회복관리",
        href: "/after-loan/bond-adjustment/credit-recovery",
      },
      {
        name: "개인회생관리",
        href: "/after-loan/bond-adjustment/personal-rehabilitation",
      },
      {
        name: "파산면책관리",
        href: "/after-loan/bond-adjustment/bankruptcy-exemption",
      },
      {
        name: "채권정보동기화",
        href: "/under-construction?page=채권정보동기화",
      },
      {
        name: "미처리금액조회",
        href: "/under-construction?page=미처리금액조회",
      },
      {
        name: "채무조정관리",
        href: "/after-loan/bond-adjustment/debt-adjustment-management",
      },
      {
        name: "채권조회 (채무조정관리 팝업 생성)",
        href: "/under-construction?page=채권조회 (채무조정관리 팝업 생성)",
      },
    ],
  },
  {
    name: "채권관리",
    icon: IconSubMenu02,
    href: "/under-construction?page=채권관리",
  },
  {
    name: "재산조사",
    icon: IconSubMenu03,
    href: "/under-construction?page=재산조사",
  },
  {
    name: "법적조치",
    icon: IconSubMenu04,
    children: [
        { name: "법무정보 동기화", href: "/after-loan/legal-action/legal-info-sync" },
        { name: "법무진행 조회", href: "/after-loan/legal-action/inquiry-legal-proceedings" },
        { name: "법무관리", href: "/after-loan/legal-action/legal-management" },
        { name: "사후관리일지조회", href: "/under-construction?page=사후관리일지조회" },
        { name: "채권특성정보", href: "/under-construction?page=채권특성정보" },
        { name: "통합엑셀업로드", href: "/after-loan/legal-action/excel-upload" },
    ]
  },
  {
    name: "재산건전성/대손상각",
    icon: IconSubMenu05,
    children: [
        { name: "건전성 기초자료 생성", href: "/after-loan/asset-soundness-bad-debt/soundness-foundation-data-generation" },
        { name: "건전성 자료 생성", href: "/after-loan/asset-soundness-bad-debt/soundness-data-generation" },
        { name: "자산건전성 검증", href: "/after-loan/asset-soundness-bad-debt/asset-soundness-verification" },
        { name: "대손상각대상 관리", href: "/after-loan/asset-soundness-bad-debt/bad-debt-management" },
        { name: "대손상각대상 조회", href: "/after-loan/asset-soundness-bad-debt/write-off-target" },
        { name: "대손신청채권명세", href: "/after-loan/asset-soundness-bad-debt/write-off-application-specifications" },
        { name: "부실책임성사의뢰서", href: "/under-construction?page=부실책임성사의뢰서" },
        { name: "영업구역 주소관리", href: "/after-loan/asset-soundness-bad-debt/business-area-address-management" },
    ]
  },
  {
    name: "특수채권",
    icon: IconSubMenu06,
    children: [
        { name: "특수채권 편입조회", href: "/after-loan/special-bond/subscription-inquiry" },
        { name: "특수채권 관리대장", href: "/after-loan/special-bond/management-ledger" },
        { name: "특수채권 담당자관리", href: "/after-loan/special-bond/manager-management" },
        { name: "특수채권 담당자조회", href: "/after-loan/special-bond/manager-inquiry" },
    ]
  },
  {
    name: "여신상시모니터링",
    icon: IconCreditMonitoring,
    children: [
        { name: "여신상시모니터링 변동현황", href: "/under-construction?page=여신상시모니터링 변동현황" },
        { name: "여신상시모니터링 결과", href: "/under-construction?page=여신상시모니터링 결과" },
    ]
  },
  {
    name: "매각채권일괄등록",
    icon: IconSubMenu07,
    href: "/after-loan/collective-registration-of-bonds-for-sale",
  },
  {
    name: "채권관리등급 엑셀 업로드",
    icon: IconSubMenu08,
    href: "/after-loan/credit-rating-excel-upload",
  },
];

export function Sidebar() {
  const [selected, setSelected] = useState("상담관리");
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
      setSelected("여신사후");
      if (isSidebarExpanded) {
        setExpandedMenu("여신사후");
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
        if (item.name === "여신사후") {
            setExpandedMenu(expandedMenu === "여신사후" ? null : "여신사후");
        } else if (item.name === "상담관리") {
             setExpandedMenu(expandedMenu === "상담관리" ? null : "상담관리");
        } else {
            // Leaf node navigation
            if (item.href !== "#") {
                handleLinkClick(item.href, item.name);
            }
        }
    } else {
        if (item.name !== "여신사후" && item.href !== "#") {
            handleLinkClick(item.href, item.name);
        }
    }
  };

  return (
    <div
      className="relative flex h-full"
      onMouseLeave={() => setOpenPanel(null)}
    >
      <aside className={cn(
          "flex h-full flex-col py-4 transition-all duration-300",
          isSidebarExpanded ? "w-64" : "w-[108px]"
      )}>
        {/* Tab Buttons */}
        {isSidebarExpanded ? (
          <div className="flex gap-1 px-4 mb-4">
            <Button
              variant={sidebarTab === 'menu' ? 'default' : 'ghost'}
              onClick={() => setSidebarTab('menu')}
              className={cn(
                "flex-1 h-9 rounded-xl transition-colors",
                sidebarTab === 'menu'
                  ? "bg-[#219361] text-white hover:bg-[#219361]/90"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              업무메뉴
            </Button>
            <Button
              variant={sidebarTab === 'favorites' ? 'default' : 'ghost'}
              onClick={() => setSidebarTab('favorites')}
              className={cn(
                "flex-1 h-9 rounded-xl transition-colors",
                sidebarTab === 'favorites'
                  ? "bg-[#219361] text-white hover:bg-[#219361]/90"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              즐겨찾기
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 px-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => setSidebarTab('menu')}
              className={cn(
                "h-10 w-full rounded-xl transition-colors",
                sidebarTab === 'menu'
                  ? "bg-[#219361] text-white hover:bg-[#219361]/90"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <Menu className="size-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSidebarTab('favorites')}
              className={cn(
                "h-10 w-full rounded-xl transition-colors",
                sidebarTab === 'favorites'
                  ? "bg-[#219361] text-white hover:bg-[#219361]/90"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <Star className="size-5" />
            </Button>
          </div>
        )}

        {/* Scrollable Menu Area */}
        {sidebarTab === 'menu' && (
        <div className="flex-grow overflow-y-auto no-scrollbar">
          <div className="px-4">
            {primaryNavItems.map((item) => {
              const isSelected = selected === item.name;
              const hasChildren = item.name === "여신사후" || item.name === "상담관리";

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
                            {item.name === "여신사후" && (
                                <InlineAfterLoanMenu handleLinkClick={handleLinkClick} />
                            )}
                            {item.name === "상담관리" && (
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
                            홍길동
                        </p>
                        <p className="truncate text-xs text-gray-500 mt-0.5">
                            admin@example.com
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-800 mt-1">
                            JT 친애저축은행
                        </p>
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
                                                if (child.name === "채권조회 (채무조정관리 팝업 생성)") {
                                                    const popupWidth = 1600;
                                                    const popupHeight = 800;
                                                    const left = (window.screen.width / 2) - (popupWidth / 2);
                                                    const top = (window.screen.height / 2) - (popupHeight / 2);
                                                    window.open(
                                                      '/popup/debt-adjustment-management',
                                                      'DebtAdjustmentManagement',
                                                      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
                                                    );
                                                } else {
                                                    handleLinkClick(child.href, child.name);
                                                }
                                            }}
                                        >
                                            <span className="truncate">• {child.name}</span>
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
      <h2 className="mb-4 text-lg font-semibold px-4">상담관리</h2>
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
                        • {child.name}
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
                                            <span className="truncate">• {child.name}</span>
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
      <h2 className="mb-4 text-lg font-semibold px-4">여신사후</h2>
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
                          if (child.name === "채권조회 (채무조정관리 팝업 생성)") {
                            const popupWidth = 1600;
                            const popupHeight = 800;
                            const left = (window.screen.width / 2) - (popupWidth / 2);
                            const top = (window.screen.height / 2) - (popupHeight / 2);
                            window.open(
                              '/popup/debt-adjustment-management',
                              'DebtAdjustmentManagement',
                              `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
                            );
                          } else {
                            handleLinkClick(child.href, child.name);
                          }
                        }}
                      >
                        • {child.name}
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

    return (
      <div key={folder.id}>
        {/* Folder header */}
        <Button
          variant="ghost"
          className={cn(
            "group w-full flex items-center gap-2 h-9 rounded-xl transition-colors justify-start px-3",
            "text-gray-700 hover:bg-gray-100"
          )}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          onClick={() => toggleFolder(folder.id)}
        >
          {hasChildren && (
            <ChevronRight
              className={cn(
                "size-3 shrink-0 text-gray-400 transition-transform",
                isOpen && "rotate-90"
              )}
            />
          )}
          {!hasChildren && <div className="w-3" />}
          <span className="truncate text-sm font-medium">{folder.name}</span>
          <span className="text-xs text-gray-400 ml-auto">
            {folderFavorites.length + childFolders.length}
          </span>
        </Button>

        {/* Folder contents */}
        {isOpen && (
          <div className="flex flex-col">
            {/* Sub-folders */}
            {childFolders.map(childFolder => renderFolder(childFolder, depth + 1))}

            {/* Favorites in this folder */}
            {folderFavorites.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "group w-full flex items-center gap-2 h-9 rounded-xl transition-colors justify-start px-3",
                  checkIsActive(item.path)
                    ? "bg-[#219361] text-white hover:bg-[#219361]/90"
                    : "text-gray-800 hover:bg-gray-100"
                )}
                style={{ paddingLeft: `${24 + depth * 12}px` }}
                onClick={() => handleLinkClick(item.path, item.label)}
              >
                <Star
                  className={cn(
                    "size-3.5 shrink-0",
                    checkIsActive(item.path)
                      ? "text-yellow-300 fill-yellow-300"
                      : "text-yellow-500 fill-yellow-500"
                  )}
                />
                <span className="truncate text-sm">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Collapsed mode: show flat list of all favorites
  if (!isExpanded) {
    const allFavorites = favorites.sort((a, b) => b.addedAt - a.addedAt);

    if (allFavorites.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center px-4">
          <Star className="size-6 text-gray-300" />
        </div>
      );
    }

    return (
      <div className="flex-grow overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-1 px-4">
          {allFavorites.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "group w-full flex items-center justify-center gap-2 h-10 rounded-xl transition-colors px-0",
                checkIsActive(item.path)
                  ? "bg-[#219361] text-white hover:bg-[#219361]/90"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              onClick={() => handleLinkClick(item.path, item.label)}
            >
              <Star
                className={cn(
                  "size-4 shrink-0",
                  checkIsActive(item.path)
                    ? "text-yellow-300 fill-yellow-300"
                    : "text-yellow-500 fill-yellow-500"
                )}
              />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Expanded mode: show folder tree
  const rootFolders = getFolderChildren(null);

  if (favorites.length === 0 && rootFolders.length <= 1) {
    return (
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center text-gray-500 text-sm">
          <Star className="size-8 mx-auto mb-2 text-gray-300" />
          <p>즐겨찾기한 페이지가 없습니다</p>
          <p className="text-xs mt-1 text-gray-400">
            페이지에서 ★ 버튼을 클릭하여<br />즐겨찾기를 추가하세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-0.5 px-2">
        {rootFolders.map(folder => renderFolder(folder, 0))}
      </div>
    </div>
  );
}

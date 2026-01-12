


import React from "react";
import { useRouter } from "@/lib/hooks/useAppLocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  LogOut,
  User as UserIcon,
  LogIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLayoutStore } from "@/lib/store/layoutStore";

// 변경된 Logo 컴포넌트 (사용 유지)
import Logo from "@/assets/icons/js/지니시스템로고2";
import textLogo from "@/assets/친애저축은행 로고.png";

type HeaderProps = {
  /** 로그인 여부 */
  isLoggedIn: boolean;
  /** 로그인 시 표시할 사용자 이름 (예: "홍길동") */
  userName?: string;
  /** 좌측 회사 PNG 이미지 경로(옵션): 지정하지 않으면 기본으로 import한 textLogo 사용 */
  companyPngSrc?: string;
  /** 버튼 핸들러(선택) */
  onLogout?: () => void;
  onMyPage?: () => void;
  onLogin?: () => void;
};

export function Header({
  isLoggedIn,
  userName = "홍길동",
  companyPngSrc,
  onLogout,
  onMyPage,
  onLogin,
}: HeaderProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = React.useState<number>(
    isLoggedIn ? 600 : 0
  );
  const { isSidebarExpanded, toggleSidebar } = useLayoutStore();

  const handleExtend = () => {
    setTimeLeft(600);
  };

  React.useEffect(() => {
    if (!isLoggedIn) {
      setTimeLeft(0);
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          if (onLogout) {
            onLogout();
          } else {
            setTimeout(() => router.push("/"), 1000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isLoggedIn, onLogout, router]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const companyLogoSrc = companyPngSrc ?? textLogo;

  function Divider() {
    return (
      <span aria-hidden className="mx-4 select-none text-gray-400">
        |
      </span>
    );
  }

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 h-[75px] bg-[#25292e] text-white"
    >
      <div className="relative mx-auto flex h-full items-center justify-between">
        <div className="flex items-center h-full">
          <div className="w-56 flex items-center gap-2 pl-6">
            <Logo size={40} color="#58bf83" />
            <span className="whitespace-nowrap text-2xl font-normal leading-none pb-0.5">
              Jany system
            </span>
          </div>
          <div className="absolute left-[242px] h-full flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="size-7 rounded-2xl bg-[#1ec37b] text-white hover:bg-[#ffffff] hover:text-[#1ec37b] border-none"
                    onClick={toggleSidebar}
                  >
                    {isSidebarExpanded ? (
                      <ChevronLeft className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSidebarExpanded ? "닫기" : "열기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center pr-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-x-2">
                <span className="whitespace-nowrap text-sm">{userName}님</span>
                <span
                  className="whitespace-nowrap text-xs text-gray-300"
                  aria-label={`로그인 유지 시간 ${mm}:${ss}`}
                  title="로그인 유지 시간"
                >
                  {mm}:{ss}
                </span>
                <Button
                  variant="ghost"
                  className="h-auto rounded-full border border-gray-500 px-3 py-1 text-xs text-white hover:bg-white/10 hover:text-white"
                  onClick={handleExtend}
                >
                  시간 연장
                </Button>
              </div>

              <Divider />

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full [&>svg]:!h-6 [&>svg]:!w-6"
                aria-label="로그아웃"
                onClick={onLogout}
              >
                <LogOut />
              </Button>

              <Divider />

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full [&>svg]:!h-6 [&>svg]:!w-6"
                aria-label="마이페이지"
                onClick={onMyPage}
              >
                <UserIcon />
              </Button>

              <Divider />

              <div className="relative w-[260px] max-w-xs">
                <Search className="pointer-events-none absolute right-2.5 top-2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  className="w-full rounded-full bg-white pl-4 pr-12 text-gray-900"
                />
              </div>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full [&>svg]:!h-6 [&>svg]:!w-6"
                aria-label="로그인"
                onClick={onLogin}
              >
                <LogIn />
              </Button>
              <div className="relative ml-3 w-[260px] max-w-xs">
                <Search className="pointer-events-none absolute right-2.5 top-2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  className="w-full rounded-full bg-white pl-4 pr-12 text-gray-900"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

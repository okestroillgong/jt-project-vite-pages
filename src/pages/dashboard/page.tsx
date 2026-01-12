import { useEffect } from "react";
import { useRouter } from "@/lib/hooks/useAppLocation";
import { useTabStore } from "@/lib/store/tabs";
import { LeftActions } from "@/components/app/LeftActions";

export default function DashboardDefaultPage() {
  const router = useRouter();
  const { tabs, addTab, _hasHydrated } = useTabStore();

  useEffect(() => {
    // Wait for hydration to complete
    if (!_hasHydrated) return;

    // If no tabs exist, open "채권상담" as default
    if (tabs.length === 0) {
      const defaultPath = "/counseling/general-counseling/bond-counseling";
      addTab({ id: defaultPath, label: "채권상담", path: defaultPath });
      // Wait for state update before routing
      queueMicrotask(() => {
        router.push(defaultPath);
      });
    }
  }, [_hasHydrated, tabs.length, addTab, router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">메인 대시보드</h1>
      <p className="mt-2 text-muted-foreground">
        좌측 메뉴를 선택하여 작업을 시작하세요.
      </p>
      <div className="mt-8">
        <LeftActions actions={[]} />
      </div>
    </div>
  );
}
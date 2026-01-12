import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTabStore } from '@/lib/store/tabs';
import { usePageStore } from '@/lib/store/pageStore';
import { Sidebar } from '@/components/app/Sidebar';
import { Header } from '@/components/app/Header';
import { DashboardTabs } from '@/components/app/DashboardTabs';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const activeTabId = useTabStore((state) => state.activeTabId);
  const hasHydrated = useTabStore((state) => state._hasHydrated);
  const { loadState, currentState, clearAllStates } = usePageStore();
  const { reset: resetTabs } = useTabStore();

  // 인증 상태 확인
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/login', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (hasHydrated && activeTabId) {
      loadState(activeTabId);
    }
  }, [hasHydrated, activeTabId, loadState]);

  // 인증 확인 중이거나 하이드레이션 중일 때 로딩 표시
  if (!hasHydrated || isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  // 인증되지 않은 경우 (리다이렉트 전 방어)
  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  // 로그아웃 핸들러
  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  // 로그인한 사용자 이름 가져오기
  const userName = sessionStorage.getItem('userId') || '사용자';

  return (
    <div className="flex h-screen flex-col">
      <Header isLoggedIn={true} userName={userName} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <div className="relative bg-sidebar">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {activeTabId && !currentState ? <LoadingSpinner /> : <Outlet />}
          </main>
          <DashboardTabs />
        </div>
      </div>
    </div>
  );
}

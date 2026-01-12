import { Outlet } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';

export default function PopupLayout() {
  useEffect(() => {
    const POPUP_WIDTH = 1600;
    const POPUP_HEIGHT = 800;
    const left = (window.screen.width / 2) - (POPUP_WIDTH / 2);
    const top = (window.screen.height / 2) - (POPUP_HEIGHT / 2);

    if (window.innerWidth !== POPUP_WIDTH || window.innerHeight !== POPUP_HEIGHT) {
      window.resizeTo(POPUP_WIDTH, POPUP_HEIGHT);
    }
    window.moveTo(left, top);

  }, []);

  return (
    <main>
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <LoadingSpinner />
        </div>
      }>
        <Outlet />
      </Suspense>
    </main>
  );
}

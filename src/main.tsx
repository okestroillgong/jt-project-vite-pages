import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './routes';
import './styles/globals.css';

// ------------------------------------------------------------
// GitHub Pages(프로젝트 페이지) 하위 경로에서 팝업(/popup/*)이
// 도메인 루트로 열려 404 나는 문제를 전역적으로 보정합니다.
//   window.open("/popup/...") -> window.open("<BASE_URL>popup/...")
// ------------------------------------------------------------
(() => {
  const base = (import.meta.env.BASE_URL || '/');
  const baseNorm = base.endsWith('/') ? base : `${base}/`;
  const original = window.open?.bind(window);
  if (!original) return;

  window.open = ((url?: string | URL, target?: string, features?: string) => {
    try {
      if (typeof url === 'string' && url.startsWith('/popup')) {
        url = `${baseNorm}popup${url.slice('/popup'.length)}`;
      }
    } catch { /* ignore */ }
    return original(url as any, target, features);
  }) as any;
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);

import { useLocation, useNavigate, useSearchParams as useRouterSearchParams } from 'react-router-dom';

/**
 * React Router replacement for Next.js usePathname
 * Returns the current pathname (equivalent to usePathname())
 */
export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

/**
 * React Router replacement for Next.js useSearchParams
 * Returns URLSearchParams object with a get method
 */
export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

/**
 * React Router replacement for Next.js useRouter
 * Returns an object with push, replace, back, forward methods
 */
export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
  };
}

'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

// ============ VIEW / NAVIGATION ============
export type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'onboarding'
  | 'admin-dashboard'
  | 'merchant-dashboard'
  | 'storefront'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'campaigns'
  | 'coupons'
  | 'payments'
  | 'invoices'
  | 'delivery'
  | 'delivery-agents'
  | 'reports'
  | 'settings'
  | 'automation'
  | 'order-details'
  | 'product-form'
  | 'category-form'
  | 'coupon-form'
  | 'campaign-form'
  | 'storefront-product'
  | 'storefront-cart'
  | 'storefront-checkout'
  | 'store-builder'
  | 'store-builder-identity'
  | 'store-builder-sections'
  | 'store-builder-pages'
  | 'store-builder-social'
  | 'store-builder-preview'
  | 'accounting'
  | 'accounting-overview'
  | 'accounting-payment-methods'
  | 'accounting-payment-review'
  | 'accounting-transactions'
  | 'accounting-reports'
  | 'storefront-page';

const ALL_VIEWS: AppView[] = [
  'landing','login','signup','forgot-password','onboarding','admin-dashboard',
  'merchant-dashboard','storefront','products','categories','orders','customers',
  'campaigns','coupons','payments','invoices','delivery','delivery-agents',
  'reports','settings','automation','order-details','product-form','category-form',
  'coupon-form','campaign-form','storefront-product','storefront-cart','storefront-checkout',
  'store-builder','store-builder-identity','store-builder-sections','store-builder-pages',
  'store-builder-social','store-builder-preview',
  'accounting','accounting-overview','accounting-payment-methods','accounting-payment-review',
  'accounting-transactions','accounting-reports','storefront-page',
];

const VALID_VIEWS = new Set<string>(ALL_VIEWS);

function parseHash(): { view: AppView; params: Record<string, string> } {
  if (typeof window === 'undefined') return { view: 'landing', params: {} };
  const hash = window.location.hash.replace('#', '');
  if (!hash) return { view: 'landing', params: {} };
  const [path, query] = hash.split('?');
  const view = VALID_VIEWS.has(path) ? (path as AppView) : 'landing';
  const params: Record<string, string> = {};
  if (query) {
    new URLSearchParams(query).forEach((v, k) => { params[k] = v; });
  }
  return { view, params };
}

export interface AppState {
  currentView: AppView;
  viewParams: Record<string, string>;
  sidebarOpen: boolean;
  setView: (view: AppView, params?: Record<string, string>) => void;
  goBack: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function DokaniProvider({ children }: { children: ReactNode }) {
  const initial = parseHash();
  const [currentView, setCurrentView] = useState<AppView>(initial.view);
  const [viewParams, setViewParams] = useState<Record<string, string>>(initial.params);
  const [history, setHistory] = useState<Array<{ view: AppView; params: Record<string, string> }>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isInternalChange = useRef(false);

  const setView = useCallback((view: AppView, params: Record<string, string> = {}) => {
    setHistory(prev => [...prev, { view: currentView, params: viewParams }]);
    setCurrentView(view);
    setViewParams(params);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
    // Update URL hash
    isInternalChange.current = true;
    const qs = Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : '';
    window.location.hash = `${view}${qs}`;
  }, [currentView, viewParams]);

  // Listen for hash changes (back/forward browser buttons, manual hash set)
  useEffect(() => {
    const handleHashChange = () => {
      if (isInternalChange.current) {
        isInternalChange.current = false;
        return;
      }
      const { view, params } = parseHash();
      setCurrentView(view);
      setViewParams(params);
      setSidebarOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrentView(prev.view);
      setViewParams(prev.params);
    } else {
      setCurrentView('landing');
      setViewParams({});
    }
  }, [history]);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);
  const setSidebarOpenFn = useCallback((open: boolean) => setSidebarOpen(open), []);

  return (
    <AppContext.Provider value={{
      currentView,
      viewParams,
      sidebarOpen,
      setView,
      goBack,
      toggleSidebar,
      setSidebarOpen: setSidebarOpenFn,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within DokaniProvider');
  return ctx;
}
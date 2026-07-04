'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
  // merchant sub-views
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
  | 'storefront-checkout';

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
  const [currentView, setCurrentView] = useState<AppView>('merchant-dashboard');
  const [viewParams, setViewParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<{ view: AppView; params: Record<string, string> }>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setView = useCallback((view: AppView, params: Record<string, string> = {}) => {
    setHistory(prev => [...prev, { view: currentView, params: viewParams }]);
    setCurrentView(view);
    setViewParams(params);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [currentView, viewParams]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrentView(prev.view);
      setViewParams(prev.params);
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
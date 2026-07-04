'use client'

import { useApp } from '@/lib/store'
import LandingPage from '@/components/landing/LandingPage'
import { AuthPages } from '@/components/auth/AuthPages'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import AdminDashboard from '@/components/admin/AdminDashboard'
import MerchantDashboard from '@/components/merchant/MerchantDashboard'
import StorefrontPage from '@/components/storefront/StorefrontPage'
import { OrdersModule } from '@/components/orders/OrdersModule'
import {
  CustomersModule,
  CampaignsModule,
  CouponsModule,
  DeliveryModule,
  AutomationModule,
} from '@/components/merchant/AdditionalModules'

export default function Home() {
  const { currentView } = useApp()

  // Public pages
  if (currentView === 'landing') return <LandingPage />
  if (currentView === 'login' || currentView === 'signup' || currentView === 'forgot-password') {
    return <AuthPages />
  }
  if (currentView === 'onboarding') return <OnboardingFlow />
  if (currentView === 'storefront') return <StorefrontPage />

  // Platform admin
  if (currentView === 'admin-dashboard') return <AdminDashboard />

  // Orders (has its own sidebar-less layout for detail view)
  if (currentView === 'orders' || currentView === 'order-details') {
    return <OrdersModule />
  }

  // Merchant dashboard and sub-modules that need the merchant sidebar
  if (
    currentView === 'merchant-dashboard' ||
    currentView === 'products' ||
    currentView === 'product-form' ||
    currentView === 'categories' ||
    currentView === 'category-form' ||
    currentView === 'payments' ||
    currentView === 'invoices' ||
    currentView === 'reports' ||
    currentView === 'settings'
  ) {
    return <MerchantDashboard />
  }

  // Additional modules with merchant sidebar
  if (
    currentView === 'customers' ||
    currentView === 'campaigns' ||
    currentView === 'campaign-form' ||
    currentView === 'coupons' ||
    currentView === 'coupon-form' ||
    currentView === 'delivery' ||
    currentView === 'delivery-agents' ||
    currentView === 'automation'
  ) {
    return <MerchantDashboard />
  }

  // Storefront sub-views
  if (
    currentView === 'storefront-product' ||
    currentView === 'storefront-cart' ||
    currentView === 'storefront-checkout'
  ) {
    return <StorefrontPage />
  }

  // Fallback to landing
  return <LandingPage />
}
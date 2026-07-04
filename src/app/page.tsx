'use client'

import { useApp } from '@/lib/store'
import LandingPage from '@/components/landing/LandingPage'
import AuthPages from '@/components/auth/AuthPages'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import AdminDashboard from '@/components/admin/AdminDashboard'
import MerchantDashboard from '@/components/merchant/MerchantDashboard'
import StorefrontPage from '@/components/storefront/StorefrontPage'

export default function Home() {
  const { currentView } = useApp()

  // Public pages
  if (currentView === 'landing') return <LandingPage />
  if (currentView === 'login' || currentView === 'signup' || currentView === 'forgot-password') {
    return <AuthPages />
  }
  if (currentView === 'onboarding') return <OnboardingFlow />
  if (currentView === 'storefront' || currentView === 'storefront-product' || currentView === 'storefront-cart' || currentView === 'storefront-checkout') {
    return <StorefrontPage />
  }

  // Platform admin
  if (currentView === 'admin-dashboard') return <AdminDashboard />

  // Everything else is merchant dashboard (includes orders, customers, etc. via sidebar)
  return <MerchantDashboard />
}
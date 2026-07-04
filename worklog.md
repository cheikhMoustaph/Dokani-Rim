---
Task ID: 1
Agent: Main Agent
Task: Major update - Store Builder, Accounting Module, Empty Dashboard, Checkout Payment UI

Work Log:
- Updated Prisma schema with 6 new models: StorePage, StoreSocialLink, StoreThemeSetting, PaymentMethod, PaymentReceipt, AccountingTransaction
- Updated types.ts with 15+ new interfaces/types: DemoPaymentMethod, DemoPaymentReceipt, DemoAccountingTransaction, DemoStorePage, DemoSocialLink, DemoThemeSettings, HomepageSection, OnboardingChecklistItem, and label/color maps
- Updated store.tsx with 12 new AppView types for store-builder and accounting views
- Updated demo-data.ts with: IS_DEV_MODE flag, EMPTY_MERCHANT_STATS, ONBOARDING_CHECKLIST, DEMO_PAYMENT_METHODS (7 methods), DEMO_PAYMENT_RECEIPTS (8 receipts), DEMO_TRANSACTIONS (6 transactions), DEMO_STORE_PAGES (8 pages), DEMO_SOCIAL_LINKS (8 links), DEMO_THEME_SETTINGS, NEW_STORE_THEME, NEW_STORE_DEFAULT_PAGES
- Created StoreBuilder.tsx (1,439 lines) - 6 named exports: StoreBuilderMain, StoreBuilderIdentity, StoreBuilderSections, StoreBuilderPages, StoreBuilderSocial, StoreBuilderPreview
- Created AccountingModule.tsx (1,437 lines) - 6 named exports: AccountingMain, AccountingOverview, AccountingPaymentMethods, AccountingPaymentReview, AccountingTransactions, AccountingReports
- Updated MerchantDashboard.tsx: added بناء المتجر and المحاسبة sidebar items, empty state with onboarding checklist (IS_DEV_MODE=false), routing for 12 new views
- Updated StorefrontPage.tsx: professional payment method radio buttons with colored logo placeholders, manual payment fields (instructions, account, receipt upload, reference, note), footer with pages links and social media icons, storefront-page view for page content
- Updated AdminDashboard.tsx: added طرق الدفع sidebar item and tab with 6 payment method cards and platform statistics
- All changes compile successfully (next build passes with zero errors)

Stage Summary:
- All 8 requested features implemented
- 2 new major component files created (StoreBuilder, AccountingModule)
- 8 existing files modified (schema, types, store, demo-data, MerchantDashboard, StorefrontPage, AdminDashboard, page.tsx)
- Build verified clean - zero compilation errors
- Total new/modified code: ~8,762 lines across 9 files
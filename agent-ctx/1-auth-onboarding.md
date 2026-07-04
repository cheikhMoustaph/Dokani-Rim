# Task: Authentication & Onboarding Pages

## Files Created

### 1. `/src/components/auth/AuthPages.tsx`
- **Login View**: Centered card on green gradient, "دكاني" logo, email/password fields with show/hide toggle, forgot password link, signup link, back to landing
- **Signup View**: Full name, phone/WhatsApp, email, password fields with inline validation, navigates to onboarding on success
- **Forgot Password View**: Email input, submit button, success state with checkmark animation, back to login link
- All forms use React `useState` with `touched` tracking for inline validation
- Shared `FormField` component with icon, error display, and password toggle
- Subtle animated background with decorative circles

### 2. `/src/components/onboarding/OnboardingFlow.tsx`
- **Step 1 (Account)**: Pre-filled data (فاطمة بنت أحمد, 22222333, fatima@dokani.mr) in read-only cards with green checkmarks
- **Step 2 (Store Info)**: Store name (required), type select, city select, WhatsApp number, logo upload with drag/drop area, language select - all with validation
- **Step 3 (Products)**: 3 expandable product cards (عباية كتان فاخرة, حقيبة يد جلدية, عطر فاخر) with name/price/category/image fields, skip option
- **Step 4 (Celebration)**: Animated rings + bouncing icon, confetti emojis, store URL card with copy button, WhatsApp share button (#25D366), dashboard entry button
- Progress bar with step indicators and connecting lines

### 3. `/src/app/page.tsx` (updated)
- Routes between LandingPage, AuthPages, and OnboardingFlow based on `currentView`

## Design
- Brand colors: Green #0F7A4F, Gold #D6A84F, Background #FAFAF7, WhatsApp #25D366
- All Arabic text, RTL layout
- Clean white cards with rounded-2xl, green accents, soft shadows
- Fade-in animations, hover effects, responsive
- All lint checks pass (zero errors in new files)
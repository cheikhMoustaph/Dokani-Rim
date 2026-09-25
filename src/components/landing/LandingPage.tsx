'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { assetUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ShoppingCart,
  Store,
  ClipboardList,
  Users,
  Megaphone,
  Truck,
  BarChart3,
  Star,
  Check,
  ArrowLeft,
  Menu,
  X,
  MessageCircle,
  Instagram,
  Twitter,
  Phone,
  Mail,
  ChevronDown,
  Play,
  Zap,
  Shield,
  Clock,
  Headphones,
} from 'lucide-react';

/* ──────────────────────────── data ──────────────────────────── */

const features = [
  {
    icon: Store,
    title: 'متجر إلكتروني جاهز',
    desc: 'أنشئ متجرك الإلكتروني في دقائق بدون أي خبرة تقنية',
    color: 'bg-emerald-50 text-[#0F7A4F]',
  },
  {
    icon: ClipboardList,
    title: 'إدارة الطلبات',
    desc: 'استقبل الطلبات من واتساب وموقعك وتابعها من لوحة واحدة',
    color: 'bg-amber-50 text-[#D6A84F]',
  },
  {
    icon: Users,
    title: 'CRM ذكي',
    desc: 'تعرف على زبائنك، تابعهم، وأبنِ علاقات قوية معهم',
    color: 'bg-emerald-50 text-[#0F7A4F]',
  },
  {
    icon: Megaphone,
    title: 'حملات تسويقية',
    desc: 'أنشئ حملات على واتساب وإنستغرام وزد مبيعاتك',
    color: 'bg-amber-50 text-[#D6A84F]',
  },
  {
    icon: Truck,
    title: 'التوصيل والدفع',
    desc: 'إدارة المندوبين والمناطق وتتبع التوصيل',
    color: 'bg-emerald-50 text-[#0F7A4F]',
  },
  {
    icon: BarChart3,
    title: 'التقارير والتحليلات',
    desc: 'تتبع مبيعاتك وزبائنك بتحليلات واضحة',
    color: 'bg-amber-50 text-[#D6A84F]',
  },
];

const steps = [
  {
    num: '١',
    title: 'سجّل حسابك',
    desc: 'أنشئ حسابك مجاناً في أقل من دقيقة',
    icon: Zap,
  },
  {
    num: '٢',
    title: 'أضف منتجاتك',
    desc: 'صوّر منتجاتك وأضفها بسهولة',
    icon: Store,
  },
  {
    num: '٣',
    title: 'شارك رابط متجرك',
    desc: 'انشر الرابط على واتساب ووسائل التواصل',
    icon: ArrowLeft,
  },
  {
    num: '٤',
    title: 'استقبل الطلبات',
    desc: 'ابدأ في استقبال الطلبات وإدارتها',
    icon: ClipboardList,
  },
];

const faqs = [
  {
    q: 'كيف أبدأ باستخدام دكاني؟',
    a: 'كل ما عليك فعله هو إنشاء حساب مجاني، إضافة منتجاتك، ومشاركة رابط متجرك مع زبائنك. العملية بأكملها لا تستغرق أكثر من 5 دقائق.',
  },
  {
    q: 'هل أحتاج خبرة تقنية؟',
    a: 'لا أبداً! دكاني مصمم ليكون سهل الاستخدام لأي شخص. لا تحتاج أي معرفة بالبرمجة أو التصميم. واجهتنا عربية بالكامل وبسيطة جداً.',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    a: 'نوفر عدة طرق للدفع تشمل: الدفع عند الاستلام، التحويل البنكي، IMTransfer، Sadapay، وغيرها من الطرق المحلية في موريتانيا.',
  },
  {
    q: 'كيف يتم التوصيل؟',
    a: 'يمكنك إدارة مندوبي التوصيل وتحديد المناطق التي تغطيها. يتتبع النظام حالة كل طلب ويُعلم الزبون تلقائياً بمرحلة توصيله.',
  },
  {
    q: 'هل يمكنني تجربة المنصة مجاناً؟',
    a: 'نعم! نوفر باقة مجانية تتيح لك إضافة حتى 10 منتجات واستقبال 50 طلب شهرياً. يمكنك الترقية في أي وقت حسب حاجتك.',
  },
  {
    q: 'كيف يمكنني التواصل مع الدعم؟',
    a: 'فريق الدعم متاح عبر واتساب على مدار الساعة. يمكنك أيضاً التواصل معنا عبر البريد الإلكتروني أو نموذج الاتصال في الموقع.',
  },
];

const pricingPlans = [
  {
    name: 'أساسي',
    price: 'مجاناً',
    priceNote: '/ بعد ٣٠ يوم تجريبية',
    features: ['10 منتجات', '50 طلب شهرياً', 'دعم عبر واتساب', 'رابط متجر مخصص'],
    recommended: false,
    cta: 'ابدأ مجاناً',
  },
  {
    name: 'احترافي',
    price: '6,000',
    priceNote: 'أوقية/شهر',
    features: [
      'منتجات غير محدودة',
      'طلبات غير محدودة',
      'تقارير وتحليلات متقدمة',
      'حملات تسويقية',
      'CRM ذكي',
      'إدارة التوصيل',
      'دعم أولوي',
    ],
    recommended: true,
    cta: 'اشترك الآن',
  },
  {
    name: 'مؤسسات',
    price: 'تواصل معنا',
    priceNote: 'حسب احتياجاتك',
    features: [
      'كل شيء في الاحترافي',
      'واجهة برمجية (API)',
      'دعم فروع متعددة',
      'دعم مخصص 24/7',
      'تدريب للفريق',
    ],
    recommended: false,
    cta: 'تواصل معنا',
  },
];

const trustedStores = [
  'متجر النورس',
  'بازار نواكشوط',
  'سوق الكسب',
  'تجارة الأمان',
  'دار البيع',
  'سوبر ماركت السلام',
];

const stats = [
  { value: '150+', label: 'تاجر نشط' },
  { value: '4,500+', label: 'طلب شهرياً' },
  { value: '24+', label: 'مليون أوقية مبيعات' },
  { value: '4.8', label: 'تقييم المستخدمين', icon: Star },
];

/* ──────────────────────────── component ──────────────────────────── */

export default function LandingPage() {
  const { setView } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    setView('signup');
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setView('login');
    setMobileMenuOpen(false);
  };

  /* ──────── Navbar ──────── */
  const Navbar = (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={assetUrl('/logo-image.png')}
              alt="دكاني — Dokani"
              className={`h-10 sm:h-12 w-auto object-contain transition-all duration-300 ${
                scrolled ? '' : 'brightness-0 invert'
              }`}
            />
          </div>

          {/* Desktop buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <Button
              variant="ghost"
              onClick={handleLogin}
              className={`rounded-xl px-5 text-sm font-semibold ${
                scrolled
                  ? 'text-[#0F7A4F] hover:bg-[#0F7A4F]/5'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              تسجيل الدخول
            </Button>
            <Button
              onClick={handleSignup}
              className="rounded-xl bg-[#D6A84F] px-6 text-sm font-bold text-white shadow-lg shadow-[#D6A84F]/25 transition-all hover:bg-[#c49a42] hover:shadow-xl hover:shadow-[#D6A84F]/30 hover:-translate-y-0.5"
            >
              ابدأ مجاناً
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`sm:hidden rounded-lg p-2 ${
              scrolled ? 'text-[#0F7A4F]' : 'text-white'
            }`}
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-white px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              onClick={handleLogin}
              className="justify-start rounded-xl text-[#0F7A4F]"
            >
              تسجيل الدخول
            </Button>
            <Button
              onClick={handleSignup}
              className="justify-center rounded-xl bg-[#D6A84F] font-bold text-white"
            >
              ابدأ مجاناً
            </Button>
          </div>
        </div>
      )}
    </nav>
  );

  /* ──────── Hero ──────── */
  const Hero = (
    <section className="relative overflow-hidden bg-gradient-to-bl from-[#0F7A4F] via-[#0a6b44] to-[#074d31] pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-[#D6A84F]/10" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-white/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-right">
            <Badge className="mb-6 rounded-full border-[#D6A84F]/30 bg-[#D6A84F]/15 px-4 py-1.5 text-sm font-medium text-[#D6A84F]">
              🚀 المنصة الأولى للتجارة في موريتانيا
            </Badge>
            <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="block">دكاني — متجرك، طلباتك،</span>
              <span className="block mt-2 bg-gradient-to-l from-[#D6A84F] to-[#f0cc7a] bg-clip-text text-transparent">
                وزبناؤك من رابط واحد
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0">
              منصة موريتانية تساعد التجار على البيع أونلاين، استقبال الطلبات،
              متابعة الزبائن، وإدارة المتجر من لوحة واحدة.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                onClick={handleSignup}
                className="h-13 rounded-xl bg-white px-8 text-base font-bold text-[#0F7A4F] shadow-xl shadow-black/10 transition-all hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-2xl sm:h-14 sm:text-lg"
              >
                <Zap className="ml-2 size-5" />
                افتح متجرك مجانًا
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="h-13 rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 sm:h-14 sm:text-lg"
              >
                <Play className="ml-2 size-5" />
                شاهد كيف يعمل
              </Button>
            </div>

            {/* Mini trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-white/60 lg:justify-start">
              <div className="flex items-center gap-1.5 text-sm">
                <Check className="size-4 text-[#D6A84F]" />
                بدون بطاقة ائتمان
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Check className="size-4 text-[#D6A84F]" />
                إعداد في 5 دقائق
              </div>
              <div className="hidden items-center gap-1.5 text-sm sm:flex">
                <Check className="size-4 text-[#D6A84F]" />
                دعم عربي
              </div>
            </div>
          </div>

          {/* Mock dashboard illustration */}
          <div className="relative flex-1 lg:max-w-lg">
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
              {/* Phone frame */}
              <div className="rounded-3xl border-4 border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                <div className="overflow-hidden rounded-2xl bg-white">
                  {/* Status bar */}
                  <div className="flex items-center justify-between bg-[#0F7A4F] px-4 py-2">
                    <span className="text-xs font-medium text-white">9:41</span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-white/60" />
                      <div className="h-2 w-2 rounded-full bg-white/40" />
                      <div className="h-2 w-2 rounded-full bg-white/80" />
                    </div>
                  </div>
                  {/* App header */}
                  <div className="bg-[#0F7A4F] px-4 pb-4 pt-2">
                    <p className="text-xs text-white/70">مرحباً بك في</p>
                    <p className="text-lg font-bold text-white">دكاني 🛒</p>
                  </div>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 px-3 py-3">
                    <div className="rounded-xl bg-white p-2 text-center shadow-sm">
                      <p className="text-lg font-bold text-[#0F7A4F]">12</p>
                      <p className="text-[10px] text-gray-500">طلب جديد</p>
                    </div>
                    <div className="rounded-xl bg-white p-2 text-center shadow-sm">
                      <p className="text-lg font-bold text-[#D6A84F]">45K</p>
                      <p className="text-[10px] text-gray-500">مبيعات</p>
                    </div>
                    <div className="rounded-xl bg-white p-2 text-center shadow-sm">
                      <p className="text-lg font-bold text-[#0F7A4F]">89</p>
                      <p className="text-[10px] text-gray-500">زبون</p>
                    </div>
                  </div>
                  {/* Order preview */}
                  <div className="space-y-2 px-3 py-3">
                    <p className="text-xs font-semibold text-gray-700">آخر الطلبات</p>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F7A4F]/10">
                            <ShoppingCart className="size-3.5 text-[#0F7A4F]" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">
                              طلب #{1200 + i}
                            </p>
                            <p className="text-[10px] text-gray-400">منذ {i * 5} دقائق</p>
                          </div>
                        </div>
                        <Badge
                          className={`rounded-full text-[10px] px-2 py-0.5 ${
                            i === 1
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {i === 1 ? 'قيد التوصيل' : 'جديد'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {/* Bottom nav */}
                  <div className="flex items-center justify-around border-t border-gray-100 bg-white px-2 py-3">
                    {[
                      { icon: Store, label: 'المتجر' },
                      { icon: ClipboardList, label: 'الطلبات' },
                      { icon: BarChart3, label: 'التقارير' },
                      { icon: Users, label: 'الزبائن' },
                    ].map(({ icon: Ic, label }) => (
                      <div key={label} className="flex flex-col items-center gap-0.5">
                        <Ic className="size-4 text-gray-400" />
                        <span className="text-[9px] text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating notification card */}
              <div className="absolute -top-3 -left-3 rounded-2xl border border-white/20 bg-white p-3 shadow-xl sm:-left-8 sm:-top-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]">
                    <MessageCircle className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">طلب جديد! 🎉</p>
                    <p className="text-[10px] text-gray-400">عبر واتساب</p>
                  </div>
                </div>
              </div>
              {/* Floating revenue card */}
              <div className="absolute -bottom-2 -right-2 rounded-2xl border border-white/20 bg-white p-3 shadow-xl sm:-bottom-4 sm:-right-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D6A84F]/10">
                    <BarChart3 className="size-4 text-[#D6A84F]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">+32% مبيعات</p>
                    <p className="text-[10px] text-gray-400">هذا الأسبوع</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ──────── Trusted By ──────── */
  const TrustedBy = (
    <section className="bg-[#FAFAF7] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium text-gray-500 sm:text-base">
          موثوق من قبل أكثر من{' '}
          <span className="font-bold text-[#0F7A4F]">150 تاجر</span> في موريتانيا
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {trustedStores.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-sm transition-all hover:border-[#0F7A4F]/20 hover:shadow-md"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Store className="size-3.5 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ──────── Features ──────── */
  const Features = (
    <section className="bg-[#FAFAF7] pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <Badge className="mb-4 rounded-full border-[#0F7A4F]/20 bg-[#0F7A4F]/5 px-4 py-1 text-sm font-medium text-[#0F7A4F]">
            مميزات المنصة
          </Badge>
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            كل ما تحتاجه لإدارة متجرك
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
            أدوات متكاملة تسهّل عليك إدارة تجارتك الإلكترونية من مكان واحد
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group border-0 bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <f.icon className="size-7" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  /* ──────── How It Works ──────── */
  const HowItWorks = (
    <section
      ref={howItWorksRef}
      className="bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <Badge className="mb-4 rounded-full border-[#D6A84F]/20 bg-[#D6A84F]/5 px-4 py-1 text-sm font-medium text-[#D6A84F]">
            كيف يعمل؟
          </Badge>
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            أربع خطوات فقط وتبدأ البيع
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
            إعداد متجرك لم يكن أسهل من ذلك
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-16 right-[12.5%] left-[12.5%] hidden h-0.5 bg-gradient-to-l from-[#0F7A4F] via-[#D6A84F] to-[#0F7A4F] lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative text-center">
                {/* Step number circle */}
                <div className="relative mx-auto mb-5">
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F7A4F] to-[#0a6b44] text-2xl font-extrabold text-white shadow-lg shadow-[#0F7A4F]/25 sm:h-[4.5rem] sm:w-[4.5rem]">
                    {step.num}
                  </div>
                  {/* Arrow between steps (mobile/tablet) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-1/2 -left-8 z-10 hidden text-gray-300 sm:block lg:hidden">
                      <ChevronDown className="size-5 rotate-90" />
                    </div>
                  )}
                </div>

                <div className="mx-auto max-w-[220px]">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <step.icon className="size-5 text-[#D6A84F]" />
                    <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  /* ──────── Stats ──────── */
  const Stats = (
    <section className="relative overflow-hidden bg-gradient-to-bl from-[#0F7A4F] via-[#0a6b44] to-[#074d31] py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#D6A84F]/10" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                {s.icon && <s.icon className="size-6 text-[#D6A84F] fill-[#D6A84F]" />}
                <span className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                  {s.value}
                </span>
              </div>
              <p className="text-sm text-white/70 sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ──────── Pricing ──────── */
  const Pricing = (
    <section className="bg-[#FAFAF7] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <Badge className="mb-4 rounded-full border-[#0F7A4F]/20 bg-[#0F7A4F]/5 px-4 py-1 text-sm font-medium text-[#0F7A4F]">
            الأسعار
          </Badge>
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            خطط تناسب جميع التجار
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
            ابدأ مجاناً وارتقِ حسب نمو تجارتك
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden border-0 bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.recommended
                  ? 'ring-2 ring-[#D6A84F] shadow-[#D6A84F]/10'
                  : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-l from-[#D6A84F] to-[#e8c56d] px-4 py-1.5 text-center">
                  <span className="text-xs font-bold text-white">
                    ⭐ الأكثر طلباً
                  </span>
                </div>
              )}
              <CardHeader className={`pb-2 ${plan.recommended ? 'pt-10' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-extrabold sm:text-4xl ${
                      plan.price === 'مجاناً'
                        ? 'text-[#0F7A4F]'
                        : plan.price === 'تواصل معنا'
                          ? 'text-[#0F7A4F]'
                          : 'text-[#0F7A4F]'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.priceNote !== '/ بعد ٣٠ يوم تجريبية' && (
                    <span className="text-sm text-gray-400">{plan.priceNote}</span>
                  )}
                </div>
                {plan.price === 'مجاناً' && (
                  <p className="mt-1 text-xs text-gray-400">{plan.priceNote}</p>
                )}
              </CardHeader>
              <CardContent className="pt-2">
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F7A4F]/10">
                        <Check className="size-3 text-[#0F7A4F]" />
                      </div>
                      <span className="text-sm text-gray-600">{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  onClick={plan.price === 'تواصل معنا' ? undefined : handleSignup}
                  className={`w-full rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${
                    plan.recommended
                      ? 'bg-[#D6A84F] text-white shadow-lg shadow-[#D6A84F]/25 hover:bg-[#c49a42]'
                      : 'bg-[#0F7A4F] text-white shadow-lg shadow-[#0F7A4F]/20 hover:bg-[#0a6b44]'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  /* ──────── FAQ ──────── */
  const FAQ = (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <Badge className="mb-4 rounded-full border-[#D6A84F]/20 bg-[#D6A84F]/5 px-4 py-1 text-sm font-medium text-[#D6A84F]">
            الأسئلة الشائعة
          </Badge>
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            عندك سؤال؟ هنا تجد الجواب
          </h2>
          <p className="text-base text-gray-500 sm:text-lg">
            الإجابات على أكثر الأسئلة شيوعاً عن دكاني
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-3"
        >
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="rounded-xl border border-gray-200 bg-[#FAFAF7] px-5 data-[state=open]:border-[#0F7A4F]/20 data-[state=open]:bg-[#0F7A4F]/5 transition-colors"
            >
              <AccordionTrigger className="text-right text-base font-semibold text-gray-800 hover:no-underline sm:text-lg">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-right text-sm leading-relaxed text-gray-600 sm:text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );

  /* ──────── Final CTA ──────── */
  const FinalCTA = (
    <section className="relative overflow-hidden bg-gradient-to-bl from-[#0F7A4F] via-[#0a6b44] to-[#074d31] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-[#D6A84F]/10" />
        <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-white/5" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-5xl">
          ابدأ بيعك أونلاين اليوم
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          انضم إلى أكثر من 150 تاجر موريتاني يستخدمون دكاني لتنمية تجارتهم.
          الاشتراك مجاني وبدون بطاقة ائتمان.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={handleSignup}
            className="h-13 rounded-xl bg-white px-8 text-base font-bold text-[#0F7A4F] shadow-xl shadow-black/10 transition-all hover:bg-white/90 hover:-translate-y-0.5 sm:h-14 sm:text-lg"
          >
            <Zap className="ml-2 size-5" />
            افتح متجرك مجانًا
          </Button>
          <a
            href="https://wa.me/22200000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center justify-center rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 sm:h-14 sm:text-lg"
          >
            <MessageCircle className="ml-2 size-5" />
            تواصل معنا عبر واتساب
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-white/60">
            <Shield className="size-5" />
            <span className="text-sm">آمن 100%</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Clock className="size-5" />
            <span className="text-sm">إعداد سريع</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Headphones className="size-5" />
            <span className="text-sm">دعم مستمر</span>
          </div>
        </div>
      </div>
    </section>
  );

  /* ──────── Footer ──────── */
  const Footer = (
    <footer className="bg-[#0a5c3a] pt-14 pb-8 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src={assetUrl('/logo-image.png')} alt="دكاني — Dokani" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/60">
              المنصة الأولى لإدارة التجارة الإلكترونية في موريتانيا.
              vendez plus, gérez mieux.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-[#25D366] hover:text-white"
                aria-label="واتساب"
              >
                <MessageCircle className="size-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white"
                aria-label="إنستغرام"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-sky-500 hover:text-white"
                aria-label="تويتر"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-[#0F7A4F] hover:text-white"
                aria-label="اتصل بنا"
              >
                <Phone className="size-5" />
              </a>
            </div>
          </div>

          {/* Product column */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">المنتج</h4>
            <ul className="space-y-3">
              {['المميزات', 'الأسعار', 'التكاملات', 'التحديثات'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">الشركة</h4>
            <ul className="space-y-3">
              {['من نحن', 'المدونة', 'الوظائف', 'الشركاء'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">الدعم</h4>
            <ul className="space-y-3">
              {[
                'مركز المساعدة',
                'تواصل معنا',
                'الشروط والأحكام',
                'سياسة الخصوصية',
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">
            © 2026 دكاني. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1 text-sm text-white/40">
            <span>صُنع بـ</span>
            <span className="text-red-400">❤</span>
            <span>في موريتانيا 🇲🇷</span>
          </div>
        </div>
      </div>
    </footer>
  );

  /* ──────── Render ──────── */
  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFAF7]">
      {Navbar}
      <main>
        {Hero}
        {TrustedBy}
        {Features}
        {HowItWorks}
        {Stats}
        {Pricing}
        {FAQ}
        {FinalCTA}
      </main>
      {Footer}
    </div>
  );
}
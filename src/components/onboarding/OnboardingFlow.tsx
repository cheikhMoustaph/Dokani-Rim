'use client';

import { useState, type FormEvent, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Store,
  MapPin,
  Upload,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  PartyPopper,
  Globe,
  Tag,
  Camera,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   Step Labels & Constants
   ═══════════════════════════════════════════ */

const STEP_LABELS = ['إنشاء الحساب', 'معلومات المتجر', 'إضافة المنتجات', 'متجرك جاهز!'];

const STORE_TYPES = [
  'أزياء وإكسسوارات',
  'عطور',
  'إلكترونيات',
  'حلويات ومأكولات',
  'أخرى',
];

const CITIES = [
  'نواكشوط',
  'نواذيبو',
  'التجمعات',
  'روصو',
  'كيفه',
  'أخرى',
];

const LANGUAGES = ['العربية', 'الفرنسية'];

const PRODUCT_CATEGORIES = [
  'أزياء وإكسسوارات',
  'عطور',
  'إلكترونيات',
  'حلويات ومأكولات',
  'أخرى',
];

const DEFAULT_PRODUCTS = [
  { name: 'عباية كتان فاخرة', price: '3,500', category: 'أزياء وإكسسوارات', image: null as string | null },
  { name: 'حقيبة يد جلدية', price: '5,000', category: 'أزياء وإكسسوارات', image: null as string | null },
  { name: 'عطر فاخر', price: '6,000', category: 'عطور', image: null as string | null },
];

/* ═══════════════════════════════════════════
   Progress Bar
   ═══════════════════════════════════════════ */

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isDone = stepNum < step;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    isDone
                      ? 'bg-[#0F7A4F] text-white shadow-md shadow-[#0F7A4F]/20'
                      : isActive
                        ? 'bg-[#0F7A4F] text-white shadow-lg shadow-[#0F7A4F]/30 ring-4 ring-[#0F7A4F]/10'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium hidden sm:block ${
                    isActive ? 'text-[#0F7A4F]' : isDone ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-3">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F7A4F] rounded-full transition-all duration-700 ease-out"
                      style={{ width: isDone ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Step 1: Account Info (Pre-filled)
   ═══════════════════════════════════════════ */

function Step1Account({ onNext }: { onNext: () => void }) {
  const [name] = useState('فاطمة بنت أحمد');
  const [phone] = useState('22222333');
  const [email] = useState('fatima@dokani.mr');

  const fields = [
    { icon: User, label: 'الاسم الكامل', value: name },
    { icon: Phone, label: 'رقم الهاتف / واتساب', value: phone },
    { icon: Mail, label: 'البريد الإلكتروني', value: email, dir: 'ltr' as const },
  ];

  return (
    <div className="animate-[fade-in_0.4s_ease-out]">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">إنشاء الحساب</h2>
        <p className="text-sm text-gray-500 mt-1">تأكد من صحة بياناتك</p>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6 space-y-4">
          {fields.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F7A4F]/5 flex items-center justify-center shrink-0">
                <f.icon className="h-4.5 w-4.5 text-[#0F7A4F]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                <p
                  className="text-sm font-semibold text-gray-800 truncate"
                  dir={f.dir || 'rtl'}
                >
                  {f.value}
                </p>
              </div>
              <Check className="h-4 w-4 text-[#0F7A4F] shrink-0 mr-auto" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={onNext}
        className="w-full h-12 mt-6 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
      >
        التالي
        <ArrowLeft className="h-4 w-4 mr-2" />
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Step 2: Store Info
   ═══════════════════════════════════════════ */

function Step2StoreInfo({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [language, setLanguage] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = useCallback(() => {
    const newErrors: Record<string, string | null> = {};
    if (!storeName.trim()) newErrors.storeName = 'اسم المتجر مطلوب';
    if (!storeType) newErrors.storeType = 'يرجى اختيار نوع المتجر';
    if (!city) newErrors.city = 'يرجى اختيار المدينة';
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === null);
  }, [storeName, storeType, city]);

  const handleNext = () => {
    setTouched({ storeName: true, storeType: true, city: true });
    if (validate()) onNext();
  };

  const inputClass =
    'w-full h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm';

  return (
    <div className="animate-[fade-in_0.4s_ease-out]">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">معلومات المتجر</h2>
        <p className="text-sm text-gray-500 mt-1">أخبرنا عن متجرك لنبنيه لك</p>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6 space-y-5">
          {/* Store Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              اسم المتجر <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Store className="h-4 w-4" />
              </span>
              <Input
                placeholder="مثال: بوتيك النخبة"
                value={storeName}
                onChange={(e) => {
                  setStoreName(e.target.value);
                  if (touched.storeName)
                    setErrors((prev) => ({
                      ...prev,
                      storeName: e.target.value.trim() ? null : 'اسم المتجر مطلوب',
                    }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, storeName: true }))}
                className={`${inputClass} pr-10 ${
                  touched.storeName && errors.storeName
                    ? 'border-red-400 focus-visible:ring-red-400/20'
                    : 'focus-visible:ring-[#0F7A4F]/20'
                }`}
              />
            </div>
            {touched.storeName && errors.storeName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                {errors.storeName}
              </p>
            )}
          </div>

          {/* Store Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              نوع المتجر <span className="text-red-400">*</span>
            </Label>
            <Select
              value={storeType}
              onValueChange={(v) => {
                setStoreType(v);
                if (touched.storeType) setErrors((prev) => ({ ...prev, storeType: null }));
              }}
              onOpenChange={() => setTouched((prev) => ({ ...prev, storeType: true }))}
            >
              <SelectTrigger
                className={`h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm ${
                  touched.storeType && errors.storeType
                    ? 'border-red-400'
                    : 'focus:ring-[#0F7A4F]/20'
                }`}
              >
                <Tag className="h-4 w-4 ml-2 text-gray-400" />
                <SelectValue placeholder="اختر نوع المتجر" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                {STORE_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="rounded-lg">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.storeType && errors.storeType && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                {errors.storeType}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              المدينة <span className="text-red-400">*</span>
            </Label>
            <Select
              value={city}
              onValueChange={(v) => {
                setCity(v);
                if (touched.city) setErrors((prev) => ({ ...prev, city: null }));
              }}
              onOpenChange={() => setTouched((prev) => ({ ...prev, city: true }))}
            >
              <SelectTrigger
                className={`h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm ${
                  touched.city && errors.city
                    ? 'border-red-400'
                    : 'focus:ring-[#0F7A4F]/20'
                }`}
              >
                <MapPin className="h-4 w-4 ml-2 text-gray-400" />
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c} className="rounded-lg">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.city && errors.city && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                {errors.city}
              </p>
            )}
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">رقم واتساب المتجر</Label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Phone className="h-4 w-4" />
              </span>
              <Input
                type="tel"
                placeholder="22XX XXXX"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`${inputClass} pr-10 focus-visible:ring-[#0F7A4F]/20`}
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">رفع شعار المتجر</Label>
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 hover:border-[#0F7A4F]/30 cursor-pointer transition-all group"
            >
              {logoPreview ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="شعار المتجر"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[#0F7A4F]/5 flex items-center justify-center mb-2 group-hover:bg-[#0F7A4F]/10 transition-colors">
                    <Upload className="h-5 w-5 text-[#0F7A4F]" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    اسحب الصورة هنا أو انقر للاختيار
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG حتى 2MB</p>
                </>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">اللغة الرئيسية</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm focus:ring-[#0F7A4F]/20">
                <Globe className="h-4 w-4 ml-2 text-gray-400" />
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l} className="rounded-lg">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 px-5 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          السابق
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 h-12 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
        >
          التالي
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Step 3: Add Products
   ═══════════════════════════════════════════ */

function ProductCard({
  product,
  index,
  onChange,
}: {
  product: { name: string; price: string; category: string; image: string | null };
  index: number;
  onChange: (index: number, field: string, value: string) => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <Card
      className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-right hover:bg-gray-50/50 transition-colors"
      >
        {/* Product Image Placeholder */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0F7A4F]/5 to-[#D6A84F]/5 flex items-center justify-center shrink-0 border border-gray-100">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <ImagePlus className="h-5 w-5 text-[#0F7A4F]/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {product.category} • {product.price} أوقية
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-50">
          <div className="pt-4 space-y-3">
            {/* Product Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">اسم المنتج</Label>
              <Input
                value={product.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                className="h-10 rounded-lg border-gray-200 bg-gray-50/50 text-sm focus-visible:ring-[#0F7A4F]/20"
              />
            </div>

            {/* Price & Category Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">السعر (أوقية)</Label>
                <Input
                  value={product.price}
                  onChange={(e) => onChange(index, 'price', e.target.value)}
                  className="h-10 rounded-lg border-gray-200 bg-gray-50/50 text-sm focus-visible:ring-[#0F7A4F]/20"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">التصنيف</Label>
                <Select
                  value={product.category}
                  onValueChange={(v) => onChange(index, 'category', v)}
                >
                  <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-gray-50/50 text-sm focus:ring-[#0F7A4F]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-lg">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image Upload */}
            <label
              htmlFor={`product-img-${index}`}
              className="flex items-center justify-center h-20 border border-dashed border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 hover:border-[#0F7A4F]/30 cursor-pointer transition-all group"
            >
              {product.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Upload className="h-4 w-4" />
                  <span className="text-xs">إضافة صورة</span>
                </div>
              )}
              <input
                id={`product-img-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onChange(index, 'image', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      )}
    </Card>
  );
}

function Step3Products({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  const handleProductChange = (index: number, field: string, value: string) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="animate-[fade-in_0.4s_ease-out]">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">إضافة أول المنتجات</h2>
        <p className="text-sm text-gray-500 mt-1">أضف على الأقل 3 منتجات لبدء البيع</p>
      </div>

      <div className="space-y-3">
        {products.map((product, i) => (
          <ProductCard
            key={i}
            product={product}
            index={i}
            onChange={handleProductChange}
          />
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 px-5 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          السابق
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-12 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
        >
          التالي
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
      >
        تخطي، سأضيفها لاحقاً
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Step 4: Celebration / Ready
   ═══════════════════════════════════════════ */

function Step4Ready() {
  const { setView } = useApp();
  const [copied, setCopied] = useState(false);
  const storeUrl = 'dokani.mr/botique-ennokhba';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = storeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `🛒 تفضل بزيارة متجري على دكاني!\n${storeUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="animate-[fade-in_0.4s_ease-out] text-center">
      {/* Celebration animation */}
      <div className="relative mb-6">
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-[#0F7A4F]/10 animate-[ping_2s_ease-out_infinite]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-[#D6A84F]/10 animate-[ping_2s_ease-out_infinite_0.3s]" />
        </div>

        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0F7A4F] to-[#0a5e3c] shadow-2xl shadow-[#0F7A4F]/30 animate-[bounce-in_0.6s_ease-out]">
          <PartyPopper className="h-9 w-9 text-white" />
        </div>
      </div>

      {/* Confetti emoji row */}
      <div className="flex justify-center gap-2 mb-4 text-2xl animate-[fade-in_0.8s_ease-out_0.3s_both]">
        <span className="animate-[float_3s_ease-in-out_infinite]">🎉</span>
        <span className="animate-[float_3s_ease-in-out_infinite_0.3s]">✨</span>
        <span className="animate-[float_3s_ease-in-out_infinite_0.6s]">🎊</span>
        <span className="animate-[float_3s_ease-in-out_infinite_0.9s]">🌟</span>
        <span className="animate-[float_3s_ease-in-out_infinite_1.2s]">🎉</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        تهانينا! متجرك جاهز لاستقبال الطلبات
      </h2>
      <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
        شارك رابط متجرك مع زبائنك وابدأ في تلقي الطلبات الآن
      </p>

      {/* Store URL Card */}
      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 mb-6 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-1 mb-3">
            <Sparkles className="h-4 w-4 text-[#D6A84F]" />
            <span className="text-xs font-medium text-gray-400">رابط متجرك</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0F7A4F]/5 border border-[#0F7A4F]/10">
            <ShoppingBag className="h-5 w-5 text-[#0F7A4F] shrink-0" />
            <span
              className="text-sm font-bold text-[#0F7A4F] flex-1 truncate"
              dir="ltr"
            >
              {storeUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                copied
                  ? 'bg-[#0F7A4F] text-white'
                  : 'bg-white text-gray-400 hover:text-[#0F7A4F] hover:bg-white shadow-sm border border-gray-100'
              }`}
              aria-label="نسخ الرابط"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Share */}
      <Button
        onClick={handleWhatsAppShare}
        className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-sm shadow-lg shadow-[#25D366]/20 transition-all hover:shadow-xl hover:shadow-[#25D366]/30 active:scale-[0.98] mb-3"
      >
        <MessageCircle className="h-5 w-5 ml-2" />
        مشاركة على واتساب
      </Button>

      {/* Dashboard Button */}
      <Button
        onClick={() => setView('merchant-dashboard')}
        className="w-full h-12 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
      >
        <Sparkles className="h-5 w-5 ml-2" />
        الدخول إلى لوحة التحكم
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN: OnboardingFlow
   ═══════════════════════════════════════════ */

export default function OnboardingFlow() {
  const { currentView } = useApp();
  const [step, setStep] = useState(1);

  // Only render for onboarding view
  if (currentView !== 'onboarding') return null;

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          'linear-gradient(160deg, #f0faf4 0%, #e8f5ee 25%, #FAFAF7 55%, #fef9ef 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#0F7A4F]/[0.03] translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D6A84F]/[0.03] -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-[#0F7A4F]/[0.02]" />

      <div className="w-full max-w-lg mx-auto">
        {/* Logo / Back */}
        <div className="flex items-center gap-3 mb-8">
          {step > 1 && step < 4 && (
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white shadow-sm transition-all"
              aria-label="السابق"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F7A4F] to-[#0a5e3c] flex items-center justify-center shadow-lg shadow-[#0F7A4F]/20">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#0F7A4F]">دكاني</span>
          </div>
          <span className="text-xs text-gray-400 mr-auto">
            الخطوة {step} من 4
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar step={step} />

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && <Step1Account onNext={goNext} />}
          {step === 2 && <Step2StoreInfo onNext={goNext} onBack={goBack} />}
          {step === 3 && <Step3Products onNext={goNext} onBack={goBack} />}
          {step === 4 && <Step4Ready />}
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.08);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
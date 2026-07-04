'use client';

import { useState, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { DEMO_STORES, DEMO_THEME_SETTINGS, DEMO_STORE_PAGES, DEMO_SOCIAL_LINKS } from '@/lib/demo-data';
import { SOCIAL_PLATFORM_LABELS } from '@/lib/types';
import type { HomepageSection, DemoStorePage, DemoSocialLink, SocialPlatform } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import {
  ArrowRight,
  ArrowLeft,
  Store,
  Layout,
  FileText,
  Share2,
  Eye,
  Upload,
  Save,
  Palette,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Send,
  Facebook,
  Instagram,
} from 'lucide-react';

// ───────────────────────────── SECTION LABELS ─────────────────────────────

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'بانر رئيسي',
  featured_products: 'منتجات مميزة',
  categories: 'التصنيفات',
  best_sellers: 'الأكثر مبيعاً',
  new_arrivals: 'وصل حديثاً',
  offers: 'عروض وخصومات',
  whatsapp_cta: 'واتساب',
  about: 'عن المتجر',
  delivery_info: 'معلومات التوصيل',
  reviews: 'آراء العملاء',
  social_media: 'السوشيال ميديا',
  footer: 'ذيل الصفحة',
};

// ───────────────────────────── SOCIAL PLATFORM COLORS ─────────────────────────────

const SOCIAL_PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: 'bg-[#1877F2]',
  instagram: 'bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]',
  tiktok: 'bg-black',
  snapchat: 'bg-[#FFFC00]',
  whatsapp: 'bg-[#25D366]',
  youtube: 'bg-[#FF0000]',
  website: 'bg-[#0F7A4F]',
  telegram: 'bg-[#0088CC]',
};

// ───────────────────────────── SOCIAL PLATFORM ICONS ─────────────────────────────

function getSocialIcon(platform: SocialPlatform) {
  switch (platform) {
    case 'facebook': return <Facebook className="h-4 w-4" />;
    case 'instagram': return <Instagram className="h-4 w-4" />;
    case 'website': return <Globe className="h-4 w-4" />;
    case 'telegram': return <Send className="h-4 w-4" />;
    default: return <Share2 className="h-4 w-4" />;
  }
}

// ───────────────────────────── SLUG GENERATOR ─────────────────────────────

function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
    .toLowerCase();
}

// ═══════════════════════════════════════════════════════════════════════════
// StoreBuilderMain
// ═══════════════════════════════════════════════════════════════════════════

export function StoreBuilderMain() {
  const { setView } = useApp();

  const cards = [
    {
      title: 'هوية المتجر',
      description: 'اسم المتجر، الشعار، الألوان، معلومات التواصل',
      icon: Store,
      view: 'store-builder-identity' as const,
      color: 'bg-[#0F7A4F]',
    },
    {
      title: 'أقسام الصفحة الرئيسية',
      description: 'ترتيب وإدارة أقسام الصفحة الرئيسية',
      icon: Layout,
      view: 'store-builder-sections' as const,
      color: 'bg-[#D6A84F]',
    },
    {
      title: 'صفحات المتجر',
      description: 'إدارة صفحات إضافية مثل من نحن وسياسة الخصوصية',
      icon: FileText,
      view: 'store-builder-pages' as const,
      color: 'bg-emerald-600',
    },
    {
      title: 'روابط التواصل الاجتماعي',
      description: 'إضافة روابط حسابات التواصل الاجتماعي',
      icon: Share2,
      view: 'store-builder-social' as const,
      color: 'bg-amber-600',
    },
    {
      title: 'معاينة المتجر',
      description: 'شاهدي كيف يبدو متجرك للزبائن',
      icon: Eye,
      view: 'store-builder-preview' as const,
      color: 'bg-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">بناء المتجر</h1>
        <p className="text-gray-500 mt-1">خصص مظهر وسلوك متجرك الإلكتروني</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card
            key={card.view}
            className="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-[#0F7A4F]/20 transition-all cursor-pointer group"
            onClick={() => setView(card.view)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`${card.color} rounded-xl p-3 text-white shrink-0`}
                >
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#0F7A4F] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-300 group-hover:text-[#0F7A4F] shrink-0 mt-1 transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// StoreBuilderIdentity
// ═══════════════════════════════════════════════════════════════════════════

export function StoreBuilderIdentity() {
  const { goBack } = useApp();
  const { toast } = useToast();
  const store = DEMO_STORES[0];
  const theme = DEMO_THEME_SETTINGS;

  const [form, setForm] = useState({
    name: store.name,
    logo: null as string | null,
    favicon: null as string | null,
    description: store.description,
    slogan: theme.heroSubtitle,
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    whatsapp: store.whatsapp,
    phone: store.phone,
    email: '',
    city: store.city,
    address: '',
  });

  const updateField = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSave = () => {
    toast({
      title: 'تم الحفظ بنجاح',
      description: 'تم تحديث هوية المتجر',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="shrink-0"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">هوية المتجر</h1>
          <p className="text-gray-500 text-sm mt-0.5">المعلومات الأساسية لعرض متجرك</p>
        </div>
      </div>

      {/* Store Info Card */}
      <Card className="bg-white rounded-xl border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">معلومات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="store-name">اسم المتجر</Label>
            <Input
              id="store-name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="أدخل اسم المتجر"
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>شعار المتجر</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#0F7A4F]/40 transition-colors cursor-pointer bg-gray-50/50">
                {form.logo ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-[#0F7A4F]/10 flex items-center justify-center mx-auto mb-2">
                      <Store className="h-8 w-8 text-[#0F7A4F]" />
                    </div>
                    <p className="text-xs text-gray-500">تم اختيار الشعار</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">اضغطي لرفع الشعار</p>
                    <p className="text-xs text-gray-400">PNG, JPG — حد أقصى 2MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>أيقونة الموقع (Favicon)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#0F7A4F]/40 transition-colors cursor-pointer bg-gray-50/50">
                {form.favicon ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-[#D6A84F]/10 flex items-center justify-center mx-auto mb-2">
                      <Store className="h-8 w-8 text-[#D6A84F]" />
                    </div>
                    <p className="text-xs text-gray-500">تم اختيار الأيقونة</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">اضغطي لرفع الأيقونة</p>
                    <p className="text-xs text-gray-400">ICO, PNG — 32×32px</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-description">وصف المتجر</Label>
            <Textarea
              id="store-description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="اكتب وصفاً مختصراً لمتجرك"
              rows={3}
              className="rounded-lg resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-slogan">الشعار / العبارة الترويجية</Label>
            <Input
              id="store-slogan"
              value={form.slogan}
              onChange={(e) => updateField('slogan', e.target.value)}
              placeholder="مثال: أفضل المنتجات بأفضل الأسعار"
              className="rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Colors Card */}
      <Card className="bg-white rounded-xl border-gray-100">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#0F7A4F]" />
            <CardTitle className="text-lg font-semibold text-gray-900">ألوان المتجر</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="primary-color">اللون الأساسي</Label>
              <div className="flex items-center gap-3">
                <input
                  id="primary-color"
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <Input
                  value={form.primaryColor}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  className="rounded-lg font-mono text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">اللون الثانوي</Label>
              <div className="flex items-center gap-3">
                <input
                  id="secondary-color"
                  type="color"
                  value={form.secondaryColor}
                  onChange={(e) => updateField('secondaryColor', e.target.value)}
                  className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <Input
                  value={form.secondaryColor}
                  onChange={(e) => updateField('secondaryColor', e.target.value)}
                  className="rounded-lg font-mono text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500 mb-3">معاينة الألوان</p>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-24 rounded-lg shadow-sm"
                style={{ backgroundColor: form.primaryColor }}
              />
              <div
                className="h-12 w-24 rounded-lg shadow-sm"
                style={{ backgroundColor: form.secondaryColor }}
              />
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: form.primaryColor }}
                >
                  نص بلون أساسي
                </p>
                <p
                  className="text-sm"
                  style={{ color: form.secondaryColor }}
                >
                  نص بلون ثانوي
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card className="bg-white rounded-xl border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">معلومات التواصل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">رقم واتساب</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                placeholder="22XXXXXX"
                className="rounded-lg"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="22XXXXXX"
                className="rounded-lg"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="email@example.com"
              className="rounded-lg"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="نواكشوط"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="الحي، الشارع، رقم المبنى"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-8 h-11"
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// StoreBuilderSections
// ═══════════════════════════════════════════════════════════════════════════

export function StoreBuilderSections() {
  const { goBack } = useApp();
  const { toast } = useToast();

  const [sections, setSections] = useState<HomepageSection[]>(
    () => [...DEMO_THEME_SETTINGS.sections]
  );

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const updateTitle = (id: string, title: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  };

  const updateSubtitle = (id: string, subtitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, subtitle } : s))
    );
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next.map((s, i) => ({ ...s, sortOrder: i }));
    });
  };

  const handleSave = () => {
    toast({
      title: 'تم الحفظ بنجاح',
      description: 'تم تحديث أقسام الصفحة الرئيسية',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">أقسام الصفحة الرئيسية</h1>
            <p className="text-gray-500 text-sm mt-0.5">رتبي وأضيفي الأقسام التي تظهر في صفحتك الرئيسية</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-6 h-10"
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card
            key={section.id}
            className={`bg-white rounded-xl border-gray-100 transition-all ${
              !section.visible ? 'opacity-50' : ''
            }`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Reorder + Toggle */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Switch
                    checked={section.visible}
                    onCheckedChange={() => toggleVisibility(section.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Section Content */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="bg-[#0F7A4F]/5 text-[#0F7A4F] border-[#0F7A4F]/20 text-xs font-medium"
                    >
                      {SECTION_TYPE_LABELS[section.type] || section.type}
                    </Badge>
                    {!section.visible && (
                      <Badge variant="secondary" className="text-xs">
                        مخفي
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">العنوان</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateTitle(section.id, e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">العنوان الفرعي</Label>
                      <Input
                        value={section.subtitle}
                        onChange={(e) => updateSubtitle(section.id, e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                  </div>

                  {/* Image Upload Placeholder */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-lg border-dashed"
                    >
                      <Upload className="h-3.5 w-3.5 ml-1.5" />
                      {section.imageUrl ? 'تغيير الصورة' : 'رفع صورة'}
                    </Button>
                    {section.imageUrl && (
                      <span className="text-xs text-gray-400">صورة مرفقة</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-8 h-11"
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// StoreBuilderPages
// ═══════════════════════════════════════════════════════════════════════════

export function StoreBuilderPages() {
  const { goBack } = useApp();
  const { toast } = useToast();

  const [pages, setPages] = useState<DemoStorePage[]>(
    () => [...DEMO_STORE_PAGES]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<DemoStorePage | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft' as 'published' | 'draft',
    showInFooter: false,
  });

  const openNewDialog = () => {
    setEditingPage(null);
    setForm({ title: '', slug: '', content: '', status: 'draft', showInFooter: false });
    setDialogOpen(true);
  };

  const openEditDialog = (page: DemoStorePage) => {
    setEditingPage(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
      showInFooter: page.showInFooter,
    });
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: editingPage ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    if (editingPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingPage.id
            ? { ...p, ...form, updatedAt: new Date().toISOString() }
            : p
        )
      );
      toast({ title: 'تم التحديث', description: `تم تحديث صفحة "${form.title}"` });
    } else {
      const newPage: DemoStorePage = {
        id: `sp_${Date.now()}`,
        storeId: 's1',
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        content: form.content,
        status: form.status,
        showInFooter: form.showInFooter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPages((prev) => [newPage, ...prev]);
      toast({ title: 'تم الإضافة', description: `تم إضافة صفحة "${form.title}"` });
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'تم الحذف', description: `تم حذف صفحة "${title}"` });
  };

  const toggleFooter = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, showInFooter: !p.showInFooter, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">صفحات المتجر</h1>
            <p className="text-gray-500 text-sm mt-0.5">أنشئي وأدربي صفحات إضافية لمتجرك</p>
          </div>
        </div>
        <Button
          onClick={openNewDialog}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-6 h-10"
        >
          <Plus className="h-4 w-4 ml-2" />
          صفحة جديدة
        </Button>
      </div>

      {/* Pages Table */}
      <Card className="bg-white rounded-xl border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-semibold text-gray-600">العنوان</TableHead>
                <TableHead className="font-semibold text-gray-600">الرابط</TableHead>
                <TableHead className="font-semibold text-gray-600">الحالة</TableHead>
                <TableHead className="font-semibold text-gray-600">ذيل الصفحة</TableHead>
                <TableHead className="font-semibold text-gray-600">آخر تحديث</TableHead>
                <TableHead className="font-semibold text-gray-600 text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id} className="border-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {page.title}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500 font-mono" dir="ltr">
                      /{page.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800 text-xs'
                          : 'bg-gray-100 text-gray-600 text-xs'
                      }
                    >
                      {page.status === 'published' ? 'منشورة' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={page.showInFooter}
                      onCheckedChange={() => toggleFooter(page.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString('ar-MR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-[#0F7A4F]"
                        onClick={() => openEditDialog(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => handleDelete(page.id, page.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-2xl max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingPage ? 'تعديل الصفحة' : 'صفحة جديدة'}
            </DialogTitle>
            <DialogDescription>
              {editingPage ? 'عدّلي معلومات الصفحة' : 'أدخلي معلومات الصفحة الجديدة'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="page-title">عنوان الصفحة</Label>
              <Input
                id="page-title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="مثال: من نحن"
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-slug">الرابط (Slug)</Label>
              <Input
                id="page-slug"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="about-us"
                className="rounded-lg font-mono text-sm"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-content">المحتوى</Label>
              <Textarea
                id="page-content"
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="اكتب محتوى الصفحة هنا..."
                rows={8}
                className="rounded-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, status: v as 'published' | 'draft' }))
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">منشورة</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>إظهار في ذيل الصفحة</Label>
              <Switch
                checked={form.showInFooter}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, showInFooter: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.title.trim()}
              className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl"
            >
              <Save className="h-4 w-4 ml-2" />
              {editingPage ? 'تحديث' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// StoreBuilderSocial
// ═══════════════════════════════════════════════════════════════════════════

export function StoreBuilderSocial() {
  const { goBack } = useApp();
  const { toast } = useToast();

  const allPlatforms: SocialPlatform[] = [
    'facebook',
    'instagram',
    'tiktok',
    'snapchat',
    'whatsapp',
    'youtube',
    'website',
    'telegram',
  ];

  const [links, setLinks] = useState<DemoSocialLink[]>(() => {
    const existing = [...DEMO_SOCIAL_LINKS];
    const existingPlatforms = new Set(existing.map((l) => l.platform));
    const missing = allPlatforms.filter((p) => !existingPlatforms.has(p));
    const newLinks: DemoSocialLink[] = missing.map((p) => ({
      id: `sl_new_${p}`,
      storeId: 's1',
      platform: p,
      url: '',
      isActive: false,
    }));
    return [...existing, ...newLinks];
  });

  const updateUrl = (platform: SocialPlatform, url: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.platform === platform ? { ...l, url } : l))
    );
  };

  const toggleActive = (platform: SocialPlatform) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.platform === platform ? { ...l, isActive: !l.isActive } : l
      )
    );
  };

  const handleSave = () => {
    toast({
      title: 'تم الحفظ بنجاح',
      description: 'تم تحديث روابط التواصل الاجتماعي',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">روابط التواصل الاجتماعي</h1>
            <p className="text-gray-500 text-sm mt-0.5">أضيفي روابط حساباتك على مواقع التواصل</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-6 h-10"
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ
        </Button>
      </div>

      {/* Social Links */}
      <Card className="bg-white rounded-xl border-gray-100">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {allPlatforms.map((platform) => {
              const link = links.find((l) => l.platform === platform);
              if (!link) return null;

              const isSnapchat = platform === 'snapchat';
              const isDark = ['tiktok', 'youtube'].includes(platform);

              return (
                <div
                  key={platform}
                  className="flex items-center gap-4 p-4 sm:p-5"
                >
                  {/* Platform Icon */}
                  <div
                    className={`${SOCIAL_PLATFORM_COLORS[platform]} rounded-xl p-2.5 text-white shrink-0`}
                  >
                    {getSocialIcon(platform)}
                  </div>

                  {/* Label */}
                  <div className="w-28 sm:w-36 shrink-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {SOCIAL_PLATFORM_LABELS[platform]}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5" dir="ltr">
                      {platform}.com
                    </p>
                  </div>

                  {/* URL Input */}
                  <Input
                    value={link.url}
                    onChange={(e) => updateUrl(platform, e.target.value)}
                    placeholder={`أدخلي رابط ${SOCIAL_PLATFORM_LABELS[platform]}`}
                    className="flex-1 rounded-lg h-9 text-sm"
                    dir="ltr"
                  />

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {link.isActive ? 'نشط' : 'معطل'}
                    </span>
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={() => toggleActive(platform)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button Bottom */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-8 h-11"
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// StoreBuilderPreview
// ═══════════════════════════════════════════════════════════════════════════

export function StoreBuilderPreview() {
  const { setView, goBack } = useApp();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const store = DEMO_STORES[0];
  const theme = DEMO_THEME_SETTINGS;
  const storeUrl = `https://dokani.mr/${store.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      toast({ title: 'تم النسخ', description: 'تم نسخ رابط المتجر' });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const visibleSections = theme.sections.filter((s) => s.visible);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">معاينة متجرك</h1>
            <p className="text-gray-500 text-sm mt-0.5">شاهدي كيف يبدو متجرك للزبائن</p>
          </div>
        </div>
        <Button
          onClick={() => setView('storefront')}
          className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white rounded-xl px-6 h-10"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          فتح المتجر
        </Button>
      </div>

      {/* Store URL / Share */}
      <Card className="bg-white rounded-xl border-gray-100">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-3 flex-wrap">
            <Globe className="h-5 w-5 text-[#0F7A4F] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">رابط متجرك</p>
              <p className="font-mono text-sm text-gray-900 truncate" dir="ltr">
                {storeUrl}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-xl shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 ml-1.5 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 ml-1.5" />
              )}
              {copied ? 'تم النسخ' : 'نسخ الرابط'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Mockup */}
      <Card className="bg-white rounded-xl border-gray-100 overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="text-base font-semibold text-gray-700">
            معاينة الصفحة الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-w-md mx-auto border-x border-gray-100">
            {/* Phone-style mockup header */}
            <div
              className="p-4 text-white text-center"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Store className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">{store.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white/20 rounded" />
                  <div className="w-6 h-6 bg-white/20 rounded" />
                </div>
              </div>
            </div>

            {/* Hero Section Preview */}
            {visibleSections.find((s) => s.type === 'hero') && (
              <div
                className="p-6 text-center"
                style={{
                  backgroundColor: `${theme.primaryColor}10`,
                }}
              >
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: theme.primaryColor }}
                >
                  {theme.heroTitle}
                </h2>
                <p className="text-sm text-gray-600">
                  {theme.heroSubtitle}
                </p>
                <div
                  className="mt-3 inline-block px-6 py-2 text-white rounded-full text-xs font-medium"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  تسوقي الآن
                </div>
              </div>
            )}

            {/* Categories Preview */}
            {visibleSections.find((s) => s.type === 'categories') && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">
                  التصنيفات
                </h3>
                <div className="flex gap-2 overflow-hidden">
                  {['أزياء نسائية', 'إكسسوارات', 'أحذية', 'حقائب'].map(
                    (cat) => (
                      <div
                        key={cat}
                        className="flex-shrink-0 w-20 text-center"
                      >
                        <div className="w-16 h-16 mx-auto rounded-xl bg-gray-100 mb-1.5 flex items-center justify-center">
                          <Layout className="h-5 w-5 text-gray-300" />
                        </div>
                        <p className="text-[10px] text-gray-600 leading-tight">
                          {cat}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Featured Products Preview */}
            {visibleSections.find((s) => s.type === 'featured_products') && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">
                  منتجات مميزة
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-2"
                    >
                      <div className="aspect-square rounded-lg bg-gray-100 mb-2 flex items-center justify-center">
                        <Store className="h-6 w-6 text-gray-200" />
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded w-3/4 mb-1.5" />
                      <div className="flex items-center justify-between">
                        <div className="h-2.5 w-10 bg-gray-200 rounded" />
                        <div
                          className="h-2.5 w-10 rounded"
                          style={{ backgroundColor: theme.primaryColor + '40' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Sellers Preview */}
            {visibleSections.find((s) => s.type === 'best_sellers') && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">
                  الأكثر مبيعاً
                </h3>
                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-28 bg-gray-50 rounded-xl p-2"
                    >
                      <div className="aspect-square rounded-lg bg-gray-100 mb-1.5 flex items-center justify-center">
                        <Store className="h-5 w-5 text-gray-200" />
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                      <div className="h-2 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA Preview */}
            {visibleSections.find((s) => s.type === 'whatsapp_cta') && (
              <div className="p-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Share2 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-green-800">اطلبي عبر واتساب</p>
                  <p className="text-xs text-green-600 mt-0.5">تواصلي معنا مباشرة للطلب</p>
                </div>
              </div>
            )}

            {/* About Preview */}
            {visibleSections.find((s) => s.type === 'about') && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
                  عن متجرنا
                </h3>
                <p className="text-xs text-gray-500 text-center leading-relaxed px-2">
                  {store.description}
                </p>
              </div>
            )}

            {/* Social Media Preview */}
            {visibleSections.find((s) => s.type === 'social_media') && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">
                  تابعينا
                </h3>
                <div className="flex items-center justify-center gap-3">
                  {['facebook', 'instagram', 'tiktok', 'whatsapp'].map((p) => (
                    <div
                      key={p}
                      className={`w-9 h-9 ${SOCIAL_PLATFORM_COLORS[p as SocialPlatform]} rounded-full flex items-center justify-center text-white`}
                    >
                      {getSocialIcon(p as SocialPlatform)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Preview */}
            {visibleSections.find((s) => s.type === 'footer') && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  {store.name} — جميع الحقوق محفوظة
                </p>
                <p className="text-[10px] text-gray-300 text-center mt-1">
                  مدعوم من دكاني
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sections Summary */}
      <Card className="bg-white rounded-xl border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900">
            ملخص الأقسام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {theme.sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm ${
                  section.visible
                    ? 'border-[#0F7A4F]/20 bg-[#0F7A4F]/5 text-[#0F7A4F]'
                    : 'border-gray-100 bg-gray-50 text-gray-400 line-through'
                }`}
              >
                {section.visible ? (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300" />
                )}
                <span className="text-xs truncate">{SECTION_TYPE_LABELS[section.type]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
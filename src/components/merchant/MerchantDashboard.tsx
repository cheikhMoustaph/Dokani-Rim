'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  MERCHANT_STATS,
  DEMO_PRODUCTS,
  DEMO_CATEGORIES,
  DEMO_ORDERS,
  DEMO_INVOICES,
  formatMRU,
  IS_DEV_MODE,
  EMPTY_MERCHANT_STATS,
  ONBOARDING_CHECKLIST,
} from '@/lib/demo-data';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@/lib/types';
import type { DemoProduct, DemoCategory } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  CustomersModule, CampaignsModule, CouponsModule,
  DeliveryModule, AutomationModule,
} from '@/components/merchant/AdditionalModules';
import OrdersModule from '@/components/orders/OrdersModule';
import {
  StoreBuilderIdentity, StoreBuilderSections, StoreBuilderPages,
  StoreBuilderSocial, StoreBuilderPreview, StoreBuilderMain,
} from '@/components/merchant/StoreBuilder';
import {
  AccountingOverview, AccountingPaymentMethods, AccountingPaymentReview,
  AccountingTransactions, AccountingReports, AccountingMain,
} from '@/components/merchant/AccountingModule';

import {
  LayoutDashboard, ShoppingBag, Package, FolderOpen, Users, Megaphone,
  Tag, CreditCard, FileText, Truck, Bike, BarChart3, Settings, Zap,
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye,
  ArrowUpDown, ChevronLeft, X, Check, Star, TrendingUp, TrendingDown,
  DollarSign, Clock, AlertCircle, Menu, Bell, Store, Calculator, Share2,
} from 'lucide-react';

// ───────────────────────────── NAVIGATION ITEMS ─────────────────────────────
const NAV_ITEMS = [
  { label: 'الرئيسية', icon: LayoutDashboard, view: 'merchant-dashboard' as const },
  { label: 'الطلبات', icon: ShoppingBag, view: 'orders' as const },
  { label: 'المنتجات', icon: Package, view: 'products' as const },
  { label: 'التصنيفات', icon: FolderOpen, view: 'categories' as const },
  { label: 'العملاء', icon: Users, view: 'customers' as const },
  { label: 'الحملات', icon: Megaphone, view: 'campaigns' as const },
  { label: 'الكوبونات', icon: Tag, view: 'coupons' as const },
  { label: 'المدفوعات', icon: CreditCard, view: 'payments' as const },
  { label: 'الفواتير', icon: FileText, view: 'invoices' as const },
  { label: 'التوصيل', icon: Truck, view: 'delivery' as const },
  { label: 'المندوبون', icon: Bike, view: 'delivery-agents' as const },
  { label: 'التقارير', icon: BarChart3, view: 'reports' as const },
  { label: 'الأتمتة', icon: Zap, view: 'automation' as const },
  { label: 'بناء المتجر', icon: Store, view: 'store-builder' as const },
  { label: 'المحاسبة', icon: Calculator, view: 'accounting' as const },
  { label: 'إعدادات المتجر', icon: Settings, view: 'settings' as const },
];

// ───────────────────────────── STAT CARDS CONFIG ─────────────────────────────
const STAT_CARDS = [
  { label: 'إجمالي الطلبات', value: MERCHANT_STATS.totalOrders, icon: ShoppingBag, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-700' },
  { label: 'طلبات جديدة', value: MERCHANT_STATS.newOrders, icon: Clock, bg: 'bg-blue-50', iconBg: 'bg-blue-100 text-blue-700' },
  { label: 'الزبائن', value: MERCHANT_STATS.customers, icon: Users, bg: 'bg-purple-50', iconBg: 'bg-purple-100 text-purple-700' },
  { label: 'المنتجات', value: MERCHANT_STATS.products, icon: Package, bg: 'bg-cyan-50', iconBg: 'bg-cyan-100 text-cyan-700' },
  { label: 'الإيرادات', value: formatMRU(MERCHANT_STATS.revenue), icon: DollarSign, bg: 'bg-amber-50', iconBg: 'bg-amber-100 text-amber-700' },
  { label: 'الحملات النشطة', value: MERCHANT_STATS.activeCampaigns, icon: Megaphone, bg: 'bg-orange-50', iconBg: 'bg-orange-100 text-orange-700' },
  { label: 'مدفوعات معلقة', value: MERCHANT_STATS.pendingPayments, icon: CreditCard, bg: 'bg-red-50', iconBg: 'bg-red-100 text-red-700' },
  { label: 'طلبات التوصيل', value: MERCHANT_STATS.deliveryOrders, icon: Truck, bg: 'bg-indigo-50', iconBg: 'bg-indigo-100 text-indigo-700' },
];

// ─────────────────────────────────── INVOICE STATUS LABELS ──────────────────
const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'مسودة',
  pending_payment: 'بانتظار الدفع',
  paid: 'مدفوعة',
  rejected: 'مرفوضة',
  cancelled: 'ملغاة',
  refunded: 'مستردة',
};

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-rose-100 text-rose-800',
  refunded: 'bg-purple-100 text-purple-800',
};

// ═══════════════════════════════════════════════════════════════════════════
//  SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function Sidebar() {
  const { currentView, setView, sidebarOpen, setSidebarOpen } = useApp();
  const isMobile = useIsMobile();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F7A4F] text-white">
      {/* Logo */}
      <div className="p-5 pb-6 border-b border-white/15 flex items-center gap-3">
        <img src="/logo-image.png" alt="دكاني" className="h-9 w-9 rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight leading-none">دكاني</h1>
          <p className="text-sm text-white/70 mt-1">بوتيك النخبة</p>
        </div>
      </div>

      {/* Nav Items */}
      <ScrollArea className="flex-1 py-3 px-3">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view as any);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Store Owner */}
      <div className="p-4 border-t border-white/15">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-white/30">
            <AvatarFallback className="bg-white/20 text-white text-sm font-bold">فأ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">فاطمة بنت أحمد</p>
            <p className="text-xs text-white/60 truncate">صاحبة المتجر</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile: Sheet
  if (isMobile) {
    return (
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="p-0 w-[280px] bg-transparent border-none">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside className="fixed top-0 right-0 bottom-0 w-[260px] z-30 shadow-lg">
      {sidebarContent}
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TOP BAR
// ═══════════════════════════════════════════════════════════════════════════
function TopBar() {
  const { toggleSidebar } = useApp();
  const isMobile = useIsMobile();
  const currentView = useApp().currentView;
  const viewLabel = NAV_ITEMS.find(n => n.view === currentView)?.label || 'الرئيسية';

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900">{viewLabel}</h2>
            <p className="text-xs text-gray-500 hidden sm:block">بوتيك النخبة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>الإشعارات</TooltipContent>
          </Tooltip>
          <Avatar className="h-8 w-8 border-2 border-gray-200">
            <AvatarFallback className="bg-[#0F7A4F] text-white text-xs font-bold">فأ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
function DashboardOverview() {
  const { setView } = useApp();

  if (IS_DEV_MODE) {
    const latestOrders = DEMO_ORDERS.slice(0, 5);
    const bestSellers = DEMO_PRODUCTS.filter(p => p.isBestSeller).slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900 truncate">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders */}
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">الطلبات الأخيرة</CardTitle>
            <Button variant="ghost" size="sm" className="text-[#0F7A4F] text-xs" onClick={() => setView('orders')}>
              عرض الكل
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="text-xs font-semibold text-gray-500">رقم الطلب</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">الزبون</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">المبلغ</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">الحالة</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 hidden md:table-cell">المصدر</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 hidden lg:table-cell">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setView('order-details', { id: order.id })}
                    >
                      <TableCell className="text-sm font-medium text-gray-900">{order.orderNumber}</TableCell>
                      <TableCell className="text-sm text-gray-700">{order.customerName}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-900">{formatMRU(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 hidden md:table-cell">{order.source}</TableCell>
                      <TableCell className="text-sm text-gray-500 hidden lg:table-cell">
                        {new Date(order.createdAt).toLocaleDateString('ar-MR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Best Sellers */}
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">المنتجات الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bestSellers.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {idx < 3 && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#D6A84F] text-white text-[10px] font-bold">
                          {idx + 1}
                        </span>
                      )}
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    </div>
                    <p className="text-sm font-bold text-[#0F7A4F] mt-0.5">{formatMRU(product.price)}</p>
                  </div>
                  <Star className="h-4 w-4 text-[#D6A84F] fill-[#D6A84F] shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Empty state for real new merchants ──
  const emptyStatCards = [
    { label: 'إجمالي الطلبات', value: EMPTY_MERCHANT_STATS.totalOrders, icon: ShoppingBag, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-700' },
    { label: 'طلبات جديدة', value: EMPTY_MERCHANT_STATS.newOrders, icon: Clock, bg: 'bg-blue-50', iconBg: 'bg-blue-100 text-blue-700' },
    { label: 'الزبائن', value: EMPTY_MERCHANT_STATS.customers, icon: Users, bg: 'bg-purple-50', iconBg: 'bg-purple-100 text-purple-700' },
    { label: 'المنتجات', value: EMPTY_MERCHANT_STATS.products, icon: Package, bg: 'bg-cyan-50', iconBg: 'bg-cyan-100 text-cyan-700' },
    { label: 'الإيرادات', value: formatMRU(EMPTY_MERCHANT_STATS.revenue), icon: DollarSign, bg: 'bg-amber-50', iconBg: 'bg-amber-100 text-amber-700' },
    { label: 'الحملات النشطة', value: EMPTY_MERCHANT_STATS.activeCampaigns, icon: Megaphone, bg: 'bg-orange-50', iconBg: 'bg-orange-100 text-orange-700' },
    { label: 'مدفوعات معلقة', value: EMPTY_MERCHANT_STATS.pendingPayments, icon: CreditCard, bg: 'bg-red-50', iconBg: 'bg-red-100 text-red-700' },
    { label: 'طلبات التوصيل', value: EMPTY_MERCHANT_STATS.deliveryOrders, icon: Truck, bg: 'bg-indigo-50', iconBg: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="text-center py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">مرحباً بك في دكاني! 🎉</h2>
        <p className="text-sm text-gray-500 mt-2">ابدأ بإعداد متجرك لاستقبال أول طلب</p>
      </div>

      {/* Empty Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {emptyStatCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-xl border-gray-100 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Onboarding Checklist */}
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">قائمة المهام الأولى</CardTitle>
          <CardDescription className="text-xs text-gray-500">أكمل هذه الخطوات لتفعيل متجرك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ONBOARDING_CHECKLIST.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Checkbox
                  checked={item.completed}
                  disabled
                  className="shrink-0"
                />
                <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#0F7A4F] shrink-0"
                  onClick={() => setView(item.view as any)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA - Share Store Link */}
      <Card className="rounded-xl border-[#0F7A4F]/20 bg-[#0F7A4F]/5 shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right">
            <p className="text-base font-bold text-gray-900">شارك رابط متجرك لاستقبال أول طلب</p>
            <p className="text-xs text-gray-500 mt-1">أرسل الرابط لعملائك عبر واتساب أو وسائل التواصل الاجتماعي</p>
          </div>
          <Button
            className="bg-[#0F7A4F] hover:bg-[#0F7A4F]/90 text-white shrink-0"
            onClick={() => setView('store-builder-preview')}
          >
            <Share2 className="h-4 w-4 ml-2" />
            مشاركة الرابط
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PRODUCTS VIEW
// ═══════════════════════════════════════════════════════════════════════════
function ProductsView() {
  const { setView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
      const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, categoryFilter, statusFilter]);

  const storeCategories = DEMO_CATEGORIES.filter(c => c.storeId === 's1');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">المنتجات</h3>
          <p className="text-sm text-gray-500">{DEMO_PRODUCTS.length} منتج</p>
        </div>
        <Button
          onClick={() => setView('product-form')}
          className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg shadow-sm"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 rounded-lg"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {storeCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] rounded-lg">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="available">متوفر</SelectItem>
                <SelectItem value="unavailable">غير متوفر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="py-16 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">لا توجد منتجات</p>
            <p className="text-sm text-gray-400 mt-1">حاول تعديل معايير البحث</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              {/* Image Placeholder */}
              <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                <Package className="h-10 w-10 text-gray-300" />
                {product.isBestSeller && (
                  <Badge className="absolute top-3 right-3 bg-[#D6A84F] text-white text-[10px] px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 ml-1 fill-current" />
                    الأكثر مبيعاً
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full ${
                    product.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.status === 'available' ? 'متوفر' : 'غير متوفر'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-[#0F7A4F]">{formatMRU(product.price)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatMRU(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">المخزون: {product.stockQuantity} قطعة</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setView('product-form', { id: product.id })}>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedProduct(product);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>حذف المنتج</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف &quot;{selectedProduct?.name}&quot؛؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-lg">
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-lg"
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PRODUCT FORM VIEW
// ═══════════════════════════════════════════════════════════════════════════
function ProductFormView() {
  const { viewParams, setView, goBack } = useApp();
  const isEditing = !!viewParams?.id;
  const storeCategories = DEMO_CATEGORIES.filter(c => c.storeId === 's1');

  const [name, setName] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.name || '' : '');
  const [description, setDescription] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.description || '' : '');
  const [price, setPrice] = useState(isEditing ? String(DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.price || '') : '');
  const [compareAtPrice, setCompareAtPrice] = useState(isEditing ? String(DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.compareAtPrice || '') : '');
  const [categoryId, setCategoryId] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.categoryId || '' : '');
  const [status, setStatus] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.status || 'available' : 'available');
  const [stockQuantity, setStockQuantity] = useState(isEditing ? String(DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.stockQuantity || '') : '');
  const [sizes, setSizes] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.sizes.join(', ') || '' : '');
  const [colors, setColors] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.colors.join(', ') || '' : '');
  const [sku, setSku] = useState(isEditing ? DEMO_PRODUCTS.find(p => p.id === viewParams.id)?.sku || '' : '');
  const [customDeliveryCost, setCustomDeliveryCost] = useState('');

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h3>
          <p className="text-sm text-gray-500">أدخل بيانات المنتج</p>
        </div>
      </div>

      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">اسم المنتج *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: عباية كتان فاخرة" className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">التصنيف *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {storeCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">الوصف</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف تفصيلي للمنتج..."
              rows={4}
              className="rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">السعر (أوقية) *</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">سعر المقارنة</Label>
              <Input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="اختياري"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">الكمية في المخزون *</Label>
              <Input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">الحالة</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'available' | 'unavailable')}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">متوفر</SelectItem>
                  <SelectItem value="unavailable">غير متوفر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">المقاسات</Label>
              <Input
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="مفصولة بفاصلة: M, L, XL"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">الألوان</Label>
              <Input
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="مفصولة بفاصلة: أسود, بني"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">كود المنتج SKU</Label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="مثال: ABA-001"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">تكلفة توصيل مخصصة</Label>
              <Input
                type="number"
                value={customDeliveryCost}
                onChange={(e) => setCustomDeliveryCost(e.target.value)}
                placeholder="اختياري"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">رفع الصور</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0F7A4F] hover:bg-[#0F7A4F]/5 transition-colors cursor-pointer">
              <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">اضغط أو اسحب الصور هنا</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG حتى 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setView('products')}
          className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg shadow-sm"
        >
          <Check className="h-4 w-4 ml-2" />
          حفظ المنتج
        </Button>
        <Button variant="outline" onClick={goBack} className="rounded-lg">
          إلغاء
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  CATEGORIES VIEW
// ═══════════════════════════════════════════════════════════════════════════
function CategoriesView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<DemoCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catStatus, setCatStatus] = useState<'active' | 'inactive'>('active');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<DemoCategory | null>(null);

  const storeCategories = DEMO_CATEGORIES.filter(c => c.storeId === 's1');

  const openAdd = () => {
    setEditCat(null);
    setCatName('');
    setCatStatus('active');
    setDialogOpen(true);
  };

  const openEdit = (cat: DemoCategory) => {
    setEditCat(cat);
    setCatName(cat.name);
    setCatStatus(cat.status);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">التصنيفات</h3>
          <p className="text-sm text-gray-500">{storeCategories.length} تصنيف</p>
        </div>
        <Button onClick={openAdd} className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg shadow-sm">
          <Plus className="h-4 w-4 ml-2" />
          إضافة تصنيف
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {storeCategories.map((cat) => (
          <Card key={cat.id} className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <FolderOpen className="h-5 w-5 text-[#0F7A4F]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{cat.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.productCount} منتج</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-[#0F7A4F] text-xs flex-1" onClick={() => openEdit(cat)}>
                  <Edit className="h-3.5 w-3.5 ml-1" />
                  تعديل
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 text-xs flex-1"
                  onClick={() => {
                    setSelectedCat(cat);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 ml-1" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>{editCat ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</DialogTitle>
            <DialogDescription>
              {editCat ? 'قم بتعديل بيانات التصنيف' : 'أدخل بيانات التصنيف الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">اسم التصنيف</Label>
              <Input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="مثال: عبايات"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">الحالة</Label>
              <Select value={catStatus} onValueChange={(v) => setCatStatus(v as 'active' | 'inactive')}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg">إلغاء</Button>
            <Button onClick={() => setDialogOpen(false)} className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg">
              <Check className="h-4 w-4 ml-1" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>حذف التصنيف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف &quot;{selectedCat?.name}&quot؛؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-lg">إلغاء</Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(false)} className="rounded-lg">حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  REPORTS VIEW
// ═══════════════════════════════════════════════════════════════════════════
function ReportsView() {
  const monthlyData = [
    { month: 'يناير', orders: 12, revenue: 45000 },
    { month: 'فبراير', orders: 18, revenue: 72000 },
    { month: 'مارس', orders: 25, revenue: 110000 },
    { month: 'أبريل', orders: 22, revenue: 95000 },
    { month: 'مايو', orders: 30, revenue: 135000 },
    { month: 'يونيو', orders: 28, revenue: 120000 },
    { month: 'يوليو', orders: 21, revenue: 89000 },
  ];
  const maxOrders = Math.max(...monthlyData.map(d => d.orders));

  const topProducts = DEMO_PRODUCTS.filter(p => p.isBestSeller).slice(0, 5);

  const sourceData = [
    { source: 'واتساب', count: 65, percent: 42, color: 'bg-[#25D366]' },
    { source: 'انستغرام', count: 35, percent: 22, color: 'bg-pink-500' },
    { source: 'فيسبوك', count: 20, percent: 13, color: 'bg-blue-600' },
    { source: 'رابط مباشر', count: 18, percent: 12, color: 'bg-[#0F7A4F]' },
    { source: 'أخرى', count: 18, percent: 11, color: 'bg-gray-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-[#0F7A4F] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500 mt-1">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-[#D6A84F] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{formatMRU(892000)}</p>
            <p className="text-xs text-gray-500 mt-1">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">+15%</p>
            <p className="text-xs text-gray-500 mt-1">نسبة النمو</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{formatMRU(5718)}</p>
            <p className="text-xs text-gray-500 mt-1">متوسط قيمة الطلب</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Over Time - Bar Chart */}
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">الطلبات عبر الوقت</CardTitle>
          <CardDescription>عدد الطلبات الشهرية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">{d.orders}</span>
                <div
                  className="w-full rounded-t-md bg-[#0F7A4F] transition-all duration-500 min-h-[4px] hover:bg-[#0D6843]"
                  style={{ height: `${(d.orders / maxOrders) * 140}px` }}
                />
                <span className="text-[10px] text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">أفضل المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#D6A84F] text-white text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  </div>
                  <span className="text-sm font-bold text-[#0F7A4F] shrink-0">{formatMRU(product.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Sources */}
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">مصادر الزبائن</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceData.map((s) => (
                <div key={s.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{s.source}</span>
                    <span className="text-gray-500">{s.count} ({s.percent}%)</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color} transition-all duration-700`}
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SETTINGS VIEW
// ═══════════════════════════════════════════════════════════════════════════
function SettingsView() {
  const [storeName, setStoreName] = useState('بوتيك النخبة');
  const [storeDesc, setStoreDesc] = useState('أجمل الأزياء والإكسسوارات النسائية في نواكشوط');
  const [storePhone, setStorePhone] = useState('22222333');
  const [storeWhatsapp, setStoreWhatsapp] = useState('22222333');
  const [storeCity, setStoreCity] = useState('نواكشوط');
  const [storeLang, setStoreLang] = useState('ar');
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [returnPolicy, setReturnPolicy] = useState('يمكن إرجاع المنتج خلال 3 أيام من الاستلام بشرط أن يكون في حالته الأصلية. يتم استرجاع المبلغ خلال 48 ساعة بعد استلام المنتج المرتجع.');
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState('10000');

  const teamMembers = [
    { name: 'فاطمة بنت أحمد', role: 'صاحبة المتجر', phone: '22222333', avatar: 'فأ' },
    { name: 'محمد ولد إبراهيم', role: 'مندوب توصيل', phone: '11223344', avatar: 'مإ' },
    { name: 'آمنة محمد', role: 'مديرة الطلبات', phone: '55667788', avatar: 'أم' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">إعدادات المتجر</h3>
        <p className="text-sm text-gray-500">إدارة إعدادات متجرك وتفضيلاتك</p>
      </div>

      <Tabs dir="rtl" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="store-info" className="rounded-md text-xs sm:text-sm">معلومات المتجر</TabsTrigger>
          <TabsTrigger value="delivery" className="rounded-md text-xs sm:text-sm">التوصيل</TabsTrigger>
          <TabsTrigger value="return" className="rounded-md text-xs sm:text-sm">سياسة الإرجاع</TabsTrigger>
          <TabsTrigger value="team" className="rounded-md text-xs sm:text-sm">فريق العمل</TabsTrigger>
        </TabsList>

        <TabsContent value="store-info">
          <Card className="rounded-xl border-gray-100 shadow-sm mt-4">
            <CardContent className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">اسم المتجر</Label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">المدينة</Label>
                  <Input value={storeCity} onChange={(e) => setStoreCity(e.target.value)} className="rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">وصف المتجر</Label>
                <Textarea value={storeDesc} onChange={(e) => setStoreDesc(e.target.value)} rows={3} className="rounded-lg resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
                  <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">واتساب</Label>
                  <Input value={storeWhatsapp} onChange={(e) => setStoreWhatsapp(e.target.value)} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">اللغة</Label>
                  <Select value={storeLang} onValueChange={setStoreLang}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="fr">الفرنسية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">شعار المتجر</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0F7A4F] transition-colors cursor-pointer">
                  <Package className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-sm text-gray-500">اضغط لرفع الشعار</p>
                  <p className="text-xs text-gray-400">PNG, JPG حتى 2MB</p>
                </div>
              </div>
              <Button className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg shadow-sm">
                <Check className="h-4 w-4 ml-2" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card className="rounded-xl border-gray-100 shadow-sm mt-4">
            <CardContent className="p-5 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">توصيل للمنزل</p>
                    <p className="text-xs text-gray-500">تفعيل خدمة التوصيل</p>
                  </div>
                  <Switch checked={deliveryEnabled} onCheckedChange={setDeliveryEnabled} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">استلام من المتجر</p>
                    <p className="text-xs text-gray-500">السماح بالاستلام المباشر</p>
                  </div>
                  <Switch checked={pickupEnabled} onCheckedChange={setPickupEnabled} />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">توصيل مجاني فوق (أوقية)</Label>
                <Input value={freeDeliveryAbove} onChange={(e) => setFreeDeliveryAbove(e.target.value)} className="rounded-lg max-w-xs" />
              </div>
              <Button className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg shadow-sm">
                <Check className="h-4 w-4 ml-2" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="return">
          <Card className="rounded-xl border-gray-100 shadow-sm mt-4">
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">سياسة الإرجاع</p>
                <p className="text-xs text-gray-500">سيتم عرض هذه السياسة لعملائك في صفحة المتجر</p>
              </div>
              <Textarea
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                rows={6}
                className="rounded-lg resize-none"
              />
              <Button className="bg-[#0F7A4F] hover:bg-[#0D6843] text-white rounded-lg shadow-sm">
                <Check className="h-4 w-4 ml-2" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="rounded-xl border-gray-100 shadow-sm mt-4">
            <CardContent className="p-5">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.phone}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-[#0F7A4F] text-white text-sm font-bold">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role} • {member.phone}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#0F7A4F] text-xs shrink-0">
                      <Edit className="h-3.5 w-3.5 ml-1" />
                      تعديل
                    </Button>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="rounded-lg">
                <Plus className="h-4 w-4 ml-2" />
                إضافة عضو
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PAYMENTS VIEW
// ═══════════════════════════════════════════════════════════════════════════
function PaymentsView() {
  const stats = [
    { label: 'إجمالي المستلم', value: formatMRU(892000), icon: DollarSign, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-700', trend: '+12%' },
    { label: 'مبالغ معلقة', value: formatMRU(45000), icon: Clock, bg: 'bg-yellow-50', iconBg: 'bg-yellow-100 text-yellow-700', trend: '' },
    { label: 'هذا الشهر', value: formatMRU(125000), icon: TrendingUp, bg: 'bg-blue-50', iconBg: 'bg-blue-100 text-blue-700', trend: '+8%' },
  ];

  const transactions = [
    { id: 't1', description: 'دفعة طلب ORD-007', amount: 9400, method: 'نقداً عند التسليم', date: '2026-06-30', status: 'completed' as const },
    { id: 't2', description: 'دفعة طلب ORD-004', amount: 8000, method: 'تحويل يدوي', date: '2026-07-03', status: 'completed' as const },
    { id: 't3', description: 'دفعة طلب ORD-003', amount: 1400, method: 'نقداً عند التسليم', date: '2026-07-03', status: 'completed' as const },
    { id: 't4', description: 'دفعة طلب ORD-005', amount: 3800, method: 'تحويل يدوي', date: '2026-07-02', status: 'pending' as const },
    { id: 't5', description: 'دفعة طلب ORD-006', amount: 5200, method: 'تحويل يدوي', date: '2026-07-02', status: 'completed' as const },
    { id: 't6', description: 'دفعة طلب ORD-002', amount: 6200, method: 'تحويل يدوي', date: '2026-07-04', status: 'pending' as const },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">المدفوعات</h3>
        <p className="text-sm text-gray-500">تتبع جميع المدفوعات والتحويلات</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-xl border-gray-100 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 truncate">{stat.value}</p>
                  {stat.trend && (
                    <p className={`text-[10px] font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stat.trend} عن الشهر الماضي
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">المعاملات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="text-xs font-semibold text-gray-500">الوصف</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">المبلغ</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">الطريقة</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">الحالة</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-sm font-medium text-gray-900">{t.description}</TableCell>
                    <TableCell className="text-sm font-bold text-gray-900">{formatMRU(t.amount)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{t.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {t.status === 'completed' ? 'مكتمل' : 'معلق'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(t.date).toLocaleDateString('ar-MR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  INVOICES VIEW
// ═══════════════════════════════════════════════════════════════════════════
function InvoicesView() {
  const [selectedInvoice, setSelectedInvoice] = useState<typeof DEMO_INVOICES[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (invoice: typeof DEMO_INVOICES[0]) => {
    setSelectedInvoice(invoice);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">الفواتير</h3>
        <p className="text-sm text-gray-500">إدارة فواتير الاشتراك</p>
      </div>

      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="text-xs font-semibold text-gray-500">رقم الفاتورة</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">المبلغ</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">الخطة</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">المدة</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">الحالة</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">التاريخ</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_INVOICES.filter(i => i.storeId === 's1').map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-sm font-bold text-gray-900">{formatMRU(invoice.amount)}</TableCell>
                    <TableCell className="text-sm text-gray-700">{invoice.plan}</TableCell>
                    <TableCell className="text-sm text-gray-600">{invoice.duration}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-2 py-0.5 rounded-full ${INVOICE_STATUS_COLORS[invoice.status]}`}
                      >
                        {INVOICE_STATUS_LABELS[invoice.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString('ar-MR')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-[#0F7A4F] text-xs" onClick={() => openDetail(invoice)}>
                        <Eye className="h-3.5 w-3.5 ml-1" />
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="rounded-xl max-w-lg">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">فاتورة {selectedInvoice.invoiceNumber}</DialogTitle>
                <DialogDescription className="text-center">تفاصيل فاتورة الاشتراك</DialogDescription>
              </DialogHeader>
              <div className="border-2 border-[#0F7A4F]/20 rounded-xl p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-4">
                  <div>
                    <h4 className="text-xl font-bold text-[#0F7A4F]">دكاني</h4>
                    <p className="text-xs text-gray-500 mt-0.5">منصة التجارة الإلكترونية</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">فاتورة رقم</p>
                    <p className="text-sm font-bold text-gray-900">{selectedInvoice.invoiceNumber}</p>
                  </div>
                </div>

                {/* Merchant Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">التاجر</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.merchantName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">المتجر</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.storeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">الهاتف</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">تاريخ الإنشاء</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedInvoice.createdAt).toLocaleDateString('ar-MR')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Plan Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">خطة الاشتراك</span>
                    <span className="font-medium text-gray-900">{selectedInvoice.plan}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المدة</span>
                    <span className="font-medium text-gray-900">{selectedInvoice.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">طريقة الدفع</span>
                    <span className="font-medium text-gray-900">{selectedInvoice.paymentMethod}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">المجموع</span>
                  <span className="text-xl font-bold text-[#0F7A4F]">{formatMRU(selectedInvoice.amount)}</span>
                </div>

                {/* Status */}
                <div className="text-center pt-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs px-3 py-1 rounded-full ${INVOICE_STATUS_COLORS[selectedInvoice.status]}`}
                  >
                    {INVOICE_STATUS_LABELS[selectedInvoice.status]}
                  </Badge>
                  {selectedInvoice.paidAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      تاريخ الدفع: {new Date(selectedInvoice.paidAt).toLocaleDateString('ar-MR')}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PLACEHOLDER VIEW (for views not yet fully implemented)
// ═══════════════════════════════════════════════════════════════════════════
function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN MERCHANT DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function MerchantDashboard() {
  const { currentView } = useApp();
  const isMobile = useIsMobile();

  const renderView = () => {
    switch (currentView) {
      case 'merchant-dashboard':
        return <DashboardOverview />;
      case 'products':
        return <ProductsView />;
      case 'product-form':
        return <ProductFormView />;
      case 'categories':
        return <CategoriesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'payments':
        return <PaymentsView />;
      case 'invoices':
        return <InvoicesView />;
      case 'orders':
      case 'order-details':
        return <OrdersModule />;
      case 'customers':
        return <CustomersModule />;
      case 'campaigns':
      case 'campaign-form':
        return <CampaignsModule />;
      case 'coupons':
      case 'coupon-form':
        return <CouponsModule />;
      case 'delivery':
      case 'delivery-agents':
        return <DeliveryModule />;
      case 'automation':
        return <AutomationModule />;
      case 'store-builder':
        return <StoreBuilderMain />;
      case 'store-builder-identity':
        return <StoreBuilderIdentity />;
      case 'store-builder-sections':
        return <StoreBuilderSections />;
      case 'store-builder-pages':
        return <StoreBuilderPages />;
      case 'store-builder-social':
        return <StoreBuilderSocial />;
      case 'store-builder-preview':
        return <StoreBuilderPreview />;
      case 'accounting':
        return <AccountingMain />;
      case 'accounting-overview':
        return <AccountingOverview />;
      case 'accounting-payment-methods':
        return <AccountingPaymentMethods />;
      case 'accounting-payment-review':
        return <AccountingPaymentReview />;
      case 'accounting-transactions':
        return <AccountingTransactions />;
      case 'accounting-reports':
        return <AccountingReports />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isMobile ? 'mr-0' : 'mr-[260px]'}`}>
        <TopBar />
        <main className="p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
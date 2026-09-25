'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  ADMIN_STATS,
  DEMO_STORES,
  DEMO_INVOICES,
  formatMRU,
} from '@/lib/demo-data';
import { STORE_STATUS_LABELS, STORE_STATUS_COLORS } from '@/lib/types';
import { assetUrl } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import {
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Ban,
  MoreVertical,
  Search,
  Bell,
  ChevronDown,
  Package,
  CreditCard,
  BarChart3,
  Megaphone,
  Headphones,
  Settings,
  ArrowUpDown,
  Filter,
  Menu,
  X,
  Wallet,
} from 'lucide-react';

// ============ INVOICE STATUS LABELS & COLORS ============
const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'مسودة',
  pending_payment: 'بانتظار الدفع',
  paid: 'مدفوع',
  rejected: 'مرفوض',
  cancelled: 'ملغي',
  refunded: 'مسترد',
};

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-purple-100 text-purple-800',
};

// ============ SIDEBAR ITEMS ============
const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { id: 'merchants', label: 'التجار', icon: Users },
  { id: 'stores', label: 'المتاجر', icon: Store },
  { id: 'subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { id: 'payments', label: 'المدفوعات', icon: DollarSign },
  { id: 'payment-methods', label: 'طرق الدفع', icon: Wallet },
  { id: 'invoices', label: 'الفواتير', icon: TrendingUp },
  { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
  { id: 'products', label: 'المنتجات', icon: Package },
  { id: 'campaigns', label: 'الحملات', icon: Megaphone },
  { id: 'support', label: 'الدعم', icon: Headphones },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

// ============ STAT CARDS DATA ============
const STAT_CARDS = [
  {
    label: 'إجمالي التجار',
    value: ADMIN_STATS.totalMerchants.toLocaleString('ar-EG'),
    icon: Users,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    label: 'المتاجر النشطة',
    value: ADMIN_STATS.activeStores.toLocaleString('ar-EG'),
    icon: Store,
    color: 'bg-green-50 text-green-700 border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    label: 'متاجر تجريبية',
    value: ADMIN_STATS.trialStores.toLocaleString('ar-EG'),
    icon: Clock,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    iconBg: 'bg-yellow-100',
  },
  {
    label: 'متاجر منتهية',
    value: ADMIN_STATS.expiredStores.toLocaleString('ar-EG'),
    icon: XCircle,
    color: 'bg-gray-50 text-gray-600 border-gray-200',
    iconBg: 'bg-gray-100',
  },
  {
    label: 'متاجر معلقة',
    value: ADMIN_STATS.suspendedStores.toLocaleString('ar-EG'),
    icon: Ban,
    color: 'bg-red-50 text-red-600 border-red-200',
    iconBg: 'bg-red-100',
  },
  {
    label: 'إجمالي الطلبات',
    value: ADMIN_STATS.totalOrders.toLocaleString('ar-EG'),
    icon: ShoppingBag,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    iconBg: 'bg-purple-100',
  },
  {
    label: 'إجمالي المنتجات',
    value: ADMIN_STATS.totalProducts.toLocaleString('ar-EG'),
    icon: Package,
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    iconBg: 'bg-cyan-100',
  },
  {
    label: 'إجمالي الإيرادات',
    value: formatMRU(ADMIN_STATS.totalRevenue),
    icon: DollarSign,
    color: 'bg-green-50 text-green-700 border-green-200',
    iconBg: 'bg-green-100',
  },
];

// ============ MAIN COMPONENT ============
export default function AdminDashboard() {
  const { toggleSidebar, sidebarOpen, setSidebarOpen } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [activeSidebarItem, setActiveSidebarItem] = useState('overview');
  const [storeSearch, setStoreSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');

  // Map sidebar items to tabs
  const handleSidebarClick = (id: string) => {
    setActiveSidebarItem(id);
    if (id === 'overview') setActiveTab('overview');
    else if (id === 'stores') setActiveTab('stores');
    else if (id === 'payments') setActiveTab('payments');
    else if (id === 'invoices') setActiveTab('payments');
    else if (id === 'payment-methods') setActiveTab('payment-methods');
    setSidebarOpen(false);
  };

  // Unique cities from demo stores
  const uniqueCities = useMemo(
    () => ['all', ...Array.from(new Set(DEMO_STORES.map((s) => s.city)))],
    []
  );

  // Filtered stores
  const filteredStores = useMemo(() => {
    return DEMO_STORES.filter((store) => {
      const matchSearch =
        !storeSearch ||
        store.name.includes(storeSearch) ||
        store.city.includes(storeSearch);
      const matchStatus =
        statusFilter === 'all' || store.status === statusFilter;
      const matchCity = cityFilter === 'all' || store.city === cityFilter;
      return matchSearch && matchStatus && matchCity;
    });
  }, [storeSearch, statusFilter, cityFilter]);

  // Payment stats
  const paymentStats = useMemo(() => {
    const total = DEMO_INVOICES.reduce((sum, inv) => sum + inv.amount, 0);
    const confirmed = DEMO_INVOICES.filter((i) => i.status === 'paid').reduce(
      (sum, i) => sum + i.amount,
      0
    );
    const pending = DEMO_INVOICES.filter(
      (i) => i.status === 'pending_payment'
    ).reduce((sum, i) => sum + i.amount, 0);
    const rejected = DEMO_INVOICES.filter((i) => i.status === 'rejected').reduce(
      (sum, i) => sum + i.amount,
      0
    );
    return { total, confirmed, pending, rejected };
  }, []);

  // Open action dialog
  const openDialog = (title: string, description: string) => {
    setDialogTitle(title);
    setDialogDescription(description);
    setDialogOpen(true);
  };

  // ============ RENDER ============
  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Tajawal', 'Arial', sans-serif" }}>
      {/* ===== TOP BAR ===== */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-3">
            <img src={assetUrl('/logo-image.png')} alt="دكاني — Dokani" className="h-8 w-auto" />
            <h1 className="text-base font-bold text-gray-700 md:text-lg hidden sm:block">
              لوحة إدارة المنصة
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#D6A84F' }}>
              3
            </span>
          </Button>

          <Separator orientation="vertical" className="h-8 bg-gray-200" />

          {/* Admin info */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
            <Avatar className="h-9 w-9 border-2" style={{ borderColor: '#0F7A4F' }}>
              <AvatarFallback className="text-sm font-bold text-white" style={{ backgroundColor: '#0F7A4F' }}>
                م
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">مدير دكاني</p>
              <p className="text-xs text-gray-500 leading-tight">مدير النظام</p>
            </div>
            <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ===== SIDEBAR OVERLAY (mobile) ===== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ===== SIDEBAR ===== */}
        <aside
          className={`
            fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-64 transform overflow-y-auto transition-transform duration-300 ease-in-out
            lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
          style={{ backgroundColor: '#0F7A4F' }}
        >
          <nav className="flex flex-col py-4 px-3">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarClick(item.id)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-4 border-t border-white/20" />

            {/* Platform brand */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">دكاني</p>
                <p className="text-[11px] text-white/60">الإصدار 2.0</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              const tabToSidebar: Record<string, string> = {
                overview: 'overview',
                stores: 'stores',
                payments: 'payments',
                'payment-methods': 'payment-methods',
              };
              setActiveSidebarItem(tabToSidebar[val] || val);
            }}
            className="w-full"
          >
            {/* ============ OVERVIEW TAB ============ */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Page title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">نظرة عامة</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ملخص شامل لحالة المنصة اليوم
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit text-xs px-3 py-1.5 border-gray-300 text-gray-600"
                >
                  آخر تحديث: اليوم ١٢:٠٠
                </Badge>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={idx}
                      className={`border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-default ${stat.color}`}
                    >
                      <CardContent className="p-4 md:p-5">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium opacity-70">
                              {stat.label}
                            </p>
                            <p className="text-xl md:text-2xl font-bold leading-tight">
                              {stat.value}
                            </p>
                          </div>
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick insights row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent stores card */}
                <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-gray-900">
                        أحدث المتاجر
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-gray-100"
                        onClick={() => {
                          setActiveTab('stores');
                          setActiveSidebarItem('stores');
                        }}
                      >
                        عرض الكل
                        <ChevronDown className="h-3.5 w-3.5 rotate-90 mr-1" />
                      </Button>
                    </div>
                    <CardDescription>آخر المتاجر المسجلة في المنصة</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {DEMO_STORES.slice(0, 5).map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
                              style={{ backgroundColor: '#0F7A4F' }}
                            >
                              {store.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {store.name}
                              </p>
                              <p className="text-xs text-gray-500">{store.city}</p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-[11px] shrink-0 ${STORE_STATUS_COLORS[store.status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {STORE_STATUS_LABELS[store.status] || store.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent payments card */}
                <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-gray-900">
                        أحدث المدفوعات
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-gray-100"
                        onClick={() => {
                          setActiveTab('payments');
                          setActiveSidebarItem('payments');
                        }}
                      >
                        عرض الكل
                        <ChevronDown className="h-3.5 w-3.5 rotate-90 mr-1" />
                      </Button>
                    </div>
                    <CardDescription>آخر عمليات الدفع في المنصة</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {DEMO_INVOICES.map((inv) => (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {inv.storeName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {inv.merchantName} • {inv.invoiceNumber}
                            </p>
                          </div>
                          <div className="text-left shrink-0 mr-3">
                            <p className="text-sm font-bold text-gray-900">
                              {formatMRU(inv.amount)}
                            </p>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${INVOICE_STATUS_COLORS[inv.status] || 'bg-gray-100 text-gray-700'}`}
                            >
                              {INVOICE_STATUS_LABELS[inv.status] || inv.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ============ STORES TAB ============ */}
            <TabsContent value="stores" className="mt-0 space-y-6">
              {/* Page title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة المتاجر</h2>
                <p className="text-sm text-gray-500 mt-1">
                  عرض وإدارة جميع المتاجر المسجلة في المنصة
                </p>
              </div>

              {/* Filter bar */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="ابحث بالاسم أو المدينة..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        className="pr-9 h-10 border-gray-300 focus:border-[#0F7A4F] focus:ring-[#0F7A4F]/20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-full sm:w-44 h-10 border-gray-300">
                          <Filter className="h-4 w-4 ml-2 text-gray-400" />
                          <SelectValue placeholder="الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الحالات</SelectItem>
                          {Object.entries(STORE_STATUS_LABELS).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <Select value={cityFilter} onValueChange={setCityFilter}>
                        <SelectTrigger className="w-full sm:w-44 h-10 border-gray-300">
                          <SelectValue placeholder="المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city === 'all' ? 'جميع المدن' : city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stores table */}
              <Card className="border-gray-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 sticky top-0 z-10">
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            المتجر
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            المدينة
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            المنتجات
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            الطلبات
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            الإيرادات
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            الحالة
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            تاريخ الإنشاء
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            إجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStores.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center py-12 text-gray-500"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-gray-300" />
                                <p>لا توجد نتائج مطابقة</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStores.map((store) => (
                            <TableRow
                              key={store.id}
                              className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                            >
                              <TableCell className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                                    style={{ backgroundColor: '#0F7A4F' }}
                                  >
                                    {store.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                                      {store.name}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate max-w-[160px]">
                                      {store.description}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-sm text-gray-600">
                                {store.city}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-center text-sm font-medium text-gray-700">
                                {store.productCount}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-center text-sm font-medium text-gray-700">
                                {store.orderCount}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-sm font-semibold text-gray-900">
                                {formatMRU(store.revenue)}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-center">
                                <Badge
                                  variant="secondary"
                                  className={`text-[11px] font-medium ${STORE_STATUS_COLORS[store.status] || 'bg-gray-100 text-gray-700'}`}
                                >
                                  {STORE_STATUS_LABELS[store.status] || store.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-sm text-gray-500">
                                {new Date(store.createdAt).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-gray-100"
                                    >
                                      <MoreVertical className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        openDialog(
                                          `عرض المتجر: ${store.name}`,
                                          `الاسم: ${store.name}\nالمدينة: ${store.city}\nالحالة: ${STORE_STATUS_LABELS[store.status]}\nالمنتجات: ${store.productCount}\nالطلبات: ${store.orderCount}\nالإيرادات: ${formatMRU(store.revenue)}\nتاريخ الإنشاء: ${store.createdAt}`
                                        )
                                      }
                                    >
                                      <Eye className="h-4 w-4 ml-2 text-blue-500" />
                                      عرض
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer text-red-600 focus:text-red-600"
                                      onClick={() =>
                                        openDialog(
                                          `تعليق المتجر: ${store.name}`,
                                          `هل أنت متأكد من تعليق المتجر "${store.name}"؟ سيتم منع صاحب المتجر من الوصول حتى تتم إعادة تفعيله.`
                                        )
                                      }
                                    >
                                      <Ban className="h-4 w-4 ml-2" />
                                      تعليق
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        openDialog(
                                          `تفعيل المتجر: ${store.name}`,
                                          `سيتم تفعيل المتجر "${store.name}" وجعله متاحاً للاستخدام.`
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                                      تفعيل
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        openDialog(
                                          `إرسال إشعار إلى: ${store.name}`,
                                          `سيتم إرسال إشعار إلى مالك المتجر "${store.name}" عبر البريد الإلكتروني والهاتف.`
                                        )
                                      }
                                    >
                                      <Bell className="h-4 w-4 ml-2" style={{ color: '#D6A84F' }} />
                                      إرسال إشعار
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Store count summary */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <p>
                  عرض{' '}
                  <span className="font-semibold text-gray-700">
                    {filteredStores.length}
                  </span>{' '}
                  متجر من أصل{' '}
                  <span className="font-semibold text-gray-700">
                    {DEMO_STORES.length}
                  </span>
                </p>
              </div>
            </TabsContent>

            {/* ============ PAYMENTS TAB ============ */}
            <TabsContent value="payments" className="mt-0 space-y-6">
              {/* Page title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة المدفوعات</h2>
                <p className="text-sm text-gray-500 mt-1">
                  متابعة وتأكيد المدفوعات والفواتير
                </p>
              </div>

              {/* Payment stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">إجمالي المدفوعات</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatMRU(paymentStats.total)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">المدفوعات المؤكدة</p>
                        <p className="text-lg font-bold text-green-700">
                          {formatMRU(paymentStats.confirmed)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">بانتظار التأكيد</p>
                        <p className="text-lg font-bold text-yellow-700">
                          {formatMRU(paymentStats.pending)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">المرفوضة</p>
                        <p className="text-lg font-bold text-red-600">
                          {formatMRU(paymentStats.rejected)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payments table */}
              <Card className="border-gray-200 overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base font-bold text-gray-900">
                      قائمة الفواتير
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        ترتيب حسب التاريخ
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            رقم الفاتورة
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            التاجر
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            المتجر
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            الخطة
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            المبلغ
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            طريقة الدفع
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            الحالة
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
                            التاريخ
                          </TableHead>
                          <TableHead className="text-center font-semibold text-gray-700 py-3 px-4">
                            إجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DEMO_INVOICES.map((inv) => (
                          <TableRow
                            key={inv.id}
                            className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                          >
                            <TableCell className="py-3.5 px-4">
                              <span className="text-sm font-mono font-semibold text-gray-900">
                                {inv.invoiceNumber}
                              </span>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-sm text-gray-700">
                              {inv.merchantName}
                            </TableCell>
                            <TableCell className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white text-[10px] font-bold"
                                  style={{ backgroundColor: '#0F7A4F' }}
                                >
                                  {inv.storeName.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                  {inv.storeName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-center">
                              <Badge
                                variant="outline"
                                className="text-xs font-medium border-gray-300 text-gray-700"
                              >
                                {inv.plan}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-sm font-bold text-gray-900">
                              {formatMRU(inv.amount)}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-center">
                              <Badge
                                variant="secondary"
                                className={`text-[11px] font-medium ${
                                  inv.paymentMethod === 'bankily'
                                    ? 'bg-blue-50 text-blue-700'
                                    : inv.paymentMethod === 'masrvi'
                                      ? 'bg-purple-50 text-purple-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {inv.paymentMethod === 'bankily'
                                  ? 'بنكيلي'
                                  : inv.paymentMethod === 'masrvi'
                                    ? 'مصريفي'
                                    : inv.paymentMethod === 'cash'
                                      ? 'نقدي'
                                      : inv.paymentMethod}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-center">
                              <Badge
                                variant="secondary"
                                className={`text-[11px] font-medium ${INVOICE_STATUS_COLORS[inv.status] || 'bg-gray-100 text-gray-700'}`}
                              >
                                {INVOICE_STATUS_LABELS[inv.status] || inv.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-sm text-gray-500">
                              {new Date(inv.createdAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100"
                                  >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      openDialog(
                                        `عرض الفاتورة: ${inv.invoiceNumber}`,
                                        `رقم الفاتورة: ${inv.invoiceNumber}\nالتاجر: ${inv.merchantName}\nالمتجر: ${inv.storeName}\nالخطة: ${inv.plan}\nالمدة: ${inv.duration}\nالمبلغ: ${formatMRU(inv.amount)}\nطريقة الدفع: ${inv.paymentMethod}\nالحالة: ${INVOICE_STATUS_LABELS[inv.status]}\nالتاريخ: ${inv.createdAt}${inv.paidAt ? `\nتاريخ الدفع: ${inv.paidAt}` : ''}`
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4 ml-2 text-blue-500" />
                                    عرض
                                  </DropdownMenuItem>
                                  {inv.status === 'pending_payment' && (
                                    <>
                                      <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                          openDialog(
                                            `تأكيد الدفع: ${inv.invoiceNumber}`,
                                            `سيتم تأكيد استلام دفع بقيمة ${formatMRU(inv.amount)} من ${inv.merchantName} (${inv.storeName}) عبر ${inv.paymentMethod}.`
                                          )
                                        }
                                      >
                                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                                        تأكيد الدفع
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() =>
                                          openDialog(
                                            `رفض الدفع: ${inv.invoiceNumber}`,
                                            `سيتم رفض الدفع بقيمة ${formatMRU(inv.amount)} من ${inv.merchantName}. يرجى التأكد من صحة الإجراء.`
                                          )
                                        }
                                      >
                                        <XCircle className="h-4 w-4 ml-2" />
                                        رفض
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {inv.status === 'draft' && (
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        openDialog(
                                          `تأكيد الدفع: ${inv.invoiceNumber}`,
                                          `سيتم تحويل حالة الفاتورة من "مسودة" إلى "مدفوع" بقيمة ${formatMRU(inv.amount)}.`
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                                      تأكيد الدفع
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ PAYMENT METHODS TAB ============ */}
            <TabsContent value="payment-methods" className="mt-0 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">طرق الدفع</h2>
                  <p className="text-sm text-gray-500 mt-1">إدارة طرق الدفع المتاحة على المنصة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                  { name: 'Bankily', type: 'bankily', color: 'bg-orange-500', merchants: 89, transactions: 1250 },
                  { name: 'Sedad', type: 'sedad', color: 'bg-blue-500', merchants: 67, transactions: 890 },
                  { name: 'Masrvi', type: 'masrvi', color: 'bg-green-500', merchants: 72, transactions: 1050 },
                  { name: 'BIM Bank', type: 'bim_bank', color: 'bg-purple-500', merchants: 45, transactions: 520 },
                  { name: 'Click', type: 'click', color: 'bg-cyan-500', merchants: 38, transactions: 310 },
                  { name: 'الدفع عند الاستلام', type: 'cash', color: 'bg-gray-500', merchants: 156, transactions: 4523 },
                ].map((method) => (
                  <Card key={method.type} className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center text-white font-bold text-lg`}>
                          {method.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{method.name}</p>
                          <Badge variant="outline" className="text-[10px] mt-0.5">نشط</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">التجار المستخدمين</span>
                          <span className="font-semibold text-gray-900">{method.merchants}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">المعاملات</span>
                          <span className="font-semibold text-gray-900">{method.transactions.toLocaleString('ar-EG')}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4 text-xs border-gray-200">
                        إعدادات الطريقة
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="rounded-xl border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">إحصائيات المدفوعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">24.650.000</p>
                      <p className="text-xs text-green-600 mt-1">إجمالي المعاملات (أوقية)</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">8.530</p>
                      <p className="text-xs text-blue-600 mt-1">إجمالي المعاملات الرقمية</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-700">62%</p>
                      <p className="text-xs text-gray-600 mt-1">نسبة الدفع الرقمي</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* ===== ACTION DIALOG ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="whitespace-pre-line text-sm text-gray-600 leading-relaxed pt-2">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 sm:justify-start">
            <Button
              onClick={() => setDialogOpen(false)}
              className="text-white"
              style={{ backgroundColor: '#0F7A4F' }}
            >
              حسناً
            </Button>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
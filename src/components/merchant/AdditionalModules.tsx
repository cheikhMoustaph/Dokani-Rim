'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  DEMO_CUSTOMERS, CUSTOMER_STATUS_LABELS, CUSTOMER_SOURCE_LABELS,
  DEMO_CAMPAIGNS, CAMPAIGN_TYPE_LABELS,
  DEMO_COUPONS, DEMO_DELIVERY_ZONES, DEMO_DELIVERY_AGENTS, DEMO_AUTOMATIONS, formatMRU,
} from '@/lib/demo-data';
import type { DemoCustomer, DemoCampaign, DemoCoupon, DemoDeliveryZone, DemoDeliveryAgent, DemoAutomation } from '@/lib/types';

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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

import {
  Users, Search, Filter, MoreVertical, Plus, Edit, Trash2, Eye,
  MessageCircle, Phone, MapPin, Star, TrendingUp, Megaphone, Tag,
  Truck, Bike, Zap, Target, BarChart3, DollarSign, Clock, Ban,
  Check, X, Send, UserPlus, Mail, ChevronDown,
} from 'lucide-react';

// ============================================================
// CONSTANTS
// ============================================================

const TRIGGER_LABELS: Record<string, string> = {
  new_order: 'طلب جديد',
  waiting_payment: 'بانتظار الدفع',
  payment_confirmed: 'تم تأكيد الدفع',
  on_the_way: 'في الطريق',
  delivered: 'تم التسليم',
  customer_not_responding: 'الزبون لا يرد',
  trial_ending: 'انتهاء التجربة قريباً',
  trial_expired: 'انتهت التجربة',
};

const ACTION_LABELS: Record<string, string> = {
  send_whatsapp: 'إرسال رسالة واتساب',
  show_notification: 'إشعار في لوحة التحكم',
  change_status: 'تغيير الحالة',
  add_tag: 'إضافة وسم للزبون',
};

const CUSTOMER_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  repeat: 'bg-green-100 text-green-800',
  vip: 'bg-amber-100 text-amber-800',
  inactive: 'bg-gray-100 text-gray-600',
};

const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  active: 'نشط',
  paused: 'متوقفة',
  ended: 'منتهية',
};

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  ended: 'bg-gray-100 text-gray-600',
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: 'واتساب',
  instagram: 'انستغرام',
  facebook: 'فيسبوك',
  sms: 'رسائل نصية',
  email: 'بريد إلكتروني',
};

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: 'bg-emerald-100 text-emerald-800',
  instagram: 'bg-pink-100 text-pink-800',
  facebook: 'bg-blue-100 text-blue-800',
  sms: 'bg-violet-100 text-violet-800',
  email: 'bg-orange-100 text-orange-800',
};

const AGENT_STATUS_LABELS: Record<string, string> = {
  available: 'متاح',
  busy: 'مشغول',
  offline: 'غير متصل',
};

const AGENT_STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  busy: 'bg-yellow-100 text-yellow-800',
  offline: 'bg-gray-100 text-gray-600',
};

const AUTO_TRIGGER_COLORS: Record<string, string> = {
  new_order: 'bg-blue-100 text-blue-800',
  waiting_payment: 'bg-yellow-100 text-yellow-800',
  payment_confirmed: 'bg-green-100 text-green-800',
  on_the_way: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  customer_not_responding: 'bg-gray-100 text-gray-600',
  trial_ending: 'bg-orange-100 text-orange-800',
  trial_expired: 'bg-red-100 text-red-800',
};

const AUTO_ACTION_COLORS: Record<string, string> = {
  send_whatsapp: 'bg-emerald-100 text-emerald-800',
  show_notification: 'bg-blue-100 text-blue-800',
  change_status: 'bg-orange-100 text-orange-800',
  add_tag: 'bg-violet-100 text-violet-800',
};

// ============================================================
// 1. CUSTOMERS MODULE
// ============================================================

export function CustomersModule() {
  const { setView } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<DemoCustomer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    return DEMO_CUSTOMERS.filter((c) => {
      if (search && !c.name.includes(search) && !c.phone.includes(search)) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
      return true;
    });
  }, [search, statusFilter, sourceFilter]);

  const stats = useMemo(() => ({
    total: DEMO_CUSTOMERS.length,
    vip: DEMO_CUSTOMERS.filter((c) => c.status === 'vip').length,
    newC: DEMO_CUSTOMERS.filter((c) => c.status === 'new').length,
    inactive: DEMO_CUSTOMERS.filter((c) => c.status === 'inactive').length,
  }), []);

  const openDetail = (c: DemoCustomer) => {
    setSelectedCustomer(c);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">العملاء</h1>
        <Button
          onClick={() => {}}
          className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white gap-2"
        >
          <UserPlus className="h-4 w-4" />
          إضافة زبون
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="بحث بالاسم أو الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="repeat">متكرر</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="المصدر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المصادر</SelectItem>
                {Object.entries(CUSTOMER_SOURCE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F7A4F]/10">
              <Users className="h-5 w-5 text-[#0F7A4F]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي العملاء</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Star className="h-5 w-5 text-[#D6A84F]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">عملاء VIP</p>
              <p className="text-xl font-bold text-gray-900">{stats.vip}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">عملاء جدد</p>
              <p className="text-xl font-bold text-gray-900">{stats.newC}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Ban className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">غير نشطين</p>
              <p className="text-xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <ScrollArea className="max-h-[480px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                  <TableHead className="text-gray-700 font-semibold">الاسم</TableHead>
                  <TableHead className="text-gray-700 font-semibold">الهاتف</TableHead>
                  <TableHead className="text-gray-700 font-semibold hidden md:table-cell">المدينة</TableHead>
                  <TableHead className="text-gray-700 font-semibold hidden lg:table-cell">المصدر</TableHead>
                  <TableHead className="text-gray-700 font-semibold text-center">الطلبات</TableHead>
                  <TableHead className="text-gray-700 font-semibold hidden xl:table-cell">إجمالي المشتريات</TableHead>
                  <TableHead className="text-gray-700 font-semibold">الحالة</TableHead>
                  <TableHead className="text-gray-700 font-semibold hidden lg:table-cell">آخر طلب</TableHead>
                  <TableHead className="text-gray-700 font-semibold text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-gray-400">
                      لا يوجد عملاء مطابقون للبحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-[#0F7A4F]/5 transition-colors"
                      onClick={() => openDetail(customer)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#0F7A4F]/10 text-[#0F7A4F] text-xs font-bold">
                              {customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm" dir="ltr">{customer.phone}</TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600">{customer.city}</TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600">
                        {CUSTOMER_SOURCE_LABELS[customer.source] || customer.source}
                      </TableCell>
                      <TableCell className="text-center font-medium">{customer.orderCount}</TableCell>
                      <TableCell className="hidden xl:table-cell text-gray-600">{formatMRU(customer.totalPurchases)}</TableCell>
                      <TableCell>
                        <Badge className={`${CUSTOMER_STATUS_COLORS[customer.status]} border-0 text-xs font-medium`}>
                          {CUSTOMER_STATUS_LABELS[customer.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-500 text-sm">{customer.lastOrderDate}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetail(customer); }}>
                              <Eye className="ml-2 h-4 w-4" /> عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Edit className="ml-2 h-4 w-4" /> تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="ml-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">حذف</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تفاصيل الزبون</DialogTitle>
            <DialogDescription className="text-right">معلومات كاملة عن الزبون وسجل الطلبات</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-[#0F7A4F]/10 text-[#0F7A4F] text-lg font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${CUSTOMER_STATUS_COLORS[selectedCustomer.status]} border-0 text-xs`}>
                      {CUSTOMER_STATUS_LABELS[selectedCustomer.status]}
                    </Badge>
                    <span className="text-sm text-gray-500">{CUSTOMER_SOURCE_LABELS[selectedCustomer.source]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">الهاتف</p>
                  <p className="font-medium text-gray-900 font-mono" dir="ltr">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">المدينة</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.city} - {selectedCustomer.area}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">عدد الطلبات</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.orderCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">إجمالي المشتريات</p>
                  <p className="font-medium text-[#0F7A4F]">{formatMRU(selectedCustomer.totalPurchases)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">أول طلب</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.firstOrderDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">آخر طلب</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.lastOrderDate}</p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-gray-400 text-sm mb-1">ملاحظات</p>
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{selectedCustomer.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Mock order history */}
              <div>
                <p className="text-gray-400 text-sm mb-2">آخر الطلبات</p>
                <div className="space-y-2">
                  {[
                    { id: 'ORD-001', total: 8700, status: 'جديد', date: '2026-07-04' },
                    { id: 'ORD-007', total: 9400, status: 'تم التسليم', date: '2026-06-30' },
                    { id: 'ORD-012', total: 5200, status: 'تم التسليم', date: '2026-06-15' },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <span className="text-gray-400 mr-2">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">{formatMRU(order.total)}</span>
                        <Badge variant="outline" className="text-xs">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Contact buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
                  <Phone className="h-4 w-4" />
                  اتصال
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 2. CAMPAIGNS MODULE
// ============================================================

export function CampaignsModule() {
  const { setView } = useApp();
  const [formOpen, setFormOpen] = useState(false);

  const stats = useMemo(() => {
    const active = DEMO_CAMPAIGNS.filter((c) => c.status === 'active');
    return {
      activeCount: active.length,
      totalVisits: DEMO_CAMPAIGNS.reduce((s, c) => s + c.visits, 0),
      totalOrders: DEMO_CAMPAIGNS.reduce((s, c) => s + c.orders, 0),
      totalRevenue: DEMO_CAMPAIGNS.reduce((s, c) => s + c.revenue, 0),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الحملات التسويقية</h1>
        <Button
          onClick={() => setFormOpen(true)}
          className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          إنشاء حملة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Megaphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">حملات نشطة</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الزيارات</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalVisits.toLocaleString('ar')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D6A84F]/15">
              <Target className="h-5 w-5 text-[#D6A84F]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الطلبات</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F7A4F]/10">
              <DollarSign className="h-5 w-5 text-[#0F7A4F]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
              <p className="text-lg font-bold text-gray-900">{formatMRU(stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DEMO_CAMPAIGNS.map((campaign) => (
          <Card key={campaign.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-bold text-gray-900 leading-tight">{campaign.name}</CardTitle>
                <Badge className={`${CAMPAIGN_STATUS_COLORS[campaign.status]} border-0 text-xs shrink-0`}>
                  {CAMPAIGN_STATUS_LABELS[campaign.status]}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs border-[#0F7A4F]/30 text-[#0F7A4F]">
                  {CAMPAIGN_TYPE_LABELS[campaign.type] || campaign.type}
                </Badge>
                <Badge className={`${CHANNEL_COLORS[campaign.channel] || 'bg-gray-100 text-gray-700'} border-0 text-xs`}>
                  {CHANNEL_LABELS[campaign.channel] || campaign.channel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">زيارات</p>
                  <p className="text-sm font-bold text-gray-900">{campaign.visits.toLocaleString('ar')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">طلبات</p>
                  <p className="text-sm font-bold text-gray-900">{campaign.orders}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">زبائن</p>
                  <p className="text-sm font-bold text-gray-900">{campaign.customers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">إيرادات</p>
                  <p className="text-sm font-bold text-[#0F7A4F]">{formatMRU(campaign.revenue)}</p>
                </div>
              </div>

              {/* Conversion */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">معدل التحويل</span>
                  <span className="font-bold text-[#D6A84F]">{campaign.conversionRate}%</span>
                </div>
                <Progress
                  value={Math.min(campaign.conversionRate * 10, 100)}
                  className="h-2 bg-gray-100"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {campaign.createdAt}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem><Edit className="ml-2 h-4 w-4" /> تعديل</DropdownMenuItem>
                    <DropdownMenuItem><BarChart3 className="ml-2 h-4 w-4" /> التفاصيل</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="ml-2 h-4 w-4 text-red-500" />
                      <span className="text-red-500">حذف</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">إنشاء حملة جديدة</DialogTitle>
            <DialogDescription className="text-right">أدخل بيانات الحملة التسويقية</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم الحملة</Label>
              <Input placeholder="مثال: عرض الصيف 2026" />
            </div>
            <div className="space-y-2">
              <Label>نوع الحملة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CAMPAIGN_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>القناة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القناة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المنتج المرتبط (اختياري)</Label>
              <Input placeholder="ابحث عن منتج..." />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="paused">متوقفة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFormOpen(false)}>إلغاء</Button>
            <Button onClick={() => setFormOpen(false)} className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white">
              إنشاء الحملة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 3. COUPONS MODULE
// ============================================================

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  usageLimit: string;
  expiryDate: string;
  status: 'active' | 'inactive';
}

export function CouponsModule() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DemoCoupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '', discountType: 'percentage', discountValue: '', usageLimit: '', expiryDate: '', status: 'active',
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingCoupon(null);
    setFormData({ code: '', discountType: 'percentage', discountValue: '', usageLimit: '', expiryDate: '', status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (coupon: DemoCoupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
      expiryDate: coupon.expiryDate || '',
      status: coupon.status,
    });
    setDialogOpen(true);
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الكوبونات</h1>
        <Button
          onClick={openAdd}
          className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          إنشاء كوبون
        </Button>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="text-gray-700 font-semibold">الكود</TableHead>
                <TableHead className="text-gray-700 font-semibold">نوع الخصم</TableHead>
                <TableHead className="text-gray-700 font-semibold text-center">القيمة</TableHead>
                <TableHead className="text-gray-700 font-semibold text-center">الاستخدام</TableHead>
                <TableHead className="text-gray-700 font-semibold text-center hidden md:table-cell">الحد الأقصى</TableHead>
                <TableHead className="text-gray-700 font-semibold hidden lg:table-cell">تاريخ الانتهاء</TableHead>
                <TableHead className="text-gray-700 font-semibold">الحالة</TableHead>
                <TableHead className="text-gray-700 font-semibold text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_COUPONS.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 text-gray-900 px-2.5 py-1 rounded-md font-mono font-bold text-sm">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => copyCode(coupon.id, coupon.code)}
                        title="نسخ الكود"
                      >
                        {copiedId === coupon.id ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {coupon.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-900">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : formatMRU(coupon.discountValue)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-gray-900">{coupon.usageCount}</span>
                    <span className="text-gray-400 text-sm">
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell text-gray-600">
                    {coupon.usageLimit ? coupon.usageLimit : 'غير محدود'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-600 text-sm">
                    {coupon.expiryDate || 'بدون انتهاء'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} border-0 text-xs`}>
                      {coupon.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => openEdit(coupon)}>
                          <Edit className="ml-2 h-4 w-4" /> تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="ml-2 h-4 w-4 text-red-500" />
                          <span className="text-red-500">حذف</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {editingCoupon ? 'تعديل الكوبون' : 'إنشاء كوبون جديد'}
            </DialogTitle>
            <DialogDescription className="text-right">
              {editingCoupon ? 'قم بتعديل بيانات الكوبون' : 'أدخل بيانات الكوبون الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>كود الكوبون</Label>
              <Input
                placeholder="مثال: SUMMER30"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>نوع الخصم</Label>
              <Select
                value={formData.discountType}
                onValueChange={(v) => setFormData({ ...formData, discountType: v as 'percentage' | 'fixed' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                  <SelectItem value="fixed">مبلغ ثابت (أوقية)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>قيمة الخصم</Label>
              <Input
                type="number"
                placeholder={formData.discountType === 'percentage' ? '25' : '500'}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>حد الاستخدام (اتركه فارغاً لغير محدود)</Label>
              <Input
                type="number"
                placeholder="100"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>تاريخ الانتهاء (اختياري)</Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'inactive' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={() => setDialogOpen(false)} className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white">
              {editingCoupon ? 'حفظ التعديلات' : 'إنشاء الكوبون'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 4. DELIVERY MODULE
// ============================================================

export function DeliveryModule() {
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">التوصيل</h1>

      {/* Tabs */}
      <Tabs defaultValue="zones" dir="rtl">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="zones" className="data-[state=active]:bg-[#0F7A4F] data-[state=active]:text-white gap-2">
            <MapPin className="h-4 w-4" />
            مناطق التوصيل
          </TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-[#0F7A4F] data-[state=active]:text-white gap-2">
            <Bike className="h-4 w-4" />
            المندوبون
          </TabsTrigger>
        </TabsList>

        {/* Zones Tab */}
        <TabsContent value="zones" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setZoneDialogOpen(true)}
              className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة منطقة
            </Button>
          </div>

          <Card className="border-gray-200">
            <CardContent className="p-0">
              <ScrollArea className="max-h-[420px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                      <TableHead className="text-gray-700 font-semibold">المدينة</TableHead>
                      <TableHead className="text-gray-700 font-semibold">المنطقة</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-center">رسوم التوصيل</TableHead>
                      <TableHead className="text-gray-700 font-semibold">الحالة</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DEMO_DELIVERY_ZONES.map((zone) => (
                      <TableRow key={zone.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium text-gray-900">{zone.city}</TableCell>
                        <TableCell className="text-gray-600">{zone.area}</TableCell>
                        <TableCell className="text-center font-bold text-[#0F7A4F]">
                          {formatMRU(zone.fee)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${zone.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} border-0 text-xs`}>
                            {zone.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem><Edit className="ml-2 h-4 w-4" /> تعديل</DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="ml-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">حذف</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_DELIVERY_AGENTS.map((agent) => (
              <Card key={agent.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#0F7A4F]/10 text-[#0F7A4F] text-base font-bold">
                          {agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-500 font-mono" dir="ltr">{agent.phone}</p>
                      </div>
                    </div>
                    <Badge className={`${AGENT_STATUS_COLORS[agent.status]} border-0 text-xs`}>
                      {AGENT_STATUS_LABELS[agent.status]}
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Truck className="h-4 w-4" />
                      <span>الطلبات المعينة</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{agent.assignedOrders}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 text-sm gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      اتصال
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-sm gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      واتساب
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Zone Dialog */}
      <Dialog open={zoneDialogOpen} onOpenChange={setZoneDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">إضافة منطقة توصيل</DialogTitle>
            <DialogDescription className="text-right">أدخل بيانات المنطقة الجديدة</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>المدينة</Label>
              <Input placeholder="مثال: نواكشوط" />
            </div>
            <div className="space-y-2">
              <Label>المنطقة</Label>
              <Input placeholder="مثال: تيارت زمبل" />
            </div>
            <div className="space-y-2">
              <Label>رسوم التوصيل (أوقية)</Label>
              <Input type="number" placeholder="200" />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setZoneDialogOpen(false)}>إلغاء</Button>
            <Button onClick={() => setZoneDialogOpen(false)} className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white">
              إضافة المنطقة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 5. AUTOMATION MODULE
// ============================================================

export function AutomationModule() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [automations, setAutomations] = useState(DemoAutomation);

  const toggleActive = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'new_order': return <Tag className="h-5 w-5" />;
      case 'waiting_payment': return <DollarSign className="h-5 w-5" />;
      case 'payment_confirmed': return <Check className="h-5 w-5" />;
      case 'on_the_way': return <Truck className="h-5 w-5" />;
      case 'delivered': return <Check className="h-5 w-5" />;
      case 'customer_not_responding': return <Phone className="h-5 w-5" />;
      case 'trial_ending': return <Clock className="h-5 w-5" />;
      case 'trial_expired': return <Ban className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const activeCount = automations.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأتمتة</h1>
          <p className="text-gray-500 mt-1">أنشئ قواعد تلقائية لإدارة متجرك بذكاء</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة قاعدة
        </Button>
      </div>

      {/* Active count */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-full">
          <Zap className="h-3.5 w-3.5" />
          <span className="font-medium">{activeCount} قاعدة نشطة</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
          <Ban className="h-3.5 w-3.5" />
          <span className="font-medium">{automations.length - activeCount} قاعدة متوقفة</span>
        </div>
      </div>

      {/* Automation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {automations.map((auto) => (
          <Card
            key={auto.id}
            className={`border-2 transition-all ${
              auto.isActive ? 'border-[#0F7A4F]/20 bg-white' : 'border-gray-200 bg-gray-50/50 opacity-75'
            }`}
          >
            <CardContent className="p-5">
              {/* Top row: icon + name + toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                    auto.isActive ? 'bg-[#0F7A4F]/10 text-[#0F7A4F]' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {getTriggerIcon(auto.trigger)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                      {auto.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge className={`${AUTO_TRIGGER_COLORS[auto.trigger] || 'bg-gray-100 text-gray-600'} border-0 text-[10px] px-1.5 py-0`}>
                        {TRIGGER_LABELS[auto.trigger] || auto.trigger}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={auto.isActive}
                  onCheckedChange={() => toggleActive(auto.id)}
                />
              </div>

              <Separator className="my-3" />

              {/* Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">الإجراء:</span>
                <Badge className={`${AUTO_ACTION_COLORS[auto.action] || 'bg-gray-100 text-gray-600'} border-0 text-xs`}>
                  {ACTION_LABELS[auto.action] || auto.action}
                </Badge>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="flex-1 text-xs text-gray-500 h-8">
                  <Edit className="ml-1 h-3 w-3" /> تعديل
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs text-red-500 h-8">
                  <Trash2 className="ml-1 h-3 w-3" /> حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Rule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">إضافة قاعدة أتمتة</DialogTitle>
            <DialogDescription className="text-right">أنشئ قاعدة تلقائية جديدة لإدارة متجرك</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم القاعدة</Label>
              <Input placeholder="مثال: رسالة ترحيب تلقائية" />
            </div>
            <div className="space-y-2">
              <Label>المحفز (Trigger)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المحفز" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRIGGER_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الإجراء (Action)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الإجراء" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTION_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <Label className="cursor-pointer text-gray-700">تفعيل القاعدة</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={() => setDialogOpen(false)} className="bg-[#0F7A4F] hover:bg-[#0d6a44] text-white">
              حفظ القاعدة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/lib/store';
import {
  DEMO_ORDERS,
  formatMRU,
  WHATSAPP_TEMPLATES,
} from '@/lib/demo-data';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  CUSTOMER_SOURCE_LABELS,
} from '@/lib/types';
import type { DemoOrder, OrderStatus, PaymentStatus } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Kanban,
  List,
  Eye,
  MessageCircle,
  Phone,
  Clock,
  MapPin,
  Package,
  DollarSign,
  User,
  FileText,
  ChevronLeft,
  MoreVertical,
  Search,
  Filter,
  Printer,
  X,
  Check,
  ArrowUpDown,
  Truck,
  CreditCard,
  AlertCircle,
  Ban,
  RotateCcw,
  Send,
  ExternalLink,
} from 'lucide-react';

// ============ HELPERS ============

function getTimeSince(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHour < 24) return `منذ ${diffHour} ساعة`;
  if (diffDay < 7) return `منذ ${diffDay} يوم`;
  return `منذ ${Math.floor(diffDay / 7)} أسبوع`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const SOURCE_BADGE_COLORS: Record<string, string> = {
  whatsapp: 'bg-green-100 text-green-800',
  instagram: 'bg-pink-100 text-pink-800',
  facebook: 'bg-blue-100 text-blue-800',
  tiktok: 'bg-gray-100 text-gray-800',
  snapchat: 'bg-yellow-100 text-yellow-800',
  direct: 'bg-emerald-100 text-emerald-800',
  paid_ad: 'bg-orange-100 text-orange-800',
  friend_referral: 'bg-violet-100 text-violet-800',
  other: 'bg-slate-100 text-slate-800',
};

function getSourceColor(source: string): string {
  return SOURCE_BADGE_COLORS[source] || SOURCE_BADGE_COLORS.other;
}

const KANBAN_COLUMNS: { key: OrderStatus | 'closed'; label: string; statuses: OrderStatus[]; headerColor: string; headerBg: string }[] = [
  { key: 'new', label: 'طلب جديد', statuses: ['new'], headerColor: 'text-blue-700', headerBg: 'bg-blue-50 border-blue-200' },
  { key: 'contacted', label: 'تم التواصل', statuses: ['contacted', 'customer_not_responding'], headerColor: 'text-indigo-700', headerBg: 'bg-indigo-50 border-indigo-200' },
  { key: 'waiting_payment', label: 'بانتظار الدفع', statuses: ['waiting_payment'], headerColor: 'text-yellow-700', headerBg: 'bg-yellow-50 border-yellow-200' },
  { key: 'paid', label: 'مدفوع', statuses: ['paid'], headerColor: 'text-green-700', headerBg: 'bg-green-50 border-green-200' },
  { key: 'preparing', label: 'قيد التحضير', statuses: ['preparing'], headerColor: 'text-orange-700', headerBg: 'bg-orange-50 border-orange-200' },
  { key: 'ready_delivery', label: 'جاهز للتوصيل', statuses: ['ready_delivery'], headerColor: 'text-cyan-700', headerBg: 'bg-cyan-50 border-cyan-200' },
  { key: 'on_the_way', label: 'في الطريق', statuses: ['on_the_way'], headerColor: 'text-purple-700', headerBg: 'bg-purple-50 border-purple-200' },
  { key: 'delivered', label: 'تم التسليم', statuses: ['delivered'], headerColor: 'text-emerald-700', headerBg: 'bg-emerald-50 border-emerald-200' },
  { key: 'closed', label: 'مُغلق', statuses: ['cancelled', 'returned', 'rejected'], headerColor: 'text-red-700', headerBg: 'bg-red-50 border-red-200' },
];

const STATUS_FLOW: OrderStatus[] = [
  'new', 'contacted', 'waiting_payment', 'paid', 'preparing', 'ready_delivery', 'on_the_way', 'delivered',
];

function getFlowIndex(status: OrderStatus): number {
  const idx = STATUS_FLOW.indexOf(status);
  if (status === 'cancelled' || status === 'returned' || status === 'rejected') return -1;
  if (status === 'customer_not_responding') return -1;
  return idx;
}

function generateWhatsAppMessage(order: DemoOrder): string {
  let templateKey = order.status;
  if (order.status === 'preparing' || order.status === 'ready_delivery' || order.status === 'paid') {
    templateKey = 'payment_confirmed';
  }
  const template = WHATSAPP_TEMPLATES[templateKey] || WHATSAPP_TEMPLATES.new_order;
  return template
    .replace(/{customer_name}/g, order.customerName)
    .replace(/{store_name}/g, 'بوتيك النخبة')
    .replace(/{order_number}/g, order.orderNumber)
    .replace(/{order_total}/g, formatMRU(order.total))
    .replace(/{payment_status}/g, PAYMENT_STATUS_LABELS[order.paymentStatus])
    .replace(/{delivery_area}/g, order.customerArea || '')
    .replace(/{store_whatsapp}/g, '22222333');
}

const MOCK_TIMELINE: Record<string, { status: string; time: string; note?: string }[]> = {
  o1: [
    { status: 'new', time: '2026-07-04T10:30:00', note: 'طلب جديد عبر واتساب' },
  ],
  o2: [
    { status: 'new', time: '2026-07-04T09:15:00', note: 'طلب جديد عبر انستغرام' },
    { status: 'contacted', time: '2026-07-04T10:00:00', note: 'تم التواصل مع الزبونة - وعدت بالتحويل' },
  ],
  o3: [
    { status: 'new', time: '2026-07-03T14:00:00' },
    { status: 'contacted', time: '2026-07-03T14:15:00' },
    { status: 'paid', time: '2026-07-03T15:00:00', note: 'دفع عند التوصيل' },
  ],
  o4: [
    { status: 'new', time: '2026-07-03T11:00:00' },
    { status: 'contacted', time: '2026-07-03T11:30:00' },
    { status: 'paid', time: '2026-07-03T12:00:00' },
    { status: 'preparing', time: '2026-07-03T14:00:00' },
  ],
  o5: [
    { status: 'new', time: '2026-07-02T16:30:00' },
    { status: 'contacted', time: '2026-07-02T16:45:00' },
    { status: 'paid', time: '2026-07-02T17:00:00' },
    { status: 'preparing', time: '2026-07-03T09:00:00' },
    { status: 'ready_delivery', time: '2026-07-03T14:00:00' },
  ],
  o6: [
    { status: 'new', time: '2026-07-02T10:00:00' },
    { status: 'contacted', time: '2026-07-02T10:20:00' },
    { status: 'paid', time: '2026-07-02T11:00:00' },
    { status: 'preparing', time: '2026-07-02T14:00:00' },
    { status: 'ready_delivery', time: '2026-07-03T08:00:00' },
    { status: 'on_the_way', time: '2026-07-03T10:00:00' },
  ],
  o7: [
    { status: 'new', time: '2026-06-30T09:00:00' },
    { status: 'contacted', time: '2026-06-30T09:20:00' },
    { status: 'paid', time: '2026-06-30T10:00:00' },
    { status: 'preparing', time: '2026-06-30T12:00:00' },
    { status: 'ready_delivery', time: '2026-06-30T16:00:00' },
    { status: 'on_the_way', time: '2026-07-01T08:00:00' },
    { status: 'delivered', time: '2026-07-01T11:00:00', note: 'تم التسليم بنجاح' },
  ],
  o8: [
    { status: 'new', time: '2026-07-01T13:00:00' },
    { status: 'customer_not_responding', time: '2026-07-02T10:00:00', note: 'لا يرد على الهاتف' },
  ],
  o9: [
    { status: 'new', time: '2026-06-28T15:00:00' },
    { status: 'contacted', time: '2026-06-28T15:30:00' },
    { status: 'cancelled', time: '2026-06-29T10:00:00', note: 'ألغت الزبونة الطلب' },
  ],
  o10: [
    { status: 'new', time: '2026-07-04T11:00:00' },
    { status: 'contacted', time: '2026-07-04T11:30:00' },
    { status: 'waiting_payment', time: '2026-07-04T12:00:00' },
  ],
};

type SortField = 'orderNumber' | 'customerName' | 'total' | 'status' | 'paymentStatus' | 'createdAt';
type SortDir = 'asc' | 'desc';

// ============ MAIN COMPONENT ============

export default function OrdersModule() {
  const { setView, currentView, viewParams, goBack } = useApp();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [selectedStatus, setSelectedStatus] = useState<Record<string, OrderStatus>>({});
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<Record<string, PaymentStatus>>({});

  // Filter orders (always called before conditional return)
  const filteredOrders = useMemo(() => {
    let orders = [...DEMO_ORDERS];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.customerArea || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'closed') {
        orders = orders.filter(o => o.status === 'cancelled' || o.status === 'returned' || o.status === 'rejected');
      } else {
        orders = orders.filter(o => o.status === statusFilter);
      }
    }

    // Sort
    orders.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'orderNumber':
          cmp = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case 'customerName':
          cmp = a.customerName.localeCompare(b.customerName, 'ar');
          break;
        case 'total':
          cmp = a.total - b.total;
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'paymentStatus':
          cmp = a.paymentStatus.localeCompare(b.paymentStatus);
          break;
        case 'createdAt':
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return orders;
  }, [searchQuery, statusFilter, sortField, sortDir]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }, [sortField]);

  const openOrder = useCallback((orderId: string) => {
    setView('order-details', { orderId });
  }, [setView]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown className={`inline-block h-3.5 w-3.5 mr-1 ${sortField === field ? 'text-[#0F7A4F]' : 'text-gray-400'}`} />
  );

  // If we're in order-details view (after all hooks)
  if (currentView === 'order-details') {
    return <OrderDetails />;
  }

  // ============ KANBAN VIEW ============
  const renderKanban = () => (
    <ScrollArea className="w-full" dir="rtl">
      <div className="flex gap-4 pb-4 min-w-max px-1">
        {KANBAN_COLUMNS.map(col => {
          const colOrders = filteredOrders.filter(o => col.statuses.includes(o.status));
          return (
            <div key={col.key} className="min-w-[280px] w-[280px] flex-shrink-0">
              {/* Column Header */}
              <div className={`rounded-t-xl border border-b-0 px-4 py-3 ${col.headerBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${col.headerColor}`}>{col.label}</h3>
                  <Badge variant="secondary" className="text-xs font-semibold bg-white/70">
                    {colOrders.length}
                  </Badge>
                </div>
              </div>

              {/* Column Body */}
              <div className="border border-t-0 rounded-b-xl bg-gray-50/50 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto p-2 space-y-2">
                {colOrders.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-gray-400 text-xs">
                    لا توجد طلبات
                  </div>
                )}
                {colOrders.map(order => (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-[#0F7A4F]/30 border-gray-200 bg-white"
                    onClick={() => openOrder(order.id)}
                  >
                    <CardContent className="p-3 space-y-2.5">
                      {/* Order Number + Source */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-800">{order.orderNumber}</span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${getSourceColor(order.source)}`}>
                          {CUSTOMER_SOURCE_LABELS[order.source] || order.source}
                        </Badge>
                      </div>

                      {/* Customer Name */}
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-medium truncate">{order.customerName}</span>
                      </div>

                      {/* Items + Total */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Package className="h-3.5 w-3.5" />
                          <span className="text-xs">{order.items.length} منتج</span>
                        </div>
                        <span className="font-bold text-sm" style={{ color: '#0F7A4F' }}>
                          {formatMRU(order.total)}
                        </span>
                      </div>

                      {/* Payment Status */}
                      {order.paymentStatus !== 'paid' && (
                        <Badge className={`text-[10px] w-full justify-center ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                          <CreditCard className="h-3 w-3 ml-1" />
                          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                        </Badge>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span className="text-[11px]">{getTimeSince(order.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  // ============ TABLE VIEW ============
  const renderTable = () => (
    <div className="overflow-x-auto">
      <Table dir="rtl">
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort('orderNumber')}>
              <SortIcon field="orderNumber" />رقم الطلب
            </TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort('customerName')}>
              <SortIcon field="customerName" />الزبون
            </TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>المنطقة</TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort('total')}>
              <SortIcon field="total" />المبلغ
            </TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
              <SortIcon field="status" />حالة الطلب
            </TableHead>
            <TableHead>حالة الدفع</TableHead>
            <TableHead>المصدر</TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
              <SortIcon field="createdAt" />التاريخ
            </TableHead>
            <TableHead className="text-center">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-12 text-gray-400">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>لا توجد طلبات مطابقة</p>
              </TableCell>
            </TableRow>
          )}
          {filteredOrders.map(order => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-[#0F7A4F]/5 transition-colors"
              onClick={() => openOrder(order.id)}
            >
              <TableCell className="font-bold text-sm">{order.orderNumber}</TableCell>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell className="text-gray-600 font-mono text-sm" dir="ltr">{order.customerPhone}</TableCell>
              <TableCell className="text-gray-600">{order.customerArea || '—'}</TableCell>
              <TableCell className="font-bold" style={{ color: '#0F7A4F' }}>
                {formatMRU(order.total)}
              </TableCell>
              <TableCell>
                <Badge className={`${ORDER_STATUS_COLORS[order.status]} text-[11px]`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${PAYMENT_STATUS_COLORS[order.paymentStatus]} text-[11px]`}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-[11px] ${getSourceColor(order.source)}`}>
                  {CUSTOMER_SOURCE_LABELS[order.source] || order.source}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-500 text-xs">{formatDate(order.createdAt)}</TableCell>
              <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-[#0F7A4F]/10 hover:text-[#0F7A4F]"
                  onClick={() => openOrder(order.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // ============ MAIN RETURN ============
  return (
    <div className="space-y-4" style={{ background: '#FAFAF7', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#0F7A4F' }}
          >
            <Package className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">الطلبات</h1>
          <Badge className="bg-[#0F7A4F] text-white">{DEMO_ORDERS.length}</Badge>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث برقم الطلب أو اسم الزبون..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-9 bg-white border-gray-200 focus:border-[#0F7A4F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-white border-gray-200">
              <Filter className="h-4 w-4 ml-1 text-gray-400" />
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {KANBAN_COLUMNS.map(col => (
                <SelectItem key={col.key} value={col.key}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
        <button
          onClick={() => setViewMode('kanban')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'kanban'
              ? 'bg-[#0F7A4F] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Kanban className="h-4 w-4" />
          لوحة كانبان
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'table'
              ? 'bg-[#0F7A4F] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <List className="h-4 w-4" />
          جدول
        </button>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? renderKanban() : renderTable()}
    </div>
  );
}

// ============ ORDER DETAILS ============

function OrderDetails() {
  const { viewParams, goBack, setView } = useApp();
  const orderId = viewParams.orderId || '';
  const order = DEMO_ORDERS.find(o => o.id === orderId);

  const [newStatus, setNewStatus] = useState<string>('');
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState(order?.internalNotes || '');
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400" style={{ background: '#FAFAF7', minHeight: '100%' }}>
        <AlertCircle className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">الطلب غير موجود</p>
        <Button variant="outline" className="mt-4" onClick={() => goBack()}>
          <ChevronLeft className="h-4 w-4 ml-1" />
          العودة للطلبات
        </Button>
      </div>
    );
  }

  const currentStatusIndex = getFlowIndex(order.status);
  const timeline = MOCK_TIMELINE[order.id] || [
    { status: order.status, time: order.createdAt },
  ];
  const whatsappMsg = generateWhatsAppMessage(order);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(whatsappMsg);
    window.open(`https://wa.me/${order.customerPhone}?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotes = () => {
    // In a real app, this would call an API
  };

  const handleUpdateStatus = () => {
    if (newStatus) {
      // In a real app, this would call an API
    }
  };

  const handleUpdatePaymentStatus = () => {
    if (newPaymentStatus) {
      // In a real app, this would call an API
    }
  };

  const allStatusOptions: OrderStatus[] = [
    'new', 'contacted', 'waiting_payment', 'paid', 'preparing',
    'ready_delivery', 'on_the_way', 'delivered', 'cancelled',
    'returned', 'rejected', 'customer_not_responding',
  ];

  const allPaymentOptions: PaymentStatus[] = [
    'unpaid', 'waiting_confirmation', 'paid', 'rejected', 'refunded',
  ];

  return (
    <div className="space-y-5" style={{ background: '#FAFAF7', minHeight: '100%' }}>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 hover:bg-[#0F7A4F]/5 hover:text-[#0F7A4F] hover:border-[#0F7A4F]/30"
            onClick={goBack}
          >
            <ChevronLeft className="h-4 w-4 ml-1" />
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gray-200" onClick={handlePrint}>
            <Printer className="h-4 w-4 ml-1" />
            طباعة
          </Button>
          <a
            href={`https://wa.me/${order.customerPhone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-[#0F7A4F] hover:bg-[#0F7A4F]/90 text-white">
              <MessageCircle className="h-4 w-4 ml-1" />
              واتساب
            </Button>
          </a>
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-max px-4 py-4 gap-0" dir="rtl">
              {STATUS_FLOW.map((step, idx) => {
                const isCompleted = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                const isAfter = idx > currentStatusIndex;

                return (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-20">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#0F7A4F] text-white shadow-sm'
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#0F7A4F]/20 scale-110' : ''}`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] text-center leading-tight font-medium ${
                          isCompleted ? 'text-[#0F7A4F]' : 'text-gray-400'
                        }`}
                      >
                        {ORDER_STATUS_LABELS[step]}
                      </span>
                    </div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-1 ${
                          idx < currentStatusIndex ? 'bg-[#0F7A4F]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
              {/* Closed indicator */}
              {(order.status === 'cancelled' || order.status === 'returned' || order.status === 'rejected') && (
                <>
                  <div className="w-12 h-0.5 mx-1 bg-gray-200" />
                  <div className="flex flex-col items-center gap-1.5 w-20">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white shadow-sm">
                      <Ban className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-center leading-tight font-medium text-red-600">
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Right Column (wider) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order Items */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-5 w-5 text-[#0F7A4F]" />
                عناصر الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.size && (
                          <Badge variant="secondary" className="text-[10px]">
                            {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="outline" className="text-[10px] border-gray-300">
                            {item.color}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatMRU(item.productPrice)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sm mr-4" style={{ color: '#0F7A4F' }}>
                      {formatMRU(item.total)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>المجموع الفرعي</span>
                  <span>{formatMRU(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>
                    {order.deliveryMethod === 'delivery' ? 'رسوم التوصيل' : 'استلام من المتجر'}
                  </span>
                  <span>{order.deliveryFee > 0 ? formatMRU(order.deliveryFee) : 'مجاني'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>الإجمالي</span>
                  <span style={{ color: '#0F7A4F' }}>{formatMRU(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5 text-[#0F7A4F]" />
                معلومات الزبون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">الاسم</p>
                      <p className="font-medium text-sm">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">الهاتف</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm font-mono" dir="ltr">{order.customerPhone}</p>
                        <a href={`tel:${order.customerPhone}`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-green-50 hover:text-green-600">
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                        <a href={`https://wa.me/${order.customerPhone}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-green-50 hover:text-green-600">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">المدينة</p>
                      <p className="font-medium text-sm">{order.customerCity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">المنطقة</p>
                      <p className="font-medium text-sm">{order.customerArea || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">طريقة التوصيل</p>
                      <p className="font-medium text-sm">
                        {order.deliveryMethod === 'delivery' ? 'توصيل للمنزل' : 'استلام من المتجر'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.orderNotes && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 font-medium mb-1 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    ملاحظات الزبون
                  </p>
                  <p className="text-sm text-amber-800">{order.orderNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#0F7A4F]" />
                معلومات التوصيل
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.deliveryMethod === 'delivery' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">منطقة التوصيل</p>
                    <p className="font-medium text-sm">{order.customerArea}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">رسوم التوصيل</p>
                    <p className="font-medium text-sm" style={{ color: '#0F7A4F' }}>
                      {formatMRU(order.deliveryFee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">طريقة الدفع</p>
                    <p className="font-medium text-sm">
                      {order.paymentMethod === 'cash' ? 'الدفع عند التوصيل' : 'تحويل يدوي'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-700">استلام من المتجر — لا توجد رسوم توصيل</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0F7A4F]" />
                ملاحظات داخلية
              </CardTitle>
              <CardDescription>ملاحظات خاصة لا تظهر للزبون</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="أضف ملاحظات داخلية حول هذا الطلب..."
                value={internalNotes}
                onChange={e => setInternalNotes(e.target.value)}
                className="min-h-[80px] border-gray-200 focus:border-[#0F7A4F] resize-none"
              />
              <Button
                size="sm"
                className="mt-2 bg-[#0F7A4F] hover:bg-[#0F7A4F]/90 text-white"
                onClick={handleSaveNotes}
              >
                <Check className="h-4 w-4 ml-1" />
                حفظ الملاحظات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Left Column */}
        <div className="space-y-5">
          {/* Status Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#0F7A4F]" />
                حالة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={`${ORDER_STATUS_COLORS[order.status]} text-sm px-3 py-1.5 font-semibold`}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>

              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="تغيير الحالة..." />
                </SelectTrigger>
                <SelectContent>
                  {allStatusOptions.map(s => (
                    <SelectItem key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="sm"
                className="w-full bg-[#0F7A4F] hover:bg-[#0F7A4F]/90 text-white"
                onClick={handleUpdateStatus}
                disabled={!newStatus}
              >
                تحديث الحالة
              </Button>
            </CardContent>
          </Card>

          {/* Payment Status Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#D6A84F]" />
                حالة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={`${PAYMENT_STATUS_COLORS[order.paymentStatus]} text-sm px-3 py-1.5 font-semibold`}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </Badge>

              <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="تغيير حالة الدفع..." />
                </SelectTrigger>
                <SelectContent>
                  {allPaymentOptions.map(s => (
                    <SelectItem key={s} value={s}>
                      {PAYMENT_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="sm"
                className="w-full hover:bg-[#D6A84F]/90 text-white"
                style={{ background: '#D6A84F' }}
                onClick={handleUpdatePaymentStatus}
                disabled={!newPaymentStatus}
              >
                تحديث حالة الدفع
              </Button>
            </CardContent>
          </Card>

          {/* Payment Proof Card */}
          {order.paymentMethod === 'manual_transfer' && (
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  إثبات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#0F7A4F]/40 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">اضغط لرفع صورة الإيصال</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG حتى 5MB</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* WhatsApp Message Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                رسالة واتساب
              </CardTitle>
              <CardDescription>رسالة جاهزة حسب حالة الطلب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-[#DCF8C6] rounded-lg p-3 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed" dir="rtl">
                  {whatsappMsg}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleWhatsAppSend}
                >
                  <Send className="h-4 w-4 ml-1" />
                  إرسال عبر واتساب
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200"
                  onClick={handleCopyMessage}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 text-center font-medium">تم نسخ الرسالة ✓</p>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#0F7A4F]" />
                سجل الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {timeline.map((entry, idx) => {
                  const isLast = idx === timeline.length - 1;
                  return (
                    <div key={idx} className="flex gap-3 pb-4">
                      {/* Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            isLast
                              ? 'bg-[#0F7A4F] ring-2 ring-[#0F7A4F]/20'
                              : 'bg-[#0F7A4F]/60'
                          }`}
                        />
                        {!isLast && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0 -mt-0.5">
                        <p className="text-sm font-medium text-gray-800">
                          {ORDER_STATUS_LABELS[entry.status as OrderStatus] || entry.status}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.time)}</p>
                        {entry.note && (
                          <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded px-2 py-1">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============ Upload Icon (simple SVG since no icon available) ============
function Upload({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
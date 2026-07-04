'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  DEMO_TRANSACTIONS,
  DEMO_PAYMENT_RECEIPTS,
  DEMO_PAYMENT_METHODS,
  formatMRU,
} from '@/lib/demo-data';
import type {
  DemoPaymentMethod,
  DemoPaymentReceipt,
  PaymentMethodType,
} from '@/lib/types';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_COLORS,
  RECEIPT_STATUS_LABELS,
  RECEIPT_STATUS_COLORS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
} from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// Note: Tabs components available for future use
import { Separator } from '@/components/ui/separator';
import {
  DollarSign, Banknote, Smartphone, Landmark, CreditCard, Clock, XCircle,
  TrendingUp, Plus, Edit, Check, X, Eye, Download,
  ChevronLeft, ArrowRight, List,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// ============ HELPERS ============

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDayShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-MA', { weekday: 'short', day: 'numeric' });
}

const LOGO_COLORS: Record<PaymentMethodType, string> = {
  bankily: 'bg-orange-500',
  sedad: 'bg-blue-500',
  masrvi: 'bg-green-500',
  bim_bank: 'bg-purple-500',
  click: 'bg-cyan-500',
  cash: 'bg-gray-500',
  other: 'bg-yellow-500',
};

function getLogoColor(type: PaymentMethodType): string {
  return LOGO_COLORS[type] || LOGO_COLORS.other;
}

function getPaymentMethodFirstLetter(name: string): string {
  return name.charAt(0);
}

// Map payment method names from transactions to types
function paymentNameToType(name: string): PaymentMethodType {
  if (name.includes('Bankily') || name.includes('bankily')) return 'bankily';
  if (name.includes('Sedad') || name.includes('sedad')) return 'sedad';
  if (name.includes('Masrvi') || name.includes('masrvi')) return 'masrvi';
  if (name.includes('BIM') || name.includes('bim')) return 'bim_bank';
  if (name.includes('Click') || name.includes('click')) return 'click';
  if (name.includes('نقد') || name.includes('استلام')) return 'cash';
  return 'other';
}

// ============ SHARED BAR CHART COLORS ============

const METHOD_BAR_COLORS: Record<string, string> = {
  'الدفع عند الاستلام': 'bg-gray-500',
  'Bankily': 'bg-orange-500',
  'Sedad': 'bg-blue-500',
  'Masrvi': 'bg-green-500',
  'BIM Bank': 'bg-purple-500',
  'Click': 'bg-cyan-500',
};

// ============ AccountingMain / AccountingOverview ============

export function AccountingMain() {
  return <AccountingOverview />;
}

export function AccountingOverview() {
  const { setView } = useApp();

  const stats = useMemo(() => {
    const paid = DEMO_TRANSACTIONS.filter(t => t.status === 'paid' && t.amount > 0);
    const totalIncome = paid.reduce((s, t) => s + t.amount, 0);

    const cash = paid.filter(t => paymentNameToType(t.paymentMethodName) === 'cash').reduce((s, t) => s + t.amount, 0);
    const bankily = paid.filter(t => paymentNameToType(t.paymentMethodName) === 'bankily').reduce((s, t) => s + t.amount, 0);
    const sedad = paid.filter(t => paymentNameToType(t.paymentMethodName) === 'sedad').reduce((s, t) => s + t.amount, 0);
    const masrvi = paid.filter(t => paymentNameToType(t.paymentMethodName) === 'masrvi').reduce((s, t) => s + t.amount, 0);
    const bimBank = paid.filter(t => paymentNameToType(t.paymentMethodName) === 'bim_bank').reduce((s, t) => s + t.amount, 0);
    const click = paid.filter(t => paymentNameToType(t.paymentMethodName) === 'click').reduce((s, t) => s + t.amount, 0);

    const pending = DEMO_TRANSACTIONS.filter(t => t.status === 'waiting_confirmation').reduce((s, t) => s + Math.abs(t.amount), 0);
    const rejected = DEMO_TRANSACTIONS.filter(t => t.status === 'rejected').reduce((s, t) => s + Math.abs(t.amount), 0);
    const netSales = totalIncome - rejected;

    return { totalIncome, cash, bankily, sedad, masrvi, bimBank, click, pending, rejected, netSales };
  }, []);

  // Bar chart data: group by payment method
  const barData = useMemo(() => {
    const paid = DEMO_TRANSACTIONS.filter(t => t.status === 'paid' && t.amount > 0);
    const map = new Map<string, number>();
    paid.forEach(t => {
      map.set(t.paymentMethodName, (map.get(t.paymentMethodName) || 0) + t.amount);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const maxBar = useMemo(() => Math.max(...barData.map(d => d[1]), 1), [barData]);

  // Recent transactions (last 5)
  const recentTx = useMemo(() => {
    return [...DEMO_TRANSACTIONS]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);

  const summaryCards = [
    { label: 'إجمالي المداخيل', value: formatMRU(stats.totalIncome), bg: 'bg-emerald-50', icon: DollarSign, color: 'text-emerald-600' },
    { label: 'إجمالي المدفوع نقدًا', value: formatMRU(stats.cash), bg: 'bg-gray-50', icon: Banknote, color: 'text-gray-600' },
    { label: 'إجمالي Bankily', value: formatMRU(stats.bankily), bg: 'bg-orange-50', icon: Smartphone, color: 'text-orange-600' },
    { label: 'إجمالي Sedad', value: formatMRU(stats.sedad), bg: 'bg-blue-50', icon: Smartphone, color: 'text-blue-600' },
    { label: 'إجمالي Masrvi', value: formatMRU(stats.masrvi), bg: 'bg-green-50', icon: Smartphone, color: 'text-green-600' },
    { label: 'إجمالي BIM Bank', value: formatMRU(stats.bimBank), bg: 'bg-purple-50', icon: Landmark, color: 'text-purple-600' },
    { label: 'إجمالي Click', value: formatMRU(stats.click), bg: 'bg-cyan-50', icon: CreditCard, color: 'text-cyan-600' },
    { label: 'المبالغ بانتظار التأكيد', value: formatMRU(stats.pending), bg: 'bg-yellow-50', icon: Clock, color: 'text-yellow-600' },
    { label: 'المبالغ المرفوضة', value: formatMRU(stats.rejected), bg: 'bg-red-50', icon: XCircle, color: 'text-red-600' },
    { label: 'صافي المبيعات', value: formatMRU(stats.netSales), bg: 'bg-amber-50', icon: TrendingUp, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المحاسبة</h1>
          <p className="text-sm text-gray-500 mt-1">متابعة المداخيل والمعاملات المالية</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setView('accounting-transactions')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            المعاملات
          </Button>
          <Button
            className="gap-2 bg-[#0F7A4F] hover:bg-[#0d6843] text-white"
            onClick={() => setView('accounting-reports')}
          >
            <TrendingUp className="h-4 w-4" />
            التقارير
          </Button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className={`${card.bg} border-0 rounded-xl`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">{card.label}</p>
                  <p className={`text-sm font-bold ${card.color} truncate`}>{card.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-white/70 shrink-0`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Income by Payment Method Chart */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">الإيرادات حسب طريقة الدفع</CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {barData.map(([method, amount]) => (
                <div key={method} className="flex items-center gap-3">
                  <div className="w-32 sm:w-40 text-sm text-gray-600 text-left shrink-0 truncate">
                    {method}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${METHOD_BAR_COLORS[method] || 'bg-gray-400'} flex items-center justify-end px-3 transition-all duration-500`}
                      style={{ width: `${Math.max((amount / maxBar) * 100, 8)}%` }}
                    >
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        {formatMRU(amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">آخر المعاملات</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#0F7A4F] gap-1"
              onClick={() => setView('accounting-transactions')}
            >
              عرض الكل
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">التاريخ</TableHead>
                  <TableHead className="text-xs">الزبون</TableHead>
                  <TableHead className="text-xs">طريقة الدفع</TableHead>
                  <TableHead className="text-xs">المبلغ</TableHead>
                  <TableHead className="text-xs">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTx.map((tx) => {
                  const pmType = paymentNameToType(tx.paymentMethodName);
                  return (
                    <TableRow key={tx.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-xs py-3">{formatDate(tx.createdAt)}</TableCell>
                      <TableCell className="text-xs font-medium py-3">{tx.customerName}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className={`text-[10px] ${PAYMENT_METHOD_COLORS[pmType]}`}>
                          {tx.paymentMethodName}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-xs font-bold py-3 ${tx.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatMRU(Math.abs(tx.amount))}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className={`text-[10px] ${RECEIPT_STATUS_COLORS[tx.status]}`}>
                          {RECEIPT_STATUS_LABELS[tx.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ AccountingPaymentMethods ============

export function AccountingPaymentMethods() {
  const { goBack } = useApp();
  const [methods, setMethods] = useState<DemoPaymentMethod[]>([...DEMO_PAYMENT_METHODS]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<DemoPaymentMethod | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<PaymentMethodType>('bankily');
  const [formAccountName, setFormAccountName] = useState('');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formActive, setFormActive] = useState(true);

  function openAddDialog() {
    setEditingMethod(null);
    setFormName('');
    setFormType('bankily');
    setFormAccountName('');
    setFormAccountNumber('');
    setFormInstructions('');
    setFormActive(true);
    setDialogOpen(true);
  }

  function openEditDialog(method: DemoPaymentMethod) {
    setEditingMethod(method);
    setFormName(method.name);
    setFormType(method.type);
    setFormAccountName(method.accountName || '');
    setFormAccountNumber(method.accountNumber || '');
    setFormInstructions(method.instructions || '');
    setFormActive(method.isActive);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formName.trim()) {
      toast({ title: 'الرجاء إدخال اسم طريقة الدفع', variant: 'destructive' });
      return;
    }
    if (editingMethod) {
      setMethods(prev =>
        prev.map(m =>
          m.id === editingMethod.id
            ? { ...m, name: formName, type: formType, accountName: formAccountName || null, accountNumber: formAccountNumber || null, instructions: formInstructions || null, isActive: formActive }
            : m
        )
      );
      toast({ title: 'تم تحديث طريقة الدفع بنجاح' });
    } else {
      const newMethod: DemoPaymentMethod = {
        id: `pm-new-${Date.now()}`,
        storeId: 's1',
        name: formName,
        type: formType,
        logoUrl: null,
        accountName: formAccountName || null,
        accountNumber: formAccountNumber || null,
        instructions: formInstructions || null,
        isActive: formActive,
        isDefault: false,
        sortOrder: methods.length + 1,
      };
      setMethods(prev => [...prev, newMethod]);
      toast({ title: 'تمت إضافة طريقة الدفع بنجاح' });
    }
    setDialogOpen(false);
  }

  function handleToggleActive(id: string) {
    setMethods(prev =>
      prev.map(m => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  }

  function handleSetDefault(id: string) {
    setMethods(prev =>
      prev.map(m => ({ ...m, isDefault: m.id === id }))
    );
    toast({ title: 'تم تعيين طريقة الدفع كافتراضية' });
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">طرق الدفع</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة طرق الدفع المتاحة لمتجرك</p>
          </div>
        </div>
        <Button
          className="gap-2 bg-[#0F7A4F] hover:bg-[#0d6843] text-white"
          onClick={openAddDialog}
        >
          <Plus className="h-4 w-4" />
          إضافة طريقة دفع
        </Button>
      </div>

      {/* Payment Method Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method) => {
          const logoColor = getLogoColor(method.type);
          const firstLetter = getPaymentMethodFirstLetter(method.name);
          return (
            <Card key={method.id} className={`rounded-xl border shadow-sm ${!method.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${logoColor} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
                      {firstLetter}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{method.name}</h3>
                      {method.isDefault && (
                        <Badge className="bg-[#0F7A4F] text-white text-[10px] mt-1">افتراضي</Badge>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={method.isActive}
                    onCheckedChange={() => handleToggleActive(method.id)}
                  />
                </div>

                {method.accountName && (
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-400">اسم الحساب</p>
                    <p className="text-sm text-gray-700">{method.accountName}</p>
                  </div>
                )}

                {method.accountNumber && (
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-400">رقم الحساب</p>
                    <p className="text-sm text-gray-700 font-mono" dir="ltr">{method.accountNumber}</p>
                  </div>
                )}

                {method.instructions && (
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-400">التعليمات</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{method.instructions}</p>
                  </div>
                )}

                <Separator className="my-3" />

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => openEditDialog(method)}
                  >
                    <Edit className="h-3 w-3" />
                    تعديل
                  </Button>
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#0F7A4F] text-xs"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      تعيين كافتراضي
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}</DialogTitle>
            <DialogDescription>
              {editingMethod ? 'عدّل بيانات طريقة الدفع' : 'أدخل بيانات طريقة الدفع الجديدة'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="مثال: Bankily"
              />
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as PaymentMethodType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>اسم الحساب</Label>
              <Input
                value={formAccountName}
                onChange={(e) => setFormAccountName(e.target.value)}
                placeholder="اسم صاحب الحساب"
              />
            </div>
            <div className="space-y-2">
              <Label>رقم الحساب</Label>
              <Input
                value={formAccountNumber}
                onChange={(e) => setFormAccountNumber(e.target.value)}
                placeholder="رقم الحساب أو الهاتف"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>التعليمات</Label>
              <Textarea
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
                placeholder="تعليمات الدفع التي تظهر للزبون"
                rows={3}
              />
            </div>
            {/* Logo upload placeholder */}
            <div className="space-y-2">
              <Label>الشعار</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#0F7A4F] transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-xl ${getLogoColor(formType)} flex items-center justify-center text-white text-xl font-bold`}>
                    {formName ? getPaymentMethodFirstLetter(formName) : '?'}
                  </div>
                  <p className="text-xs text-gray-400">اضغط لرفع الشعار (قريبًا)</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>نشط</Label>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              className="bg-[#0F7A4F] hover:bg-[#0d6843] text-white"
              onClick={handleSave}
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ AccountingPaymentReview ============

export function AccountingPaymentReview() {
  const { goBack } = useApp();

  const [receipts, setReceipts] = useState<DemoPaymentReceipt[]>([...DEMO_PAYMENT_RECEIPTS]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Detail dialog
  const [detailReceipt, setDetailReceipt] = useState<DemoPaymentReceipt | null>(null);
  const [detailNote, setDetailNote] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  // Confirmation dialog
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [confirmReceiptId, setConfirmReceiptId] = useState<string | null>(null);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (methodFilter !== 'all' && r.paymentMethodName !== methodFilter) return false;
      if (dateFrom && new Date(r.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.createdAt) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [receipts, statusFilter, methodFilter, dateFrom, dateTo]);

  const uniqueMethods = useMemo(() => {
    return [...new Set(receipts.map(r => r.paymentMethodName))];
  }, [receipts]);

  function openDetail(receipt: DemoPaymentReceipt) {
    setDetailReceipt(receipt);
    setDetailNote(receipt.merchantNote || '');
    setDetailOpen(true);
  }

  function handleApprove() {
    if (!confirmReceiptId) return;
    setReceipts(prev =>
      prev.map(r =>
        r.id === confirmReceiptId
          ? { ...r, status: 'paid' as const, reviewedAt: new Date().toISOString() }
          : r
      )
    );
    toast({ title: 'تم تأكيد الدفع بنجاح' });
    setConfirmAction(null);
    setConfirmReceiptId(null);
    setDetailOpen(false);
  }

  function handleReject() {
    if (!confirmReceiptId) return;
    setReceipts(prev =>
      prev.map(r =>
        r.id === confirmReceiptId
          ? { ...r, status: 'rejected' as const, reviewedAt: new Date().toISOString() }
          : r
      )
    );
    toast({ title: 'تم رفض الدفع' });
    setConfirmAction(null);
    setConfirmReceiptId(null);
    setDetailOpen(false);
  }

  function handleSaveNote() {
    if (!detailReceipt) return;
    setReceipts(prev =>
      prev.map(r =>
        r.id === detailReceipt.id ? { ...r, merchantNote: detailNote } : r
      )
    );
    toast({ title: 'تم حفظ الملاحظة' });
  }

  function getMethodBadgeColor(name: string): string {
    const receipt = receipts.find(r => r.paymentMethodName === name);
    if (!receipt) return 'bg-gray-100 text-gray-800';
    // Find matching type
    for (const [type, color] of Object.entries(PAYMENT_METHOD_COLORS)) {
      if (PAYMENT_METHOD_LABELS[type as PaymentMethodType] === name) {
        return color;
      }
    }
    return 'bg-gray-100 text-gray-800';
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مراجعة إيصالات الدفع</h1>
          <p className="text-sm text-gray-500 mt-1">راجع وقبول أو رفض إيصالات الدفع المرسلة من الزبائن</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label className="text-xs">الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="waiting_confirmation">بانتظار التأكيد</SelectItem>
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">طريقة الدفع</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {uniqueMethods.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">من تاريخ</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">إلى تاريخ</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipts Table */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 bg-white z-10">
                  <TableHead className="text-xs">رقم الطلب</TableHead>
                  <TableHead className="text-xs">الزبون</TableHead>
                  <TableHead className="text-xs">طريقة الدفع</TableHead>
                  <TableHead className="text-xs">المبلغ</TableHead>
                  <TableHead className="text-xs">الحالة</TableHead>
                  <TableHead className="text-xs">التاريخ</TableHead>
                  <TableHead className="text-xs">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      لا توجد إيصالات مطابقة
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-xs font-mono py-3">
                        {receipt.orderNumber || '—'}
                      </TableCell>
                      <TableCell className="text-xs font-medium py-3">
                        {receipt.customerName}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className={`text-[10px] ${getMethodBadgeColor(receipt.paymentMethodName)}`}>
                          {receipt.paymentMethodName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold py-3">
                        {formatMRU(receipt.amount)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className={`text-[10px] ${RECEIPT_STATUS_COLORS[receipt.status]}`}>
                          {RECEIPT_STATUS_LABELS[receipt.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        {formatDateTime(receipt.createdAt)}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openDetail(receipt)}
                            title="عرض"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {receipt.status === 'waiting_confirmation' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => {
                                  setConfirmAction('approve');
                                  setConfirmReceiptId(receipt.id);
                                }}
                                title="تأكيد"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setConfirmAction('reject');
                                  setConfirmReceiptId(receipt.id);
                                }}
                                title="رفض"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل إيصال الدفع</DialogTitle>
            <DialogDescription>عرض وتقييم إيصال الدفع</DialogDescription>
          </DialogHeader>
          {detailReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400">رقم الطلب</p>
                  <p className="text-sm font-medium">{detailReceipt.orderNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">الزبون</p>
                  <p className="text-sm font-medium">{detailReceipt.customerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">طريقة الدفع</p>
                  <Badge variant="secondary" className={`text-[10px] ${getMethodBadgeColor(detailReceipt.paymentMethodName)}`}>
                    {detailReceipt.paymentMethodName}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">المبلغ</p>
                  <p className="text-sm font-bold text-[#0F7A4F]">{formatMRU(detailReceipt.amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">الحالة</p>
                  <Badge variant="secondary" className={`text-[10px] ${RECEIPT_STATUS_COLORS[detailReceipt.status]}`}>
                    {RECEIPT_STATUS_LABELS[detailReceipt.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">رقم المرجع</p>
                  <p className="text-sm font-mono" dir="ltr">{detailReceipt.referenceNumber || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-gray-400">التاريخ</p>
                  <p className="text-sm">{formatDateTime(detailReceipt.createdAt)}</p>
                </div>
              </div>

              {detailReceipt.customerNote && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-[10px] text-yellow-600 font-medium mb-1">ملاحظة الزبون</p>
                  <p className="text-sm text-gray-700">{detailReceipt.customerNote}</p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>ملاحظة التاجر</Label>
                <Textarea
                  value={detailNote}
                  onChange={(e) => setDetailNote(e.target.value)}
                  placeholder="أضف ملاحظة..."
                  rows={2}
                />
                <Button variant="outline" size="sm" className="text-xs" onClick={handleSaveNote}>
                  حفظ الملاحظة
                </Button>
              </div>

              {detailReceipt.status === 'waiting_confirmation' && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                      onClick={() => {
                        setConfirmAction('approve');
                        setConfirmReceiptId(detailReceipt.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                      تأكيد الدفع
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => {
                        setConfirmAction('reject');
                        setConfirmReceiptId(detailReceipt.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                      رفض الدفع
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => { if (!open) { setConfirmAction(null); setConfirmReceiptId(null); } }}
      >
        <DialogContent className="sm:max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' ? 'تأكيد الدفع' : 'رفض الدفع'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve'
                ? 'هل أنت متأكد من تأكيد هذا الدفع؟'
                : 'هل أنت متأكد من رفض هذا الدفع؟'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => { setConfirmAction(null); setConfirmReceiptId(null); }}
            >
              إلغاء
            </Button>
            <Button
              className={confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
              onClick={confirmAction === 'approve' ? handleApprove : handleReject}
            >
              {confirmAction === 'approve' ? 'تأكيد' : 'رفض'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ AccountingTransactions ============

export function AccountingTransactions() {
  const { goBack } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredTx = useMemo(() => {
    return DEMO_TRANSACTIONS.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (methodFilter !== 'all' && t.paymentMethodName !== methodFilter) return false;
      if (dateFrom && new Date(t.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(t.createdAt) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [typeFilter, statusFilter, methodFilter, dateFrom, dateTo]);

  const uniqueMethods = useMemo(() => {
    return [...new Set(DEMO_TRANSACTIONS.map(t => t.paymentMethodName))];
  }, []);

  const summaryStats = useMemo(() => {
    const totalAmount = DEMO_TRANSACTIONS
      .filter(t => t.status === 'paid' && t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const pendingCount = DEMO_TRANSACTIONS.filter(t => t.status === 'waiting_confirmation').length;
    return {
      count: DEMO_TRANSACTIONS.length,
      totalAmount,
      pendingCount,
    };
  }, []);

  function handleExport() {
    toast({ title: 'تم التصدير' });
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">المعاملات المالية</h1>
          <p className="text-sm text-gray-500 mt-1">جميع المعاملات المالية لمتجرك</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          تصدير
        </Button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-xl border-0 shadow-sm bg-emerald-50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">إجمالي المعاملات</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">{summaryStats.count}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm bg-amber-50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">إجمالي المبالغ المدفوعة</p>
            <p className="text-xl font-bold text-amber-700 mt-1">{formatMRU(summaryStats.totalAmount)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">بانتظار التأكيد</p>
            <p className="text-xl font-bold text-yellow-700 mt-1">{summaryStats.pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label className="text-xs">النوع</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {Object.entries(TRANSACTION_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {Object.entries(RECEIPT_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">طريقة الدفع</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {uniqueMethods.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">من تاريخ</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">إلى تاريخ</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 bg-white z-10">
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">التاريخ</TableHead>
                  <TableHead className="text-xs">الزبون</TableHead>
                  <TableHead className="text-xs">طريقة الدفع</TableHead>
                  <TableHead className="text-xs">النوع</TableHead>
                  <TableHead className="text-xs">المبلغ</TableHead>
                  <TableHead className="text-xs">الحالة</TableHead>
                  <TableHead className="text-xs">رقم الطلب</TableHead>
                  <TableHead className="text-xs">المرجع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-400">
                      لا توجد معاملات مطابقة
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTx.map((tx) => {
                    const pmType = paymentNameToType(tx.paymentMethodName);
                    return (
                      <TableRow key={tx.id} className="hover:bg-gray-50/50">
                        <TableCell className="text-xs font-mono text-gray-400 py-3">
                          {tx.id}
                        </TableCell>
                        <TableCell className="text-xs py-3">
                          {formatDate(tx.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs font-medium py-3">
                          {tx.customerName}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="secondary" className={`text-[10px] ${PAYMENT_METHOD_COLORS[pmType]}`}>
                            {tx.paymentMethodName}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="secondary" className={`text-[10px] ${TRANSACTION_TYPE_COLORS[tx.type]}`}>
                            {TRANSACTION_TYPE_LABELS[tx.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-xs font-bold py-3 ${tx.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {tx.amount < 0 ? '-' : ''}{formatMRU(Math.abs(tx.amount))}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="secondary" className={`text-[10px] ${RECEIPT_STATUS_COLORS[tx.status]}`}>
                            {RECEIPT_STATUS_LABELS[tx.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono py-3">
                          {tx.orderNumber || '—'}
                        </TableCell>
                        <TableCell className="text-xs font-mono py-3" dir="ltr">
                          {tx.referenceNumber || '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ AccountingReports ============

export function AccountingReports() {
  const { goBack } = useApp();

  // 1. Income by payment method (horizontal bars)
  const methodBreakdown = useMemo(() => {
    const paid = DEMO_TRANSACTIONS.filter(t => t.status === 'paid' && t.amount > 0);
    const map = new Map<string, number>();
    paid.forEach(t => {
      map.set(t.paymentMethodName, (map.get(t.paymentMethodName) || 0) + t.amount);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const maxMethod = useMemo(() => Math.max(...methodBreakdown.map(d => d[1]), 1), [methodBreakdown]);

  // 2. Daily income (last 7 days, vertical bars)
  const dailyIncome = useMemo(() => {
    const days: { date: string; label: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = formatDayShort(d.toISOString());
      const dayAmount = DEMO_TRANSACTIONS
        .filter(t => t.status === 'paid' && t.amount > 0 && t.createdAt.startsWith(dateStr))
        .reduce((s, t) => s + t.amount, 0);
      days.push({ date: dateStr, label: dayLabel, amount: dayAmount });
    }
    return days;
  }, []);

  const maxDaily = useMemo(() => Math.max(...dailyIncome.map(d => d.amount), 1), [dailyIncome]);

  // 3. Cash vs Digital
  const cashVsDigital = useMemo(() => {
    const paid = DEMO_TRANSACTIONS.filter(t => t.status === 'paid' && t.amount > 0);
    const cashTotal = paid
      .filter(t => paymentNameToType(t.paymentMethodName) === 'cash')
      .reduce((s, t) => s + t.amount, 0);
    const digitalTotal = paid
      .filter(t => paymentNameToType(t.paymentMethodName) !== 'cash')
      .reduce((s, t) => s + t.amount, 0);
    const grandTotal = cashTotal + digitalTotal;
    return { cashTotal, digitalTotal, grandTotal };
  }, []);

  // 4. Status summary
  const statusSummary = useMemo(() => {
    const all = DEMO_TRANSACTIONS;
    const paid = all.filter(t => t.status === 'paid');
    const pending = all.filter(t => t.status === 'waiting_confirmation');
    const rejected = all.filter(t => t.status === 'rejected');
    return {
      paidCount: paid.length,
      paidAmount: paid.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, t) => s + Math.abs(t.amount), 0),
      rejectedCount: rejected.length,
      rejectedAmount: rejected.reduce((s, t) => s + Math.abs(t.amount), 0),
    };
  }, []);

  const VERT_BAR_COLORS = [
    'bg-[#0F7A4F]',
    'bg-[#D6A84F]',
    'bg-emerald-600',
    'bg-amber-500',
    'bg-teal-600',
    'bg-orange-500',
    'bg-lime-600',
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقارير المحاسبة</h1>
          <p className="text-sm text-gray-500 mt-1">تحليل مفصل للإيرادات والمعاملات المالية</p>
        </div>
      </div>

      {/* 1. Income by Payment Method */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">الإيرادات حسب طريقة الدفع</CardTitle>
        </CardHeader>
        <CardContent>
          {methodBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {methodBreakdown.map(([method, amount]) => (
                <div key={method} className="flex items-center gap-3">
                  <div className="w-36 sm:w-44 text-sm text-gray-600 text-left shrink-0 truncate">
                    {method}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${METHOD_BAR_COLORS[method] || 'bg-gray-400'} flex items-center justify-end px-3 transition-all duration-500`}
                      style={{ width: `${Math.max((amount / maxMethod) * 100, 10)}%` }}
                    >
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        {formatMRU(amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Daily Income (Vertical Bar Chart) */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">الإيرادات اليومية</CardTitle>
          <CardDescription>آخر 7 أيام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-around gap-2 h-52">
            {dailyIncome.map((day, i) => {
              const heightPct = maxDaily > 0 ? Math.max((day.amount / maxDaily) * 100, 4) : 4;
              return (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-medium text-gray-700">
                    {day.amount > 0 ? formatMRU(day.amount) : ''}
                  </span>
                  <div className="w-full flex justify-center" style={{ height: '160px', alignItems: 'flex-end' }}>
                    <div
                      className={`w-full max-w-[48px] rounded-t-lg ${VERT_BAR_COLORS[i % VERT_BAR_COLORS.length]} transition-all duration-500 min-h-[4px]`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{day.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Cash vs Digital */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">المقارنة: نقدًا مقابل رقمي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cash */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 mb-3">
                <Banknote className="h-7 w-7 text-gray-600" />
              </div>
              <p className="text-sm text-gray-500 mb-1">الدفع نقدًا</p>
              <p className="text-2xl font-bold text-gray-800">{formatMRU(cashVsDigital.cashTotal)}</p>
              {cashVsDigital.grandTotal > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {Math.round((cashVsDigital.cashTotal / cashVsDigital.grandTotal) * 100)}% من الإجمالي
                </p>
              )}
            </div>
            {/* Digital */}
            <div className="bg-[#0F7A4F]/5 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0F7A4F]/10 mb-3">
                <Smartphone className="h-7 w-7 text-[#0F7A4F]" />
              </div>
              <p className="text-sm text-gray-500 mb-1">الدفع الرقمي</p>
              <p className="text-2xl font-bold text-[#0F7A4F]">{formatMRU(cashVsDigital.digitalTotal)}</p>
              {cashVsDigital.grandTotal > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {Math.round((cashVsDigital.digitalTotal / cashVsDigital.grandTotal) * 100)}% من الإجمالي
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Status Summary */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">ملخص الحالات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Paid */}
            <div className="bg-green-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-700" />
                </div>
                <span className="text-sm font-medium text-green-800">مدفوع</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{formatMRU(statusSummary.paidAmount)}</p>
              <p className="text-xs text-green-600 mt-1">{statusSummary.paidCount} معاملة</p>
            </div>
            {/* Pending */}
            <div className="bg-yellow-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-700" />
                </div>
                <span className="text-sm font-medium text-yellow-800">بانتظار التأكيد</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{formatMRU(statusSummary.pendingAmount)}</p>
              <p className="text-xs text-yellow-600 mt-1">{statusSummary.pendingCount} معاملة</p>
            </div>
            {/* Rejected */}
            <div className="bg-red-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-700" />
                </div>
                <span className="text-sm font-medium text-red-800">مرفوض</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{formatMRU(statusSummary.rejectedAmount)}</p>
              <p className="text-xs text-red-600 mt-1">{statusSummary.rejectedCount} معاملة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


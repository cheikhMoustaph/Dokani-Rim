'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { DEMO_STORES, DEMO_PRODUCTS, DEMO_CATEGORIES, formatMRU } from '@/lib/demo-data';
import type { DemoProduct, CartItem } from '@/lib/types';
import { cartItems as initialCart } from '@/lib/demo-data';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import {
  Search, ShoppingBag, Plus, Minus, Trash2, X, Heart, Share2,
  MessageCircle, Phone, MapPin, Star, ChevronLeft, ChevronRight,
  Store, Truck, RotateCcw, Shield, Package, CreditCard, Filter,
  CheckCircle, Clock, Upload
} from 'lucide-react';

// ─── Color Map for color circles ───
const COLOR_MAP: Record<string, string> = {
  'أسود': '#1a1a1a',
  'بيج': '#d4c5a9',
  'رمادي': '#9ca3af',
  'بني': '#8B4513',
  'عنابي': '#800020',
  'وردي': '#ec4899',
  'أزرق': '#3b82f6',
  'ذهبي': '#D6A84F',
  'أبيض': '#f5f5f5',
  'فضي': '#c0c0c0',
  'رمادي فاتح': '#d1d5db',
  'وردي فاتح': '#f9a8d4',
  'أزرق فاتح': '#93c5fd',
};

const NOUAKCHOTT_NEIGHBORHOODS = [
  'تيارت زمبل',
  'لكصر',
  'سيدي محمود',
  'العيون',
  'تفرغ زينة',
  'سنهاجة',
  'الكفه',
  'أرفد',
  'العاصمة',
  'توجنين',
  'السبخة',
];

export default function StorefrontPage() {
  const { currentView, viewParams, setView, goBack } = useApp();

  // ─── Cart State ───
  const [cart, setCart] = useState<CartItem[]>([...initialCart]);
  const [cartOpen, setCartOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [orderNumber] = useState('ORD-011');

  // ─── Store & Product Data ───
  const store = DEMO_STORES.find(s => s.id === 's1')!;
  const storeCategories = DEMO_CATEGORIES.filter(c => c.storeId === 's1');
  const storeProducts = DEMO_PRODUCTS.filter(p => p.storeId === 's1');

  // ─── Filter / Search State ───
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Product Detail (derived, no sync needed) ───
  const currentProduct = currentView === 'storefront-product'
    ? DEMO_PRODUCTS.find(p => p.id === viewParams.productId) ?? null
    : null;

  // ─── Checkout State ───
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    deliveryMethod: 'delivery' as 'delivery' | 'pickup',
    paymentMethod: 'cash' as 'cash' | 'manual_transfer',
    notes: '',
    agreePolicy: false,
  });
  const [proofFile, setProofFile] = useState<string | null>(null);

  // ─── Filtered Products ───
  const filteredProducts = useMemo(() => {
    let products = storeProducts;
    if (selectedCategory) {
      products = products.filter(p => p.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return products;
  }, [storeProducts, selectedCategory, searchQuery]);

  // ─── Cart Functions ───
  const handleAddToCart = useCallback((product: DemoProduct, size?: string | null, color?: string | null) => {
    const selectedSize = size ?? (product.sizes.length > 0 ? product.sizes[0] : null);
    const selectedColor = color ?? (product.colors.length > 0 ? product.colors[0] : null);

    setCart(prev => {
      const existing = prev.find(
        c => c.productId === product.id && c.size === selectedSize && c.color === selectedColor
      );
      if (existing) {
        return prev.map(c =>
          c.productId === product.id && c.size === selectedSize && c.color === selectedColor
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        image: product.images[0] || '',
      }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string, size: string | null, color: string | null) => {
    setCart(prev => prev.filter(c => !(c.productId === productId && c.size === size && c.color === color)));
  }, []);

  const handleUpdateQty = useCallback((productId: string, size: string | null, color: string | null, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(c =>
      c.productId === productId && c.size === size && c.color === color
        ? { ...c, quantity: qty }
        : c
    ));
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryFee = checkoutForm.deliveryMethod === 'delivery' ? 200 : 0;
  const checkoutTotal = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.city || !checkoutForm.agreePolicy) return;
    if (checkoutForm.paymentMethod === 'manual_transfer' && !proofFile) return;
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setCart([]);
    setCheckoutForm({
      name: '', phone: '', city: '', area: '',
      deliveryMethod: 'delivery', paymentMethod: 'cash',
      notes: '', agreePolicy: false,
    });
    setProofFile(null);
    goBack();
  };

  // ─── Discount Calculator ───
  const getDiscount = (product: DemoProduct) => {
    if (!product.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  };

  // ═══════════════════════════════════════════════════════════
  // PRODUCT DETAIL VIEW
  // ═══════════════════════════════════════════════════════════
  if (currentView === 'storefront-product' && currentProduct) {
    return (
      <ProductDetailView
        product={currentProduct}
        cartCount={cartCount}
        cart={cart}
        cartOpen={cartOpen}
        onCartOpenChange={setCartOpen}
        onGoBack={goBack}
        onAddToCart={handleAddToCart}
        onUpdateCartQty={handleUpdateQty}
        onRemoveFromCart={handleRemoveFromCart}
        onGoCheckout={() => { setCartOpen(false); setView('storefront-checkout'); }}
        cartSubtotal={cartSubtotal}
        store={store}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════
  // CHECKOUT VIEW
  // ═══════════════════════════════════════════════════════════
  if (currentView === 'storefront-checkout') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAF7' }}>
        <TopBar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Back to cart */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm mb-6 hover:underline"
              style={{ color: '#0F7A4F' }}
            >
              <ChevronRight className="h-4 w-4" />
              العودة للسلة
            </button>

            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
              إتمام الطلب
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" style={{ color: '#0F7A4F' }} />
                      معلومات الشحن
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="أدخل اسمك الكامل"
                        value={checkoutForm.name}
                        onChange={e => setCheckoutForm(f => ({ ...f, name: e.target.value }))}
                        className="border-gray-200 rounded-xl h-11"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        رقم الهاتف / واتساب <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="مثال: 22XXXXXXXX"
                        value={checkoutForm.phone}
                        onChange={e => setCheckoutForm(f => ({ ...f, phone: e.target.value }))}
                        className="border-gray-200 rounded-xl h-11"
                        dir="ltr"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        المدينة <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={checkoutForm.city}
                        onValueChange={v => setCheckoutForm(f => ({ ...f, city: v }))}
                      >
                        <SelectTrigger className="border-gray-200 rounded-xl h-11">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {NOUAKCHOTT_NEIGHBORHOODS.map(n => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        المنطقة / الحي
                      </label>
                      <Input
                        placeholder="مثال: بجانب المسجد الكبير"
                        value={checkoutForm.area}
                        onChange={e => setCheckoutForm(f => ({ ...f, area: e.target.value }))}
                        className="border-gray-200 rounded-xl h-11"
                      />
                    </div>

                    <Separator className="my-1" />

                    {/* Delivery Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">طريقة التوصيل</label>
                      <Select
                        value={checkoutForm.deliveryMethod}
                        onValueChange={v => setCheckoutForm(f => ({ ...f, deliveryMethod: v as 'delivery' | 'pickup' }))}
                      >
                        <SelectTrigger className="border-gray-200 rounded-xl h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delivery">
                            <span className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              توصيل — 200 أوقية
                            </span>
                          </SelectItem>
                          <SelectItem value="pickup">
                            <span className="flex items-center gap-2">
                              <Store className="h-4 w-4" />
                              استلام من المتجر — مجاني
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">طريقة الدفع</label>
                      <Select
                        value={checkoutForm.paymentMethod}
                        onValueChange={v => setCheckoutForm(f => ({ ...f, paymentMethod: v as 'cash' | 'manual_transfer' }))}
                      >
                        <SelectTrigger className="border-gray-200 rounded-xl h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">
                            <span className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              الدفع عند الاستلام
                            </span>
                          </SelectItem>
                          <SelectItem value="manual_transfer">
                            <span className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              تحويل يدوي
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Payment Proof Upload */}
                    {checkoutForm.paymentMethod === 'manual_transfer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          إثبات التحويل <span className="text-red-500">*</span>
                        </label>
                        <div
                          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
                          style={{ borderColor: proofFile ? '#0F7A4F' : '#d0d0c8' }}
                          onClick={() => setProofFile('receipt_uploaded.png')}
                        >
                          {proofFile ? (
                            <div className="flex flex-col items-center gap-2">
                              <CheckCircle className="h-10 w-10" style={{ color: '#0F7A4F' }} />
                              <p className="text-sm font-semibold" style={{ color: '#0F7A4F' }}>
                                تم رفع الإيصال بنجاح
                              </p>
                              <button
                                onClick={e => { e.stopPropagation(); setProofFile(null); }}
                                className="text-xs text-red-500 hover:underline"
                              >
                                حذف وإعادة الرفع
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-10 w-10 text-gray-400" />
                              <p className="text-sm text-gray-500">اضغط لرفع صورة إيصال التحويل</p>
                              <p className="text-xs text-gray-400">PNG, JPG حتى 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator className="my-1" />

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        ملاحظات الطلب <span className="text-gray-400 font-normal">(اختياري)</span>
                      </label>
                      <Textarea
                        placeholder="أي ملاحظات خاصة بالطلب..."
                        value={checkoutForm.notes}
                        onChange={e => setCheckoutForm(f => ({ ...f, notes: e.target.value }))}
                        className="border-gray-200 rounded-xl min-h-[90px] resize-none"
                      />
                    </div>

                    {/* Policy Checkbox */}
                    <div className="flex items-start gap-3 pt-1">
                      <Checkbox
                        id="agree-policy"
                        checked={checkoutForm.agreePolicy}
                        onCheckedChange={v => setCheckoutForm(f => ({ ...f, agreePolicy: v === true }))}
                        className="mt-0.5"
                      />
                      <label htmlFor="agree-policy" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                        أوافق على{' '}
                        <span className="font-semibold" style={{ color: '#0F7A4F' }}>
                          سياسة الإرجاع والاستبدال
                        </span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm rounded-2xl lg:sticky lg:top-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" style={{ color: '#D6A84F' }} />
                      ملخص الطلب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="max-h-64 pr-2">
                      <div className="space-y-3">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
                              style={{ backgroundColor: '#f0f0ec' }}
                            >
                              <Package className="h-5 w-5" style={{ color: '#c0c0b8' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-400">
                                {item.size && `المقاس: ${item.size}`}
                                {item.size && item.color && ' · '}
                                {item.color && `اللون: ${item.color}`}
                              </p>
                            </div>
                            <div className="text-left shrink-0">
                              <p className="text-sm font-semibold" style={{ color: '#0F7A4F' }}>{formatMRU(item.price)}</p>
                              <p className="text-xs text-gray-400">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <Separator />

                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">المجموع الفرعي</span>
                        <span className="font-medium text-gray-800">{formatMRU(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">رسوم التوصيل</span>
                        <span className="font-medium text-gray-800">
                          {deliveryFee > 0 ? formatMRU(deliveryFee) : 'مجاني'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800">الإجمالي</span>
                        <span style={{ color: '#0F7A4F' }}>{formatMRU(checkoutTotal)}</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full text-base font-bold py-6 rounded-xl transition-all duration-200 hover:opacity-90 mt-2"
                      style={{ backgroundColor: '#0F7A4F' }}
                      disabled={
                        !checkoutForm.name ||
                        !checkoutForm.phone ||
                        !checkoutForm.city ||
                        !checkoutForm.agreePolicy ||
                        (checkoutForm.paymentMethod === 'manual_transfer' && !proofFile)
                      }
                      onClick={handleCheckout}
                    >
                      تأكيد الطلب
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Success Dialog */}
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent className="text-center max-w-sm mx-auto rounded-2xl">
            <DialogHeader className="items-center pt-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#ecfdf5' }}
              >
                <CheckCircle className="h-9 w-9" style={{ color: '#0F7A4F' }} />
              </div>
              <DialogTitle className="text-xl font-bold">تم استلام طلبك بنجاح!</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                رقم الطلب:{' '}
                <span className="font-bold text-gray-800 text-base">{orderNumber}</span>
                <br />
                سنتواصل معك قريباً لتأكيد الطلب.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center pb-6 pt-2">
              <Button
                className="px-10 py-5 rounded-xl text-base font-semibold"
                style={{ backgroundColor: '#0F7A4F' }}
                onClick={handleSuccessClose}
              >
                متابعة التسوق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cart Sheet */}
        <CartSheet
          cart={cart}
          open={cartOpen}
          onOpenChange={setCartOpen}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={() => { setCartOpen(false); setView('storefront-checkout'); }}
          subtotal={cartSubtotal}
        />

        <StorefrontFooter store={store} />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN STOREFRONT VIEW (Product Grid)
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAF7' }}>
      {/* Top Bar */}
      <TopBar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {/* Store Header */}
      <StoreHeader store={store} />

      {/* Navigation: Categories + Search */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b shadow-sm" style={{ borderColor: '#e8e8e0' }}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !selectedCategory
                  ? 'text-white shadow-md'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={!selectedCategory ? { backgroundColor: '#0F7A4F' } : undefined}
            >
              الكل
            </button>
            {storeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'text-white shadow-md'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: '#0F7A4F' } : undefined}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pr-10 pl-10 border-gray-200 bg-gray-50/80 rounded-xl h-11"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Products Count */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-6 pb-2">
        <p className="text-sm text-gray-500">
          {filteredProducts.length} منتج
          {selectedCategory && (
            <span>
              {' '}في{' '}
              <span className="font-semibold" style={{ color: '#0F7A4F' }}>
                {storeCategories.find(c => c.id === selectedCategory)?.name}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Product Grid */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 pb-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filteredProducts.map(product => {
                const discount = getDiscount(product);

                return (
                  <Card
                    key={product.id}
                    className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden rounded-xl"
                    style={{ backgroundColor: '#fff' }}
                    onClick={() => setView('storefront-product', { productId: product.id })}
                  >
                    {/* Image Placeholder */}
                    <div
                      className="relative h-40 sm:h-44 md:h-48 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: '#f0f0ec' }}
                    >
                      <Package
                        className="h-11 w-11 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: '#c0c0b8' }}
                      />

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                        {product.isBestSeller && (
                          <Badge
                            className="text-[10px] px-2 py-0.5 shadow-sm"
                            style={{ backgroundColor: '#D6A84F', color: '#fff' }}
                          >
                            <Star className="h-2.5 w-2.5 ml-0.5" />
                            الأكثر مبيعاً
                          </Badge>
                        )}
                        {discount > 0 && (
                          <Badge className="text-[10px] px-2 py-0.5 bg-red-500 text-white shadow-sm">
                            -{discount}%
                          </Badge>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                          onClick={e => { e.stopPropagation(); }}
                          title="المفضلة"
                        >
                          <Heart className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                        <button
                          className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                          onClick={e => { e.stopPropagation(); }}
                          title="مشاركة"
                        >
                          <Share2 className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2 mb-2 leading-relaxed min-h-[2.5rem]">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-2.5">
                        <span className="font-bold text-base md:text-lg" style={{ color: '#0F7A4F' }}>
                          {formatMRU(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs line-through text-gray-400">
                            {formatMRU(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      {/* Color dots */}
                      {product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-3">
                          {product.colors.slice(0, 5).map(color => (
                            <span
                              key={color}
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: COLOR_MAP[color] || '#ccc' }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-[10px] text-gray-400">+{product.colors.length - 5}</span>
                          )}
                        </div>
                      )}

                      {/* Add to Cart */}
                      <Button
                        size="sm"
                        className="w-full rounded-lg text-xs font-semibold py-2.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: '#0F7A4F' }}
                        onClick={e => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 ml-1" />
                        أضف للسلة
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: '#f0f0ec' }}>
                <Package className="h-10 w-10" style={{ color: '#c0c0b8' }} />
              </div>
              <p className="text-lg font-bold text-gray-700 mb-1">لا توجد منتجات</p>
              <p className="text-sm text-gray-400 max-w-xs">
                {searchQuery
                  ? 'لم نجد نتائج لبحثك. جرب كلمات مختلفة.'
                  : 'لا توجد منتجات في هذا التصنيف حالياً.'}
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-xl"
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
              >
                عرض جميع المنتجات
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Cart Sheet */}
      <CartSheet
        cart={cart}
        open={cartOpen}
        onOpenChange={setCartOpen}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={() => { setCartOpen(false); setView('storefront-checkout'); }}
        subtotal={cartSubtotal}
      />

      {/* Footer */}
      <StorefrontFooter store={store} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════

// ─── Product Detail View (own state for qty/size/color) ───
function ProductDetailView({
  product,
  cartCount,
  cart,
  cartOpen,
  onCartOpenChange,
  onGoBack,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onGoCheckout,
  cartSubtotal,
  store,
}: {
  product: DemoProduct;
  cartCount: number;
  cart: CartItem[];
  cartOpen: boolean;
  onCartOpenChange: (open: boolean) => void;
  onGoBack: () => void;
  onAddToCart: (product: DemoProduct, size?: string | null, color?: string | null) => void;
  onUpdateCartQty: (productId: string, size: string | null, color: string | null, qty: number) => void;
  onRemoveFromCart: (productId: string, size: string | null, color: string | null) => void;
  onGoCheckout: () => void;
  cartSubtotal: number;
  store: { name: string; whatsapp: string };
}) {
  const [detailQty, setDetailQty] = useState(1);
  const [detailSize, setDetailSize] = useState<string | null>(
    product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [detailColor, setDetailColor] = useState<string | null>(
    product.colors.length > 0 ? product.colors[0] : null
  );

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const openWhatsApp = () => {
    const msg = `مرحباً، أريد طلب المنتج التالي:\n\n📦 ${product.name}\n💰 ${formatMRU(product.price)}\n\nشكراً!`;
    window.open(`https://wa.me/22222333?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAF7' }}>
      <TopBar cartCount={cartCount} onCartOpen={() => onCartOpenChange(true)} />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 text-sm mb-6 hover:underline"
            style={{ color: '#0F7A4F' }}
          >
            <ChevronRight className="h-4 w-4" />
            العودة للمنتجات
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Product Image Placeholder */}
            <div
              className="w-full h-64 sm:h-80 md:h-[420px] rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#f0f0ec' }}
            >
              <Package className="h-20 w-20" style={{ color: '#c0c0b8' }} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-5">
              {product.isBestSeller && (
                <Badge className="w-fit text-xs" style={{ backgroundColor: '#D6A84F', color: '#fff' }}>
                  <Star className="h-3 w-3 ml-1" />
                  الأكثر مبيعاً
                </Badge>
              )}

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold" style={{ color: '#0F7A4F' }}>
                  {formatMRU(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg line-through text-gray-400">{formatMRU(product.compareAtPrice)}</span>
                )}
                {discount > 0 && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">وفر {discount}%</Badge>
                )}
              </div>

              <Separator />

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3 text-gray-700">المقاس</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <Button
                        key={size}
                        variant={detailSize === size ? 'default' : 'outline'}
                        onClick={() => setDetailSize(size)}
                        className={detailSize === size ? '' : 'border-gray-300 hover:border-gray-400'}
                        style={detailSize === size ? { backgroundColor: '#0F7A4F', borderColor: '#0F7A4F' } : undefined}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3 text-gray-700">
                    اللون{detailColor ? ` — ${detailColor}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setDetailColor(color)}
                        className="w-9 h-9 rounded-full transition-all duration-150 hover:scale-110"
                        style={{
                          backgroundColor: COLOR_MAP[color] || '#ccc',
                          outline: detailColor === color ? '3px solid #0F7A4F' : 'none',
                          outlineOffset: '2px',
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <p className="text-sm font-semibold mb-3 text-gray-700">الكمية</p>
                <div className="flex items-center border rounded-lg w-fit overflow-hidden" style={{ borderColor: '#e0e0d8' }}>
                  <button
                    onClick={() => setDetailQty(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="w-14 h-11 flex items-center justify-center font-semibold text-base border-x" style={{ borderColor: '#e0e0d8' }}>
                    {detailQty}
                  </span>
                  <button
                    onClick={() => setDetailQty(q => q + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="w-full text-base font-semibold py-6 rounded-xl transition-all duration-200 hover:opacity-90 mt-2"
                style={{ backgroundColor: '#0F7A4F' }}
                onClick={() => {
                  for (let i = 0; i < detailQty; i++) {
                    onAddToCart(product, detailSize, detailColor);
                  }
                  setDetailQty(1);
                  onCartOpenChange(true);
                }}
              >
                <ShoppingBag className="h-5 w-5 ml-2" />
                أضف للسلة — {formatMRU(product.price * detailQty)}
              </Button>

              {/* WhatsApp */}
              <Button
                size="lg"
                variant="outline"
                className="w-full text-base font-semibold py-6 rounded-xl transition-all duration-200"
                style={{ borderColor: '#25D366', color: '#25D366' }}
                onClick={openWhatsApp}
              >
                <MessageCircle className="h-5 w-5 ml-2" />
                اطلب عبر واتساب
              </Button>

              {/* Tabs */}
              <Tabs defaultValue="description" className="mt-4">
                <TabsList className="w-full bg-gray-100/60 h-11">
                  <TabsTrigger value="description" className="flex-1 text-sm data-[state=active]:shadow-sm">الوصف</TabsTrigger>
                  <TabsTrigger value="delivery" className="flex-1 text-sm data-[state=active]:shadow-sm">التوصيل</TabsTrigger>
                  <TabsTrigger value="returns" className="flex-1 text-sm data-[state=active]:shadow-sm">سياسة الإرجاع</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <div className="p-4 rounded-xl bg-white">
                    <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                    {product.sku && (
                      <p className="text-xs text-gray-400 mt-3">رمز المنتج: {product.sku}</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="delivery" className="mt-4">
                  <div className="p-4 rounded-xl bg-white space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#ecfdf5' }}>
                        <Truck className="h-4 w-4" style={{ color: '#0F7A4F' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">توصيل داخل نواكشوط</p>
                        <p className="text-xs text-gray-500 mt-0.5">التوصيل خلال 24-48 ساعة. رسوم التوصيل 200 أوقية.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#ecfdf5' }}>
                        <Store className="h-4 w-4" style={{ color: '#0F7A4F' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">استلام من المتجر</p>
                        <p className="text-xs text-gray-500 mt-0.5">يمكنك استلام طلبك مجاناً من المتجر مباشرة.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="returns" className="mt-4">
                  <div className="p-4 rounded-xl bg-white space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#fef9ec' }}>
                        <RotateCcw className="h-4 w-4" style={{ color: '#D6A84F' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">إرجاع واستبدال</p>
                        <p className="text-xs text-gray-500 mt-0.5">يمكنك إرجاع المنتج خلال 3 أيام من الاستلام بشرط أن يكون في حالته الأصلية.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#ecfdf5' }}>
                        <Shield className="h-4 w-4" style={{ color: '#0F7A4F' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">ضمان الجودة</p>
                        <p className="text-xs text-gray-500 mt-0.5">جميع منتجاتنا أصلية ومضمونة الجودة 100%.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <CartSheet
        cart={cart}
        open={cartOpen}
        onOpenChange={onCartOpenChange}
        onUpdateQty={onUpdateCartQty}
        onRemove={onRemoveFromCart}
        onCheckout={onGoCheckout}
        subtotal={cartSubtotal}
      />

      <StorefrontFooter store={store} />
    </div>
  );
}

// ─── Top Bar ───
function TopBar({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  return (
    <div className="bg-white border-b" style={{ borderColor: '#e8e8e0' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <span className="text-lg font-bold tracking-tight" style={{ color: '#0F7A4F' }}>
          دكاني
        </span>

        <div className="flex items-center gap-3">
          {/* Create Store Link */}
          <a
            href="#"
            className="hidden sm:inline-flex text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            إنشاء متجرك
          </a>

          {/* Cart Button */}
          <button
            onClick={onCartOpen}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="سلة التسوق"
          >
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -left-0.5 min-w-[20px] h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1"
                style={{ backgroundColor: '#0F7A4F' }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Store Header ───
function StoreHeader({ store }: { store: { name: string; description: string; phone: string; whatsapp: string; city: string } }) {
  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F7A4F 0%, #0a5c3b 60%, #0d6e47 100%)',
        }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full border-2 border-white" />
          <div className="absolute -bottom-4 right-10 w-56 h-56 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full border-2 border-white" />
          <div className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full border border-white" />
          <div className="absolute bottom-1/4 left-1/2 w-32 h-32 rounded-full border border-white" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            {store.name}
          </h1>
          <p className="text-white/75 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {store.description}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/25 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>

      {/* Store Info Bar */}
      <div className="bg-white border-b" style={{ borderColor: '#e8e8e0' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <a
            href={`tel:${store.phone}`}
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <Phone className="h-4 w-4" style={{ color: '#0F7A4F' }} />
            <span dir="ltr">{store.phone}</span>
          </a>
          <a
            href={`https://wa.me/${store.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <MessageCircle className="h-4 w-4" style={{ color: '#25D366' }} />
            <span>واتساب</span>
          </a>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: '#D6A84F' }} />
            <span>{store.city}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sheet ───
function CartSheet({
  cart,
  open,
  onOpenChange,
  onUpdateQty,
  onRemove,
  onCheckout,
  subtotal,
}: {
  cart: CartItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateQty: (productId: string, size: string | null, color: string | null, qty: number) => void;
  onRemove: (productId: string, size: string | null, color: string | null) => void;
  onCheckout: () => void;
  subtotal: number;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col rounded-r-2xl" style={{ backgroundColor: '#FAFAF7' }}>
        <SheetHeader className="px-6 py-4 border-b bg-white" style={{ borderColor: '#e8e8e0' }}>
          <div className="flex items-center justify-between w-full">
            <SheetTitle className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ecfdf5' }}>
                <ShoppingBag className="h-4 w-4" style={{ color: '#0F7A4F' }} />
              </div>
              سلة التسوق
              {cart.length > 0 && (
                <Badge className="mr-1 text-xs px-1.5" style={{ backgroundColor: '#0F7A4F' }}>
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f0ec' }}>
              <ShoppingBag className="h-10 w-10" style={{ color: '#c0c0b8' }} />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-700">السلة فارغة</p>
              <p className="text-sm text-gray-400 mt-1">أضف بعض المنتجات لبدء التسوق</p>
            </div>
            <Button
              variant="outline"
              className="mt-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              متابعة التسوق
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-4 py-4 space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}-${idx}`}
                    className="flex gap-3 bg-white rounded-xl p-3 shadow-sm"
                  >
                    {/* Image placeholder */}
                    <div
                      className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: '#f0f0ec' }}
                    >
                      <Package className="h-6 w-6" style={{ color: '#c0c0b8' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => onRemove(item.productId, item.size, item.color)}
                          className="shrink-0 p-1 rounded-md hover:bg-red-50 transition-colors"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {item.size && (
                          <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {item.color}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#e0e0d8' }}>
                          <button
                            onClick={() => onUpdateQty(item.productId, item.size, item.color, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="تقليل الكمية"
                          >
                            <Minus className="h-3 w-3 text-gray-500" />
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center text-xs font-semibold border-x" style={{ borderColor: '#e0e0d8' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.productId, item.size, item.color, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                        <span className="text-sm font-bold" style={{ color: '#0F7A4F' }}>
                          {formatMRU(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Cart Footer */}
            <div className="border-t px-5 py-4 bg-white rounded-t-2xl" style={{ borderColor: '#e8e8e0' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">المجموع الفرعي</span>
                <span className="text-lg font-bold" style={{ color: '#0F7A4F' }}>
                  {formatMRU(subtotal)}
                </span>
              </div>
              <Button
                size="lg"
                className="w-full font-bold py-6 rounded-xl transition-all duration-200 hover:opacity-90 text-base"
                style={{ backgroundColor: '#0F7A4F' }}
                onClick={onCheckout}
              >
                إتمام الطلب
              </Button>
              <button
                className="w-full text-center text-sm mt-3 font-medium hover:underline"
                style={{ color: '#0F7A4F' }}
                onClick={() => onOpenChange(false)}
              >
                متابعة التسوق
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Footer ───
function StorefrontFooter({ store }: { store: { name: string; whatsapp: string } }) {
  return (
    <footer className="bg-white border-t mt-auto" style={{ borderColor: '#e8e8e0' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {/* Store Info */}
          <div>
            <h3 className="font-bold text-base mb-3" style={{ color: '#0F7A4F' }}>{store.name}</h3>
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline transition-colors"
              style={{ color: '#25D366' }}
            >
              <MessageCircle className="h-4 w-4" />
              تواصل معنا عبر واتساب
            </a>
          </div>

          {/* Delivery Info */}
          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-3">التوصيل</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 shrink-0" style={{ color: '#0F7A4F' }} />
                توصيل داخل نواكشوط
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: '#D6A84F' }} />
                خلال 24-48 ساعة
              </li>
            </ul>
          </div>

          {/* Return Policy */}
          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-3">سياسة الإرجاع</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 shrink-0" style={{ color: '#0F7A4F' }} />
                إرجاع خلال 3 أيام
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0" style={{ color: '#D6A84F' }} />
                ضمان الجودة
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-xs text-gray-400">
          بدعم من{' '}
          <span className="font-bold" style={{ color: '#0F7A4F' }}>
            دكاني
          </span>{' '}
          — منصة التجارة الإلكترونية في موريتانيا
        </div>
      </div>
    </footer>
  );
}
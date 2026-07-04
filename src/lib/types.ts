// ============ DEMO DATA TYPES ============

export interface DemoStore {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  phone: string;
  whatsapp: string;
  city: string;
  status: 'trial' | 'active' | 'expired' | 'suspended' | 'pending_payment' | 'cancelled';
  language: string;
  productCount: number;
  orderCount: number;
  revenue: number;
  createdAt: string;
}

export interface DemoProduct {
  id: string;
  storeId: string;
  categoryId: string | null;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  status: 'available' | 'unavailable';
  stockQuantity: number;
  sizes: string[];
  colors: string[];
  sku: string | null;
  customDeliveryCost: number | null;
  isBestSeller: boolean;
}

export interface DemoCategory {
  id: string;
  storeId: string;
  name: string;
  image: string | null;
  status: 'active' | 'inactive';
  productCount: number;
}

export interface DemoOrder {
  id: string;
  storeId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerArea: string | null;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'manual_transfer';
  paymentProof: string | null;
  orderNotes: string | null;
  internalNotes: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  source: string;
  items: DemoOrderItem[];
  createdAt: string;
}

export interface DemoOrderItem {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  total: number;
  size: string | null;
  color: string | null;
}

export type OrderStatus =
  | 'new' | 'contacted' | 'waiting_payment' | 'paid' | 'preparing'
  | 'ready_delivery' | 'on_the_way' | 'delivered' | 'cancelled'
  | 'returned' | 'rejected' | 'customer_not_responding';

export type PaymentStatus = 'unpaid' | 'waiting_confirmation' | 'paid' | 'rejected' | 'refunded';

export interface DemoCustomer {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  city: string | null;
  area: string | null;
  status: 'new' | 'repeat' | 'vip' | 'inactive';
  notes: string | null;
  source: string;
  orderCount: number;
  totalPurchases: number;
  lastOrderDate: string | null;
  lastContactDate: string | null;
  firstOrderDate: string | null;
}

export interface DemoCampaign {
  id: string;
  storeId: string;
  name: string;
  type: string;
  channel: string;
  status: 'active' | 'paused' | 'ended';
  visits: number;
  orders: number;
  customers: number;
  revenue: number;
  conversionRate: number;
  createdAt: string;
}

export interface DemoCoupon {
  id: string;
  storeId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit: number | null;
  usageCount: number;
  expiryDate: string | null;
  status: 'active' | 'inactive';
}

export interface DemoDeliveryZone {
  id: string;
  storeId: string;
  city: string;
  area: string;
  fee: number;
  status: 'active' | 'inactive';
}

export interface DemoDeliveryAgent {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  assignedOrders: number;
}

export interface DemoInvoice {
  id: string;
  storeId: string;
  invoiceNumber: string;
  merchantName: string;
  storeName: string;
  phone: string;
  plan: string;
  duration: string;
  amount: number;
  paymentMethod: string;
  status: 'draft' | 'pending_payment' | 'paid' | 'rejected' | 'cancelled' | 'refunded';
  createdAt: string;
  paidAt: string | null;
}

export interface DemoAutomation {
  id: string;
  storeId: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image: string;
}

// ============ LABELS ============

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'طلب جديد',
  contacted: 'تم التواصل',
  waiting_payment: 'بانتظار الدفع',
  paid: 'مدفوع',
  preparing: 'قيد التحضير',
  ready_delivery: 'جاهز للتوصيل',
  on_the_way: 'في الطريق',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  returned: 'مرتجع',
  rejected: 'مرفوض',
  customer_not_responding: 'الزبون لا يرد',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-indigo-100 text-indigo-800',
  waiting_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready_delivery: 'bg-cyan-100 text-cyan-800',
  on_the_way: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-pink-100 text-pink-800',
  rejected: 'bg-rose-100 text-rose-800',
  customer_not_responding: 'bg-gray-100 text-gray-800',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'غير مدفوع',
  waiting_confirmation: 'بانتظار التأكيد',
  paid: 'مدفوع',
  rejected: 'مرفوض',
  refunded: 'مسترد',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  unpaid: 'bg-red-100 text-red-800',
  waiting_confirmation: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
};

export const STORE_STATUS_LABELS: Record<string, string> = {
  trial: 'فترة تجريبية',
  active: 'نشط',
  expired: 'منتهي الصلاحية',
  suspended: 'معلق',
  pending_payment: 'بانتظار الدفع',
  cancelled: 'ملغي',
};

export const STORE_STATUS_COLORS: Record<string, string> = {
  trial: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  expired: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  pending_payment: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

export const CUSTOMER_STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  repeat: 'متكرر',
  vip: 'VIP',
  inactive: 'غير نشط',
};

export const CUSTOMER_SOURCE_LABELS: Record<string, string> = {
  whatsapp: 'واتساب',
  instagram: 'انستغرام',
  facebook: 'فيسبوك',
  tiktok: 'تيك توك',
  snapchat: 'سناب شات',
  direct: 'رابط مباشر',
  paid_ad: 'إعلان مدفوع',
  friend_referral: 'إحالة صديق',
  other: 'أخرى',
};

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  single_product: 'حملة منتج واحد',
  discount: 'حملة تخفيضات',
  coupon: 'حملة كوبونات',
  whatsapp_leads: 'جمع بيانات واتساب',
  new_store_launch: 'إطلاق متجر جديد',
  reactivation: 'إعادة تنشيط الزبائن',
  seasonal: 'حملة موسمية',
  whatsapp_order: 'طلب عبر واتساب',
  lead_magnet: 'مغناطيس عملاء',
};
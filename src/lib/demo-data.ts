import type {
  DemoStore, DemoProduct, DemoCategory, DemoOrder, DemoCustomer,
  DemoCampaign, DemoCoupon, DemoDeliveryZone, DemoDeliveryAgent,
  DemoInvoice, DemoAutomation, CartItem
} from './types';

// ============ STORES ============
export const DEMO_STORES: DemoStore[] = [
  {
    id: 's1', name: 'بوتيك النخبة', slug: 'botique-ennokhba',
    description: 'أجمل الأزياء والإكسسوارات النسائية في نواكشوط',
    logo: null, phone: '22222333', whatsapp: '22222333', city: 'نواكشوط',
    status: 'active', language: 'ar', productCount: 24, orderCount: 156, revenue: 892000, createdAt: '2025-11-15'
  },
  {
    id: 's2', name: 'عطور الصحراء', slug: 'atoor-essahra',
    description: 'أفخم العطور العربية والفرنسية بأفضل الأسعار',
    logo: null, phone: '33444555', whatsapp: '33444555', city: 'نواكشوط',
    status: 'active', language: 'ar', productCount: 18, orderCount: 89, revenue: 1450000, createdAt: '2025-12-01'
  },
  {
    id: 's3', name: 'ساعات الأصالة', slug: 'sawat-el-asala',
    description: 'ساعات أصلية ماركات عالمية بضمان الجودة',
    logo: null, phone: '44555666', whatsapp: '44555666', city: 'نواكشوط',
    status: 'trial', language: 'ar', productCount: 12, orderCount: 34, revenue: 2100000, createdAt: '2026-06-20'
  },
  {
    id: 's4', name: 'حلويات السلام', slug: 'halawiyat-essalam',
    description: 'أشهى الحلويات الموريتانية التقليدية والحديثة',
    logo: null, phone: '55666777', whatsapp: '55666777', city: 'نواكشوط',
    status: 'expired', language: 'ar', productCount: 8, orderCount: 67, revenue: 456000, createdAt: '2025-10-05'
  },
  {
    id: 's5', name: 'إلكترو موريتانيا', slug: 'electro-mauritania',
    description: 'أحدث الأجهزة الإلكترونية والهواتف بأسعار منافسة',
    logo: null, phone: '66777888', whatsapp: '66777888', city: 'نواكشوط',
    status: 'suspended', language: 'ar', productCount: 30, orderCount: 200, revenue: 5600000, createdAt: '2025-08-10'
  },
  {
    id: 's6', name: 'أزياء الرجال', slug: 'azyaa-errijal',
    description: 'أجمل الملابس الرجالية العصرية والكلاسيكية',
    logo: null, phone: '77888999', whatsapp: '77888999', city: 'نواكشوط',
    status: 'active', language: 'ar', productCount: 20, orderCount: 78, revenue: 1340000, createdAt: '2026-01-10'
  },
];

// ============ CATEGORIES ============
export const DEMO_CATEGORIES: DemoCategory[] = [
  { id: 'c1', storeId: 's1', name: 'عبايات', image: null, status: 'active', productCount: 8 },
  { id: 'c2', storeId: 's1', name: 'حقائب يد', image: null, status: 'active', productCount: 5 },
  { id: 'c3', storeId: 's1', name: 'طرحات', image: null, status: 'active', productCount: 6 },
  { id: 'c4', storeId: 's1', name: 'إكسسوارات', image: null, status: 'active', productCount: 5 },
  { id: 'c5', storeId: 's2', name: 'عطور رجالية', image: null, status: 'active', productCount: 8 },
  { id: 'c6', storeId: 's2', name: 'عطور نسائية', image: null, status: 'active', productCount: 10 },
];

// ============ PRODUCTS ============
export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'p1', storeId: 's1', categoryId: 'c1', name: 'عباية كتان فاخرة', description: 'عباية كتان فاخرة بتصميم عصري وألوان متنوعة. خامة كتان طبيعي مريحة للارتداء اليومي والمناسبات.',
    price: 3500, compareAtPrice: 4500, images: [], status: 'available', stockQuantity: 25,
    sizes: ['M', 'L', 'XL', 'XXL'], colors: ['أسود', 'بيج', 'رمادي'], sku: 'ABA-001', customDeliveryCost: null, isBestSeller: true
  },
  {
    id: 'p2', storeId: 's1', categoryId: 'c2', name: 'حقيبة يد جلدية', description: 'حقيبة يد جلدية طبيعية فاخرة بتصميم أنيق يناسب جميع المناسبات. تحتوي على عدة جيوب داخلية.',
    price: 5000, compareAtPrice: 6500, images: [], status: 'available', stockQuantity: 15,
    sizes: [], colors: ['بني', 'أسود', 'عنابي'], sku: 'BAG-001', customDeliveryCost: null, isBestSeller: true
  },
  {
    id: 'p3', storeId: 's1', categoryId: 'c3', name: 'طرحة حرير', description: 'طرحة حرير طبيعي ناعمة بألوان زاهية. سهلة التنسيق مع مختلف الأزياء.',
    price: 1200, compareAtPrice: 1800, images: [], status: 'available', stockQuantity: 40,
    sizes: [], colors: ['وردي', 'أزرق', 'بيج', 'أسود'], sku: 'TRH-001', customDeliveryCost: null, isBestSeller: false
  },
  {
    id: 'p4', storeId: 's1', categoryId: 'c4', name: 'إكسسوارات ذهبية', description: 'مجموعة إكسسوارات ذهبية عيار 18 تشمل سلسلة وأسورة وحلقات.',
    price: 8000, compareAtPrice: 10000, images: [], status: 'available', stockQuantity: 10,
    sizes: [], colors: ['ذهبي', 'أبيض'], sku: 'ACC-001', customDeliveryCost: null, isBestSeller: true
  },
  {
    id: 'p5', storeId: 's1', categoryId: 'c1', name: 'عباية سوداء كلاسيكية', description: 'عباية سوداء كلاسيكية أنيقة مع تطريز يدوي راقي. مناسبة للمناسبات الرسمية.',
    price: 4200, compareAtPrice: null, images: [], status: 'available', stockQuantity: 18,
    sizes: ['M', 'L', 'XL'], colors: ['أسود'], sku: 'ABA-002', customDeliveryCost: null, isBestSeller: false
  },
  {
    id: 'p6', storeId: 's1', categoryId: 'c4', name: 'نظارات شمسية فاخرة', description: 'نظارات شمسية بتصميم عصري مع حماية كاملة من أشعة الشمس UV400.',
    price: 2500, compareAtPrice: 3000, images: [], status: 'available', stockQuantity: 20,
    sizes: [], colors: ['أسود', 'بني', 'ذهبي'], sku: 'ACC-002', customDeliveryCost: null, isBestSeller: false
  },
  {
    id: 'p7', storeId: 's2', categoryId: 'c5', name: 'عطر فاخر', description: 'عطر رجالي فاخر برائحة خشبية مميزة تدوم طويلاً. مثالي للمناسبات الرسمية.',
    price: 6000, compareAtPrice: 8000, images: [], status: 'available', stockQuantity: 12,
    sizes: ['50ml', '100ml'], colors: [], sku: 'PRF-001', customDeliveryCost: null, isBestSeller: true
  },
  {
    id: 'p8', storeId: 's2', categoryId: 'c6', name: 'عطر نسائي ساحر', description: 'عطر نسائي بألوان زهرية أنيقة يدوم أكثر من 8 ساعات.',
    price: 4500, compareAtPrice: 5500, images: [], status: 'available', stockQuantity: 8,
    sizes: ['30ml', '50ml'], colors: [], sku: 'PRF-002', customDeliveryCost: null, isBestSeller: true
  },
  {
    id: 'p9', storeId: 's1', categoryId: 'c1', name: 'عباية مطرزة', description: 'عباية مطرزة يدوياً بتطريز موريتاني تقليدي أصيل. قطعة فنية فريدة.',
    price: 7500, compareAtPrice: 9000, images: [], status: 'available', stockQuantity: 5,
    sizes: ['M', 'L', 'XL'], colors: ['أبيض', 'بيج'], sku: 'ABA-003', customDeliveryCost: null, isBestSeller: false
  },
  {
    id: 'p10', storeId: 's1', categoryId: 'c2', name: 'حقيبة ظهر أنيقة', description: 'حقيبة ظهر جلدية أنيقة مناسبة للعمل والسفر. غرفية ومتينة.',
    price: 3800, compareAtPrice: null, images: [], status: 'available', stockQuantity: 22,
    sizes: [], colors: ['أسود', 'بني'], sku: 'BAG-002', customDeliveryCost: null, isBestSeller: false
  },
  {
    id: 'p11', storeId: 's1', categoryId: 'c3', name: 'طرحة قطنية', description: 'طرحة قطنية مريحة للارتداء اليومي بألوان هادئة.',
    price: 800, compareAtPrice: null, images: [], status: 'available', stockQuantity: 50,
    sizes: [], colors: ['رمادي فاتح', 'وردي فاتح', 'أزرق فاتح'], sku: 'TRH-002', customDeliveryCost: null, isBestSeller: false
  },
  {
    id: 'p12', storeId: 's1', categoryId: 'c4', name: 'ساعة رجالية', description: 'ساعة رجالية بتصميم كلاسيكي مع سوار جلدي وعلبة معدنية مقاومة للماء.',
    price: 12000, compareAtPrice: 15000, images: [], status: 'available', stockQuantity: 7,
    sizes: [], colors: ['أسود', 'فضي', 'ذهبي'], sku: 'ACC-003', customDeliveryCost: null, isBestSeller: true
  },
];

// ============ ORDERS ============
export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'o1', storeId: 's1', orderNumber: 'ORD-001', customerName: 'فاطمة بنت أحمد', customerPhone: '23456789', customerCity: 'نواكشوط', customerArea: 'تيارت زمبل',
    deliveryMethod: 'delivery', paymentMethod: 'cash', paymentProof: null, orderNotes: 'يرجى التوصيل بعد الظهر', internalNotes: null,
    status: 'new', paymentStatus: 'unpaid', subtotal: 8500, deliveryFee: 200, total: 8700, source: 'whatsapp',
    items: [
      { id: 'oi1', productName: 'عباية كتان فاخرة', productPrice: 3500, quantity: 1, total: 3500, size: 'L', color: 'أسود' },
      { id: 'oi2', productName: 'حقيبة يد جلدية', productPrice: 5000, quantity: 1, total: 5000, size: null, color: 'بني' },
    ],
    createdAt: '2026-07-04T10:30:00'
  },
  {
    id: 'o2', storeId: 's1', orderNumber: 'ORD-002', customerName: 'مريم محمد', customerPhone: '34567890', customerCity: 'نواكشوط', customerArea: 'لكصر',
    deliveryMethod: 'delivery', paymentMethod: 'manual_transfer', paymentProof: null, orderNotes: null, internalNotes: 'اتصلت ووعدت بالتحويل',
    status: 'contacted', paymentStatus: 'waiting_confirmation', subtotal: 6000, deliveryFee: 200, total: 6200, source: 'instagram',
    items: [
      { id: 'oi3', productName: 'عطر فاخر', productPrice: 6000, quantity: 1, total: 6000, size: '100ml', color: null },
    ],
    createdAt: '2026-07-04T09:15:00'
  },
  {
    id: 'o3', storeId: 's1', orderNumber: 'ORD-003', customerName: 'خديجة ولد عبد الله', customerPhone: '45678901', customerCity: 'نواكشوط', customerArea: 'العيون',
    deliveryMethod: 'delivery', paymentMethod: 'cash', paymentProof: null, orderNotes: 'المنزل بجانب المسجد الكبير', internalNotes: null,
    status: 'paid', paymentStatus: 'paid', subtotal: 1200, deliveryFee: 200, total: 1400, source: 'direct',
    items: [
      { id: 'oi4', productName: 'طرحة حرير', productPrice: 1200, quantity: 1, total: 1200, size: null, color: 'وردي' },
    ],
    createdAt: '2026-07-03T14:00:00'
  },
  {
    id: 'o4', storeId: 's1', orderNumber: 'ORD-004', customerName: 'آمنة محمدو', customerPhone: '56789012', customerCity: 'نواكشوط', customerArea: 'سيدي محمود',
    deliveryMethod: 'pickup', paymentMethod: 'cash', paymentProof: null, orderNotes: null, internalNotes: null,
    status: 'preparing', paymentStatus: 'paid', subtotal: 8000, deliveryFee: 0, total: 8000, source: 'facebook',
    items: [
      { id: 'oi5', productName: 'إكسسوارات ذهبية', productPrice: 8000, quantity: 1, total: 8000, size: null, color: 'ذهبي' },
    ],
    createdAt: '2026-07-03T11:00:00'
  },
  {
    id: 'o5', storeId: 's1', orderNumber: 'ORD-005', customerName: 'زينب بنت محمد', customerPhone: '67890123', customerCity: 'نواكشوط', customerArea: 'تفرغ زينة',
    deliveryMethod: 'delivery', paymentMethod: 'cash', paymentProof: null, orderNotes: null, internalNotes: null,
    status: 'ready_delivery', paymentStatus: 'paid', subtotal: 3500, deliveryFee: 300, total: 3800, source: 'whatsapp',
    items: [
      { id: 'oi6', productName: 'عباية كتان فاخرة', productPrice: 3500, quantity: 1, total: 3500, size: 'M', color: 'بيج' },
    ],
    createdAt: '2026-07-02T16:30:00'
  },
  {
    id: 'o6', storeId: 's1', orderNumber: 'ORD-006', customerName: 'حنّة مولاي', customerPhone: '78901234', customerCity: 'نواكشوط', customerArea: 'لكصر',
    deliveryMethod: 'delivery', paymentMethod: 'manual_transfer', paymentProof: null, orderNotes: null, internalNotes: null,
    status: 'on_the_way', paymentStatus: 'paid', subtotal: 5000, deliveryFee: 200, total: 5200, source: 'friend_referral',
    items: [
      { id: 'oi7', productName: 'حقيبة يد جلدية', productPrice: 5000, quantity: 1, total: 5000, size: null, color: 'أسود' },
    ],
    createdAt: '2026-07-02T10:00:00'
  },
  {
    id: 'o7', storeId: 's1', orderNumber: 'ORD-007', customerName: 'فاطمة بنت أحمد', customerPhone: '23456789', customerCity: 'نواكشوط', customerArea: 'تيارت زمبل',
    deliveryMethod: 'delivery', paymentMethod: 'cash', paymentProof: null, orderNotes: null, internalNotes: null,
    status: 'delivered', paymentStatus: 'paid', subtotal: 9200, deliveryFee: 200, total: 9400, source: 'whatsapp',
    items: [
      { id: 'oi8', productName: 'عباية سوداء كلاسيكية', productPrice: 4200, quantity: 1, total: 4200, size: 'L', color: 'أسود' },
      { id: 'oi9', productName: 'ساعة رجالية', productPrice: 12000, quantity: 1, total: 12000, size: null, color: 'أسود' },
    ],
    createdAt: '2026-06-30T09:00:00'
  },
  {
    id: 'o8', storeId: 's1', orderNumber: 'ORD-008', customerName: 'عائشة بنت المصطفى', customerPhone: '89012345', customerCity: 'نواكشوط', customerArea: 'سنهاجة',
    deliveryMethod: 'delivery', paymentMethod: 'cash', paymentProof: null, orderNotes: null, internalNotes: 'لا يرد على الهاتف',
    status: 'customer_not_responding', paymentStatus: 'unpaid', subtotal: 2500, deliveryFee: 200, total: 2700, source: 'tiktok',
    items: [
      { id: 'oi10', productName: 'نظارات شمسية فاخرة', productPrice: 2500, quantity: 1, total: 2500, size: null, color: 'بني' },
    ],
    createdAt: '2026-07-01T13:00:00'
  },
  {
    id: 'o9', storeId: 's1', orderNumber: 'ORD-009', customerName: 'رشيدة بنت محمد', customerPhone: '90123456', customerCity: 'نواكشوط', customerArea: 'الكفه',
    deliveryMethod: 'delivery', paymentMethod: 'cash', paymentProof: null, orderNotes: null, internalNotes: null,
    status: 'cancelled', paymentStatus: 'unpaid', subtotal: 7500, deliveryFee: 200, total: 7700, source: 'snapchat',
    items: [
      { id: 'oi11', productName: 'عباية مطرزة', productPrice: 7500, quantity: 1, total: 7500, size: 'M', color: 'أبيض' },
    ],
    createdAt: '2026-06-28T15:00:00'
  },
  {
    id: 'o10', storeId: 's1', orderNumber: 'ORD-010', customerName: 'مريم محمد', customerPhone: '34567890', customerCity: 'نواكشوط', customerArea: 'لكصر',
    deliveryMethod: 'delivery', paymentMethod: 'manual_transfer', paymentProof: null, orderNotes: 'طلب ثاني لها - زبونة مميزة', internalNotes: null,
    status: 'waiting_payment', paymentStatus: 'waiting_confirmation', subtotal: 15500, deliveryFee: 200, total: 15700, source: 'instagram',
    items: [
      { id: 'oi12', productName: 'عباية كتان فاخرة', productPrice: 3500, quantity: 2, total: 7000, size: 'L', color: 'أسود' },
      { id: 'oi13', productName: 'حقيبة يد جلدية', productPrice: 5000, quantity: 1, total: 5000, size: null, color: 'عنابي' },
      { id: 'oi14', productName: 'طرحة حرير', productPrice: 1200, quantity: 1, total: 1200, size: null, color: 'أزرق' },
    ],
    createdAt: '2026-07-04T11:00:00'
  },
];

// ============ CUSTOMERS ============
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  { id: 'cu1', storeId: 's1', name: 'فاطمة بنت أحمد', phone: '23456789', city: 'نواكشوط', area: 'تيارت زمبل', status: 'repeat', notes: 'زبونة مميزة تحب الألوان الداكنة', source: 'whatsapp', orderCount: 5, totalPurchases: 28500, lastOrderDate: '2026-07-04', lastContactDate: '2026-07-04', firstOrderDate: '2025-12-20' },
  { id: 'cu2', storeId: 's1', name: 'مريم محمد', phone: '34567890', city: 'نواكشوط', area: 'لكصر', status: 'vip', notes: 'زبونة VIP - طلبات كثيرة ومتكررة', source: 'instagram', orderCount: 12, totalPurchases: 89000, lastOrderDate: '2026-07-04', lastContactDate: '2026-07-04', firstOrderDate: '2025-11-20' },
  { id: 'cu3', storeId: 's1', name: 'خديجة ولد عبد الله', phone: '45678901', city: 'نواكشوط', area: 'العيون', status: 'new', notes: null, source: 'direct', orderCount: 1, totalPurchases: 1400, lastOrderDate: '2026-07-03', lastContactDate: '2026-07-03', firstOrderDate: '2026-07-03' },
  { id: 'cu4', storeId: 's1', name: 'آمنة محمدو', phone: '56789012', city: 'نواكشوط', area: 'سيدي محمود', status: 'repeat', notes: null, source: 'facebook', orderCount: 3, totalPurchases: 15000, lastOrderDate: '2026-07-03', lastContactDate: '2026-07-03', firstOrderDate: '2026-04-10' },
  { id: 'cu5', storeId: 's1', name: 'زينب بنت محمد', phone: '67890123', city: 'نواكشوط', area: 'تفرغ زينة', status: 'new', notes: null, source: 'whatsapp', orderCount: 1, totalPurchases: 3800, lastOrderDate: '2026-07-02', lastContactDate: '2026-07-02', firstOrderDate: '2026-07-02' },
  { id: 'cu6', storeId: 's1', name: 'حنّة مولاي', phone: '78901234', city: 'نواكشوط', area: 'لكصر', status: 'repeat', notes: 'أحبت الحقائب كثيراً', source: 'friend_referral', orderCount: 4, totalPurchases: 22000, lastOrderDate: '2026-07-02', lastContactDate: '2026-07-02', firstOrderDate: '2026-02-15' },
  { id: 'cu7', storeId: 's1', name: 'عائشة بنت المصطفى', phone: '89012345', city: 'نواكشوط', area: 'سنهاجة', status: 'new', notes: 'لا ترد على الهاتف', source: 'tiktok', orderCount: 1, totalPurchases: 0, lastOrderDate: '2026-07-01', lastContactDate: '2026-07-01', firstOrderDate: '2026-07-01' },
  { id: 'cu8', storeId: 's1', name: 'رشيدة بنت محمد', phone: '90123456', city: 'نواكشوط', area: 'الكفه', status: 'inactive', notes: 'ألغت الطلب الأخير', source: 'snapchat', orderCount: 2, totalPurchases: 5000, lastOrderDate: '2026-06-28', lastContactDate: '2026-06-28', firstOrderDate: '2026-05-10' },
];

// ============ CAMPAIGNS ============
export const DEMO_CAMPAIGNS: DemoCampaign[] = [
  { id: 'cm1', storeId: 's1', name: 'عرض رمضان - العبايات', type: 'discount', channel: 'whatsapp', status: 'ended', visits: 1250, orders: 45, customers: 38, revenue: 180000, conversionRate: 3.6, createdAt: '2026-03-01' },
  { id: 'cm2', storeId: 's1', name: 'كوبون الصيف 2026', type: 'coupon', channel: 'instagram', status: 'active', visits: 890, orders: 22, customers: 19, revenue: 95000, conversionRate: 2.5, createdAt: '2026-06-15' },
  { id: 'cm3', storeId: 's1', name: 'إطلاق مجموعة الإكسسوارات', type: 'new_store_launch', channel: 'whatsapp', status: 'active', visits: 560, orders: 15, customers: 12, revenue: 120000, conversionRate: 2.7, createdAt: '2026-06-25' },
  { id: 'cm4', storeId: 's1', name: 'إعادة تنشيط الزبائن القديمين', type: 'reactivation', channel: 'whatsapp', status: 'paused', visits: 320, orders: 8, customers: 7, revenue: 45000, conversionRate: 2.5, createdAt: '2026-06-20' },
  { id: 'cm5', storeId: 's1', name: 'الطلب عبر واتساب - حقائب', type: 'whatsapp_order', channel: 'whatsapp', status: 'active', visits: 210, orders: 10, customers: 9, revenue: 52000, conversionRate: 4.8, createdAt: '2026-07-01' },
];

// ============ COUPONS ============
export const DEMO_COUPONS: DemoCoupon[] = [
  { id: 'cp1', storeId: 's1', code: 'RAMADAN25', discountType: 'percentage', discountValue: 25, usageLimit: 100, usageCount: 45, expiryDate: '2026-04-30', status: 'active' },
  { id: 'cp2', storeId: 's1', code: 'SUMMER500', discountType: 'fixed', discountValue: 500, usageLimit: 50, usageCount: 22, expiryDate: '2026-08-31', status: 'active' },
  { id: 'cp3', storeId: 's1', code: 'VIP10', discountType: 'percentage', discountValue: 10, usageLimit: null, usageCount: 89, expiryDate: null, status: 'active' },
  { id: 'cp4', storeId: 's1', code: 'NEWYEAR', discountType: 'percentage', discountValue: 15, usageLimit: 200, usageCount: 200, expiryDate: '2026-01-31', status: 'inactive' },
];

// ============ DELIVERY ZONES ============
export const DEMO_DELIVERY_ZONES: DemoDeliveryZone[] = [
  { id: 'dz1', storeId: 's1', city: 'نواكشوط', area: 'تيارت زمبل', fee: 200, status: 'active' },
  { id: 'dz2', storeId: 's1', city: 'نواكشوط', area: 'لكصر', fee: 200, status: 'active' },
  { id: 'dz3', storeId: 's1', city: 'نواكشوط', area: 'سيدي محمود', fee: 200, status: 'active' },
  { id: 'dz4', storeId: 's1', city: 'نواكشوط', area: 'العيون', fee: 300, status: 'active' },
  { id: 'dz5', storeId: 's1', city: 'نواكشوط', area: 'تفرغ زينة', fee: 300, status: 'active' },
  { id: 'dz6', storeId: 's1', city: 'نواكشوط', area: 'سنهاجة', fee: 400, status: 'active' },
  { id: 'dz7', storeId: 's1', city: 'نواكشوط', area: 'الكفه', fee: 400, status: 'active' },
  { id: 'dz8', storeId: 's1', city: 'نواكشوط', area: 'أرفد', fee: 500, status: 'active' },
];

// ============ DELIVERY AGENTS ============
export const DEMO_DELIVERY_AGENTS: DemoDeliveryAgent[] = [
  { id: 'da1', storeId: 's1', name: 'محمد ولد إبراهيم', phone: '11223344', status: 'busy', assignedOrders: 3 },
  { id: 'da2', storeId: 's1', name: 'أحمدو بنت محمد', phone: '22334455', status: 'available', assignedOrders: 1 },
  { id: 'da3', storeId: 's1', name: 'سيدي بابا', phone: '33445566', status: 'offline', assignedOrders: 0 },
];

// ============ INVOICES ============
export const DEMO_INVOICES: DemoInvoice[] = [
  { id: 'inv1', storeId: 's1', invoiceNumber: 'INV-2026-001', merchantName: 'فاطمة بنت أحمد', storeName: 'بوتيك النخبة', phone: '22222333', plan: 'احترافي', duration: 'سنوي', amount: 60000, paymentMethod: 'bankily', status: 'paid', createdAt: '2025-11-15', paidAt: '2025-11-15' },
  { id: 'inv2', storeId: 's1', invoiceNumber: 'INV-2026-002', merchantName: 'فاطمة بنت أحمد', storeName: 'بوتيك النخبة', phone: '22222333', plan: 'احترافي', duration: 'شهري', amount: 6000, paymentMethod: 'masrvi', status: 'pending_payment', createdAt: '2026-07-01', paidAt: null },
  { id: 'inv3', storeId: 's2', invoiceNumber: 'INV-2026-003', merchantName: 'عبد الرحمن ولد محمد', storeName: 'عطور الصحراء', phone: '33444555', plan: 'احترافي', duration: 'سنوي', amount: 60000, paymentMethod: 'bankily', status: 'paid', createdAt: '2025-12-01', paidAt: '2025-12-01' },
  { id: 'inv4', storeId: 's3', invoiceNumber: 'INV-2026-004', merchantName: 'يوسف بنت عبد الله', storeName: 'ساعات الأصالة', phone: '44555666', plan: 'أساسي', duration: 'شهري', amount: 3000, paymentMethod: 'cash', status: 'draft', createdAt: '2026-07-04', paidAt: null },
];

// ============ AUTOMATIONS ============
export const DEMO_AUTOMATIONS: DemoAutomation[] = [
  { id: 'au1', storeId: 's1', name: 'رسالة ترحيب بطلب جديد', trigger: 'new_order', action: 'send_whatsapp', isActive: true },
  { id: 'au2', storeId: 's1', name: 'تنبيه الدفع', trigger: 'waiting_payment', action: 'send_whatsapp', isActive: true },
  { id: 'au3', storeId: 's1', name: 'تأكيد الدفع', trigger: 'payment_confirmed', action: 'change_status', isActive: true },
  { id: 'au4', storeId: 's1', name: 'إشعار التوصيل', trigger: 'on_the_way', action: 'send_whatsapp', isActive: true },
  { id: 'au5', storeId: 's1', name: 'شكر بعد التسليم', trigger: 'delivered', action: 'send_whatsapp', isActive: true },
  { id: 'au6', storeId: 's1', name: 'تنبيه انتهاء التجربة', trigger: 'trial_ending', action: 'show_notification', isActive: false },
];

// ============ WHATSAPP TEMPLATES ============
export const WHATSAPP_TEMPLATES: Record<string, string> = {
  new_order: `السلام عليكم {customer_name} 👋\n\nشكراً لطلبك من {store_name}!\n\n📦 رقم الطلب: {order_number}\n💰 المبلغ: {order_total} أوقية\n💳 حالة الدفع: {payment_status}\n\nسنتواصل معك قريباً لتأكيد الطلب.\n\nشكراً لتثقيتك بنا! 🙏`,
  waiting_payment: `السلام عليكم {customer_name} 👋\n\nطلبك رقم {order_number} بانتظار الدفع.\n\n💰 المبلغ المطلوب: {order_total} أوقية\n\nيمكنك الدفع عبر:\n- Bankily: {store_whatsapp}\n- Masrvi: {store_whatsapp}\n\nبمجرد التحويل، أرسل لنا صورة الإيصال.\n\nشكراً! 🙏`,
  payment_confirmed: `السلام عليكم {customer_name} ✅\n\nتم تأكيد استلام دفعك للطلب {order_number}.\n\n📦 طلبك الآن قيد التحضير.\n\nسنبقيك على اطلاع بكل جديد!\n\n{store_name} 🛍️`,
  on_the_way: `السلام عليكم {customer_name} 🚚\n\nطلبك رقم {order_number} في الطريق إليك!\n\n📍 منطقة التوصيل: {delivery_area}\n\nالمندوب سيتم التواصل معك قريباً.\n\n{store_name} 🛍️`,
  delivered: `السلام عليكم {customer_name} 🎉\n\nتم تسليم طلبك رقم {order_number} بنجاح!\n\nنتمنى أن ينال رضاكم.\n\nلأي استفسار لا تترددي في التواصل معنا.\n\n{store_name} 🛍️\n📞 {store_whatsapp}`,
  customer_not_responding: `السلام عليكم {customer_name} 👋\n\nنحاول التواصل معك بخصوص طلبك رقم {order_number}.\n\nيرجى الرد على رسالتنا في أقرب وقت.\n\n{store_name} 📞 {store_whatsapp}`,
};

// ============ ADMIN STATS ============
export const ADMIN_STATS = {
  totalMerchants: 156,
  activeStores: 89,
  trialStores: 34,
  expiredStores: 18,
  suspendedStores: 8,
  pendingPaymentStores: 7,
  totalOrders: 4523,
  totalProducts: 1890,
  totalRevenue: 24650000,
  subscriptionRevenue: 4200000,
  recentStores: DEMO_STORES.slice(0, 5),
  recentPayments: DEMO_INVOICES.slice(0, 4),
};

// ============ MERCHANT DASHBOARD STATS ============
export const MERCHANT_STATS = {
  totalOrders: 156,
  newOrders: 12,
  customers: 89,
  products: 24,
  revenue: 892000,
  activeCampaigns: 3,
  pendingPayments: 5,
  deliveryOrders: 8,
};

// ============ HELPER: Format currency ============
export function formatMRU(amount: number): string {
  return new Intl.NumberFormat('ar-MR').format(amount) + ' أوقية';
}

// ============ CART STATE (client-side) ============
export let cartItems: CartItem[] = [];

export function addToCart(item: CartItem) {
  const existing = cartItems.find(c => c.productId === item.productId && c.size === item.size && c.color === item.color);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cartItems.push({ ...item });
  }
  return cartItems;
}

export function removeFromCart(productId: string, size: string | null, color: string | null) {
  cartItems = cartItems.filter(c => !(c.productId === productId && c.size === size && c.color === color));
  return cartItems;
}

export function updateCartQty(productId: string, size: string | null, color: string | null, qty: number) {
  const item = cartItems.find(c => c.productId === productId && c.size === size && c.color === color);
  if (item) item.quantity = Math.max(1, qty);
  return cartItems;
}

export function clearCart() {
  cartItems = [];
  return cartItems;
}

export function getCartTotal(): number {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
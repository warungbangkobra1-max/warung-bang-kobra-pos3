export type UserRole = 'OWNER' | 'KASIR' | 'DELIVERY' | 'CUSTOMER';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  photoUrl?: string;
  createdAt?: any;
}

export type OrderType = 'BUNGKUS' | 'DELIVERY_DQM';

export type OrderStatus =
  | 'MENUNGGU'
  | 'DIPROSES'
  | 'SIAP_DIAMBIL'
  | 'SIAP_DIANTAR'
  | 'DIANTAR'
  | 'SELESAI'
  | 'DIBATALKAN';

export type PaymentMethod = 'TUNAI' | 'TRANSFER' | 'QRIS' | 'EWALLET';
export type PaymentStatus = 'PENDING' | 'PAID';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
  subtotal: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  transactionNumber: string; // WBK-YYYYMMDD-0001
  customerId?: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  status: OrderStatus;
  
  // Delivery DQM specific fields
  deliveryArea: string | null; // e.g. "Pesantren DQM"
  deliveryLocation: string | null; // e.g. "Asrama Putra - Kamar 12"
  deliveryDetail: string | null; // e.g. "Dekat Masjid"
  deliveryNote: string | null; // e.g. "Antar setelah Maghrib"
  deliveryFee: number;

  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  notes?: string;

  courierId?: string | null;
  courierName?: string | null;

  createdAt: any;
  updatedAt: any;
  createdBy?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  soldCount?: number;
  rating?: number;
  reviewCount?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: any;
  createdAt?: any;
}

export type StockMovementType = 'IN' | 'OUT' | 'SALE' | 'RETURN' | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  currentStock: number;
  notes?: string;
  createdBy?: string;
  createdAt: any;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
  createdBy?: string;
  createdAt: any;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phoneWhatsApp: string;
  logoUrl: string;
  deliveryEnabled: boolean;
  deliveryArea: string;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  printerPaperWidth?: string;
}

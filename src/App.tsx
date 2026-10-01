import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { seedInitialFirestoreData } from './services/seedData';
import { 
  Product, 
  Category, 
  Order, 
  OrderItem, 
  OrderType, 
  OrderStatus, 
  PaymentMethod, 
  StoreSettings, 
  UserRole,
  UserProfile
} from './types';
import { INITIAL_STORE_SETTINGS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './services/seedData';
import { createNewOrder, updateOrderStatus } from './services/orderService';
import { onAuthStateChanged } from 'firebase/auth';
import { subscribeToUserProfile } from './services/authService';

// Layouts & Components
import { SidebarDesktop } from './components/layout/SidebarDesktop';
import { BottomNavMobile } from './components/layout/BottomNavMobile';
import { NavigationHeader } from './components/layout/NavigationHeader';
import { AndroidContainer } from './components/layout/AndroidContainer';
import { AuthModal } from './components/common/AuthModal';
import { BrandLogo } from './components/common/BrandLogo';

// Customer Web Views
import { CustomerHome } from './components/customer/CustomerHome';
import { CustomerCart } from './components/customer/CustomerCart';
import { CustomerCheckout } from './components/customer/CustomerCheckout';
import { OrderSuccess } from './components/customer/OrderSuccess';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CustomerBottomNav } from './components/customer/CustomerBottomNav';

// Admin / POS / Delivery Views
import { PosSystem } from './components/pos/PosSystem';
import { CashierQueue } from './components/pos/CashierQueue';
import { OrderDetailModal } from './components/pos/OrderDetailModal';
import { DeliveryDqmView } from './components/delivery/DeliveryDqmView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductManagement } from './components/admin/ProductManagement';
import { StoreSettingsView } from './components/admin/StoreSettingsView';
import { QrGeneratorView } from './components/admin/QrGeneratorView';
import { ExpensesView } from './components/admin/ExpensesView';
import { ReportsView } from './components/admin/ReportsView';
import { Expense } from './types';
import { addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { soundEffects } from './utils/soundEffects';
import { ThermalReceipt } from './components/common/ThermalReceipt';
import { HelpSupportModal } from './components/common/HelpSupportModal';

export default function App() {
  // App Mode: 'admin' (Desktop POS/Dashboard) | 'android' (Mobile App Compose) | 'customer' (Mobile-first web customer)
  const [appMode, setAppMode] = useState<'admin' | 'android' | 'customer'>('admin');
  
  // Role switcher for testing & permissions: OWNER, KASIR, DELIVERY
  const [userRole, setUserRole] = useState<UserRole>('OWNER');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Firestore Data State with immediate rich defaults
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  // Admin Navigation Tab
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const pageTitleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    pos: 'Kasir POS',
    antrian: 'Pesanan',
    'delivery-dqm': 'Delivery DQM',
    produk: 'Produk',
    kategori: 'Kategori',
    stok: 'Stok',
    pelanggan: 'Pelanggan',
    pengeluaran: 'Pengeluaran',
    laporan: 'Laporan',
    pengguna: 'Pengguna',
    'qr-code': 'QR Code',
    pengaturan: 'Pengaturan'
  };

  // Customer Mobile Navigation Tab: 'home' | 'menu' | 'cart' | 'orders' | 'profile'
  const [customerTab, setCustomerTab] = useState<'home' | 'menu' | 'cart' | 'orders' | 'profile'>('home');
  const [customerCategory, setCustomerCategory] = useState<string>('all');
  
  // Customer Cart & Checkout
  const [customerCart, setCustomerCart] = useState<OrderItem[]>([]);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCustomerCheckingOut, setIsCustomerCheckingOut] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('BUNGKUS');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Modal View
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  // 1. Initial Firestore Seeding & Realtime Listeners
  useEffect(() => {
    // Seed sample menu if database is newly initialized
    seedInitialFirestoreData().catch(console.warn);

    // Listen to Categories
    const unsubCat = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => cats.push({ id: doc.id, ...doc.data() } as Category));
      cats.sort((a, b) => a.order - b.order);
      if (cats.length > 0) {
        setCategories(cats);
      }
    }, (err) => {
      console.warn("Categories listener:", err.message);
    });

    // Listen to Products
    const unsubProd = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      if (prods.length > 0) {
        setProducts(prods);
      }
    }, (err) => {
      console.warn("Products listener:", err.message);
    });

    // Listen to Orders (Realtime sync for Kasir, Delivery DQM, and Customer)
    let isFirstOrdersLoad = true;
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => ords.push({ id: doc.id, ...doc.data() } as Order));
      
      // Play melodic chime on newly incoming order (ignore initial snapshot load)
      if (!isFirstOrdersLoad && snapshot.docChanges().some(c => c.type === 'added')) {
        soundEffects.playNewOrderNotification();
      }
      isFirstOrdersLoad = false;
      setOrders(ords);
    }, (err) => {
      console.warn("Orders listener:", err.message);
    });

    // Listen to Store Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'store'), (docSnap) => {
      if (docSnap.exists()) {
        setStoreSettings(docSnap.data() as StoreSettings);
      }
    }, (err) => {
      console.warn("Settings listener:", err.message);
    });

    // Listen to Expenses
    const qExpenses = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const expList: Expense[] = [];
      snapshot.forEach((doc) => expList.push({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(expList);
    }, (err) => {
      console.warn("Expenses listener:", err.message);
    });

    // Listen to Firebase Auth state
    let unsubProfile: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        if (unsubProfile) unsubProfile();
        unsubProfile = subscribeToUserProfile(fbUser.uid, (profile) => {
          if (profile) {
            setCurrentUser(profile);
            setUserRole(profile.role);
          } else {
            setCurrentUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Pengguna WBK',
              role: 'OWNER',
            });
          }
        });
      } else {
        if (unsubProfile) unsubProfile();
        setCurrentUser(null);
      }
    });

    return () => {
      unsubCat();
      unsubProd();
      unsubOrders();
      unsubSettings();
      unsubExpenses();
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // Customer Cart Handlers
  const handleAddToCart = (product: Product, qty: number = 1, notes: string = '') => {
    setCustomerCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.notes === notes);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.notes === notes
            ? { ...i, qty: i.qty + qty, subtotal: (i.qty + qty) * i.price }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          notes,
          subtotal: product.price * qty,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCustomerCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty, subtotal: newQty * item.price } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCustomerCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Submit Order from Customer Web
  const handleCustomerSubmitOrder = async (details: {
    orderType: OrderType;
    customerName: string;
    customerPhone: string;
    deliveryArea: string | null;
    deliveryLocation: string | null;
    deliveryDetail: string | null;
    deliveryNote: string | null;
    deliveryFee: number;
    paymentMethod: PaymentMethod;
  }) => {
    try {
      setIsSubmittingOrder(true);
      const subtotal = customerCart.reduce((sum, item) => sum + item.subtotal, 0);
      const total = subtotal + details.deliveryFee;

      const newOrder = await createNewOrder({
        customerName: details.customerName,
        customerPhone: details.customerPhone,
        orderType: details.orderType,
        status: 'MENUNGGU',
        deliveryArea: details.deliveryArea,
        deliveryLocation: details.deliveryLocation,
        deliveryDetail: details.deliveryDetail,
        deliveryNote: details.deliveryNote,
        deliveryFee: details.deliveryFee,
        items: customerCart,
        itemCount: customerCart.reduce((sum, i) => sum + i.qty, 0),
        subtotal,
        discount: 0,
        tax: 0,
        total,
        paymentMethod: details.paymentMethod,
        paymentStatus: details.paymentMethod === 'TUNAI' ? 'PENDING' : 'PAID',
      });

      setLastPlacedOrder(newOrder);
      soundEffects.playNewOrderNotification();
      setCustomerCart([]);
      setIsCustomerCheckingOut(false);
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Submit Order from Kasir POS
  const handlePosSubmitOrder = async (orderData: {
    orderType: OrderType;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    notes?: string;
  }) => {
    try {
      setIsSubmittingOrder(true);
      const created = await createNewOrder({
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        orderType: orderData.orderType,
        status: 'MENUNGGU',
        deliveryArea: orderData.orderType === 'DELIVERY_DQM' ? 'Pesantren DQM' : null,
        deliveryLocation: orderData.orderType === 'DELIVERY_DQM' ? 'Asrama Putra - Gedung A' : null,
        deliveryDetail: null,
        deliveryNote: orderData.notes || null,
        deliveryFee: 0,
        items: orderData.items,
        itemCount: orderData.items.reduce((s, i) => s + i.qty, 0),
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        tax: orderData.tax,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'PAID',
        notes: orderData.notes,
      });
      setSelectedAdminOrder(created);
      soundEffects.playCashRegister();
    } catch (err) {
      console.error('Error submitting POS order:', err);
      alert('Gagal memproses transaksi kasir.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Order status progression
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      // Update local state if modal is open
      if (selectedAdminOrder && selectedAdminOrder.id === orderId) {
        setSelectedAdminOrder({ ...selectedAdminOrder, status });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Expense management handlers
  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Gagal mencatat pengeluaran.');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Yakin ingin menghapus catatan pengeluaran ini?')) return;
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  // Count active queues
  const activeOrderCount = orders.filter(
    (o) => o.status === 'MENUNGGU' || o.status === 'DIPROSES' || o.status === 'SIAP_DIAMBIL' || o.status === 'SIAP_DIANTAR'
  ).length;

  const deliveryDqmCount = orders.filter(
    (o) => o.orderType === 'DELIVERY_DQM' && (o.status === 'SIAP_DIANTAR' || o.status === 'DIANTAR')
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased select-none flex flex-col">
      {/* Top Universal Platform Navigation Bar */}
      <NavigationHeader
        appMode={appMode}
        onChangeAppMode={(mode) => {
          setAppMode(mode);
          if (mode === 'customer') {
            setLastPlacedOrder(null);
            setIsCustomerCheckingOut(false);
          }
        }}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        activeOrdersCount={activeOrderCount}
        deliveryCount={deliveryDqmCount}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        activePageTitle={pageTitleMap[adminTab] || 'Dashboard'}
      />

      {/* ========================================================================= */}
      {/* PLATFORM 1: ANDROID APP (Jetpack Compose Layout in Phone Mockup)           */}
      {/* ========================================================================= */}
      {appMode === 'android' && (
        <AndroidContainer
          userRole={userRole}
          products={products}
          categories={categories}
          orders={orders}
          onSelectOrder={setSelectedAdminOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSubmitPosOrder={handlePosSubmitOrder}
          isSubmittingPos={isSubmittingOrder}
          storeSettings={storeSettings}
          onUpdateStoreSettings={setStoreSettings}
          onOpenCustomerView={() => setAppMode('customer')}
        />
      )}

      {/* ========================================================================= */}
      {/* PLATFORM 2: WEB ADMIN & KASIR (Desktop Layout with Left Sidebar)           */}
      {/* ========================================================================= */}
      {appMode === 'admin' && (
        <div className="flex h-[calc(100dvh-60px)] overflow-hidden relative">
          <SidebarDesktop
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            userRole={userRole}
            onSwitchRole={setUserRole}
            onOpenCustomerView={() => setAppMode('customer')}
            activeOrderCount={activeOrderCount}
            deliveryCount={deliveryDqmCount}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isCollapsed={isDesktopSidebarCollapsed}
            onToggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
          />

          <main className="flex-1 overflow-y-auto bg-slate-50 w-full pb-16 lg:pb-0">
            {adminTab === 'dashboard' && (
              <AdminDashboard
                orders={orders}
                products={products}
                onSelectOrder={setSelectedAdminOrder}
                onGoToTab={setAdminTab}
              />
            )}

            {adminTab === 'pos' && (
              <PosSystem
                products={products}
                categories={categories}
                onSubmitPosOrder={handlePosSubmitOrder}
                isSubmitting={isSubmittingOrder}
              />
            )}

            {adminTab === 'antrian' && (
              <CashierQueue
                orders={orders}
                onSelectOrder={setSelectedAdminOrder}
                onUpdateStatus={handleUpdateOrderStatus}
                userRole={userRole}
              />
            )}

            {adminTab === 'delivery-dqm' && (
              <DeliveryDqmView
                orders={orders}
                onSelectOrder={setSelectedAdminOrder}
                onUpdateStatus={handleUpdateOrderStatus}
                storePhone={storeSettings.phoneWhatsApp}
                userRole={userRole}
              />
            )}

            {adminTab === 'produk' && (
              <ProductManagement products={products} categories={categories} />
            )}

            {adminTab === 'kategori' && (
              <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900">Kategori Menu</h2>
                  <span className="text-xs text-slate-500 font-semibold">{categories.length} Kategori Aktif</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                      <div className="font-bold text-slate-900 text-sm">{cat.name}</div>
                      <div className="text-xs text-slate-400">Kode: {cat.slug}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'stok' && (
              <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900">Monitor Stok Realtime</h2>
                  <span className="text-xs text-slate-500 font-semibold">{products.length} Menu</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Nama Produk</th>
                        <th className="py-3 px-4">Sisa Stok</th>
                        <th className="py-3 px-4">Batas Minimum</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">{p.name}</td>
                          <td className="py-3 px-4 font-mono font-bold text-red-600">{p.stock} {p.unit}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{p.minimumStock} {p.unit}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              p.stock <= p.minimumStock ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {p.stock <= p.minimumStock ? 'Menipis' : 'Aman'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'pelanggan' && (
              <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Daftar Pelanggan Warung Bang Kobra</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {orders.slice(0, 8).map((o, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{o.customerName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{o.customerPhone}</div>
                      </div>
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                        {o.orderType === 'DELIVERY_DQM' ? 'Delivery DQM' : 'Bungkus'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'pengeluaran' && (
              <ExpensesView
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {adminTab === 'laporan' && (
              <ReportsView
                orders={orders}
                expenses={expenses}
              />
            )}

            {adminTab === 'pengguna' && (
              <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Manajemen Pengguna & Hak Akses</h2>
                    <p className="text-xs text-slate-500">Kelola akun kasir, kurir DQM, dan owner warung</p>
                  </div>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm hover:bg-red-700 transition"
                  >
                    + Kelola Akun
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-extrabold text-base">
                      {currentUser ? currentUser.displayName[0] : 'O'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{currentUser ? currentUser.displayName : 'Owner Warung Bang Kobra'}</div>
                      <div className="text-xs text-slate-500">{currentUser ? currentUser.email : 'warungbangkobra1@gmail.com'}</div>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        Peran Aktif: {userRole}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 space-y-2">
                    <div className="font-semibold text-slate-800">Tingkatan Hak Akses Warung:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="font-bold text-slate-900">1. OWNER</div>
                        <div className="text-[11px] text-slate-500 mt-1">Akses penuh ke semua laporan omzet, laba, pengaturan toko, stok, dan kasir.</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="font-bold text-slate-900">2. KASIR</div>
                        <div className="text-[11px] text-slate-500 mt-1">Khusus operasional transaksi POS, cetak struk thermal, dan antrian pesanan.</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="font-bold text-slate-900">3. DELIVERY DQM</div>
                        <div className="text-[11px] text-slate-500 mt-1">Khusus kurir pengantaran pesanan santri & santriwati di Pesantren DQM.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'qr-code' && (
              <QrGeneratorView onOpenCustomerView={() => setAppMode('customer')} />
            )}

            {adminTab === 'pengaturan' && (
              <StoreSettingsView settings={storeSettings} onUpdateSettings={setStoreSettings} />
            )}
          </main>

          {/* Mobile Bottom Navigation for Admin / POS (< lg screens) */}
          <BottomNavMobile
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            activeOrderCount={activeOrderCount}
            onToggleDrawer={() => setIsMobileSidebarOpen(true)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CUSTOMER WEB PLATFORM (Mobile-First for Santri & Pelanggan via QR)    */}
      {/* ========================================================================= */}
      {appMode === 'customer' && (
        <div className="min-h-screen bg-black max-w-md mx-auto relative shadow-2xl border-x border-zinc-900">
          {/* Order Placed Success View */}
          {lastPlacedOrder ? (
            <OrderSuccess
              order={lastPlacedOrder}
              onViewOrderDetails={() => {
                setSelectedAdminOrder(lastPlacedOrder);
                setAppMode('admin');
                setAdminTab('antrian');
              }}
              onBackToHome={() => {
                setLastPlacedOrder(null);
                setCustomerTab('home');
              }}
              storePhone={storeSettings.phoneWhatsApp}
            />
          ) : isCustomerCheckingOut ? (
            <CustomerCheckout
              items={customerCart}
              defaultOrderType={selectedOrderType}
              storeSettings={storeSettings}
              onBack={() => setIsCustomerCheckingOut(false)}
              onSubmitOrder={handleCustomerSubmitOrder}
              isSubmitting={isSubmittingOrder}
            />
          ) : (
            <>
              {customerTab === 'home' && (
                <CustomerHome
                  categories={categories}
                  products={products}
                  selectedCategory={customerCategory}
                  onSelectCategory={setCustomerCategory}
                  onSelectOrderType={(type) => {
                    setSelectedOrderType(type);
                    setCustomerTab('menu');
                  }}
                  onProductClick={setSelectedProductDetail}
                  onAddToCart={handleAddToCart}
                  onGoToMenu={() => setCustomerTab('menu')}
                  cartCount={customerCart.reduce((s, i) => s + i.qty, 0)}
                />
              )}

              {customerTab === 'menu' && (
                <div className="pb-24 pt-3 px-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-white">Daftar Menu Pilihan</h2>
                      <p className="text-xs text-zinc-400">Warung Bang Kobra</p>
                    </div>
                    <span className="text-xs font-bold text-red-500 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800">
                      {selectedOrderType === 'DELIVERY_DQM' ? '🛵 DELIVERY DQM' : '🛍️ BUNGKUS'}
                    </span>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setCustomerCategory('all')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        customerCategory === 'all' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Semua
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCustomerCategory(c.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
                          customerCategory === c.id ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>

                  {/* Product Cards */}
                  <div className="space-y-3">
                    {products
                      .filter((p) => customerCategory === 'all' || p.categoryId === customerCategory)
                      .map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProductDetail(prod)}
                          className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3 cursor-pointer"
                        >
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-16 h-16 rounded-xl object-cover bg-zinc-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-white">{prod.name}</h4>
                            <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{prod.description}</p>
                            <div className="text-xs font-black text-red-500 mt-1">
                              Rp {prod.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(prod);
                            }}
                            className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {customerTab === 'cart' && (
                <CustomerCart
                  items={customerCart}
                  onUpdateQty={handleUpdateCartQty}
                  onRemoveItem={handleRemoveCartItem}
                  onProceedCheckout={() => setIsCustomerCheckingOut(true)}
                  onContinueShopping={() => setCustomerTab('menu')}
                />
              )}

              {customerTab === 'orders' && (
                <div className="pb-24 pt-3 px-4 space-y-3">
                  <h2 className="text-base font-black text-white">Status Pesanan Terakhir</h2>
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-white">{ord.transactionNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {ord.orderType === 'DELIVERY_DQM' ? '🛵 Antar ke ' + ord.deliveryLocation : '🛍️ Bungkus di Warung'}
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-800/60 font-black text-red-400">
                        <span>Total:</span>
                        <span>Rp {ord.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {customerTab === 'profile' && (
                <div className="pb-24 pt-4 px-4 space-y-4 text-center">
                  <BrandLogo size="lg" className="justify-center" />
                  <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-xs space-y-2 text-left">
                    <div className="font-bold text-white">Kontak Warung Bang Kobra</div>
                    <div className="text-zinc-400">WhatsApp: {storeSettings.phoneWhatsApp}</div>
                    <div className="text-zinc-400">Area Delivery: Pesantren DQM</div>
                    <div className="text-zinc-400">Ongkir DQM: Rp {storeSettings.deliveryFee.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation on Mobile */}
              <CustomerBottomNav
                currentTab={customerTab}
                onSelectTab={setCustomerTab}
                cartCount={customerCart.reduce((s, i) => s + i.qty, 0)}
                activeOrderCount={activeOrderCount}
              />
            </>
          )}

          {/* Product Detail Modal */}
          {selectedProductDetail && (
            <ProductDetailModal
              product={selectedProductDetail}
              onClose={() => setSelectedProductDetail(null)}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      )}

      {/* Global Order Detail Modal (for Kasir, Kurir, and Owner) */}
      {selectedAdminOrder && (
        <OrderDetailModal
          order={selectedAdminOrder}
          onClose={() => setSelectedAdminOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
          storePhone={storeSettings.phoneWhatsApp}
          userRole={userRole}
        />
      )}

      {/* Auth Modal for Role & Firebase Auth (Phase 3) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={(profile) => {
          setCurrentUser(profile);
          if (profile) {
            setUserRole(profile.role);
          }
        }}
      />

      {/* Help & SOP Modal (Phase 13) */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        storePhone={storeSettings.phoneWhatsApp}
      />

      {/* Hidden 58mm/80mm Thermal Receipt (Rendered only during print) */}
      <ThermalReceipt
        order={selectedAdminOrder || lastPlacedOrder}
        storeName={storeSettings.storeName}
        storeAddress={storeSettings.deliveryArea || 'Kawasan Pesantren DQM'}
        storePhone={storeSettings.phoneWhatsApp}
      />
    </div>
  );
}

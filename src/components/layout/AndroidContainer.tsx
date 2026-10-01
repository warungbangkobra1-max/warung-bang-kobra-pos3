import React, { useState } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Signal, 
  Home, 
  Receipt, 
  ListOrdered, 
  Bike, 
  UtensilsCrossed, 
  Boxes, 
  Settings,
  ChevronLeft,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { UserRole, Product, Category, Order, OrderStatus } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { CashierQueue } from '../pos/CashierQueue';
import { DeliveryDqmView } from '../delivery/DeliveryDqmView';
import { PosSystem } from '../pos/PosSystem';
import { ProductManagement } from '../admin/ProductManagement';
import { StoreSettingsView } from '../admin/StoreSettingsView';
import { formatRupiah } from '../../utils/formatters';

interface AndroidContainerProps {
  userRole: UserRole;
  products: Product[];
  categories: Category[];
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onSubmitPosOrder: (order: any) => Promise<void>;
  isSubmittingPos: boolean;
  storeSettings: any;
  onUpdateStoreSettings: (newSettings: any) => void;
  onOpenCustomerView: () => void;
}

export const AndroidContainer: React.FC<AndroidContainerProps> = ({
  userRole,
  products,
  categories,
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  onSubmitPosOrder,
  isSubmittingPos,
  storeSettings,
  onUpdateStoreSettings,
  onOpenCustomerView,
}) => {
  // Android Jetpack Compose Tab Navigation Simulation
  // Tabs: 'home' | 'pos' | 'orders' | 'delivery' | 'inventory' | 'settings'
  const [androidTab, setAndroidTab] = useState<'home' | 'pos' | 'orders' | 'delivery' | 'inventory' | 'settings'>('home');

  const [isFrameMode, setIsFrameMode] = useState<boolean>(false);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'MENUNGGU' || o.status === 'DIPROSES' || o.status === 'SIAP_DIAMBIL' || o.status === 'SIAP_DIANTAR'
  ).length;

  const dqmOrdersCount = orders.filter(
    (o) => o.orderType === 'DELIVERY_DQM' && (o.status === 'SIAP_DIANTAR' || o.status === 'DIANTAR')
  ).length;

  const totalTodayRevenue = orders.reduce((sum, o) => sum + (o.status !== 'DIBATALKAN' ? o.total : 0), 0);

  return (
    <div className={`flex justify-center items-start min-h-[calc(100dvh-56px)] bg-zinc-950 ${
      isFrameMode ? 'py-4 px-2' : ''
    }`}>
      {/* Container: Either Realistic Phone Frame or Seamless Responsive App */}
      <div className={`w-full bg-black flex flex-col relative ${
        isFrameMode 
          ? 'max-w-[390px] h-[844px] rounded-[48px] border-[6px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(220,38,38,0.2)] overflow-hidden ring-1 ring-zinc-700/50 my-auto'
          : 'max-w-2xl min-h-[calc(100dvh-56px)] border-x border-zinc-800/70 shadow-2xl pb-16'
      }`}>
        
        {/* Status Bar: Shown only in Frame Mode or compact on responsive */}
        {isFrameMode ? (
          <div className="h-10 bg-black flex items-center justify-between px-6 shrink-0 text-[11px] text-white font-medium select-none z-40">
            <span>9:41</span>
            <div className="w-20 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>
        ) : null}

        {/* Android App Bar */}
        <div className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showText={false} />
            <div>
              <div className="font-extrabold text-xs text-white leading-tight">WARUNG BANG KOBRA</div>
              <div className="text-[9px] text-red-500 font-bold uppercase tracking-wider">
                Android POS & Delivery
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFrameMode(!isFrameMode)}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
              title="Ganti Mode Tampilan (Layar Penuh / Frame HP)"
            >
              {isFrameMode ? '📱 Layar Pas' : '📲 Frame HP'}
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/50">
              {userRole}
            </span>
          </div>
        </div>

        {/* Android Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 scrollbar-none pb-24">
          {/* 1. ANDROID HOME DASHBOARD (Like Reference item #2 & #21) */}
          {androidTab === 'home' && (
            <div className="p-4 space-y-4">
              {/* Daily Sales Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-red-950 via-zinc-900 to-black border border-red-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Penjualan Hari Ini</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full">
                    Live Realtime
                  </span>
                </div>
                <div className="text-2xl font-black text-white">
                  {formatRupiah(totalTodayRevenue || 1250000)}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Total Pesanan</span>
                    <span className="font-bold text-white">{orders.length} Transaksi</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Delivery DQM</span>
                    <span className="font-bold text-purple-400">
                      {orders.filter(o => o.orderType === 'DELIVERY_DQM').length} Antaran
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid (Quick Menu: Kasir, Antrian, Delivery DQM, Stok) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300">Menu Cepat</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setAndroidTab('pos')}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-left flex flex-col justify-between transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Kasir POS</div>
                      <div className="text-[10px] text-zinc-400">Input transaksi baru</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAndroidTab('orders')}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-left flex flex-col justify-between transition group relative"
                  >
                    {activeOrdersCount > 0 && (
                      <span className="absolute top-3 right-3 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                        {activeOrdersCount}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <ListOrdered className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Antrian Pesanan</div>
                      <div className="text-[10px] text-zinc-400">Proses Bungkus & DQM</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAndroidTab('delivery')}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-left flex flex-col justify-between transition group relative"
                  >
                    {dqmOrdersCount > 0 && (
                      <span className="absolute top-3 right-3 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-purple-600 text-white">
                        {dqmOrdersCount}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Delivery DQM</div>
                      <div className="text-[10px] text-zinc-400">Asrama & Komplek DQM</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAndroidTab('inventory')}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-left flex flex-col justify-between transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Stok Produk</div>
                      <div className="text-[10px] text-zinc-400">{products.length} menu aktif</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Latest Realtime Orders preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300">Antrian Masuk</span>
                  <button onClick={() => setAndroidTab('orders')} className="text-red-400 font-semibold">
                    Lihat Semua
                  </button>
                </div>
                <div className="space-y-2">
                  {orders.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      onClick={() => onSelectOrder(o)}
                      className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs cursor-pointer hover:border-zinc-700"
                    >
                      <div>
                        <div className="font-mono font-bold text-white">{o.transactionNumber}</div>
                        <div className="text-[10px] text-zinc-400">
                          {o.customerName} • {o.orderType}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-red-400">{formatRupiah(o.total)}</div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ANDROID KASIR POS */}
          {androidTab === 'pos' && (
            <div className="p-3">
              <PosSystem
                products={products}
                categories={categories}
                onSubmitPosOrder={onSubmitPosOrder}
                isSubmitting={isSubmittingPos}
              />
            </div>
          )}

          {/* 3. ANDROID ANTRIAN KASIR */}
          {androidTab === 'orders' && (
            <div className="p-2">
              <CashierQueue
                orders={orders}
                onSelectOrder={onSelectOrder}
                onUpdateStatus={onUpdateOrderStatus}
                userRole={userRole}
              />
            </div>
          )}

          {/* 4. ANDROID DELIVERY DQM DASHBOARD */}
          {androidTab === 'delivery' && (
            <div className="p-2">
              <DeliveryDqmView
                orders={orders}
                onSelectOrder={onSelectOrder}
                onUpdateStatus={onUpdateOrderStatus}
                storePhone={storeSettings.phoneWhatsApp}
                userRole={userRole}
              />
            </div>
          )}

          {/* 5. ANDROID INVENTORY / STOK */}
          {androidTab === 'inventory' && (
            <div className="p-3">
              <ProductManagement products={products} categories={categories} />
            </div>
          )}

          {/* 6. ANDROID SETTINGS */}
          {androidTab === 'settings' && (
            <div className="p-3">
              <StoreSettingsView settings={storeSettings} onUpdateSettings={onUpdateStoreSettings} />
            </div>
          )}
        </div>

        {/* Android Material 3 Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-3 flex items-center justify-around z-40 select-none">
          {[
            { id: 'home' as const, label: 'Beranda', icon: Home },
            { id: 'pos' as const, label: 'Kasir', icon: Receipt },
            { id: 'orders' as const, label: 'Pesanan', icon: ListOrdered, badge: activeOrdersCount },
            { id: 'delivery' as const, label: 'Delivery', icon: Bike, badge: dqmOrdersCount },
            { id: 'inventory' as const, label: 'Produk', icon: UtensilsCrossed },
            { id: 'settings' as const, label: 'Setelan', icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = androidTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setAndroidTab(t.id)}
                className={`flex flex-col items-center justify-center relative py-1 px-1.5 transition-all ${
                  isActive ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
                  {t.badge !== undefined && t.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-zinc-950">
                      {t.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] mt-0.5">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Android Home Indicator Bar */}
        <div className="h-4 bg-zinc-950 flex items-center justify-center shrink-0 z-50">
          <div className="w-32 h-1 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Signal, 
  Home, 
  Receipt, 
  ListOrdered, 
  Boxes, 
  FileBarChart,
  Settings,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  User,
  ShoppingBag,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock,
  Phone,
  Calendar,
  AlertTriangle,
  QrCode,
  DollarSign,
  CreditCard,
  Building
} from 'lucide-react';
import { Product, Category, Order, OrderStatus } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface AndroidGalleryOverviewProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onSubmitPosOrder: (order: any) => Promise<void>;
  isSubmittingPos: boolean;
  storeSettings: any;
}

export const AndroidGalleryOverview: React.FC<AndroidGalleryOverviewProps> = ({
  products,
  categories,
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  onSubmitPosOrder,
  isSubmittingPos,
  storeSettings,
}) => {
  // Screen selector
  const [activeScreen, setActiveScreen] = useState<
    'login' | 'dashboard' | 'pos' | 'antrian' | 'detail' | 'stok' | 'laporan' | 'pengaturan'
  >('dashboard');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [antrianFilter, setAntrianFilter] = useState<'Semua' | 'Menunggu' | 'Diproses' | 'Siap'>('Semua');

  // Sample order for Detail Pesanan screen (like screen 5)
  const detailOrder: Order = orders[0] || {
    id: 'demo-1',
    transactionNumber: 'WBK-20250926-0002',
    customerName: 'Ahmad',
    customerPhone: '08xxxxxxxxxx',
    orderType: 'DELIVERY_DQM',
    status: 'DIPROSES',
    deliveryArea: 'Pesantren DQM',
    deliveryLocation: 'Asrama Putra - Kamar 12',
    deliveryDetail: 'Gedung Asrama',
    deliveryNote: 'Antar setelah Maghrib',
    deliveryFee: 0,
    items: [
      { productId: '1', name: 'Nasi Ayam Geprek', price: 15000, qty: 1, subtotal: 15000 },
      { productId: '2', name: 'Es Teh Manis', price: 5000, qty: 1, subtotal: 5000 },
      { productId: '3', name: 'Kentang Goreng', price: 12000, qty: 1, subtotal: 12000 },
    ],
    itemCount: 3,
    subtotal: 42000,
    discount: 0,
    tax: 0,
    total: 42000,
    paymentMethod: 'QRIS',
    paymentStatus: 'PAID',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const screens = [
    { id: 'login', label: '1. Login' },
    { id: 'dashboard', label: '2. Dashboard' },
    { id: 'pos', label: '3. Kasir / POS' },
    { id: 'antrian', label: '4. Antrian Kasir' },
    { id: 'detail', label: '5. Detail Pesanan' },
    { id: 'stok', label: '6. Stok Produk' },
    { id: 'laporan', label: '7. Laporan' },
    { id: 'pengaturan', label: '8. Pengaturan' },
  ];

  return (
    <div className="py-6 px-4 flex flex-col items-center min-h-[calc(100vh-60px)] bg-zinc-950">
      {/* Screen Quick Selector Tabs (matches image 8 screen flow) */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-3 mb-4 scrollbar-none">
        {screens.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScreen(s.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeScreen === s.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Android Device Mockup Frame matching the user diagram */}
      <div className="w-full max-w-[375px] h-[780px] bg-black rounded-[42px] border-[5px] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative ring-1 ring-zinc-700/40">
        
        {/* Status Bar */}
        <div className="h-7 bg-black flex items-center justify-between px-6 shrink-0 text-[10px] text-zinc-300 font-medium select-none z-30">
          <span>10:00</span>
          <div className="w-16 h-3.5 bg-zinc-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-zinc-950" />
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3 h-3 text-zinc-200" />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 1: LOGIN (Image #1)                                    */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'login' && (
          <div className="flex-1 bg-white text-zinc-900 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="pt-8 flex flex-col items-center text-center space-y-4">
              {/* Official Cobra Logo & Badge from prompt image */}
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                  <path d="M50 8 C30 8 18 22 18 38 C18 52 28 62 38 68 C38 78 32 85 24 90 C45 92 62 82 62 68 C72 62 82 52 82 38 C82 22 70 8 50 8 Z" fill="#DC2626" />
                  <path d="M50 16 C38 16 30 26 30 38 C30 48 38 56 46 60 L50 92 L54 60 C62 56 70 48 70 38 C70 26 62 16 50 16 Z" fill="#18181B" />
                  <circle cx="42" cy="34" r="3.5" fill="#EF4444" />
                  <circle cx="58" cy="34" r="3.5" fill="#EF4444" />
                  <path d="M47 48 L50 56 L53 48 Z" fill="#F8FAFC" />
                  <path d="M49 56 L47 62 M51 56 L53 62" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-black text-red-600 tracking-wider">WARUNG BANG KOBRA</h1>
                <p className="text-[10px] text-zinc-500 font-semibold tracking-widest mt-0.5">EST. 2024</p>
              </div>

              {/* Login Form Fields */}
              <div className="w-full space-y-3 pt-4 text-left">
                <div>
                  <input
                    type="text"
                    defaultValue="warungbangkobra1@gmail.com"
                    placeholder="Email / No. WhatsApp"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs bg-zinc-50 text-zinc-800 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    placeholder="Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs bg-zinc-50 text-zinc-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  onClick={() => setActiveScreen('dashboard')}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition mt-2"
                >
                  Login
                </button>

                <div className="text-center pt-1">
                  <a href="#forgot" className="text-[11px] text-red-600 hover:underline">
                    Lupa password?
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center pb-4">
              <span className="text-[11px] font-bold text-zinc-700">Warung Bang Kobra</span>
              <p className="text-[9px] text-zinc-400">Mudah • Cepat • Terpercaya</p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 2: DASHBOARD (Image #2)                                */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'dashboard' && (
          <div className="flex-1 bg-zinc-50 text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Red Header Bar */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 p-1 flex items-center justify-center">
                    <span className="font-black text-xs">🐍</span>
                  </div>
                  <span className="font-black text-xs tracking-wider">WARUNG BANG KOBRA</span>
                </div>
                <button className="text-white hover:opacity-80">
                  <Receipt className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content */}
              <div className="p-4 space-y-3.5">
                {/* Penjualan Hari Ini Card */}
                <div className="bg-zinc-900 text-white p-3.5 rounded-2xl shadow-sm space-y-1 relative">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Penjualan Hari Ini</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                      +12%
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">Rp 1.250.000</div>
                </div>

                {/* 2 Stats Cards (Transaksi & Pesanan) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-sm">
                    <span className="text-[10px] text-zinc-500 block">Transaksi</span>
                    <span className="text-base font-black text-zinc-800">12</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-sm">
                    <span className="text-[10px] text-zinc-500 block">Pesanan</span>
                    <span className="text-base font-black text-zinc-800">25</span>
                  </div>
                </div>

                {/* 4 Icon Action Shortcuts: Produk, Stok, Pelanggan, Laporan */}
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <button onClick={() => setActiveScreen('pos')} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-700 mt-1">Produk</span>
                  </button>

                  <button onClick={() => setActiveScreen('stok')} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-700 mt-1">Stok</span>
                  </button>

                  <button onClick={() => setActiveScreen('antrian')} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-700 mt-1">Pelanggan</span>
                  </button>

                  <button onClick={() => setActiveScreen('laporan')} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                      <FileBarChart className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-700 mt-1">Laporan</span>
                  </button>
                </div>

                {/* Produk Terlaris List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-800">Produk Terlaris</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-200/80 divide-y divide-zinc-100 shadow-sm overflow-hidden">
                    <div className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100" 
                          alt="Geprek" 
                          className="w-8 h-8 rounded-lg object-cover" 
                        />
                        <span className="font-semibold text-zinc-800 text-[11px]">Nasi Ayam Geprek</span>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-500">15x</span>
                    </div>

                    <div className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100" 
                          alt="Es Teh" 
                          className="w-8 h-8 rounded-lg object-cover" 
                        />
                        <span className="font-semibold text-zinc-800 text-[11px]">Es Teh Manis</span>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-500">12x</span>
                    </div>

                    <div className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100" 
                          alt="Mie Ayam" 
                          className="w-8 h-8 rounded-lg object-cover" 
                        />
                        <span className="font-semibold text-zinc-800 text-[11px]">Mie Ayam</span>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-500">8x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Android Red Bottom Navigation Bar (Image #2 bottom) */}
            <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-around text-[9px] font-medium shrink-0">
              <button onClick={() => setActiveScreen('dashboard')} className="flex flex-col items-center text-white">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveScreen('pos')} className="flex flex-col items-center opacity-80 hover:opacity-100">
                <Receipt className="w-4 h-4" />
                <span>Kasir</span>
              </button>
              <button onClick={() => setActiveScreen('antrian')} className="flex flex-col items-center opacity-80 hover:opacity-100">
                <ListOrdered className="w-4 h-4" />
                <span>Pesanan</span>
              </button>
              <button onClick={() => setActiveScreen('stok')} className="flex flex-col items-center opacity-80 hover:opacity-100">
                <Boxes className="w-4 h-4" />
                <span>Produk</span>
              </button>
              <button onClick={() => setActiveScreen('pengaturan')} className="flex flex-col items-center opacity-80 hover:opacity-100">
                <Settings className="w-4 h-4" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 3: KASIR / POS (Image #3)                              */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'pos' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen('dashboard')} className="text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="font-bold text-xs">Kasir / POS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Receipt className="w-4 h-4" />
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-3 pb-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Categories Pills */}
              <div className="px-3 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[10px]">
                {['Semua', 'Makanan', 'Minuman', 'Snack'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                    className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition ${
                      selectedCategory === cat.toLowerCase() || (selectedCategory === 'all' && cat === 'Semua')
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products List with Plus Button */}
              <div className="px-3 divide-y divide-zinc-100">
                {[
                  { name: 'Nasi Ayam Geprek', price: 15000, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100' },
                  { name: 'Mie Ayam', price: 12000, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100' },
                  { name: 'Es Teh Manis', price: 5000, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100' },
                  { name: 'Es Jeruk', price: 6000, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100' },
                  { name: 'Kentang Goreng', price: 10000, img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=100' },
                ].map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-xs text-zinc-800">{item.name}</div>
                        <div className="text-[11px] text-zinc-500 font-medium">{formatRupiah(item.price)}</div>
                      </div>
                    </div>
                    <button className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-sm shadow hover:bg-red-700">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Checkout Strip (Keranjang 3 - Bayar) */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 block">Keranjang (3)</span>
                <span className="font-black text-xs text-zinc-800">Rp 37.000</span>
              </div>
              <button
                onClick={() => setActiveScreen('antrian')}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md shadow-red-600/30"
              >
                Bayar
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 4: ANTRIAN KASIR (Image #4)                            */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'antrian' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <span className="font-bold text-xs">Antrian Kasir</span>
                <Search className="w-4 h-4" />
              </div>

              {/* Status Filter Tabs: Semua, Menunggu, Diproses, Siap */}
              <div className="p-3 flex items-center gap-1.5 text-[10px]">
                {(['Semua', 'Menunggu', 'Diproses', 'Siap'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAntrianFilter(tab)}
                    className={`flex-1 py-1.5 rounded-full font-bold text-center transition ${
                      antrianFilter === tab ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Antrian Order List */}
              <div className="px-3 space-y-2">
                {[
                  { no: 'A-001', type: 'BUNGKUS', price: 25000, status: 'Menunggu', time: '10:25', color: 'text-red-500 bg-red-50' },
                  { no: 'A-002', type: 'DELIVERY DQM', price: 42000, status: 'Diproses', time: '10:30', color: 'text-blue-500 bg-blue-50' },
                  { no: 'A-003', type: 'BUNGKUS', price: 18000, status: 'Siap', time: '10:32', color: 'text-emerald-500 bg-emerald-50' },
                  { no: 'A-004', type: 'DELIVERY DQM', price: 56000, status: 'Menunggu', time: '10:35', color: 'text-red-500 bg-red-50' },
                  { no: 'A-005', type: 'BUNGKUS', price: 30000, status: 'Diproses', time: '10:38', color: 'text-blue-500 bg-blue-50' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveScreen('detail')}
                    className="p-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between cursor-pointer hover:border-red-400 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-200/80 flex items-center justify-center font-black text-xs text-zinc-700">
                        {item.type === 'BUNGKUS' ? <ShoppingBag className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-black text-xs text-zinc-800">{item.no}</div>
                        <div className="text-[10px] text-zinc-500 uppercase">{item.type}</div>
                        <div className="text-[11px] font-bold text-zinc-700">{formatRupiah(item.price)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                        {item.status}
                      </span>
                      <div className="text-[9px] text-zinc-400 mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Footer Icons */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-around text-zinc-600">
              <button className="p-2 rounded-xl bg-white border border-zinc-200">
                <Clock className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-white border border-zinc-200">
                <Receipt className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-white border border-zinc-200">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 5: DETAIL PESANAN (Image #5)                           */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'detail' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen('antrian')} className="text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="font-bold text-xs">Detail Pesanan</span>
                </div>
                <Search className="w-4 h-4" />
              </div>

              {/* Order Info Breakdown */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-zinc-900">A-002</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    DELIVERY DQM
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 border-b border-zinc-100 pb-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">No. Transaksi</span>
                    <span className="font-mono font-medium text-zinc-800">WBK-20250926-0002</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Nama</span>
                    <span className="font-medium text-zinc-800">Ahmad</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">WhatsApp</span>
                    <span className="font-mono text-zinc-800">08xxxxxxxxxx</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Lokasi</span>
                    <span className="font-medium text-zinc-800">Pesantren DQM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Detail Lokasi</span>
                    <span className="font-medium text-zinc-800">Asrama Putra - Kamar 12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Catatan</span>
                    <span className="italic text-zinc-800">Antar setelah Maghrib</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-zinc-400">Status</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Diproses
                    </span>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100" className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-xs text-zinc-800">Nasi Ayam Geprek</div>
                        <div className="text-[10px] text-zinc-400">1 x Rp 15.000</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-700">Rp 15.000</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100" className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-xs text-zinc-800">Es Teh Manis</div>
                        <div className="text-[10px] text-zinc-400">1 x Rp 5.000</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-700">Rp 5.000</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-500">Total</span>
                  <span className="font-black text-sm text-zinc-900">Rp 42.000</span>
                </div>
              </div>
            </div>

            {/* Bottom 2 Action Buttons (Ubah Status & Selesai) */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-white border border-red-500 text-red-600 font-bold text-xs">
                Ubah Status
              </button>
              <button
                onClick={() => setActiveScreen('antrian')}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md shadow-red-600/30"
              >
                Selesai
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 6: STOK PRODUK (Image #6)                              */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'stok' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen('dashboard')} className="text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="font-bold text-xs">Stok Produk</span>
                </div>
                <Search className="w-4 h-4" />
              </div>

              {/* Search Bar */}
              <div className="p-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Inventory items list with badges (Aman, Hampir Habis, Habis) */}
              <div className="px-3 divide-y divide-zinc-100">
                {[
                  { name: 'Nasi Ayam Geprek', stock: 25, min: 5, status: 'Aman', statusClass: 'text-emerald-600 bg-emerald-50', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100' },
                  { name: 'Mie Ayam', stock: 6, min: 5, status: 'Hampir Habis', statusClass: 'text-amber-600 bg-amber-50', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100' },
                  { name: 'Es Teh Manis', stock: 15, min: 5, status: 'Aman', statusClass: 'text-emerald-600 bg-emerald-50', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100' },
                  { name: 'Es Jeruk', stock: 10, min: 5, status: 'Aman', statusClass: 'text-emerald-600 bg-emerald-50', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100' },
                  { name: 'Kentang Goreng', stock: 2, min: 5, status: 'Habis', statusClass: 'text-red-600 bg-red-50', img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=100' },
                ].map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-xs text-zinc-800">{item.name}</div>
                        <div className="text-[10px] text-zinc-500">Stok: {item.stock} • Min: {item.min}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-around text-[9px] font-medium shrink-0">
              <button onClick={() => setActiveScreen('dashboard')} className="flex flex-col items-center opacity-80">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveScreen('pos')} className="flex flex-col items-center opacity-80">
                <Receipt className="w-4 h-4" />
                <span>Kasir</span>
              </button>
              <button onClick={() => setActiveScreen('antrian')} className="flex flex-col items-center opacity-80">
                <ListOrdered className="w-4 h-4" />
                <span>Pesanan</span>
              </button>
              <button onClick={() => setActiveScreen('stok')} className="flex flex-col items-center text-white">
                <Boxes className="w-4 h-4" />
                <span>Produk</span>
              </button>
              <button onClick={() => setActiveScreen('pengaturan')} className="flex flex-col items-center opacity-80">
                <Settings className="w-4 h-4" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 7: LAPORAN PENJUALAN (Image #7)                        */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'laporan' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen('dashboard')} className="text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="font-bold text-xs">Laporan Penjualan</span>
                </div>
                <Search className="w-4 h-4" />
              </div>

              {/* Date Filter & Metric summary */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>26 Sep 2025</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-zinc-500 block">Total Penjualan</span>
                    <span className="font-black text-sm text-zinc-900">Rp 1.250.000</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-zinc-500 block">Jumlah Transaksi</span>
                    <span className="font-black text-sm text-zinc-900">12</span>
                  </div>
                </div>

                {/* Period Filter (Harian, Mingguan, Bulanan) */}
                <div className="flex items-center gap-1 text-[10px] bg-zinc-100 p-1 rounded-xl">
                  <button className="flex-1 py-1 rounded-lg bg-red-600 text-white font-bold">Harian</button>
                  <button className="flex-1 py-1 rounded-lg text-zinc-600 font-medium">Mingguan</button>
                  <button className="flex-1 py-1 rounded-lg text-zinc-600 font-medium">Bulanan</button>
                </div>

                {/* Bar Chart Representation (matching image 7) */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 space-y-2">
                  <div className="h-28 flex items-end justify-between gap-1.5 px-2 pt-4">
                    {[40, 25, 60, 80, 50, 70, 95, 30].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full bg-red-600 rounded-t" 
                          style={{ height: `${val}%` }} 
                        />
                        <span className="text-[8px] text-zinc-400">{idx * 2 + 8}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metode Pembayaran Breakdown */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-zinc-800">Metode Pembayaran</span>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-2.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 flex items-center gap-1.5 text-[11px]">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-500" /> Cash
                      </span>
                      <span className="font-bold text-zinc-800">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 flex items-center gap-1.5 text-[11px]">
                        <QrCode className="w-3.5 h-3.5 text-zinc-500" /> QRIS
                      </span>
                      <span className="font-bold text-zinc-800">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 flex items-center gap-1.5 text-[11px]">
                        <CreditCard className="w-3.5 h-3.5 text-zinc-500" /> Transfer
                      </span>
                      <span className="font-bold text-zinc-800">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 flex items-center gap-1.5 text-[11px]">
                        <Receipt className="w-3.5 h-3.5 text-zinc-500" /> E-Wallet
                      </span>
                      <span className="font-bold text-zinc-800">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-around text-[9px] font-medium shrink-0">
              <button onClick={() => setActiveScreen('dashboard')} className="flex flex-col items-center opacity-80">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveScreen('pos')} className="flex flex-col items-center opacity-80">
                <Receipt className="w-4 h-4" />
                <span>Kasir</span>
              </button>
              <button onClick={() => setActiveScreen('antrian')} className="flex flex-col items-center opacity-80">
                <ListOrdered className="w-4 h-4" />
                <span>Pesanan</span>
              </button>
              <button onClick={() => setActiveScreen('stok')} className="flex flex-col items-center opacity-80">
                <Boxes className="w-4 h-4" />
                <span>Produk</span>
              </button>
              <button onClick={() => setActiveScreen('pengaturan')} className="flex flex-col items-center text-white">
                <Settings className="w-4 h-4" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 8: PENGATURAN (Image #8)                               */}
        {/* ------------------------------------------------------------- */}
        {activeScreen === 'pengaturan' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen('dashboard')} className="text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="font-bold text-xs">Pengaturan</span>
                </div>
              </div>

              {/* Settings Menu List */}
              <div className="divide-y divide-zinc-100 text-xs">
                {[
                  { label: 'Informasi Toko', sub: 'Warung Bang Kobra' },
                  { label: 'Nilai Ayam Toko', sub: 'Harga default' },
                  { label: 'Logo Toko', sub: 'Icon & Branding' },
                  { label: 'Metode Pembayaran', sub: 'Cash, QRIS, Transfer' },
                  { label: 'WhatsApp Bisnis', sub: '0812-3456-7890' },
                  { label: 'Template Pesan', sub: 'Notifikasi Otomatis' },
                  { label: 'Jam Operasional', sub: '10:00 - 22:00 WIB' },
                  { label: 'Pajak & Diskon', sub: 'Atur nominal promo' },
                  { label: 'Format Transaksi', sub: 'WBK-YYYYMMDD-XXXX' },
                  { label: 'Pengaturan Struk', sub: 'Thermal 58mm / 80mm' },
                  { label: 'Delivery DQM', sub: 'Asrama Putra & Putri' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-zinc-50 cursor-pointer">
                    <div>
                      <div className="font-semibold text-zinc-800 text-[11px]">{item.label}</div>
                      <div className="text-[10px] text-zinc-400">{item.sub}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-around text-[9px] font-medium shrink-0">
              <button onClick={() => setActiveScreen('dashboard')} className="flex flex-col items-center opacity-80">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveScreen('pos')} className="flex flex-col items-center opacity-80">
                <Receipt className="w-4 h-4" />
                <span>Kasir</span>
              </button>
              <button onClick={() => setActiveScreen('antrian')} className="flex flex-col items-center opacity-80">
                <ListOrdered className="w-4 h-4" />
                <span>Pesanan</span>
              </button>
              <button onClick={() => setActiveScreen('stok')} className="flex flex-col items-center opacity-80">
                <Boxes className="w-4 h-4" />
                <span>Produk</span>
              </button>
              <button onClick={() => setActiveScreen('pengaturan')} className="flex flex-col items-center text-white">
                <Settings className="w-4 h-4" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        )}

        {/* Android Bottom Gesture Bar */}
        <div className="h-4 bg-black flex items-center justify-center shrink-0 z-30">
          <div className="w-32 h-1 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

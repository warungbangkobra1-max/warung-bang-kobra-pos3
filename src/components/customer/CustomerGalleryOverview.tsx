import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Bike, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  CreditCard,
  QrCode,
  DollarSign,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { Product, Category, Order, OrderType, OrderItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface CustomerGalleryOverviewProps {
  products: Product[];
  categories: Category[];
  onPlaceDemoOrder?: (order: any) => void;
}

export const CustomerGalleryOverview: React.FC<CustomerGalleryOverviewProps> = ({
  products,
  categories,
}) => {
  // 6 sub-screens matching Row 2 in diagram:
  // 1. menu (Halaman Menu Mobile First)
  // 2. choose-type (Checkout - Pilih Jenis Pesanan)
  // 3. dqm-form (Form Delivery DQM)
  // 4. cart (Keranjang)
  // 5. payment (Pembayaran)
  // 6. success (Selesai - Pesanan Berhasil)
  // 7. landing (Halaman Pelanggan - 2 Big Buttons)
  const [activeStep, setActiveStep] = useState<
    'menu' | 'choose-type' | 'dqm-form' | 'cart' | 'payment' | 'success' | 'landing'
  >('landing');

  const [orderType, setOrderType] = useState<OrderType>('BUNGKUS');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer Bank' | 'QRIS' | 'E-Wallet'>('QRIS');
  const [customerName, setCustomerName] = useState('Ahmad');
  const [customerPhone, setCustomerPhone] = useState('08xxxxxxxxxx');
  const [deliveryLocation, setDeliveryLocation] = useState('Pesantren DQM');
  const [deliveryDetail, setDeliveryDetail] = useState('Asrama Putra - Kamar 12');
  const [deliveryNote, setDeliveryNote] = useState('Antar setelah Maghrib');

  const steps = [
    { id: 'landing', label: '1. Landing Pelanggan' },
    { id: 'menu', label: '2. Menu (Mobile First)' },
    { id: 'choose-type', label: '3. Pilih Jenis Pesanan' },
    { id: 'dqm-form', label: '4. Form Delivery DQM' },
    { id: 'cart', label: '5. Keranjang' },
    { id: 'payment', label: '6. Pembayaran' },
    { id: 'success', label: '7. Pesanan Berhasil' },
  ];

  return (
    <div className="py-6 px-4 flex flex-col items-center min-h-[calc(100vh-60px)] bg-zinc-950">
      {/* Top flow selector tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-3 mb-4 scrollbar-none">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(s.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeStep === s.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Browser Phone Mockup Container */}
      <div className="w-full max-w-[375px] h-[780px] bg-black rounded-[42px] border-[5px] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative ring-1 ring-zinc-700/40">
        
        {/* Browser Top Navigation Bar (menu.warungbangkobra.id) */}
        <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between text-[11px] text-zinc-300 shrink-0 select-none z-30">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-zinc-500 text-xs">🌐</span>
            <span className="font-mono text-[10px] text-zinc-300 truncate">menu.warungbangkobra.id</span>
          </div>
          <span className="text-zinc-500 font-bold text-xs">⋮</span>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 1. LANDING PELANGGAN (Image Row 2, Screen #7)                      */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'landing' && (
          <div className="flex-1 bg-zinc-950 text-white flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header Bar */}
              <div className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-xs text-white">
                    🐍
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white block">WARUNG BANG KOBRA</span>
                    <span className="text-[9px] text-red-500 font-bold uppercase">Online Order</span>
                  </div>
                </div>
                <div className="text-zinc-400 font-bold text-base">☰</div>
              </div>

              {/* Banner Slogan (Pesanan Mudah, Rasa Istimewa) */}
              <div className="bg-gradient-to-r from-red-600 via-red-700 to-black p-4 text-white text-center">
                <h3 className="text-sm font-black tracking-wide">Pesanan Mudah, Rasa Istimewa</h3>
              </div>

              {/* TWO LARGE ORDER ACTION BUTTONS */}
              <div className="p-4 space-y-3">
                {/* BUNGKUS BUTTON */}
                <button
                  onClick={() => {
                    setOrderType('BUNGKUS');
                    setActiveStep('menu');
                  }}
                  className="w-full p-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-3.5 shadow-lg shadow-red-950/40 active:scale-98 transition group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-white stroke-[2.5px]" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-base tracking-wide uppercase">BUNGKUS</div>
                    <div className="text-[10px] text-red-100">Ambil langsung di warung</div>
                  </div>
                </button>

                {/* DELIVERY DQM BUTTON */}
                <button
                  onClick={() => {
                    setOrderType('DELIVERY_DQM');
                    setActiveStep('menu');
                  }}
                  className="w-full p-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-3.5 shadow-lg shadow-orange-950/40 active:scale-98 transition group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Bike className="w-6 h-6 text-white stroke-[2.5px]" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-base tracking-wide uppercase">DELIVERY DQM</div>
                    <div className="text-[10px] text-orange-100">Antar ke asrama pesantren DQM</div>
                  </div>
                </button>
              </div>

              {/* Quick Bottom Navigation icons (Menu, Riwayat, Tentang Kami) */}
              <div className="px-4 pt-2">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 flex items-center justify-around text-center text-zinc-400 text-[10px]">
                  <button onClick={() => setActiveStep('menu')} className="flex flex-col items-center hover:text-white">
                    <Receipt className="w-4 h-4 text-red-500 mb-0.5" />
                    <span>Menu</span>
                  </button>
                  <button onClick={() => setActiveStep('cart')} className="flex flex-col items-center hover:text-white">
                    <ShoppingBag className="w-4 h-4 text-orange-500 mb-0.5" />
                    <span>Riwayat</span>
                  </button>
                  <button className="flex flex-col items-center hover:text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-0.5" />
                    <span>Tentang Kami</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Food Banner at the bottom */}
            <div className="relative h-28 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"
                alt="Warung Bang Kobra"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end justify-center pb-2">
                <span className="font-black text-xs text-white tracking-widest uppercase">Warung Bang Kobra</span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 2. HALAMAN MENU (MOBILE FIRST) (Image Row 2, Screen #1)            */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'menu' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 p-1 flex items-center justify-center font-black text-xs">
                    🐍
                  </div>
                  <span className="font-black text-xs tracking-wider">WARUNG BANG KOBRA</span>
                </div>
              </div>

              {/* Hero Banner: Makan Enak, Harga Bersahabat */}
              <div className="relative bg-zinc-900 text-white p-3.5 flex items-center justify-between overflow-hidden">
                <div className="z-10">
                  <h3 className="font-black text-xs text-white leading-tight">Makan Enak, Harga Bersahabat</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Sajian istimewa setiap hari</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100"
                  alt="Ayam"
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 z-10 shrink-0"
                />
              </div>

              {/* Categories Pills */}
              <div className="p-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
                {['Semua', 'Makanan', 'Minuman', 'Snack'].map((cat, idx) => (
                  <button
                    key={cat}
                    className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition ${
                      idx === 0 ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product 2x2 Grid with 'Tersedia' Green Pills */}
              <div className="p-3 grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Nasi Ayam Geprek', price: 15000, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=160' },
                  { name: 'Mie Ayam', price: 12000, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=160' },
                  { name: 'Es Teh Manis', price: 5000, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=160' },
                  { name: 'Es Jeruk', price: 6000, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=160' },
                ].map((item, idx) => (
                  <div key={idx} className="border border-zinc-200 rounded-2xl p-2 bg-white flex flex-col justify-between">
                    <div>
                      <img src={item.img} alt={item.name} className="w-full h-20 rounded-xl object-cover mb-1.5" />
                      <div className="font-bold text-xs text-zinc-800 line-clamp-1">{item.name}</div>
                      <div className="text-[11px] font-black text-red-600">{formatRupiah(item.price)}</div>
                    </div>
                    <div className="mt-1">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Tersedia
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Bottom Sticky Bar: Keranjang (2) Rp 27.000 */}
            <div className="p-3 bg-white border-t border-zinc-200">
              <button
                onClick={() => setActiveStep('choose-type')}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-red-600/30"
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Keranjang (2)</span>
                </div>
                <span>Rp 27.000</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 3. CHECKOUT - PILIH JENIS PESANAN (Image Row 2, Screen #2)         */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'choose-type' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveStep('menu')} className="text-zinc-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-sm text-zinc-800">Pilih Jenis Pesanan</h3>
              </div>

              {/* Radio 1: BUNGKUS */}
              <div
                onClick={() => setOrderType('BUNGKUS')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  orderType === 'BUNGKUS' ? 'border-red-600 bg-red-50/50' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    orderType === 'BUNGKUS' ? 'border-red-600' : 'border-zinc-300'
                  }`}>
                    {orderType === 'BUNGKUS' && <div className="w-2 h-2 rounded-full bg-red-600" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-800">BUNGKUS</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      Pesanan akan disiapkan untuk diambil.
                    </div>
                  </div>
                </div>
              </div>

              {/* Radio 2: DELIVERY DQM */}
              <div
                onClick={() => setOrderType('DELIVERY_DQM')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  orderType === 'DELIVERY_DQM' ? 'border-red-600 bg-red-50/50' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    orderType === 'DELIVERY_DQM' ? 'border-red-600' : 'border-zinc-300'
                  }`}>
                    {orderType === 'DELIVERY_DQM' && <div className="w-2 h-2 rounded-full bg-red-600" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-800">DELIVERY DQM</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      Delivery hanya tersedia di area Pesantren DQM.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-zinc-200">
              <button
                onClick={() => setActiveStep(orderType === 'DELIVERY_DQM' ? 'dqm-form' : 'cart')}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 4. FORM DELIVERY DQM (Image Row 2, Screen #3)                      */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'dqm-form' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-3.5">
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveStep('choose-type')} className="text-zinc-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-sm text-zinc-800">Delivery DQM</h3>
              </div>

              {/* Warning Banner */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-center gap-2">
                <span className="font-bold">⚠️</span>
                <span>Hanya tersedia untuk area Pesantren DQM.</span>
              </div>

              {/* Form Fields */}
              <div className="space-y-2.5 text-xs text-zinc-700">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Nama Pemesan</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 block mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Lokasi</label>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Pesantren DQM">Pesantren DQM</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Detail Lokasi</label>
                  <input
                    type="text"
                    value={deliveryDetail}
                    onChange={(e) => setDeliveryDetail(e.target.value)}
                    placeholder="Contoh: Asrama Putra - Kamar 12"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Catatan</label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Contoh: Antar setelah Maghrib"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-zinc-200">
              <button
                onClick={() => setActiveStep('cart')}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 5. KERANJANG (Image Row 2, Screen #4)                              */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'cart' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveStep('choose-type')} className="text-zinc-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-sm text-zinc-800">Keranjang</h3>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-zinc-800">Nasi Ayam Geprek</div>
                      <div className="text-[10px] text-zinc-400">1 x Rp 15.000</div>
                    </div>
                  </div>
                  <button className="text-zinc-400 hover:text-red-500 text-xs">🗑️</button>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-zinc-800">Es Teh Manis</div>
                      <div className="text-[10px] text-zinc-400">1 x Rp 5.000</div>
                    </div>
                  </div>
                  <button className="text-zinc-400 hover:text-red-500 text-xs">🗑️</button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-800">Rp 20.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery DQM</span>
                  <span className="font-bold text-emerald-600">Rp 0</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-100 text-sm font-black text-zinc-900">
                  <span>Total</span>
                  <span>Rp 20.000</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-zinc-200">
              <button
                onClick={() => setActiveStep('payment')}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 6. PEMBAYARAN (Image Row 2, Screen #5)                             */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'payment' && (
          <div className="flex-1 bg-white text-zinc-900 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveStep('cart')} className="text-zinc-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-sm text-zinc-800">Pembayaran</h3>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-600">Metode Pembayaran</span>
                <div className="space-y-2">
                  {[
                    { id: 'Cash', label: 'Cash', icon: DollarSign },
                    { id: 'Transfer Bank', label: 'Transfer Bank', icon: CreditCard },
                    { id: 'QRIS', label: 'QRIS', icon: QrCode },
                    { id: 'E-Wallet', label: 'E-Wallet', icon: Receipt },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'border-red-600 bg-red-50/50' : 'border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium">
                          <Icon className="w-4 h-4 text-zinc-500" />
                          <span>{m.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-red-600' : 'border-zinc-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-red-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Total</span>
                <span className="font-black text-sm text-zinc-900">Rp 20.000</span>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-zinc-200">
              <button
                onClick={() => setActiveStep('success')}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 7. PESANAN BERHASIL (Image Row 2, Screen #6)                       */}
        {/* ------------------------------------------------------------------ */}
        {activeStep === 'success' && (
          <div className="flex-1 bg-white text-zinc-900 p-6 flex flex-col justify-between overflow-y-auto text-center">
            <div className="pt-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-black text-base text-zinc-900">Pesanan Berhasil!</h3>
              </div>

              {/* Order Details card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left text-xs space-y-2 text-zinc-600">
                <div>
                  <span className="text-[10px] text-zinc-400 block">No. Transaksi</span>
                  <span className="font-mono font-bold text-zinc-800">WBK-20250926-0001</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Jenis Pesanan</span>
                  <span className="font-bold text-zinc-800">BUNGKUS</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Total</span>
                  <span className="font-black text-sm text-zinc-900">Rp 20.000</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setActiveStep('landing')}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30"
                >
                  Lihat Pesanan
                </button>
                <button
                  onClick={() => setActiveStep('menu')}
                  className="w-full py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50"
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 pb-2">
              Terima kasih telah memesan di<br />
              <strong className="text-zinc-600">Warung Bang Kobra</strong>
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

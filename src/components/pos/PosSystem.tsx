import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Bike, 
  Receipt,
  CheckCircle2
} from 'lucide-react';
import { Product, Category, OrderItem, OrderType, PaymentMethod } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface PosSystemProps {
  products: Product[];
  categories: Category[];
  onSubmitPosOrder: (order: {
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
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const PosSystem: React.FC<PosSystemProps> = ({
  products,
  categories,
  onSubmitPosOrder,
  isSubmitting,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posMobileTab, setPosMobileTab] = useState<'catalog' | 'cart'>('catalog');
  
  // Cart State in POS
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('BUNGKUS');
  const [customerName, setCustomerName] = useState('Pelanggan Warung');
  const [customerPhone, setCustomerPhone] = useState('08000000000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TUNAI');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState<string>('');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCat === 'all' || p.categoryId === selectedCat;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          subtotal: product.price,
          notes: ''
        }
      ];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            return newQty > 0
              ? { ...item, qty: newQty, subtotal: newQty * item.price }
              : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = 0; // Bebas pajak warung
  const total = Math.max(0, subtotal - discount + tax);
  const change = Math.max(0, cashGiven - total);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    await onSubmitPosOrder({
      orderType,
      customerName: customerName.trim() || 'Pelanggan Warung',
      customerPhone: customerPhone.trim() || '08000000000',
      items: cart,
      paymentMethod,
      subtotal,
      discount,
      tax,
      total,
      notes: orderNotes.trim()
    });
    // Reset state
    setCart([]);
    setCashGiven(0);
    setDiscount(0);
    setOrderNotes('');
  };

  return (
    <div className="h-[calc(100dvh-60px)] flex flex-col lg:flex-row gap-3 p-2.5 sm:p-4 max-w-7xl mx-auto overflow-hidden bg-slate-50">
      {/* Mobile Mode Switcher: Katalog vs Struk Bayar (Visible only on < lg screens) */}
      <div className="lg:hidden flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shrink-0 shadow-sm">
        <button
          onClick={() => setPosMobileTab('catalog')}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            posMobileTab === 'catalog'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Katalog Menu ({filteredProducts.length})</span>
        </button>
        <button
          onClick={() => setPosMobileTab('cart')}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 relative ${
            posMobileTab === 'cart'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Struk & Bayar</span>
          {cart.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-red-100 text-red-700 font-extrabold ml-1">
              {cart.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </button>
      </div>

      {/* LEFT: Products Catalog */}
      <div className={`flex-1 flex flex-col bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 overflow-hidden relative shadow-sm ${
        posMobileTab === 'catalog' ? 'flex' : 'hidden lg:flex'
      }`}>
        {/* Search & Categories Bar */}
        <div className="space-y-2.5 mb-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-600" />
              Kasir Cepat POS
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari makanan/minuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCat === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              Semua
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedCat === cat.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2.5 pb-20 lg:pb-0">
          {filteredProducts.map(prod => {
            const inCartItem = cart.find(i => i.productId === prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => handleAddToCart(prod)}
                className={`bg-white hover:bg-slate-50 border p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer group transition select-none relative shadow-sm min-h-[140px] ${
                  inCartItem ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 mb-2">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                    Stok: {prod.stock}
                  </span>
                  {inCartItem && (
                    <span className="absolute top-1 right-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] shadow">
                      {inCartItem.qty}x
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 truncate group-hover:text-red-600 transition-colors">
                    {prod.name}
                  </h4>
                  <div className="text-xs font-black text-red-600 mt-0.5 tabular-nums">
                    {formatRupiah(prod.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Checkout Bar for Mobile Screen (< lg) */}
        {cart.length > 0 && posMobileTab === 'catalog' && (
          <div className="lg:hidden absolute bottom-3 left-3 right-3 p-3.5 bg-red-600 text-white rounded-2xl shadow-xl flex items-center justify-between z-30 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <div className="text-[11px] font-medium opacity-90">
                {cart.reduce((s, i) => s + i.qty, 0)} Item dipilih
              </div>
              <div className="text-base font-extrabold tabular-nums">{formatRupiah(total)}</div>
            </div>
            <button
              onClick={() => setPosMobileTab('cart')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white text-red-600 font-extrabold text-xs flex items-center gap-1.5 shadow"
            >
              <span>Lihat Struk</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: POS Bill & Payment */}
      <div className={`w-full lg:w-96 bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between overflow-y-auto shrink-0 shadow-sm ${
        posMobileTab === 'cart' ? 'flex flex-1 lg:flex-none' : 'hidden lg:flex'
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Struk Transaksi</h3>
                <p className="text-[10px] text-slate-500">Warung Bang Kobra</p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="px-2 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-[10px] font-bold flex items-center gap-1 transition"
                  title="Reset Keranjang"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
            {/* Bungkus vs Delivery DQM */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setOrderType('BUNGKUS')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition ${
                  orderType === 'BUNGKUS' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bungkus
              </button>
              <button
                onClick={() => setOrderType('DELIVERY_DQM')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition ${
                  orderType === 'DELIVERY_DQM' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DQM
              </button>
            </div>
          </div>

          {/* Customer Input */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nama Pelanggan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="No. WhatsApp"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>

          {/* Quick Order Note */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Catatan pesanan (misal: sambal dipisah / kuah banyak)..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Cart Items List */}
          <div className="max-h-[32vh] overflow-y-auto pr-1 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Klik produk di sebelah kiri untuk menambah ke struk
              </div>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {formatRupiah(item.price)} × {item.qty}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleUpdateQty(item.productId, -1)}
                      className="min-h-[36px] min-w-[36px] rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-xs text-slate-900 w-5 text-center tabular-nums">{item.qty}</span>
                    <button
                      onClick={() => handleUpdateQty(item.productId, 1)}
                      className="min-h-[36px] min-w-[36px] rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals & Quick Payment Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {(['TUNAI', 'TRANSFER', 'QRIS', 'EWALLET'] as PaymentMethod[]).map(pm => (
              <button
                key={pm}
                onClick={() => setPaymentMethod(pm)}
                className={`min-h-[40px] py-1.5 rounded-lg text-xs font-bold border transition ${
                  paymentMethod === pm
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pm}
              </button>
            ))}
          </div>

          {/* Quick Cash Presets (If Tunai) */}
          {paymentMethod === 'TUNAI' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[total, 10000, 20000, 50000, 100000].map(val => (
                <button
                  key={val}
                  onClick={() => setCashGiven(val)}
                  className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 whitespace-nowrap"
                >
                  {val === total ? 'Uang Pas' : formatRupiah(val)}
                </button>
              ))}
            </div>
          )}

          {/* Totals Calculation */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Diskon</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[11px]">Rp</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount || ''}
                  onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-20 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono text-xs text-red-600 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex justify-between text-slate-900 pt-1.5 border-t border-slate-200 font-extrabold">
              <span>Total Tagihan</span>
              <span className="text-base text-red-600 tabular-nums">{formatRupiah(total)}</span>
            </div>
            {paymentMethod === 'TUNAI' && cashGiven > 0 && (
              <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200 font-bold">
                <span>Kembalian</span>
                <span className="tabular-nums">{formatRupiah(change)}</span>
              </div>
            )}
          </div>

          {/* Big Touchscreen Friendly Submit Button (min 48px height) */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full min-h-[48px] py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>BAYAR & PROSES ({formatRupiah(total)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

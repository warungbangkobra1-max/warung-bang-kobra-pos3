import React from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Clock,
  Sparkles
} from 'lucide-react';
import { OrderItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface CustomerCartProps {
  items: OrderItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
  onContinueShopping: () => void;
}

export const CustomerCart: React.FC<CustomerCartProps> = ({
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  onContinueShopping,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-base font-bold text-white">Keranjang Masih Kosong</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
          Belum ada makanan atau minuman lezat yang kamu tambahkan.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-6 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition active:scale-95"
        >
          Pilih Menu Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-3 px-4 space-y-4 max-w-md mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-base font-black text-white">Keranjang Pesanan</h2>
          <p className="text-[11px] text-zinc-400">{items.length} jenis item siap diorder</p>
        </div>
        <span className="text-xs font-semibold text-red-500 bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded-full">
          Warung Bang Kobra
        </span>
      </div>

      {/* Item List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover bg-zinc-800 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {formatRupiah(item.price)}
              </div>
              {item.notes && (
                <div className="text-[10px] text-zinc-400 bg-zinc-950/50 px-2 py-0.5 rounded mt-1 line-clamp-1 italic">
                  "{item.notes}"
                </div>
              )}
              <div className="font-black text-xs text-red-400 mt-1">
                {formatRupiah(item.subtotal)}
              </div>
            </div>

            {/* Stepper controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onUpdateQty(item.productId, -1)}
                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition active:scale-95"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-black text-xs text-white w-4 text-center">
                {item.qty}
              </span>
              <button
                onClick={() => onUpdateQty(item.productId, 1)}
                className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition active:scale-95"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => onRemoveItem(item.productId)}
                className="w-7 h-7 rounded-lg text-zinc-500 hover:text-red-400 flex items-center justify-center ml-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Summary */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Subtotal</span>
          <span className="font-semibold text-zinc-200">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Diskon</span>
          <span className="font-semibold text-zinc-200">Rp 0</span>
        </div>
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Total</span>
          <span className="text-sm font-black text-red-500">{formatRupiah(subtotal)}</span>
        </div>
      </div>

      {/* Proceed Checkout Floating Bar */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 z-30">
        <button
          onClick={onProceedCheckout}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-between shadow-xl shadow-red-950/60 active:scale-98 transition"
        >
          <div className="text-left">
            <div className="text-[10px] text-red-200 font-medium">Lanjut Pembayaran</div>
            <div className="text-sm font-black">{formatRupiah(subtotal)}</div>
          </div>
          <div className="flex items-center gap-1.5 bg-red-700/60 px-3 py-1.5 rounded-xl font-bold">
            <span>LANJUT CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};

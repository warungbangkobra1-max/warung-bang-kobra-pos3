import React, { useState } from 'react';
import { 
  X, 
  Minus, 
  Plus, 
  Star, 
  ShoppingBag, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number, notes: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const handleIncrement = () => setQty(prev => prev + 1);
  const handleDecrement = () => setQty(prev => Math.max(1, prev - 1));

  const handleAdd = () => {
    onAddToCart(product, qty, notes);
    onClose();
  };

  const totalPrice = product.price * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image & Close */}
        <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating || 4.8} ({product.reviewCount || 100}+ rating)</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-base text-white">
                {product.name}
              </h3>
              <span className="text-base font-black text-red-500 whitespace-nowrap">
                {formatRupiah(product.price)}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Availability pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              Tersedia • Stok: {product.stock} {product.unit}
            </span>
          </div>

          {/* Stepper Quantity */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
            <span className="text-xs font-bold text-zinc-300">Jumlah Pesanan</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrement}
                disabled={qty <= 1}
                className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 disabled:opacity-40 transition active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm text-white w-6 text-center">
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                disabled={qty >= product.stock}
                className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-500 disabled:opacity-40 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: tanpa es, manis sedang, pedas level 2..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-[10px] text-zinc-400">Total Harga</div>
            <div className="text-sm font-black text-white">
              {formatRupiah(totalPrice)}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 active:scale-98 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            + Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

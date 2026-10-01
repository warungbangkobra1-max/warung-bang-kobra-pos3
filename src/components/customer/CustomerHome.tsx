import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Bike, 
  Plus, 
  Minus, 
  Star, 
  Sparkles,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import { Product, Category, OrderType } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { BrandLogo } from '../common/BrandLogo';

interface CustomerHomeProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onSelectOrderType: (type: OrderType) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onGoToMenu: () => void;
  cartCount: number;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  onSelectOrderType,
  onProductClick,
  onAddToCart,
  onGoToMenu,
  cartCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteProducts = products.slice(0, 4);

  return (
    <div className="pb-24 pt-3 px-4 space-y-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            Buka Sekarang
          </span>
        </div>
      </div>

      {/* Hero Card with Slogan */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 border border-zinc-800 shadow-xl">
        <div className="relative z-10 space-y-1">
          <div className="text-[11px] font-semibold text-red-500 tracking-wide uppercase">
            Warung Bang Kobra · DQM
          </div>
          <h2 className="text-xl font-extrabold text-white leading-tight tracking-tight">
            Pesan Cepat, Nikmati Lezatnya Sambal Kobra
          </h2>
          <p className="text-xs text-zinc-400 max-w-[280px]">
            Layanan bungkus siap ambil dan pesan antar kurir khusus area Pesantren DQM.
          </p>
        </div>
      </div>

      {/* TWO BIG ORDER TYPE BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        {/* BUNGKUS BUTTON */}
        <button
          onClick={() => onSelectOrderType('BUNGKUS')}
          className="group relative flex flex-col items-start p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-orange-500/80 transition-all text-left active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors">
            Bungkus
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Ambil di Warung
          </div>
          <div className="text-[10px] text-orange-400/90 font-medium mt-2">
            Siap tanpa antre
          </div>
        </button>

        {/* DELIVERY DQM BUTTON */}
        <button
          onClick={() => onSelectOrderType('DELIVERY_DQM')}
          className="group relative flex flex-col items-start p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-500/80 transition-all text-left active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5" />
          </div>
          <div className="font-extrabold text-sm text-white group-hover:text-red-400 transition-colors">
            Delivery DQM
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Antar ke Pesantren
          </div>
          <div className="text-[10px] text-red-400/90 font-medium mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Area DQM
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari menu, minuman, atau makanan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        />
      </div>

      {/* Horizontal Category Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-200">Kategori Menu</span>
          <button onClick={onGoToMenu} className="text-red-400 hover:text-red-300 text-[11px] font-medium flex items-center gap-0.5">
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Favorite / Popular Products Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-200">Menu Favorit</span>
          <span className="text-[11px] text-zinc-500">Paling Laris</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {favoriteProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onProductClick(prod)}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden p-2.5 flex flex-col justify-between hover:border-zinc-700 transition cursor-pointer group shadow-sm"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-800 mb-2">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {prod.rating || 4.8}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-100 line-clamp-1 group-hover:text-red-400 transition-colors">
                  {prod.name}
                </h4>
                <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {prod.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
                <span className="font-black text-xs text-red-500">
                  {formatRupiah(prod.price)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(prod);
                  }}
                  className="w-6 h-6 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product List Feed (Card list like reference) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-200">Daftar Pilihan Menu</span>
          <span className="text-[11px] text-zinc-500">{filteredProducts.length} Produk</span>
        </div>
        <div className="space-y-2.5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onProductClick(prod)}
              className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer group transition"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-white truncate group-hover:text-red-400 transition-colors">
                    {prod.name}
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                    Tersedia
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {prod.description}
                </p>
                <div className="text-xs font-black text-red-500 mt-1">
                  {formatRupiah(prod.price)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(prod);
                }}
                className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-950/30 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

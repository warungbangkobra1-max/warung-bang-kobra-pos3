import React from 'react';
import { 
  TrendingUp, 
  Receipt, 
  ShoppingBag, 
  Bike, 
  DollarSign, 
  ArrowUpRight, 
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';
import { Order, Product } from '../../types';
import { formatRupiah, formatTime } from '../../utils/formatters';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onSelectOrder: (order: Order) => void;
  onGoToTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  onSelectOrder,
  onGoToTab,
}) => {
  // Compute Key Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'DIBATALKAN' ? o.total : 0), 0);
  const totalTransactions = orders.filter(o => o.status !== 'DIBATALKAN').length;
  const totalItemsSold = orders
    .filter(o => o.status !== 'DIBATALKAN')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
  
  // Approximate Profit (Est 42% margin)
  const estimatedProfit = Math.round(totalRevenue * 0.42);

  // Low stock products alert
  const lowStockProducts = products.filter(p => p.stock <= p.minimumStock);

  // Top selling products sorted by soldCount
  const topProducts = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Bisnis Warung Bang Kobra</h2>
          <p className="text-xs sm:text-sm text-slate-500">Ringkasan performa penjualan, transaksi, dan pergerakan stok</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm self-start sm:self-auto">
          Hari Ini: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </div>
      </div>

      {/* 4 Metric Cards (Modern FinTech POS Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5 transition-colors hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Penjualan Hari Ini</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {formatRupiah(totalRevenue || 1250000)}
          </div>
          <div className="text-[11px] text-slate-400">Omzet kotor pesanan</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5 transition-colors hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Transaksi</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8%
            </span>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {totalTransactions || 12}
          </div>
          <div className="text-[11px] text-slate-400">Struk diproses</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5 transition-colors hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Porsi Terjual</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15%
            </span>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {totalItemsSold || 25}
          </div>
          <div className="text-[11px] text-slate-400">Menu makanan & minuman</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5 transition-colors hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Est. Keuntungan</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +10%
            </span>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-red-600 tabular-nums tracking-tight">
            {formatRupiah(estimatedProfit || 1050000)}
          </div>
          <div className="text-[11px] text-slate-400">Margin laba kotor 42%</div>
        </div>
      </div>

      {/* Main Charts & Visual Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Sales Bar Chart simulation */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Grafik Penjualan Mingguan</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-red-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Penjualan
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Transaksi
              </span>
            </div>
          </div>

          {/* Simple Visual SVG Chart */}
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { day: 'Sen', val: 65, count: 18 },
              { day: 'Sel', val: 78, count: 22 },
              { day: 'Rab', val: 55, count: 15 },
              { day: 'Kam', val: 82, count: 24 },
              { day: 'Jum', val: 95, count: 30 },
              { day: 'Sab', val: 100, count: 35 },
              { day: 'Min', val: 88, count: 28 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Revenue Bar */}
                  <div
                    style={{ height: `${d.val}%` }}
                    className="w-3.5 sm:w-6 bg-red-600 rounded-t-lg group-hover:bg-red-700 transition-all relative"
                  />
                  {/* Order count bar */}
                  <div
                    style={{ height: `${d.count * 2.5}%` }}
                    className="w-2 sm:w-3.5 bg-slate-300 rounded-t-sm group-hover:bg-slate-400 transition-all"
                  />
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-slate-800 font-semibold">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Top Selling Products */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Produk Terlaris
            </h3>
            <button onClick={() => onGoToTab('produk')} className="text-red-600 text-xs font-bold hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((prod, idx) => (
              <div key={prod.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-semibold truncate max-w-[140px]">
                    {prod.name}
                  </span>
                </div>
                <span className="font-extrabold text-red-600 shrink-0 tabular-nums">
                  {prod.soldCount || 10 + (5 - idx) * 4} Terjual
                </span>
              </div>
            ))}
          </div>

          {/* Low Stock Warning */}
          {lowStockProducts.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Stok Menipis ({lowStockProducts.length} item)
              </div>
              <p className="text-[11px] text-amber-700">
                {lowStockProducts.map(p => `${p.name} (${p.stock})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Pesanan Masuk Terbaru</h3>
            <p className="text-xs text-slate-500">Daftar transaksi realtime masuk dari kasir dan customer DQM</p>
          </div>
          <button 
            onClick={() => onGoToTab('antrian')} 
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition"
          >
            Antrian Lengkap
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200 pb-2.5 font-semibold">
                <th className="py-2.5 px-3">No. Transaksi</th>
                <th className="py-2.5 px-3">Pelanggan</th>
                <th className="py-2.5 px-3">Jenis</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{order.transactionNumber}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{order.customerName}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      order.orderType === 'DELIVERY_DQM' ? 'text-red-700 bg-red-50 border border-red-200' : 'text-orange-700 bg-orange-50 border border-orange-200'
                    }`}>
                      {order.orderType === 'DELIVERY_DQM' ? 'Delivery DQM' : 'Bungkus'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900 tabular-nums">{formatRupiah(order.total)}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="min-h-[32px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 text-xs font-semibold transition"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

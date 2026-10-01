import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  ShoppingBag, 
  Bike, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatTime } from '../../utils/formatters';

interface CashierQueueProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  userRole: string;
}

export const CashierQueue: React.FC<CashierQueueProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  userRole,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'SEMUA', label: 'Semua' },
    { id: 'MENUNGGU', label: 'Menunggu' },
    { id: 'DIPROSES', label: 'Diproses' },
    { id: 'SIAP', label: 'Siap' },
    { id: 'SELESAI', label: 'Selesai' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'SEMUA') return true;
    if (activeFilter === 'MENUNGGU') return order.status === 'MENUNGGU';
    if (activeFilter === 'DIPROSES') return order.status === 'DIPROSES';
    if (activeFilter === 'SIAP') return order.status === 'SIAP_DIAMBIL' || order.status === 'SIAP_DIANTAR';
    if (activeFilter === 'SELESAI') return order.status === 'SELESAI';
    return true;
  });

  const getStatusBadge = (order: Order) => {
    switch (order.status) {
      case 'MENUNGGU':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Menunggu
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Diproses
          </span>
        );
      case 'SIAP_DIAMBIL':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Siap Diambil
          </span>
        );
      case 'SIAP_DIANTAR':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
            Siap Diantar
          </span>
        );
      case 'DIANTAR':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
            Sedang Diantar
          </span>
        );
      case 'SELESAI':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            Selesai
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
            {order.status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Antrian Kasir & Pesanan
            <span className="text-xs px-2 py-0.5 rounded-md bg-red-950 text-red-400 border border-red-800/40">
              Live Realtime
            </span>
          </h2>
          <p className="text-xs text-zinc-400">
            Monitor dan proses pesanan Bungkus & Delivery DQM
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari no. transaksi / nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800 pb-3">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-zinc-300">Tidak ada antrian pesanan</div>
            <div className="text-xs text-zinc-500 mt-0.5">Pesanan baru akan muncul secara realtime di sini.</div>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivery = order.orderType === 'DELIVERY_DQM';
            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition shadow-sm group"
              >
                {/* Left: Transaction Code & Info */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isDelivery 
                      ? 'bg-red-600/10 border-red-500/30 text-red-500' 
                      : 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                  }`}>
                    {isDelivery ? <Bike className="w-5 h-5 stroke-[2.2px]" /> : <ShoppingBag className="w-5 h-5 stroke-[2.2px]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white group-hover:text-red-400 transition-colors">
                        {order.transactionNumber}
                      </span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        isDelivery ? 'bg-red-950 text-red-400' : 'bg-orange-950 text-orange-400'
                      }`}>
                        {isDelivery ? 'DELIVERY DQM' : 'BUNGKUS'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-zinc-200 mt-1">
                      {order.customerName} • {order.items.reduce((s, i) => s + i.qty, 0)} item
                    </div>

                    {isDelivery && order.deliveryLocation && (
                      <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <span className="text-red-400 font-medium">📍 {order.deliveryLocation}</span>
                        {order.deliveryDetail && <span>({order.deliveryDetail})</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Total, Status, Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800/80">
                  <div className="text-left sm:text-right">
                    <div className="font-black text-sm text-white">
                      {formatRupiah(order.total)}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {formatTime(order.createdAt)} • {order.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order)}

                    {/* Quick advance status buttons */}
                    {order.status === 'MENUNGGU' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(order.id, 'DIPROSES');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition"
                      >
                        Proses
                      </button>
                    )}

                    {order.status === 'DIPROSES' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(order.id, isDelivery ? 'SIAP_DIANTAR' : 'SIAP_DIAMBIL');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                      >
                        Siap
                      </button>
                    )}

                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  ExternalLink,
  Search,
  MessageCircle,
  Building,
  UserCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatTime } from '../../utils/formatters';
import { buildWhatsAppMessage, openWhatsAppChat } from '../../services/whatsappService';

interface DeliveryDqmViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  storePhone: string;
  userRole: string;
}

export const DeliveryDqmView: React.FC<DeliveryDqmViewProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  storePhone,
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState<'SEMUA' | 'DIPROSES' | 'SIAP_DIANTAR' | 'DIANTAR' | 'SELESAI'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  // Strict filter: only DELIVERY_DQM orders
  const deliveryOrders = orders.filter(o => o.orderType === 'DELIVERY_DQM');

  const filteredOrders = deliveryOrders.filter(order => {
    const matchesSearch = 
      order.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.deliveryLocation && order.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'SEMUA') return true;
    if (activeTab === 'DIPROSES') return order.status === 'MENUNGGU' || order.status === 'DIPROSES';
    if (activeTab === 'SIAP_DIANTAR') return order.status === 'SIAP_DIANTAR';
    if (activeTab === 'DIANTAR') return order.status === 'DIANTAR';
    if (activeTab === 'SELESAI') return order.status === 'SELESAI';
    return true;
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-zinc-900 to-black border border-red-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950/60">
            <Bike className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Delivery DQM</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-700/50">
                Khusus Pesantren DQM
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kelola dan pantau kurir pengantaran santri & ustadz secara langsung
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-[10px] text-zinc-400">Siap Diantar</div>
            <div className="text-sm font-black text-purple-400">
              {deliveryOrders.filter(o => o.status === 'SIAP_DIANTAR').length}
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-[10px] text-zinc-400">Sedang Diantar</div>
            <div className="text-sm font-black text-orange-400">
              {deliveryOrders.filter(o => o.status === 'DIANTAR').length}
            </div>
          </div>

          {deliveryOrders.filter(o => o.status === 'SIAP_DIANTAR').length > 1 && (
            <button
              onClick={async () => {
                const readyOrders = deliveryOrders.filter(o => o.status === 'SIAP_DIANTAR');
                for (const o of readyOrders) {
                  await onUpdateStatus(o.id, 'DIANTAR');
                }
              }}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/50 transition active:scale-95"
              title="Antar semua pesanan yang sudah siap secara bersamaan"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Antar Rombongan ({deliveryOrders.filter(o => o.status === 'SIAP_DIANTAR').length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'SEMUA', label: 'Semua Antaran' },
            { id: 'DIPROSES', label: 'Disiapkan' },
            { id: 'SIAP_DIANTAR', label: 'Siap Diantar' },
            { id: 'DIANTAR', label: 'Sedang Diantar' },
            { id: 'SELESAI', label: 'Selesai' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari asrama / nama santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Delivery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-zinc-900/30 border border-zinc-800 rounded-3xl">
            <Bike className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-zinc-300">Tidak ada pengantaran DQM</h4>
            <p className="text-xs text-zinc-500 mt-1">
              Pesanan delivery untuk area Pesantren DQM akan muncul di sini.
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-3xl space-y-3 transition cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Transaction & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-white group-hover:text-red-400 transition-colors">
                      {order.transactionNumber}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {formatTime(order.createdAt)}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    order.status === 'SIAP_DIANTAR'
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : order.status === 'DIANTAR'
                      ? 'bg-orange-950 text-orange-300 border-orange-800'
                      : order.status === 'SELESAI'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Recipient & DQM Location */}
                <div className="mt-2.5 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{order.customerName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = buildWhatsAppMessage(order, storePhone);
                        openWhatsAppChat(order.customerPhone, text);
                      }}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      {order.customerPhone}
                    </button>
                  </div>

                  <div className="text-xs text-zinc-300 flex items-start gap-1.5 pt-1 border-t border-zinc-900">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-amber-400">{order.deliveryLocation}</div>
                      {order.deliveryDetail && (
                        <div className="text-[11px] text-zinc-400">{order.deliveryDetail}</div>
                      )}
                      {(order.deliveryNote || order.notes) && (
                        <div className="text-[10px] text-amber-300 font-medium italic mt-1 bg-amber-950/40 border border-amber-800/40 p-1.5 rounded-lg">
                          Catatan: "{order.notes || order.deliveryNote}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="mt-2 text-xs text-zinc-400 space-y-0.5">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span className="truncate max-w-[200px]">{item.name} ({item.qty}x)</span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-[10px] text-zinc-500 italic">
                      +{order.items.length - 2} item lainnya...
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Action Footer */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400">Total + Ongkir</div>
                  <div className="font-black text-sm text-red-500">
                    {formatRupiah(order.total)}
                  </div>
                </div>

                {/* Quick Courier Action */}
                <div className="flex items-center gap-2">
                  {order.customerPhone && (
                    <button
                      type="button"
                      title="Hubungi Santri via WA"
                      onClick={(e) => {
                        e.stopPropagation();
                        const msg = buildWhatsAppMessage(order, storePhone);
                        openWhatsAppChat(order.customerPhone, msg);
                      }}
                      className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {order.status === 'SIAP_DIANTAR' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(order.id, 'DIANTAR');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/40 transition active:scale-95"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      Antar Sekarang
                    </button>
                  )}

                  {order.status === 'DIANTAR' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(order.id, 'SELESAI');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

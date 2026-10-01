import React from 'react';
import { 
  X, 
  Bike, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Printer, 
  CheckCircle2, 
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatTime, formatDate } from '../../utils/formatters';
import { buildWhatsAppMessage, openWhatsAppChat } from '../../services/whatsappService';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  storePhone: string;
  userRole: string;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  storePhone,
  userRole,
}) => {
  if (!order) return null;

  const isDelivery = order.orderType === 'DELIVERY_DQM';

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppCustomer = () => {
    const text = buildWhatsAppMessage(order, storePhone);
    openWhatsAppChat(order.customerPhone, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isDelivery ? 'bg-red-950 border-red-800 text-red-400' : 'bg-orange-950 border-orange-800 text-orange-400'
            }`}>
              {isDelivery ? <Bike className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-semibold">DETAIL PESANAN</div>
              <div className="font-mono font-black text-sm text-white">{order.transactionNumber}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
              title="Cetak Struk"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Bar */}
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 font-medium">Status Pesanan:</span>
            <span className="font-black text-xs px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              {order.status}
            </span>
          </div>

          {/* Customer & Delivery Information */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="font-bold text-zinc-200 text-xs border-b border-zinc-800/80 pb-1.5 flex justify-between items-center">
              <span>Informasi Pelanggan</span>
              <button
                onClick={handleWhatsAppCustomer}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md"
              >
                <Phone className="w-3 h-3" />
                Hubungi WA
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-zinc-400">
              <div>
                <span className="text-[10px] text-zinc-500 block">Nama:</span>
                <span className="font-semibold text-white">{order.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">WhatsApp:</span>
                <span className="font-mono text-zinc-200">{order.customerPhone}</span>
              </div>
            </div>

            {order.notes && (
              <div className="pt-2 border-t border-zinc-800/60">
                <span className="text-[10px] text-zinc-400 block font-semibold">Catatan Khusus:</span>
                <span className="text-xs text-amber-300 italic">"{order.notes}"</span>
              </div>
            )}

            {isDelivery && (
              <div className="pt-2 border-t border-zinc-800/60 text-zinc-300 space-y-1">
                <div className="text-red-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Area {order.deliveryArea}
                </div>
                <div className="font-medium text-white">
                  Lokasi: <span className="text-amber-400">{order.deliveryLocation}</span>
                </div>
                {order.deliveryDetail && (
                  <div className="text-zinc-400 text-[11px]">
                    Detail: {order.deliveryDetail}
                  </div>
                )}
                {order.deliveryNote && (
                  <div className="text-zinc-400 text-[11px] italic bg-zinc-950/60 p-1.5 rounded">
                    Catatan: "{order.deliveryNote}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Item Breakdown */}
          <div className="space-y-2">
            <div className="font-bold text-zinc-200 text-xs">Daftar Item Menu</div>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold text-zinc-100 truncate">{item.name}</div>
                    <div className="text-[10px] text-zinc-400">
                      {formatRupiah(item.price)} × {item.qty}
                    </div>
                    {item.notes && (
                      <div className="text-[10px] text-zinc-400 italic">
                        Catatan: {item.notes}
                      </div>
                    )}
                  </div>
                  <div className="font-black text-white text-right">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount && order.discount > 0 ? (
              <div className="flex justify-between text-amber-400">
                <span>Diskon / Potongan:</span>
                <span>-{formatRupiah(order.discount)}</span>
              </div>
            ) : null}
            {isDelivery && (
              <div className="flex justify-between text-zinc-400">
                <span>Ongkos Kirim DQM:</span>
                <span>{order.deliveryFee === 0 ? 'GRATIS' : formatRupiah(order.deliveryFee)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-zinc-800 flex justify-between font-black text-sm text-white">
              <span>Total Bayar:</span>
              <span className="text-red-500">{formatRupiah(order.total)}</span>
            </div>
            <div className="text-[10px] text-zinc-500 text-right">
              Metode: {order.paymentMethod} • Status: {order.paymentStatus}
            </div>
          </div>
        </div>

        {/* Footer Quick Status Buttons (Workflow progression) */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-end gap-2">
          {order.status === 'MENUNGGU' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'DIPROSES')}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              Mulai Diproses
            </button>
          )}

          {order.status === 'DIPROSES' && (
            <button
              onClick={() => onUpdateStatus(order.id, isDelivery ? 'SIAP_DIANTAR' : 'SIAP_DIAMBIL')}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              Tandai {isDelivery ? 'Siap Diantar' : 'Siap Diambil'}
            </button>
          )}

          {isDelivery && order.status === 'SIAP_DIANTAR' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'DIANTAR')}
              className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              Mulai Diantar ke Lokasi DQM
            </button>
          )}

          {(order.status === 'SIAP_DIAMBIL' || order.status === 'DIANTAR') && (
            <button
              onClick={() => onUpdateStatus(order.id, 'SELESAI')}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesaikan Pesanan
            </button>
          )}

          {order.status !== 'SELESAI' && order.status !== 'DIBATALKAN' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'DIBATALKAN')}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 font-semibold text-xs transition"
            >
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

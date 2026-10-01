import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Bike, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ReceiptText, 
  MessageCircle,
  Home
} from 'lucide-react';
import { Order } from '../../types';
import { formatRupiah, formatTime } from '../../utils/formatters';
import { buildWhatsAppMessage, openWhatsAppChat } from '../../services/whatsappService';

interface OrderSuccessProps {
  order: Order;
  onViewOrderDetails: () => void;
  onBackToHome: () => void;
  storePhone: string;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  order,
  onViewOrderDetails,
  onBackToHome,
  storePhone,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#EA580C', '#FFFFFF', '#FBBF24']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const isDelivery = order.orderType === 'DELIVERY_DQM';

  const handleSendToWhatsApp = () => {
    const text = buildWhatsAppMessage(order, storePhone);
    openWhatsAppChat(storePhone, text);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 max-w-md mx-auto text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
      {/* Big Animated Icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-950/50 text-white mx-auto">
          <CheckCircle2 className="w-14 h-14 stroke-[2.2px]" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-white shadow">
          {isDelivery ? <Bike className="w-4 h-4 text-red-500" /> : <ShoppingBag className="w-4 h-4 text-orange-500" />}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-white">Pesanan Berhasil Dibuat!</h2>
        <p className="text-xs text-zinc-400 mt-1">
          {isDelivery 
            ? 'Pesanan Anda segera diproses dan diantar ke lokasi DQM.' 
            : 'Pesanan Anda akan segera disiapkan untuk diambil di warung.'}
        </p>
      </div>

      {/* Transaction Summary Card */}
      <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 text-left space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <div className="text-[10px] text-zinc-400 font-medium">Nomor Transaksi</div>
            <div className="text-sm font-black text-red-400 font-mono tracking-wide">
              {order.transactionNumber}
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            isDelivery 
              ? 'bg-red-950 text-red-300 border-red-800' 
              : 'bg-orange-950 text-orange-300 border-orange-800'
          }`}>
            {isDelivery ? 'DELIVERY DQM' : 'BUNGKUS'}
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>Nama Pemesan:</span>
            <span className="font-semibold text-white">{order.customerName}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Metode Bayar:</span>
            <span className="font-semibold text-white">{order.paymentMethod}</span>
          </div>
          {isDelivery && (
            <div className="flex justify-between text-zinc-400">
              <span>Lokasi DQM:</span>
              <span className="font-semibold text-red-400 text-right">{order.deliveryLocation}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800/80">
            <span>Total Pembayaran:</span>
            <span className="text-sm font-black text-red-500">{formatRupiah(order.total)}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Status Saat Ini:</span>
          <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-800/40">
            {order.status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 pt-2">
        <button
          onClick={handleSendToWhatsApp}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-98"
        >
          <MessageCircle className="w-4 h-4" />
          Kirim Struk ke WhatsApp Warung
        </button>

        <button
          onClick={onViewOrderDetails}
          className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition active:scale-98"
        >
          <ReceiptText className="w-4 h-4" />
          Lihat Pesanan & Status Realtime
        </button>

        <button
          onClick={onBackToHome}
          className="w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 border border-zinc-800 transition"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

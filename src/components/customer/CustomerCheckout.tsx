import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Bike, 
  MapPin, 
  AlertCircle, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Wallet,
  ArrowLeft,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { OrderItem, OrderType, PaymentMethod, StoreSettings } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface CustomerCheckoutProps {
  items: OrderItem[];
  defaultOrderType: OrderType;
  storeSettings: StoreSettings;
  onBack: () => void;
  onSubmitOrder: (orderDetails: {
    orderType: OrderType;
    customerName: string;
    customerPhone: string;
    deliveryArea: string | null;
    deliveryLocation: string | null;
    deliveryDetail: string | null;
    deliveryNote: string | null;
    deliveryFee: number;
    paymentMethod: PaymentMethod;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const DQM_LOCATIONS = [
  'Asrama Putra - Gedung A',
  'Asrama Putra - Gedung B',
  'Asrama Putra - Kamar 08',
  'Asrama Putra - Kamar 12',
  'Asrama Putri - Gedung Khadijah',
  'Asrama Putri - Gedung Aisyah',
  'Komplek Asatidz & Guru',
  'Kantor Pengurus DQM',
  'Masjid Jami DQM',
  'Pos Satpam Gerbang Depan'
];

export const CustomerCheckout: React.FC<CustomerCheckoutProps> = ({
  items,
  defaultOrderType,
  storeSettings,
  onBack,
  onSubmitOrder,
  isSubmitting,
}) => {
  const [orderType, setOrderType] = useState<OrderType>(defaultOrderType);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // DQM Delivery fields
  const [deliveryArea, setDeliveryArea] = useState('Pesantren DQM');
  const [deliveryLocation, setDeliveryLocation] = useState(DQM_LOCATIONS[0]);
  const [deliveryDetail, setDeliveryDetail] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [formError, setFormError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const isDelivery = orderType === 'DELIVERY_DQM';
  const deliveryFee = isDelivery ? storeSettings.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Silakan masukkan nama pemesan.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError('Silakan masukkan nomor WhatsApp yang aktif.');
      return;
    }

    if (isDelivery) {
      if (deliveryArea !== 'Pesantren DQM') {
        setFormError('Maaf, delivery hanya tersedia di area Pesantren DQM.');
        return;
      }
      if (!deliveryLocation) {
        setFormError('Silakan pilih lokasi pengantaran di Pesantren DQM.');
        return;
      }
    }

    await onSubmitOrder({
      orderType,
      customerName,
      customerPhone,
      deliveryArea: isDelivery ? 'Pesantren DQM' : null,
      deliveryLocation: isDelivery ? deliveryLocation : null,
      deliveryDetail: isDelivery ? deliveryDetail : null,
      deliveryNote: isDelivery ? deliveryNote : null,
      deliveryFee,
      paymentMethod,
    });
  };

  return (
    <div className="pb-32 pt-3 px-4 space-y-4 max-w-md mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-black text-white">Checkout Pesanan</h2>
          <p className="text-[11px] text-zinc-400">Warung Bang Kobra</p>
        </div>
      </div>

      {formError && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Choice of Order Type: Bungkus vs Delivery DQM */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-200">Pilih Jenis Pesanan</label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Bungkus */}
          <button
            type="button"
            onClick={() => setOrderType('BUNGKUS')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              orderType === 'BUNGKUS'
                ? 'bg-orange-600/10 border-orange-500 ring-1 ring-orange-500'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShoppingBag className={`w-5 h-5 ${orderType === 'BUNGKUS' ? 'text-orange-500' : 'text-zinc-400'}`} />
              {orderType === 'BUNGKUS' && <CheckCircle className="w-4 h-4 text-orange-500" />}
            </div>
            <div className="mt-3">
              <div className="font-bold text-xs text-white">BUNGKUS</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                Pesanan akan disiapkan untuk diambil.
              </div>
            </div>
          </button>

          {/* Delivery DQM */}
          <button
            type="button"
            onClick={() => setOrderType('DELIVERY_DQM')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              orderType === 'DELIVERY_DQM'
                ? 'bg-red-600/10 border-red-500 ring-1 ring-red-500'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <Bike className={`w-5 h-5 ${orderType === 'DELIVERY_DQM' ? 'text-red-500' : 'text-zinc-400'}`} />
              {orderType === 'DELIVERY_DQM' && <CheckCircle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="mt-3">
              <div className="font-bold text-xs text-white">DELIVERY DQM</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                Hanya untuk area Pesantren DQM.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Customer Info Form */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-zinc-200">Informasi Pemesan</h4>
        
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Nama Pemesan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Ahmad / Fajar"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Nomor WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Contoh: 081234567890"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono"
            required
          />
        </div>
      </div>

      {/* Delivery DQM Strict Form & Validation (Only shown when DELIVERY_DQM) */}
      {isDelivery && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-red-900/50 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold pb-2 border-b border-zinc-800">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Form Pengantaran Pesantren DQM</span>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-800/40 text-[11px] text-orange-300 leading-relaxed">
            🛵 <strong>Khusus Area DQM:</strong> Delivery hanya tersedia untuk santri, ustadz, dan warga di dalam lingkungan <strong>Pesantren DQM</strong>.
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Area Pengantaran
            </label>
            <input
              type="text"
              value={deliveryArea}
              disabled
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-300 font-bold cursor-not-allowed opacity-90"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Pilih Lokasi Gedung / Asrama <span className="text-red-500">*</span>
            </label>
            <select
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              {DQM_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Detail Lokasi (Nomor Kamar / Patokan)
            </label>
            <input
              type="text"
              placeholder="Contoh: Kamar 12 Lantai 2 / Dekat Masjid"
              value={deliveryDetail}
              onChange={(e) => setDeliveryDetail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Catatan untuk Kurir (Waktu Antar)
            </label>
            <input
              type="text"
              placeholder="Contoh: Antar setelah Maghrib / Titip piket"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      )}

      {/* Payment Method Selector */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-zinc-200">Metode Pembayaran</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'TUNAI' as const, label: 'Tunai', icon: Banknote },
            { id: 'TRANSFER' as const, label: 'Transfer', icon: CreditCard },
            { id: 'QRIS' as const, label: 'QRIS', icon: QrCode },
            { id: 'EWALLET' as const, label: 'E-Wallet', icon: Wallet },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-red-600/20 border-red-500 text-red-400 ring-1 ring-red-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Total Breakdown */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Subtotal Pesanan</span>
          <span className="font-semibold text-zinc-200">{formatRupiah(subtotal)}</span>
        </div>
        {isDelivery && (
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Biaya Antar (DQM)</span>
            <span className="font-semibold text-zinc-200">
              {deliveryFee === 0 ? 'GRATIS' : formatRupiah(deliveryFee)}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Total Pembayaran</span>
          <span className="text-base font-black text-red-500">{formatRupiah(grandTotal)}</span>
        </div>
      </div>

      {/* Floating Submit Order Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 z-40">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 active:scale-98 transition"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>BAYAR SEKARANG • {formatRupiah(grandTotal)}</span>
          )}
        </button>
      </div>
    </div>
  );
};

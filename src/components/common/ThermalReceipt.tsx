import React from 'react';
import { Order } from '../../types';
import { formatRupiah, formatDate, formatTime } from '../../utils/formatters';

interface ThermalReceiptProps {
  order: Order | null;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  order,
  storeName = 'WARUNG BANG KOBRA',
  storeAddress = 'Kawasan Pesantren DQM',
  storePhone = '0812-3456-7890'
}) => {
  if (!order) return null;

  const isDelivery = order.orderType === 'DELIVERY_DQM';

  return (
    <div className="hidden print:block print:w-[58mm] print:max-w-[58mm] print:p-2 print:text-black print:font-mono print:text-[10px] print:leading-tight mx-auto bg-white text-black">
      {/* Header */}
      <div className="text-center pb-2 border-b border-dashed border-black">
        <div className="font-bold text-xs uppercase">{storeName}</div>
        <div className="text-[9px]">{storeAddress}</div>
        <div className="text-[9px]">WA: {storePhone}</div>
      </div>

      {/* Order Info */}
      <div className="py-1.5 border-b border-dashed border-black text-[9px]">
        <div className="flex justify-between">
          <span>TGL:</span>
          <span>{formatDate(order.createdAt)} {formatTime(order.createdAt)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>NO:</span>
          <span>{order.transactionNumber}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>TIPE:</span>
          <span className="uppercase">{isDelivery ? '🛵 DELIVERY DQM' : '🛍️ BUNGKUS'}</span>
        </div>
        <div className="flex justify-between">
          <span>PLG:</span>
          <span>{order.customerName}</span>
        </div>
        {isDelivery && (
          <div className="pt-0.5 border-t border-dotted border-black/50 mt-0.5">
            <div>AREA: {order.deliveryArea}</div>
            <div>LOKASI: {order.deliveryLocation}</div>
            {order.deliveryDetail && <div>KET: {order.deliveryDetail}</div>}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="py-1.5 border-b border-dashed border-black">
        {order.items.map((item, idx) => (
          <div key={idx} className="mb-1">
            <div className="font-bold truncate">{item.name}</div>
            <div className="flex justify-between">
              <span>{item.qty} x {formatRupiah(item.price)}</span>
              <span>{formatRupiah(item.subtotal)}</span>
            </div>
            {item.notes && <div className="text-[8px] italic">*{item.notes}</div>}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="py-1.5 border-b border-dashed border-black text-[9px] space-y-0.5">
        <div className="flex justify-between">
          <span>SUBTOTAL:</span>
          <span>{formatRupiah(order.subtotal)}</span>
        </div>
        {order.discount && order.discount > 0 ? (
          <div className="flex justify-between text-black">
            <span>POTONGAN/DISKON:</span>
            <span>-{formatRupiah(order.discount)}</span>
          </div>
        ) : null}
        {isDelivery && (
          <div className="flex justify-between">
            <span>ONGKIR DQM:</span>
            <span>{order.deliveryFee === 0 ? 'GRATIS' : formatRupiah(order.deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-[10px] pt-1 border-t border-black">
          <span>TOTAL:</span>
          <span>{formatRupiah(order.total)}</span>
        </div>
        <div className="flex justify-between">
          <span>METODE:</span>
          <span>{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>STATUS:</span>
          <span className="font-bold">{order.paymentStatus}</span>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="text-center pt-2 text-[8px] leading-tight">
        {order.notes && (
          <div className="border border-black p-1 text-[8px] font-bold text-left mb-1.5 uppercase">
            CATATAN: {order.notes}
          </div>
        )}
        <div>TERIMA KASIH ATAS KUNJUNGANNYA</div>
        <div className="font-bold">WARUNG BANG KOBRA</div>
        <div className="italic text-[7px] mt-0.5">Struk Resmi • Dicetak Otomatis</div>
      </div>
    </div>
  );
};

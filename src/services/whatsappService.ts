import { Order } from '../types';
import { formatRupiah } from '../utils/formatters';

export function buildWhatsAppMessage(order: Order, storePhone: string): string {
  const isDelivery = order.orderType === 'DELIVERY_DQM';
  
  let msg = `*WARUNG BANG KOBRA*\n`;
  msg += `*Enak • Cepat • Praktis*\n`;
  msg += `-------------------------------\n`;
  msg += `*No. Pesanan:* ${order.transactionNumber}\n`;
  msg += `*Jenis:* ${isDelivery ? '🛵 DELIVERY DQM' : '🛍️ BUNGKUS (Ambil di Warung)'}\n`;
  msg += `*Nama:* ${order.customerName}\n`;
  msg += `*Status:* ${order.status.replace('_', ' ')}\n`;
  
  if (isDelivery) {
    msg += `*Area:* ${order.deliveryArea}\n`;
    msg += `*Lokasi:* ${order.deliveryLocation}\n`;
    if (order.deliveryDetail) msg += `*Detail:* ${order.deliveryDetail}\n`;
    if (order.deliveryNote) msg += `*Catatan:* ${order.deliveryNote}\n`;
  }

  msg += `-------------------------------\n`;
  msg += `*Detail Menu:*\n`;
  order.items.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} (${item.qty}x) = ${formatRupiah(item.subtotal)}\n`;
    if (item.notes) msg += `   _Catatan: ${item.notes}_\n`;
  });
  msg += `-------------------------------\n`;
  if (isDelivery && order.deliveryFee > 0) {
    msg += `Subtotal: ${formatRupiah(order.subtotal)}\n`;
    msg += `Ongkir DQM: ${formatRupiah(order.deliveryFee)}\n`;
  }
  msg += `*TOTAL BAYAR: ${formatRupiah(order.total)}*\n`;
  msg += `*Metode Bayar:* ${order.paymentMethod} (${order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM DIBAYAR'})\n`;
  msg += `-------------------------------\n`;
  msg += `Terima kasih atas pesanan Anda di Warung Bang Kobra!`;

  return encodeURIComponent(msg);
}

export function openWhatsAppChat(phone: string, text: string) {
  // Normalize phone number (e.g. 0812... -> 62812...)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  }
  const url = `https://wa.me/${cleanPhone}?text=${text}`;
  window.open(url, '_blank');
}

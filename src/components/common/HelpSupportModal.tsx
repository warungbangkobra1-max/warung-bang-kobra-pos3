import React from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Bike, 
  ShoppingBag, 
  Printer, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink 
} from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  storePhone: string;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  storePhone,
}) => {
  if (!isOpen) return null;

  const handleOpenWAHelp = () => {
    const text = encodeURIComponent("Halo Admin Warung Bang Kobra, saya butuh bantuan mengenai sistem operasional.");
    window.open(`https://wa.me/${storePhone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-800/40 text-red-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Panduan Operasional & Bantuan</h3>
              <p className="text-[11px] text-zinc-400">Warung Bang Kobra OS v2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SOP Guidelines */}
        <div className="space-y-3.5 text-xs text-zinc-300">
          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span>1. Alur Pesanan BUNGKUS (Takeaway)</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Pesanan langsung diproses di dapur/kasir. Setelah matang, ubah status ke <strong>SIAP DIAMBIL</strong>. Pelanggan dapat mengambil langsung di gerai tanpa biaya kurir.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <Bike className="w-4 h-4 text-purple-400" />
              <span>2. Alur Pesanan DELIVERY DQM</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Khusus pengantaran santri/ustadz ke Pesantren DQM. Dapur menyiapkan makanan, kurir mengantar ke asrama & kamar terkait, serta menghubungi pemesan via tombol WhatsApp di kartu kurir.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <Printer className="w-4 h-4 text-red-400" />
              <span>3. Cetak Struk Kasir Thermal (58mm)</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Klik ikon printer pada modal detail transaksi atau tombol proses kasir. Sistem secara otomatis menyesuaikan format kertas printer thermal 58mm / 80mm tanpa memakan ruang halaman.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Sinkronisasi Realtime Cloud Firestore</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Semua transaksi, pesanan santri, stok produk, dan perubahan status tersimpan otomatis secara realtime di Firebase Firestore multi-device.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <BookOpen className="w-4 h-4 text-yellow-400" />
              <span>5. Potongan Harga & Diskon Kasir POS</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Kasir dapat memasukkan nominal potongan di kasir POS. Diskon langsung terpotong dari total tagihan dan tercatat rapi pada struk thermal fisik dan histori transaksi.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>6. Catatan Khusus & Preferensi Pesanan</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Kolom catatan pesanan pada kasir POS otomatis diteruskan ke detail transaksi dan tercetak jelas di struk thermal untuk panduan tim dapur (misal: pedas, kuah pisah).
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleOpenWAHelp}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hubungi Bantuan WhatsApp</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};

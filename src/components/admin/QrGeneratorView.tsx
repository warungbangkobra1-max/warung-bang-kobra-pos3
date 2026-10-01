import React from 'react';
import { QrCode, Download, Share2, Sparkles, Smartphone, UtensilsCrossed } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface QrGeneratorProps {
  onOpenCustomerView: () => void;
}

export const QrGeneratorView: React.FC<QrGeneratorProps> = ({ onOpenCustomerView }) => {
  const currentUrl = window.location.href;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-xl font-black text-white">QR Code Menu Meja / Warung</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Cetak dan tempelkan QR Code ini agar pelanggan dapat langsung memesan Bungkus atau Delivery DQM lewat HP tanpa antre.
        </p>
      </div>

      {/* Printable Poster Card */}
      <div className="bg-gradient-to-b from-zinc-900 to-black border-2 border-red-600/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 flex flex-col items-center">
        <BrandLogo size="lg" />

        <div className="p-4 bg-white rounded-3xl shadow-xl border-4 border-zinc-900 flex items-center justify-center">
          {/* Stylized QR Code image or SVG representation */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&color=000000`}
            alt="QR Code Warung Bang Kobra"
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
          />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-red-500">
            Scan untuk Pesan Makanan & Minuman
          </div>
          <div className="text-sm font-black text-white">
            1. BUNGKUS &nbsp;•&nbsp; 2. DELIVERY DQM
          </div>
          <div className="text-[11px] text-zinc-400">
            Tidak perlu install aplikasi • Langsung buka di browser
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          Cetak Standee QR Menu
        </button>

        <button
          onClick={onOpenCustomerView}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 border border-zinc-800 transition"
        >
          <Smartphone className="w-4 h-4 text-orange-400" />
          Buka Tampilan Customer
        </button>
      </div>
    </div>
  );
};

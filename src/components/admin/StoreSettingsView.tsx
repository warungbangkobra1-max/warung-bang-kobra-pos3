import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Save, 
  CheckCircle2, 
  Building2, 
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface StoreSettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'DQM' | 'TOKO' | 'WHATSAPP'>('DQM');
  
  // DQM Delivery settings
  const [deliveryEnabled, setDeliveryEnabled] = useState(settings.deliveryEnabled);
  const [deliveryArea, setDeliveryArea] = useState(settings.deliveryArea || 'Pesantren DQM');
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee || 2000);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(settings.freeDeliveryThreshold || 50000);
  
  // Store info
  const [storeName, setStoreName] = useState(settings.storeName || 'WARUNG BANG KOBRA');
  const [tagline, setTagline] = useState(settings.tagline || 'Enak • Cepat • Praktis');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState(settings.phoneWhatsApp || '081234567890');
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      ...settings,
      deliveryEnabled,
      deliveryArea,
      deliveryFee,
      freeDeliveryThreshold,
      storeName,
      tagline,
      phoneWhatsApp,
    };

    try {
      await setDoc(doc(db, 'settings', 'store'), updated, { merge: true });
      onUpdateSettings(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Gagal menyimpan pengaturan.');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Pengaturan Toko</h2>
        <p className="text-xs text-zinc-400">Atur profil warung, nomor WhatsApp, dan konfigurasi Delivery DQM</p>
      </div>

      {/* Sub Tabs (Matching reference #15) */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: 'DQM', label: 'Delivery DQM' },
          { id: 'TOKO', label: 'Profil Toko' },
          { id: 'WHATSAPP', label: 'WhatsApp & Struk' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan berhasil disimpan dan langsung aktif di seluruh aplikasi!</span>
        </div>
      )}

      {/* FORM: Delivery DQM Settings (Key specification in Master Prompt Poin 9) */}
      {activeSubTab === 'DQM' && (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Status Delivery DQM</h3>
                  <p className="text-[11px] text-zinc-400">Aktifkan atau nonaktifkan fitur kurir antar ke Pesantren</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryEnabled}
                  onChange={(e) => setDeliveryEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* Delivery Fee Configuration (Prompt #9: Gratis atau Biaya Delivery) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-200">Biaya Delivery (Ongkir)</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryFee(0)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    deliveryFee === 0
                      ? 'bg-red-600/10 border-red-500 text-white ring-1 ring-red-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">Gratis Ongkir</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Bebas biaya antar untuk santri DQM</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryFee(2000)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    deliveryFee > 0
                      ? 'bg-red-600/10 border-red-500 text-white ring-1 ring-red-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">Biaya Rp 2.000 / trip</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Ongkos bensin kurir internal DQM</div>
                </button>
              </div>
            </div>

            {/* Custom Fee Input */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Kustom Nominal Ongkir (Rp)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            {/* Delivery Area Enforcement */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Area Pengantaran (Terkunci)
              </label>
              <input
                type="text"
                value={deliveryArea}
                disabled
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-400 font-bold cursor-not-allowed opacity-80"
              />
              <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-red-500" />
                Sesuai aturan sistem, area delivery terkunci hanya untuk <strong>Pesantren DQM</strong>.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition"
            >
              <Save className="w-4 h-4" />
              Simpan Pengaturan Delivery DQM
            </button>
          </div>
        </form>
      )}

      {/* Profile Toko */}
      {activeSubTab === 'TOKO' && (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Nama Toko / Warung</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Slogan / Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Nomor WhatsApp Resmi Warung</label>
              <input
                type="text"
                value={phoneWhatsApp}
                onChange={(e) => setPhoneWhatsApp(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition"
            >
              <Save className="w-4 h-4" />
              Simpan Profil Toko
            </button>
          </div>
        </form>
      )}

      {/* WhatsApp Template info */}
      {activeSubTab === 'WHATSAPP' && (
        <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3 text-xs">
          <h3 className="font-bold text-white text-sm">Template WhatsApp Otomatis</h3>
          <p className="text-zinc-400">
            Sistem mengirimkan pesan otomatis untuk status Bungkus & Delivery DQM langsung ke nomor pelanggan:
          </p>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1">
            <div>*WARUNG BANG KOBRA*</div>
            <div>*No. Pesanan:* WBK-20260926-XXXX</div>
            <div>*Jenis:* 🛵 DELIVERY DQM</div>
            <div>*Lokasi:* Asrama Putra - Kamar 12</div>
            <div>*Status:* SEDANG DIANTAR OLEH KURIR</div>
            <div>*TOTAL BAYAR:* Rp 27.000</div>
          </div>
        </div>
      )}
    </div>
  );
};

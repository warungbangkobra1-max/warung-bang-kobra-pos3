import React, { useState } from 'react';
import { 
  FileBarChart, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight,
  Printer,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { Order, Expense } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';

interface ReportsViewProps {
  orders: Order[];
  expenses: Expense[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ orders, expenses }) => {
  const [reportRange, setReportRange] = useState<'SEMUA' | 'HARI_INI' | 'MINGGU_INI' | 'BULAN_INI'>('SEMUA');

  // Filter orders by range
  const filteredOrders = orders.filter(o => {
    if (o.status === 'DIBATALKAN') return false;
    if (reportRange === 'SEMUA') return true;

    const orderDate = o.createdAt ? (o.createdAt.toDate ? o.createdAt.toDate() : new Date(o.createdAt)) : new Date();
    const now = new Date();

    if (reportRange === 'HARI_INI') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (reportRange === 'MINGGU_INI') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return orderDate >= oneWeekAgo;
    }
    if (reportRange === 'BULAN_INI') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Filter expenses by range
  const filteredExpenses = expenses.filter(e => {
    if (reportRange === 'SEMUA') return true;
    const expDate = e.date ? new Date(e.date) : new Date();
    const now = new Date();

    if (reportRange === 'HARI_INI') {
      return expDate.toDateString() === now.toDateString();
    }
    if (reportRange === 'MINGGU_INI') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return expDate >= oneWeekAgo;
    }
    if (reportRange === 'BULAN_INI') {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalOmzet = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPengeluaran = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const labaBersih = totalOmzet - totalPengeluaran;

  const bungkusOrders = filteredOrders.filter(o => o.orderType === 'BUNGKUS');
  const dqmOrders = filteredOrders.filter(o => o.orderType === 'DELIVERY_DQM');

  const bungkusOmzet = bungkusOrders.reduce((sum, o) => sum + o.total, 0);
  const dqmOmzet = dqmOrders.reduce((sum, o) => sum + o.total, 0);

  const handleExportCSV = () => {
    const headers = ["No. Transaksi", "Tanggal", "Tipe", "Pelanggan", "WhatsApp", "Lokasi DQM", "Metode", "Status", "Total"];
    const rows = filteredOrders.map(o => [
      `"${o.transactionNumber}"`,
      `"${o.createdAt ? formatDate(o.createdAt) : '-'}"`,
      `"${o.orderType}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.deliveryLocation || '-'}"`,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      o.total
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Penjualan_Bang_Kobra_${reportRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-red-500" />
            Laporan Keuangan & Penjualan
          </h2>
          <p className="text-xs text-zinc-400">
            Rekap laba/rugi, breakdown omzet Bungkus & Delivery DQM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
            {(['SEMUA', 'HARI_INI', 'MINGGU_INI', 'BULAN_INI'] as const).map(range => (
              <button
                key={range}
                onClick={() => setReportRange(range)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  reportRange === range 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {range === 'SEMUA' ? 'Semua' : range === 'HARI_INI' ? 'Hari Ini' : range === 'MINGGU_INI' ? '7 Hari' : 'Bulan Ini'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </button>
        </div>
      </div>

      {/* 3 Executive Summary Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Omzet */}
        <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Pendapatan Kotor</span>
            <span className="p-1 rounded-lg bg-emerald-950/80 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white">{formatRupiah(totalOmzet)}</div>
          <div className="text-[11px] text-zinc-500">{filteredOrders.length} transaksi selesai</div>
        </div>

        {/* Total Pengeluaran */}
        <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Beban Operasional</span>
            <span className="p-1 rounded-lg bg-red-950/80 text-red-400">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-red-400">{formatRupiah(totalPengeluaran)}</div>
          <div className="text-[11px] text-zinc-500">{expenses.length} pos biaya tercatat</div>
        </div>

        {/* Laba Bersih */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950 via-zinc-900 to-black border border-red-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Laba Bersih Aktual</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              Net Profit
            </span>
          </div>
          <div className={`text-2xl font-black ${labaBersih >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
            {formatRupiah(labaBersih)}
          </div>
          <div className="text-[11px] text-zinc-400">Omzet dikurangi seluruh belanja</div>
        </div>
      </div>

      {/* Breakdown per Tipe Pesanan (Bungkus vs Delivery DQM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bungkus Breakdown */}
        <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
              <h3 className="font-bold text-sm text-white">Pesanan BUNGKUS</h3>
            </div>
            <span className="text-xs font-black text-orange-400">{bungkusOrders.length} Pesanan</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Omzet Bungkus:</span>
            <span className="font-bold text-white text-sm">{formatRupiah(bungkusOmzet)}</span>
          </div>
          <div className="text-[11px] text-zinc-500">
            Pelanggan mengambil langsung di warung tanpa biaya kurir.
          </div>
        </div>

        {/* Delivery DQM Breakdown */}
        <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
              <h3 className="font-bold text-sm text-white">Pesanan DELIVERY DQM</h3>
            </div>
            <span className="text-xs font-black text-red-400">{dqmOrders.length} Pengantaran</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Omzet Delivery DQM:</span>
            <span className="font-bold text-white text-sm">{formatRupiah(dqmOmzet)}</span>
          </div>
          <div className="text-[11px] text-zinc-500">
            Khusus area Pesantren DQM (asrama santri & guru).
          </div>
        </div>
      </div>
    </div>
  );
};

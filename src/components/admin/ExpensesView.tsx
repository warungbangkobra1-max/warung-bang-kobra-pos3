import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Wallet, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  ArrowDownRight,
  Filter,
  Receipt
} from 'lucide-react';
import { Expense } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
}

const EXPENSE_CATEGORIES = [
  'Bahan Baku (Es, Buah, Sirup)',
  'Bahan Makanan (Mi, Daging, Bumbu)',
  'Kemasan (Cup, Kantong, Sedotan)',
  'Operasional Gas & Listrik',
  'Transportasi & Bensin Kurir DQM',
  'Lain-lain'
];

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    try {
      setIsSubmitting(true);
      await onAddExpense({
        description,
        category,
        amount,
        date: new Date().toISOString().split('T')[0],
        notes,
      });
      setDescription('');
      setAmount(0);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-red-500" />
            Catatan Pengeluaran Operasional
          </h2>
          <p className="text-xs text-zinc-400">
            Pencatatan belanja bahan baku, operasional warung, dan armada kurir DQM
          </p>
        </div>

        {/* Total Expense summary card */}
        <div className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400">Total Pengeluaran</div>
            <div className="text-base font-black text-red-500">{formatRupiah(totalExpense)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form Input Pengeluaran */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4 h-fit">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-500" />
            Tambah Pengeluaran
          </h3>

          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Nama / Keterangan Belanja</label>
              <input
                type="text"
                placeholder="Contoh: Belanja Buah Mangga & Alpukat"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Kategori Biaya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Nominal Biaya (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Catatan Tambahan</label>
              <input
                type="text"
                placeholder="Contoh: Toko Berkah Pasar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/40 active:scale-95 transition"
            >
              Simpan Pengeluaran
            </button>
          </form>
        </div>

        {/* Right: Daftar Pengeluaran */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Riwayat Pengeluaran</h3>
            <span className="text-xs text-zinc-500">{expenses.length} data tercatat</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs bg-zinc-950/40 rounded-2xl border border-zinc-800">
                Belum ada pengeluaran operasional yang dicatat.
              </div>
            ) : (
              expenses.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{item.description}</div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-2">
                      <span className="text-red-400">{item.category}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      {item.notes && <span>• ({item.notes})</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-red-500 font-mono">
                      -{formatRupiah(item.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(item.id)}
                      className="text-zinc-600 hover:text-red-400 transition"
                      title="Hapus Pengeluaran"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

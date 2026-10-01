import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { Product, Category } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  onRefresh?: () => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      categoryId: categories[0]?.id || 'cat-minuman',
      categoryName: categories[0]?.name || 'Minuman',
      description: '',
      price: 10000,
      costPrice: 6000,
      stock: 20,
      minimumStock: 5,
      unit: 'Porsi',
      imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    try {
      setIsSaving(true);
      const prodId = editingProduct.id || `prod-${Date.now()}`;
      const prodRef = doc(db, 'products', prodId);
      
      const matchedCat = categories.find(c => c.id === editingProduct.categoryId);

      await setDoc(prodRef, {
        ...editingProduct,
        id: prodId,
        categoryName: matchedCat?.name || editingProduct.categoryName || 'Menu',
        updatedAt: serverTimestamp()
      }, { merge: true });

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Gagal menyimpan produk.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Manajemen Produk</h2>
          <p className="text-xs text-zinc-400">Tambah, ubah harga, foto, dan stok menu Warung Bang Kobra</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/40 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Product Table (Like reference #14) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Gambar</th>
                <th className="py-3 px-4">Nama Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga Jual</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-800/40 text-zinc-200">
                  <td className="py-2.5 px-4">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover bg-zinc-800"
                    />
                  </td>
                  <td className="py-2.5 px-4 font-bold text-white">{prod.name}</td>
                  <td className="py-2.5 px-4 text-zinc-400">{prod.categoryName || 'Menu'}</td>
                  <td className="py-2.5 px-4 font-black text-red-400">{formatRupiah(prod.price)}</td>
                  <td className="py-2.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={async () => {
                          const newStock = Math.max(0, prod.stock - 1);
                          await setDoc(doc(db, 'products', prod.id), {
                            stock: newStock,
                            status: newStock === 0 ? 'OUT_OF_STOCK' : prod.status,
                            updatedAt: serverTimestamp()
                          }, { merge: true });
                        }}
                        className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold transition"
                        title="Kurangi Stok (-1)"
                      >
                        -
                      </button>
                      <span className={`min-w-[2.5rem] text-center ${prod.stock <= prod.minimumStock ? 'text-amber-400 font-bold' : ''}`}>
                        {prod.stock}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          const newStock = prod.stock + 1;
                          await setDoc(doc(db, 'products', prod.id), {
                            stock: newStock,
                            status: prod.status === 'OUT_OF_STOCK' ? 'ACTIVE' : prod.status,
                            updatedAt: serverTimestamp()
                          }, { merge: true });
                        }}
                        className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold transition"
                        title="Tambah Stok (+1)"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-zinc-500 ml-0.5">{prod.unit}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.status === 'ACTIVE' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' 
                        : 'bg-red-950 text-red-400 border border-red-800/50'
                    }`}>
                      {prod.status === 'ACTIVE' ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                {editingProduct.id?.startsWith('prod-') && !products.find(p => p.id === editingProduct.id)
                  ? 'Tambah Produk Baru'
                  : 'Edit Produk'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Kategori</label>
                <select
                  value={editingProduct.categoryId || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-red-950/40"
                >
                  <Save className="w-4 h-4" />
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

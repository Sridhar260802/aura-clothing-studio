"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, Star } from "lucide-react";
import { formatPrice, slugify } from "@/lib/utils";
import { CATEGORIES, SIZES } from "@/types";
import type { Product, SizeStock } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "", description: "", price: "", costPrice: "", category: "Shirts",
    stock: "", featured: false, sizes: SIZES.map((s) => ({ size: s, stock: 0 })) as SizeStock[],
  });

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products?limit=100");
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "", description: "", price: "", costPrice: "", category: "Shirts",
      stock: "", featured: false, sizes: SIZES.map((s) => ({ size: s, stock: 0 })),
    });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      sizes: SIZES.map((s) => {
        const existing = product.sizes.find((ps) => ps.size === s);
        return { size: s, stock: existing?.stock || 0 };
      }),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const totalStock = form.sizes.reduce((s, sz) => s + sz.stock, 0);
      const body = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        price: form.price,
        costPrice: form.costPrice,
        category: form.category,
        stock: totalStock.toString(),
        featured: form.featured,
        sizes: form.sizes,
        images: editing?.images || [],
      };

      if (editing) {
        await fetch(`/api/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, previousStock: editing.stock }),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const updateSizeStock = (size: string, stock: number) => {
    setForm({
      ...form,
      sizes: form.sizes.map((s) => (s.size === size ? { ...s, stock: Math.max(0, stock) } : s)),
    });
  };

  if (loading) {
    return <div className="text-center py-20"><p className="font-body text-charcoal/40 dark:text-white/40">Loading products...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-charcoal dark:text-white">Products ({products.length})</h1>
        <button onClick={openAdd} className="btn-primary gap-2 !py-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-smoke dark:bg-charcoal/40 border-b border-aura-100 dark:border-aura-900/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Product</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Category</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Price</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Stock</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-aura-100 dark:border-aura-900/30 hover:bg-smoke/50 dark:hover:bg-charcoal/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-aura-100 to-aura-200 dark:from-aura-900/40 dark:to-aura-800/20 flex items-center justify-center shrink-0">
                        <span className="font-display text-sm text-aura-600 dark:text-aura-400">{product.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium line-clamp-1 flex items-center gap-1">
                          {product.name}
                          {product.featured && <Star size={12} className="text-aura-500 fill-aura-500" />}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal/60 dark:text-white/60">{product.category}</td>
                  <td className="px-4 py-3 font-body text-sm">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-body text-sm font-medium ${product.stock <= 5 ? "text-red-500" : product.stock <= 10 ? "text-orange-500" : "text-green-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-charcoal/40 dark:text-white/40 hover:text-aura-600 dark:hover:text-aura-400 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-charcoal/40 dark:text-white/40 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-charcoal rounded-xl shadow-2xl"
          >
            <div className="sticky top-0 bg-white dark:bg-charcoal border-b border-aura-100 dark:border-aura-900/30 px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-xl">{editing ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="text-charcoal/40 dark:text-white/40"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1 block">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1 block">Price (INR) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1 block">Cost Price (INR)</label>
                  <input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className="input-field" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1 block">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Size Stock */}
              <div>
                <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-2 block">Stock per Size</label>
                <div className="grid grid-cols-5 gap-2">
                  {form.sizes.map((s) => (
                    <div key={s.size} className="text-center">
                      <p className="font-body text-xs font-medium mb-1">{s.size}</p>
                      <input
                        type="number"
                        value={s.stock}
                        onChange={(e) => updateSizeStock(s.size, parseInt(e.target.value) || 0)}
                        className="input-field text-center !px-1 !py-1.5 text-sm"
                        min={0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-aura-300 text-aura-600 focus:ring-aura-500"
                />
                <span className="font-body text-sm">Featured Product</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1 !py-2.5">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="btn-primary flex-1 !py-2.5">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : editing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

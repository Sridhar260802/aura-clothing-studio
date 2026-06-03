"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import type { Product } from "@/types";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products?limit=100");
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) => {
    if (filter === "low") return p.stock > 0 && p.stock <= 10;
    if (filter === "out") return p.stock === 0;
    return true;
  });

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  if (loading) {
    return <div className="text-center py-20"><p className="font-body text-charcoal/40 dark:text-white/40">Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal dark:text-white mb-6">Inventory</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card cursor-pointer" onClick={() => setFilter("all")}>
          <div className="flex items-center gap-3">
            <Package size={18} className="text-aura-500" />
            <div>
              <p className="font-body text-xs text-charcoal/50 dark:text-white/50">Total Stock</p>
              <p className="font-display text-xl">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer" onClick={() => setFilter("low")}>
          <div className="flex items-center gap-3">
            <TrendingDown size={18} className="text-orange-500" />
            <div>
              <p className="font-body text-xs text-charcoal/50 dark:text-white/50">Low Stock</p>
              <p className="font-display text-xl text-orange-500">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer" onClick={() => setFilter("out")}>
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500" />
            <div>
              <p className="font-body text-xs text-charcoal/50 dark:text-white/50">Out of Stock</p>
              <p className="font-display text-xl text-red-500">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Inventory */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-smoke dark:bg-charcoal/40 border-b border-aura-100 dark:border-aura-900/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Product</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Category</th>
                {["S", "M", "L", "XL", "XXL"].map((s) => (
                  <th key={s} className="text-center px-2 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">{s}</th>
                ))}
                <th className="text-center px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Total</th>
                <th className="text-center px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-aura-100 dark:border-aura-900/30"
                >
                  <td className="px-4 py-3 font-body text-sm">{product.name}</td>
                  <td className="px-4 py-3 font-body text-xs text-charcoal/50 dark:text-white/50">{product.category}</td>
                  {["S", "M", "L", "XL", "XXL"].map((size) => {
                    const sizeData = product.sizes.find((s) => s.size === size);
                    const stock = sizeData?.stock ?? 0;
                    return (
                      <td key={size} className="text-center px-2 py-3">
                        <span className={`font-body text-sm ${stock === 0 ? "text-red-400" : stock <= 3 ? "text-orange-500" : ""}`}>
                          {stock}
                        </span>
                      </td>
                    );
                  })}
                  <td className="text-center px-4 py-3 font-body text-sm font-medium">{product.stock}</td>
                  <td className="text-center px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-body text-xs ${
                      product.stock === 0 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : product.stock <= 10 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {product.stock === 0 ? "Out" : product.stock <= 10 ? "Low" : "OK"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

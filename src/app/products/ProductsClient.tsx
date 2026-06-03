"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import { CATEGORIES, SIZES } from "@/types";

interface Props {
  products: Product[];
  initialCategory: string;
  initialSearch: string;
}

export default function ProductsClient({ products, initialCategory, initialSearch }: Props) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedSize) {
      result = result.filter((p) =>
        p.sizes.some((s) => s.size === selectedSize && s.stock > 0)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, category, search, selectedSize, sortBy]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="section-subtitle mb-2">Collection</p>
            <h1 className="section-title">
              {category !== "All" ? category : "All Products"}
            </h1>
            <p className="font-body text-sm text-charcoal/50 dark:text-white/50 mt-2">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal dark:text-white/40 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Toggle Filters (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-outline gap-2 py-2.5"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? "block" : "hidden"} sm:block w-full sm:w-56 shrink-0 space-y-8`}>
              {/* Categories */}
              <div>
                <h3 className="font-display text-lg mb-3 text-charcoal dark:text-white">Category</h3>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                        category === cat
                          ? "bg-aura-100 dark:bg-aura-900/40 text-aura-700 dark:text-aura-300 font-medium"
                          : "text-charcoal/60 dark:text-white/60 hover:bg-smoke dark:hover:bg-charcoal/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <h3 className="font-display text-lg mb-3 text-charcoal dark:text-white">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                      className={`px-3 py-1.5 rounded-lg font-body text-xs border transition-colors ${
                        selectedSize === size
                          ? "bg-aura-600 text-white border-aura-600"
                          : "border-aura-200 dark:border-aura-800 text-charcoal/60 dark:text-white/60 hover:border-aura-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(category !== "All" || selectedSize || search) && (
                <button
                  onClick={() => {
                    setCategory("All");
                    setSelectedSize("");
                    setSearch("");
                  }}
                  className="font-body text-xs text-aura-600 dark:text-aura-400 underline"
                >
                  Clear all filters
                </button>
              )}
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-2xl text-charcoal/40 dark:text-white/40 mb-2">
                    No products found
                  </p>
                  <p className="font-body text-sm text-charcoal/30 dark:text-white/30">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

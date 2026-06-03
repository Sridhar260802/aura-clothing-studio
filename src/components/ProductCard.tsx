"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const mainImage = product.images?.[0];
  const inStock = product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-smoke dark:bg-charcoal/40 mb-4">
          {/* Product Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-aura-100 to-aura-200 dark:from-aura-900/40 dark:to-aura-800/20 flex items-center justify-center">
            {mainImage ? (
              <div
                className="w-full h-full bg-center bg-cover group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${mainImage})` }}
              />
            ) : (
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-aura-300/30 dark:bg-aura-700/30 flex items-center justify-center">
                  <span className="font-display text-2xl text-aura-600 dark:text-aura-400">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <p className="font-body text-xs text-aura-600/60 dark:text-aura-400/60 uppercase tracking-wider">
                  {product.category}
                </p>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="px-2.5 py-1 bg-aura-600 text-white font-body text-[10px] uppercase tracking-wider rounded-full">
                Featured
              </span>
            )}
            {!inStock && (
              <span className="px-2.5 py-1 bg-red-500 text-white font-body text-[10px] uppercase tracking-wider rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <div className="bg-white dark:bg-charcoal rounded-lg px-4 py-2.5 text-center shadow-lg">
              <span className="font-body text-xs uppercase tracking-widest text-aura-600 dark:text-aura-400">
                View Details
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-body text-[10px] uppercase tracking-widest text-aura-500 dark:text-aura-400">
            {product.category}
          </p>
          <h3 className="font-display text-base text-charcoal dark:text-white group-hover:text-aura-600 dark:group-hover:text-aura-400 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="font-body text-sm font-medium text-charcoal dark:text-white">
            {formatPrice(product.price)}
          </p>
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-1.5 pt-1">
              {product.sizes.map((s) => (
                <span
                  key={s.size}
                  className={`font-body text-[10px] px-1.5 py-0.5 rounded border ${
                    s.stock > 0
                      ? "border-aura-200 dark:border-aura-800 text-charcoal/60 dark:text-white/60"
                      : "border-red-200 dark:border-red-900 text-red-400 line-through"
                  }`}
                >
                  {s.size}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

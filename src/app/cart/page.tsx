"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-28 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center py-20">
            <p className="font-body text-charcoal/40 dark:text-white/40">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-body text-sm text-charcoal/50 dark:text-white/50 hover:text-aura-600 dark:hover:text-aura-400 transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>

            <h1 className="section-title mb-8">Your Cart</h1>

            {items.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className="mx-auto mb-4 text-charcoal/20 dark:text-white/20" />
                <p className="font-display text-2xl text-charcoal/40 dark:text-white/40 mb-4">
                  Your cart is empty
                </p>
                <Link href="/products" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card flex gap-4"
                    >
                      {/* Image placeholder */}
                      <Link
                        href={`/products/${item.slug}`}
                        className="w-20 h-24 rounded-lg bg-gradient-to-br from-aura-100 to-aura-200 dark:from-aura-900/40 dark:to-aura-800/20 flex items-center justify-center shrink-0"
                      >
                        <span className="font-display text-lg text-aura-600 dark:text-aura-400">
                          {item.name.charAt(0)}
                        </span>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-display text-base text-charcoal dark:text-white hover:text-aura-600 dark:hover:text-aura-400 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="font-body text-xs text-charcoal/50 dark:text-white/50 mt-0.5">
                          Size: {item.size}
                        </p>
                        <p className="font-body text-sm font-medium text-aura-600 dark:text-aura-400 mt-1">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                              className="w-7 h-7 rounded border border-aura-200 dark:border-aura-800 flex items-center justify-center hover:bg-smoke dark:hover:bg-charcoal/40 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                              className="w-7 h-7 rounded border border-aura-200 dark:border-aura-800 flex items-center justify-center hover:bg-smoke dark:hover:bg-charcoal/40 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.size)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="card sticky top-28">
                    <h3 className="font-display text-xl mb-4 text-charcoal dark:text-white">
                      Order Summary
                    </h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between font-body text-sm">
                        <span className="text-charcoal/60 dark:text-white/60">
                          Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                        </span>
                        <span>{formatPrice(getTotal())}</span>
                      </div>
                      <div className="flex justify-between font-body text-sm">
                        <span className="text-charcoal/60 dark:text-white/60">Delivery</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="border-t border-aura-100 dark:border-aura-900/30 pt-3 flex justify-between">
                        <span className="font-body font-medium">Total</span>
                        <span className="font-display text-xl text-aura-600 dark:text-aura-400">
                          {formatPrice(getTotal())}
                        </span>
                      </div>
                    </div>
                    <Link href="/checkout" className="btn-primary w-full text-center gap-2">
                      Checkout <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

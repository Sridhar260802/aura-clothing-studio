"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, Check, Truck, Box, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/types";

const statusIcons: Record<OrderStatus, typeof Package> = {
  "Order Placed": Clock,
  "Order Confirmed": Check,
  "Packed": Box,
  "Shipped": Package,
  "Out for Delivery": Truck,
  "Delivered": MapPin,
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setQuery(orderParam);
      handleSearch(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setSearched(true);

    try {
      // Try order number first
      let res = await fetch(`/api/orders/${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setLoading(false);
        return;
      }

      // Try mobile number
      res = await fetch(`/api/orders?mobile=${encodeURIComponent(q)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders?.length > 0) {
          setOrder(data.orders[0]);
          setLoading(false);
          return;
        }
      }

      setOrder(null);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const currentStatusIndex = order
    ? ORDER_STATUSES.indexOf(order.status as OrderStatus)
    : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <p className="section-subtitle mb-2">Track</p>
          <h1 className="section-title">Track Your Order</h1>
          <p className="font-body text-sm text-charcoal/50 dark:text-white/50 mt-2">
            Enter your order number or mobile number
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-white/40"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order number or mobile number"
              className="input-field pl-12 pr-32"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2 !px-5 !text-xs"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {searched && !loading && !order && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto mb-4 text-charcoal/20 dark:text-white/20" />
            <p className="font-display text-xl text-charcoal/40 dark:text-white/40">
              No order found
            </p>
            <p className="font-body text-sm text-charcoal/30 dark:text-white/30 mt-1">
              Please check your order number or mobile number
            </p>
          </div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Info */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase tracking-wider">
                    Order Number
                  </p>
                  <p className="font-display text-xl text-aura-600 dark:text-aura-400">
                    {order.orderNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-body text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-aura-100 dark:bg-aura-900/30 text-aura-700 dark:text-aura-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50">Customer</p>
                  <p className="font-body font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50">Total</p>
                  <p className="font-body font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="card">
              <h3 className="font-display text-lg mb-6">Order Status</h3>
              <div className="space-y-0">
                {ORDER_STATUSES.map((status, i) => {
                  const Icon = statusIcons[status];
                  const isCompleted = i <= currentStatusIndex;
                  const isCurrent = i === currentStatusIndex;

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isCurrent
                              ? "bg-aura-600 text-white ring-4 ring-aura-200 dark:ring-aura-800"
                              : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-smoke dark:bg-charcoal/40 text-charcoal/30 dark:text-white/30"
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <Check size={16} />
                          ) : (
                            <Icon size={16} />
                          )}
                        </div>
                        {i < ORDER_STATUSES.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              isCompleted && i < currentStatusIndex
                                ? "bg-green-500"
                                : "bg-aura-100 dark:bg-aura-900/30"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-8">
                        <p
                          className={`font-body text-sm font-medium ${
                            isCurrent
                              ? "text-aura-600 dark:text-aura-400"
                              : isCompleted
                              ? "text-charcoal dark:text-white"
                              : "text-charcoal/30 dark:text-white/30"
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <h3 className="font-display text-lg mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between font-body text-sm py-2 border-b border-aura-100 dark:border-aura-900/30 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-charcoal/50 dark:text-white/50">
                        Size: {item.size} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <p className="font-body text-charcoal/40 dark:text-white/40">Loading...</p>
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

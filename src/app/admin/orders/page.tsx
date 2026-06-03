"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Eye, ChevronDown, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types";
import type { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams({ limit: "100" });
    if (statusFilter !== "All") params.set("status", statusFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Order Placed": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Order Confirmed": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Packed": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Shipped": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "Out for Delivery": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "Delivered": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="text-center py-20"><p className="font-body text-charcoal/40 dark:text-white/40">Loading orders...</p></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal dark:text-white mb-6">Orders ({orders.length})</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-white/40" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="input-field pl-9 !py-2" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto !py-2">
          <option value="All">All Status</option>
          {ORDER_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-smoke dark:bg-charcoal/40 border-b border-aura-100 dark:border-aura-900/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Order</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Customer</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Total</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Status</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Date</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-aura-100 dark:border-aura-900/30 hover:bg-smoke/50 dark:hover:bg-charcoal/20 transition-colors"
                >
                  <td className="px-4 py-3 font-body text-sm font-medium text-aura-600 dark:text-aura-400">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm">{order.customerName}</p>
                    <p className="font-body text-xs text-charcoal/40 dark:text-white/40">{order.mobile}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updatingStatus}
                        className={`appearance-none pl-2.5 pr-7 py-1 rounded-full font-body text-xs cursor-pointer border-0 ${statusColor(order.status)}`}
                      >
                        {ORDER_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-charcoal/50 dark:text-white/50">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-charcoal/40 dark:text-white/40 hover:text-aura-600 dark:hover:text-aura-400 transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-charcoal rounded-xl shadow-2xl"
          >
            <div className="sticky top-0 bg-white dark:bg-charcoal border-b border-aura-100 dark:border-aura-900/30 px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-xl">Order {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-charcoal/40 dark:text-white/40"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Customer</p>
                  <p className="font-body text-sm font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Mobile</p>
                  <p className="font-body text-sm">{selectedOrder.mobile}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Address</p>
                  <p className="font-body text-sm">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                </div>
              </div>

              <div>
                <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-aura-100 dark:border-aura-900/30 last:border-0">
                    <span className="font-body text-sm">{item.name} ({item.size}) x{item.quantity}</span>
                    <span className="font-body text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-medium">
                  <span className="font-body text-sm">Total</span>
                  <span className="font-body text-sm text-aura-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.paymentScreenshot && (
                <div>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase mb-2">Payment Screenshot</p>
                  <img src={selectedOrder.paymentScreenshot} alt="Payment" className="rounded-lg max-h-60 object-contain bg-smoke dark:bg-charcoal/40" />
                </div>
              )}

              <div>
                <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase mb-2">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as OrderStatus;
                    updateStatus(selectedOrder.id, newStatus);
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="input-field"
                >
                  {ORDER_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

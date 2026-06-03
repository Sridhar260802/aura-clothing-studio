"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Eye, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

interface Customer {
  name: string;
  mobile: string;
  city: string;
  state: string;
  orders: Order[];
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    const res = await fetch("/api/orders?limit=1000");
    const data = await res.json();

    // Group by mobile number
    const map: Record<string, Customer> = {};
    data.orders.forEach((order: Order) => {
      if (!map[order.mobile]) {
        map[order.mobile] = {
          name: order.customerName,
          mobile: order.mobile,
          city: order.city,
          state: order.state,
          orders: [],
          totalSpent: 0,
        };
      }
      map[order.mobile].orders.push(order);
      map[order.mobile].totalSpent += order.total;
    });

    setCustomers(Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent));
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  if (loading) {
    return <div className="text-center py-20"><p className="font-body text-charcoal/40 dark:text-white/40">Loading...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users size={20} className="text-aura-500" />
        <h1 className="font-display text-2xl text-charcoal dark:text-white">Customers ({customers.length})</h1>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-smoke dark:bg-charcoal/40 border-b border-aura-100 dark:border-aura-900/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Customer</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Mobile</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Location</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Orders</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Total Spent</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-charcoal/50 dark:text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, i) => (
                <motion.tr
                  key={customer.mobile}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-aura-100 dark:border-aura-900/30 hover:bg-smoke/50 dark:hover:bg-charcoal/20"
                >
                  <td className="px-4 py-3 font-body text-sm font-medium">{customer.name}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal/60 dark:text-white/60">{customer.mobile}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal/60 dark:text-white/60">{customer.city}, {customer.state}</td>
                  <td className="px-4 py-3 font-body text-sm">{customer.orders.length}</td>
                  <td className="px-4 py-3 font-body text-sm font-medium text-aura-600">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(customer)} className="p-1.5 text-charcoal/40 dark:text-white/40 hover:text-aura-600 transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-charcoal rounded-xl shadow-2xl"
          >
            <div className="sticky top-0 bg-white dark:bg-charcoal border-b border-aura-100 dark:border-aura-900/30 px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-xl">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-charcoal/40 dark:text-white/40"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Mobile</p><p className="font-body text-sm">{selected.mobile}</p></div>
                <div><p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Location</p><p className="font-body text-sm">{selected.city}, {selected.state}</p></div>
                <div><p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Total Orders</p><p className="font-body text-sm font-medium">{selected.orders.length}</p></div>
                <div><p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase">Total Spent</p><p className="font-body text-sm font-medium text-aura-600">{formatPrice(selected.totalSpent)}</p></div>
              </div>

              <div>
                <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase mb-3">Order History</p>
                {selected.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-aura-100 dark:border-aura-900/30 last:border-0">
                    <div>
                      <p className="font-body text-sm font-medium text-aura-600">{order.orderNumber}</p>
                      <p className="font-body text-xs text-charcoal/40 dark:text-white/40">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm">{formatPrice(order.total)}</p>
                      <p className="font-body text-xs text-charcoal/50 dark:text-white/50">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

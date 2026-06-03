"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee, ShoppingCart, Package, TrendingUp,
  AlertTriangle, BarChart3
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  todayOrders: number;
  totalProducts: number;
  bestSelling: Array<{ name: string; count: number; revenue: number }>;
  lowStock: Array<{ id: string; name: string; stock: number; category: string }>;
  statusBreakdown: Record<string, number>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-body text-charcoal/40 dark:text-white/40">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "Total Profit", value: formatPrice(stats.totalProfit), icon: TrendingUp, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingCart, color: "text-aura-600 bg-aura-100 dark:bg-aura-900/30" },
    { label: "Total Products", value: stats.totalProducts.toString(), icon: Package, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  ];

  const salesCards = [
    { label: "Today", value: formatPrice(stats.dailySales), orders: stats.todayOrders },
    { label: "This Week", value: formatPrice(stats.weeklySales), orders: 0 },
    { label: "This Month", value: formatPrice(stats.monthlySales), orders: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="font-display text-2xl text-charcoal dark:text-white mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Breakdown */}
      <div className="grid lg:grid-cols-3 gap-4">
        {salesCards.map((card) => (
          <div key={card.label} className="card">
            <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase tracking-wider mb-1">
              {card.label}&apos;s Sales
            </p>
            <p className="font-display text-xl text-aura-600 dark:text-aura-400">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best Selling */}
        <div className="card">
          <h3 className="font-display text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-aura-500" /> Best Selling Products
          </h3>
          {stats.bestSelling.length === 0 ? (
            <p className="font-body text-sm text-charcoal/40 dark:text-white/40">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.bestSelling.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-aura-100 dark:border-aura-900/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs text-charcoal/40 dark:text-white/40 w-5">{i + 1}</span>
                    <span className="font-body text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-body text-xs text-charcoal/50 dark:text-white/50">{item.count} sold</span>
                    <span className="font-body text-sm font-medium ml-3">{formatPrice(item.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <h3 className="font-display text-lg mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" /> Low Stock Alerts
          </h3>
          {stats.lowStock.length === 0 ? (
            <p className="font-body text-sm text-charcoal/40 dark:text-white/40">All products are well stocked</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-aura-100 dark:border-aura-900/30 last:border-0">
                  <div>
                    <p className="font-body text-sm">{item.name}</p>
                    <p className="font-body text-xs text-charcoal/40 dark:text-white/40">{item.category}</p>
                  </div>
                  <span className={`font-body text-sm font-medium ${
                    item.stock <= 5 ? "text-red-500" : "text-orange-500"
                  }`}>
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="card">
          <h3 className="font-display text-lg mb-4">Order Status</h3>
          <div className="space-y-2">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="font-body text-sm text-charcoal/60 dark:text-white/60">{status}</span>
                <span className="font-body text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 className="font-display text-lg mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-aura-100 dark:border-aura-900/30 last:border-0">
                <div>
                  <p className="font-body text-sm font-medium">{order.orderNumber}</p>
                  <p className="font-body text-xs text-charcoal/40 dark:text-white/40">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-sm">{formatPrice(order.total)}</p>
                  <p className="font-body text-xs text-aura-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { parseJSON } from "@/lib/utils";

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allOrders, products, todayOrders, weekOrders, monthOrders] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { active: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.findMany({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.findMany({ where: { createdAt: { gte: monthStart } } }),
  ]);

  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
  const dailySales = todayOrders.reduce((s, o) => s + o.total, 0);
  const weeklySales = weekOrders.reduce((s, o) => s + o.total, 0);
  const monthlySales = monthOrders.reduce((s, o) => s + o.total, 0);

  // Calculate profit
  const totalCost = allOrders.reduce((sum, order) => {
    const items = parseJSON<Array<{ price: number; quantity: number }>>(order.items, []);
    return sum + items.reduce((s, i) => s + (i.price * 0.45) * (i.quantity || 1), 0);
  }, 0);
  const totalProfit = totalRevenue - totalCost;

  // Best selling products (count from orders)
  const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
  allOrders.forEach((order) => {
    const items = parseJSON<Array<{ name: string; quantity: number; price: number }>>(order.items, []);
    items.forEach((item) => {
      const key = item.name;
      if (!productSales[key]) {
        productSales[key] = { name: item.name, count: 0, revenue: 0 };
      }
      productSales[key].count += item.quantity || 1;
      productSales[key].revenue += item.price * (item.quantity || 1);
    });
  });
  const bestSelling = Object.values(productSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Low stock products
  const lowStock = products
    .filter((p) => p.stock <= 10)
    .map((p) => ({ id: p.id, name: p.name, stock: p.stock, category: p.category }));

  // Order status breakdown
  const statusBreakdown: Record<string, number> = {};
  allOrders.forEach((o) => {
    statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
  });

  // Recent orders
  const recentOrders = allOrders.slice(0, 5).map((o) => ({
    ...o,
    items: parseJSON(o.items, []),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return NextResponse.json({
    totalOrders: allOrders.length,
    totalRevenue,
    totalProfit,
    dailySales,
    weeklySales,
    monthlySales,
    todayOrders: todayOrders.length,
    weekOrders: weekOrders.length,
    monthOrders: monthOrders.length,
    totalProducts: products.length,
    bestSelling,
    lowStock,
    statusBreakdown,
    recentOrders,
  });
}

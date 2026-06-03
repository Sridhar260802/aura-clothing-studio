"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingCart, Warehouse, Users,
  LogOut, Menu, X, ChevronRight
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      setAuthenticated(true);
    } catch {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-smoke dark:bg-charcoal">
        <p className="font-body text-charcoal/40 dark:text-white/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smoke dark:bg-charcoal flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-charcoal/90 border-r border-aura-100 dark:border-aura-900/30 transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-aura-100 dark:border-aura-900/30">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              <Image src="/logo.jpeg" alt="Aura" fill className="object-cover" />
            </div>
            <div>
              <span className="font-display text-lg text-charcoal dark:text-white">AURA</span>
              <span className="font-body text-[10px] text-aura-500 block -mt-1">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-charcoal/40 dark:text-white/40">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                pathname === href
                  ? "bg-aura-100 dark:bg-aura-900/40 text-aura-700 dark:text-aura-300 font-medium"
                  : "text-charcoal/60 dark:text-white/60 hover:bg-smoke dark:hover:bg-charcoal/40"
              }`}
            >
              <Icon size={18} />
              {label}
              {pathname === href && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-aura-100 dark:border-aura-900/30">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-body text-xs text-charcoal/40 dark:text-white/40 hover:bg-smoke dark:hover:bg-charcoal/40 transition-colors mb-1"
          >
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-body text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-charcoal/90 backdrop-blur-xl border-b border-aura-100 dark:border-aura-900/30 px-4 lg:px-8 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-charcoal dark:text-white"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-display text-lg text-charcoal dark:text-white capitalize">
            {pathname.split("/").pop()?.replace("-", " ")}
          </h2>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

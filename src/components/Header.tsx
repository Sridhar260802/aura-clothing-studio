"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, Sun, Moon, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/track-order", label: "Track Order" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 dark:bg-charcoal/90 backdrop-blur-xl shadow-sm border-b border-aura-100/50 dark:border-aura-900/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 text-charcoal dark:text-white hover:text-aura-600 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-full">
                <Image
                  src="/logo.jpeg"
                  alt="Aura Clothing Studio"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-display text-xl sm:text-2xl tracking-wider text-charcoal dark:text-white group-hover:text-aura-600 dark:group-hover:text-aura-400 transition-colors">
                AURA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm tracking-widest uppercase text-charcoal/70 dark:text-white/70 hover:text-aura-600 dark:hover:text-aura-400 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-aura-600 dark:bg-aura-400 transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-charcoal dark:text-white hover:text-aura-600 dark:hover:text-aura-400 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-charcoal dark:text-white hover:text-aura-600 dark:hover:text-aura-400 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>
              <Link
                href="/track-order"
                className="hidden sm:flex p-2 text-charcoal dark:text-white hover:text-aura-600 dark:hover:text-aura-400 transition-colors"
                aria-label="Track Order"
              >
                <Package size={20} />
              </Link>
              <Link
                href="/cart"
                className="relative p-2 text-charcoal dark:text-white hover:text-aura-600 dark:hover:text-aura-400 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-aura-600 text-white text-xs font-body rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-aura-100 dark:border-aura-900/30 bg-white dark:bg-charcoal"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-white/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-smoke dark:bg-charcoal/60 border border-aura-200 dark:border-aura-800 rounded-full text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-aura-500/30 focus:border-aura-500"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-charcoal sm:hidden"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-charcoal dark:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col items-center gap-8 mt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-2xl tracking-widest text-charcoal dark:text-white hover:text-aura-600 dark:hover:text-aura-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

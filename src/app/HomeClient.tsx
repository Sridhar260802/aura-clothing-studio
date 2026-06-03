"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Sparkles, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import { CATEGORIES } from "@/types";

interface Props {
  featuredProducts: Product[];
  allProducts: Product[];
}

export default function HomeClient({ featuredProducts, allProducts }: Props) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-aura-50 via-white to-aura-100 dark:from-aura-950 dark:via-charcoal dark:to-aura-900/40" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-aura-300/20 dark:bg-aura-700/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-aura-200/30 dark:bg-aura-800/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="section-subtitle mb-4"
                >
                  Premium Clothing Studio
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-charcoal dark:text-white leading-[0.9] tracking-tight mb-6"
                >
                  Elevate
                  <br />
                  Your
                  <br />
                  <span className="text-aura-600 dark:text-aura-400 italic">Style</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-body text-base sm:text-lg text-charcoal/60 dark:text-white/60 max-w-md leading-relaxed mb-8"
                >
                  Discover a curated collection of premium clothing designed for those who
                  appreciate the finer things in life.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link href="/products" className="btn-primary gap-2">
                    Shop Collection <ArrowRight size={16} />
                  </Link>
                  <Link href="/products?category=Ethnic+Wear" className="btn-outline">
                    Ethnic Wear
                  </Link>
                </motion.div>
              </div>

              {/* Hero Image / Logo Feature */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative hidden lg:flex items-center justify-center"
              >
                <div className="relative w-[420px] h-[420px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aura-200 to-aura-400 dark:from-aura-800 dark:to-aura-600 opacity-20 blur-xl animate-pulse" />
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-aura-100 to-aura-300 dark:from-aura-900 dark:to-aura-700 opacity-30" />
                  <div className="absolute inset-16 rounded-full overflow-hidden border-4 border-white/50 dark:border-aura-400/30 shadow-2xl">
                    <Image
                      src="/logo.jpeg"
                      alt="Aura Clothing Studio"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 right-8 bg-white dark:bg-charcoal shadow-lg rounded-xl px-4 py-2 flex items-center gap-2"
                  >
                    <Star size={14} className="text-aura-500 fill-aura-500" />
                    <span className="font-body text-xs font-medium">Premium Quality</span>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-2 left-4 bg-white dark:bg-charcoal shadow-lg rounded-xl px-4 py-2 flex items-center gap-2"
                  >
                    <Truck size={14} className="text-aura-500" />
                    <span className="font-body text-xs font-medium">Pan-India Delivery</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-aura-600 dark:bg-aura-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: Truck, text: "Free Delivery Across India" },
                { icon: Shield, text: "Secure UPI Payments" },
                { icon: Sparkles, text: "Premium Quality Guaranteed" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center justify-center gap-3 text-white">
                  <Icon size={18} className="opacity-80" />
                  <span className="font-body text-sm tracking-wider">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 sm:py-28 bg-white dark:bg-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="section-subtitle mb-3">Browse</p>
              <h2 className="section-title">Shop by Category</h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.filter((c) => c !== "All").map((category, i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className="block group relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-aura-100 to-aura-200 dark:from-aura-900/40 dark:to-aura-800/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-xl text-white group-hover:text-aura-200 transition-colors">
                        {category}
                      </h3>
                      <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight size={12} />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-20 sm:py-28 bg-smoke dark:bg-charcoal/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-end justify-between mb-12"
              >
                <div>
                  <p className="section-subtitle mb-3">Curated</p>
                  <h2 className="section-title">Featured Collection</h2>
                </div>
                <Link
                  href="/products?featured=true"
                  className="hidden sm:flex btn-ghost gap-2"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="py-20 sm:py-28 bg-white dark:bg-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <p className="section-subtitle mb-3">Discover</p>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link href="/products" className="hidden sm:flex btn-ghost gap-2">
                Shop All <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {allProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            <div className="text-center mt-12 sm:hidden">
              <Link href="/products" className="btn-primary">
                Shop All Products
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aura-600 to-aura-800 dark:from-aura-800 dark:to-aura-950" />
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }} />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Redefine Your <span className="italic">Wardrobe</span>
              </h2>
              <p className="font-body text-base text-white/70 mb-8 max-w-lg mx-auto">
                Join thousands of customers who trust Aura for premium quality clothing
                delivered right to your doorstep.
              </p>
              <Link href="/products" className="inline-flex items-center justify-center px-10 py-4 bg-white text-aura-700 font-body text-sm uppercase tracking-widest rounded-full hover:bg-aura-50 transition-all hover:shadow-xl gap-2">
                Start Shopping <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

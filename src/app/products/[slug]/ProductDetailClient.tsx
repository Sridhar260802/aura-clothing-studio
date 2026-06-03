"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, ArrowLeft, Check, Truck, Shield, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const mainImage = product.images?.[0];
  const sizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: mainImage || "",
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-body text-sm text-charcoal/50 dark:text-white/50 hover:text-aura-600 dark:hover:text-aura-400 transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-smoke dark:bg-charcoal/40"
            >
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-aura-100 to-aura-200 dark:from-aura-900/40 dark:to-aura-800/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-aura-300/30 dark:bg-aura-700/30 flex items-center justify-center">
                      <span className="font-display text-4xl text-aura-600 dark:text-aura-400">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <p className="font-body text-sm text-aura-600/60 dark:text-aura-400/60 uppercase tracking-wider">
                      {product.category}
                    </p>
                  </div>
                </div>
              )}
              {product.featured && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-aura-600 text-white font-body text-xs uppercase tracking-wider rounded-full">
                  Featured
                </span>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col"
            >
              <p className="section-subtitle mb-2">{product.category}</p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="font-display text-2xl sm:text-3xl text-aura-600 dark:text-aura-400 mb-6">
                {formatPrice(product.price)}
              </p>
              <p className="font-body text-sm text-charcoal/60 dark:text-white/60 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <p className="font-body text-sm font-medium text-charcoal dark:text-white mb-3">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                      disabled={s.stock === 0}
                      className={`w-14 h-14 rounded-lg font-body text-sm border-2 transition-all ${
                        selectedSize === s.size
                          ? "border-aura-600 bg-aura-600 text-white"
                          : s.stock > 0
                          ? "border-aura-200 dark:border-aura-800 text-charcoal dark:text-white hover:border-aura-400"
                          : "border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed line-through"
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 mt-2">
                    {sizeStock} in stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-body text-sm font-medium text-charcoal dark:text-white mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-aura-200 dark:border-aura-800 flex items-center justify-center font-body text-lg hover:bg-smoke dark:hover:bg-charcoal/40 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-body text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(sizeStock || 10, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-aura-200 dark:border-aura-800 flex items-center justify-center font-body text-lg hover:bg-smoke dark:hover:bg-charcoal/40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !inStock}
                  className={`flex-1 btn-primary gap-2 ${
                    added ? "!bg-green-600" : ""
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Cart
                    </>
                  )}
                </button>
                <button className="w-12 h-12 border-2 border-aura-200 dark:border-aura-800 rounded-full flex items-center justify-center hover:bg-smoke dark:hover:bg-charcoal/40 transition-colors">
                  <Heart size={18} className="text-charcoal/40 dark:text-white/40" />
                </button>
              </div>

              {/* Buy Now */}
              {inStock && (
                <Link
                  href={selectedSize ? "/cart" : "#"}
                  onClick={(e) => {
                    if (!selectedSize) {
                      e.preventDefault();
                      return;
                    }
                    handleAddToCart();
                  }}
                  className="btn-outline text-center mb-8"
                >
                  Buy Now
                </Link>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-aura-100 dark:border-aura-900/30">
                {[
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Shield, text: "Genuine Quality" },
                  { icon: RotateCcw, text: "Easy Returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="text-center">
                    <Icon size={18} className="mx-auto mb-1 text-aura-500" />
                    <p className="font-body text-[10px] text-charcoal/50 dark:text-white/50 uppercase tracking-wider">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 sm:mt-28">
              <h2 className="section-title mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
